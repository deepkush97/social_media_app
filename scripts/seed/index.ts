/* eslint-disable no-console */

import { createPost, followUser, likePost, signup } from './api';
import { generatePost, generateUser, TOPICS } from './data';
import {
  createRng,
  LatencyTracker,
  mapConcurrent,
  parseArgs,
  pick,
  type SeedPost,
  type SeedUser,
  shuffleArray,
  StatusTracker,
} from './utils';

const CONCURRENCY = 50;

async function verifyGraphState(
  userCount: number,
  postCount: number,
  followCount: number,
  likeCount: number,
): Promise<void> {
  console.log('\nGraph summary (expected):');
  console.log(`  Users:    ${userCount}`);
  console.log(`  Posts:    ${postCount}`);
  console.log(`  Follows:  ~${followCount}`);
  console.log(`  Likes:    ~${likeCount}`);

  try {
    const neo4jDriver = await import('neo4j-driver');

    const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
    const NEO4J_PASS = process.env.NEO4J_PASS || 'password';

    const driver = neo4jDriver.default.driver(
      NEO4J_URI,
      neo4jDriver.default.auth.basic(NEO4J_USER, NEO4J_PASS),
    );
    const session = driver.session();

    try {
      const result = await session.run(`
        MATCH (u:User) RETURN count(u) AS users
        UNION
        MATCH (p:Post) RETURN count(p) AS users
        UNION
        MATCH ()-[r:FOLLOWS]->() RETURN count(r) AS users
        UNION
        MATCH ()-[r:LIKED]->() RETURN count(r) AS users
      `);

      const counts = result.records.map((r) => r.get('users').toNumber());
      console.log('\nNeo4j verification:');
      console.log(`  Users:    ${counts[0]} (expected ${userCount})`);
      console.log(`  Posts:    ${counts[1]} (expected ${postCount})`);
      console.log(`  Follows:  ${counts[2]}`);
      console.log(`  Likes:    ${counts[3]}`);

      const mismatch: string[] = [];
      if (counts[0] !== userCount) mismatch.push('user');
      if (counts[1] !== postCount) mismatch.push('post');
      if (mismatch.length > 0) {
        console.warn(`\n⚠ Mismatch in: ${mismatch.join(', ')}`);
      } else {
        console.log('\n✓ All counts match expected values');
      }
    } finally {
      await session.close();
      await driver.close();
    }
  } catch (err) {
    console.warn(`\n⚠ Neo4j verification skipped: ${err instanceof Error ? err.message : err}`);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const SEED = args.seed || 42;
  const USER_COUNT = args.users || 100;
  const FOLLOW_PROB = args['follow-prob'] || 0.3;
  const LIKE_PROB = args['like-prob'] || 0.2;
  const TAG_COUNT = args['tag-count'] || 10;
  const MAX_POSTS = args['max-posts'] || 10;
  const SKIP_VERIFY = args['skip-verify'] === 1;

  const rand = createRng(SEED);

  console.log('── Seed Configuration ──');
  console.log(`  seed:          ${SEED}`);
  console.log(`  users:         ${USER_COUNT}`);
  console.log(`  follow-prob:   ${FOLLOW_PROB}`);
  console.log(`  like-prob:     ${LIKE_PROB}`);
  console.log(`  tag-count:     ${TAG_COUNT}`);
  console.log(`  max-posts:     ${MAX_POSTS}`);
  console.log(`  concurrency:   ${CONCURRENCY}`);
  console.log('');

  const tagPool: string[] = [];
  for (let i = 0; i < TAG_COUNT; i++) {
    tagPool.push(pick(TOPICS, rand).split(' ').join(''));
  }

  const t0 = performance.now();

  // Step 1: Create users
  console.log('Step 1/4: Creating users...');
  const userInputs = Array.from({ length: USER_COUNT }, (_, i) => generateUser(i, rand));
  const userResults = await mapConcurrent(userInputs, signup, CONCURRENCY, (c, t) =>
    console.log(`  [users]   ${c} / ${t}`),
  );
  const users: SeedUser[] = userInputs.map((u, i) => ({
    ...u,
    userId: userResults[i].userId,
    token: userResults[i].token,
  }));
  console.log(
    `  Created ${users.length} users ✓  [${((performance.now() - t0) / 1000).toFixed(1)}s]`,
  );

  // Step 2: Create posts
  const t1 = performance.now();
  console.log('Step 2/4: Creating posts...');
  const allPosts: SeedPost[] = [];
  const postInputs: Array<{ user: SeedUser; post: SeedPost }> = [];

  for (const user of users) {
    const postCount = Math.floor(rand() * (MAX_POSTS - 5 + 1)) + 5;
    for (let j = 0; j < postCount; j++) {
      postInputs.push({ user, post: generatePost(tagPool, rand) });
    }
  }

  const postIds = await mapConcurrent(
    postInputs,
    async ({ user, post }) => {
      return createPost(user.token!, post);
    },
    CONCURRENCY,
    (c, t) => console.log(`  [posts]   ${c} / ${t}`),
  );

  for (let i = 0; i < postInputs.length; i++) {
    allPosts.push({
      ...postInputs[i].post,
      postId: postIds[i],
      userId: postInputs[i].user.userId,
    });
  }
  console.log(
    `  Created ${allPosts.length} posts ✓  [${((performance.now() - t1) / 1000).toFixed(1)}s]`,
  );

  // Step 3: Create follows
  const t2 = performance.now();
  console.log('Step 3/4: Creating follows...');
  const followTargets: Array<[number, number]> = [];

  for (const follower of users) {
    const candidates = users.filter((u) => u.userId !== follower.userId);
    const shuffled = shuffleArray(candidates, rand);
    const targetCount = Math.floor(FOLLOW_PROB * shuffled.length);
    for (let j = 0; j < targetCount; j++) {
      followTargets.push([follower.userId!, shuffled[j].userId!]);
    }
  }

  const userMap = new Map<number, string>();
  for (const u of users) {
    userMap.set(u.userId!, u.token!);
  }

  const followLatency = new LatencyTracker('  [follows]');
  const followStatus = new StatusTracker();
  await mapConcurrent(
    followTargets,
    async ([followerId, targetId]) => {
      const start = performance.now();
      const token = userMap.get(followerId)!;
      const status = await followUser(token, targetId);
      followStatus.record(status);
      followLatency.record(performance.now() - start);
    },
    CONCURRENCY,
    (c, t) => console.log(`${followLatency.snapshot(c, t)}  ${followStatus.format()}`),
  );
  console.log(
    `  Created ${followStatus.format()} ✓  [${((performance.now() - t2) / 1000).toFixed(1)}s]`,
  );

  // Step 4: Create likes
  const t3 = performance.now();
  console.log('Step 4/4: Creating likes...');
  const likeTargets: Array<[number, number]> = [];

  for (const user of users) {
    const candidates = allPosts.filter((p) => p.userId !== user.userId);
    const shuffled = shuffleArray(candidates, rand);
    const targetCount = Math.floor(LIKE_PROB * shuffled.length);
    for (let j = 0; j < targetCount; j++) {
      likeTargets.push([user.userId!, shuffled[j].postId!]);
    }
  }

  const likeLatency = new LatencyTracker('  [likes]  ');
  const likeStatus = new StatusTracker();
  await mapConcurrent(
    likeTargets,
    async ([userId, postId]) => {
      const start = performance.now();
      const token = userMap.get(userId)!;
      const status = await likePost(token, postId);
      likeStatus.record(status);
      likeLatency.record(performance.now() - start);
    },
    CONCURRENCY,
    (c, t) => console.log(`${likeLatency.snapshot(c, t)}  ${likeStatus.format()}`),
  );
  console.log(
    `  Created ${likeStatus.format()} ✓  [${((performance.now() - t3) / 1000).toFixed(1)}s]`,
  );

  // Summary
  console.log('\n── Seed Complete ──');
  console.log(`  Users:    ${users.length}`);
  console.log(`  Posts:    ${allPosts.length}`);
  console.log(`  Follows:  ${followStatus.format()}`);
  console.log(`  Likes:    ${likeStatus.format()}`);

  if (!SKIP_VERIFY) {
    const f2xx = followStatus.count2xx();
    const l2xx = likeStatus.count2xx();
    await verifyGraphState(users.length, allPosts.length, f2xx, l2xx);
  }

  console.log('\nDone.');
}

void main();
