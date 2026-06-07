/* eslint-disable no-console */

import { writeFileSync } from 'node:fs';

import { createComment, createPost, followUser, likePost, signup } from './api';
import { generateComment, generatePost, generateUser, TOPICS } from './data';
import {
  createRng,
  LatencyTracker,
  mapConcurrent,
  parseArgs,
  pick,
  type SeedComment,
  type SeedPost,
  type SeedUser,
  shuffleArray,
  StatusTracker,
} from './utils';

const CONCURRENCY = 50;

function extractProfile(argv: string[]): string | null {
  const idx = argv.indexOf('--profile');
  if (idx !== -1 && argv[idx + 1] && !argv[idx + 1].startsWith('--')) {
    return argv[idx + 1].toLowerCase();
  }
  return null;
}

interface StepTiming {
  label: string;
  elapsed: number;
}

async function verifyGraphState(
  userCount: number,
  postCount: number,
  followCount: number,
  likeCount: number,
  commentCount: number,
): Promise<void> {
  console.log('\nGraph summary (expected):');
  console.log(`  Users:    ${userCount}`);
  console.log(`  Posts:    ${postCount}`);
  console.log(`  Follows:  ~${followCount}`);
  console.log(`  Likes:    ~${likeCount}`);
  console.log(`  Comments: ~${commentCount}`);

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
  const rawArgv = process.argv.slice(2);
  const profile = extractProfile(rawArgv);

  const defaultUsers = profile === 'light' ? 10 : profile === 'heavy' ? 500 : 100;
  const defaultFollowProb = profile === 'light' ? 0.5 : profile === 'heavy' ? 0.5 : 0.3;
  const defaultLikeProb = profile === 'light' ? 0.3 : profile === 'heavy' ? 0.5 : 0.2;
  const defaultMaxPosts = profile === 'light' ? 3 : profile === 'heavy' ? 20 : 10;
  const defaultCommentProb = profile === 'heavy' ? 0.8 : 0.5;

  const args = parseArgs(rawArgv);
  const SEED = args.seed || 42;
  const USER_COUNT = args.users || defaultUsers;
  const FOLLOW_PROB = args['follow-prob'] ?? defaultFollowProb;
  const LIKE_PROB = args['like-prob'] ?? defaultLikeProb;
  const COMMENT_PROB = args['comment-prob'] ?? defaultCommentProb;
  const TAG_COUNT = args['tag-count'] || 10;
  const MAX_POSTS = args['max-posts'] || defaultMaxPosts;
  const SKIP_VERIFY = args['skip-verify'] === 1;
  const OUTPUT = rawArgv.includes('--output')
    ? rawArgv[rawArgv.indexOf('--output') + 1]
    : 'seed-output.json';

  const rand = createRng(SEED);

  console.log('── Seed Configuration ──');
  if (profile) console.log(`  profile:       ${profile}`);
  console.log(`  seed:          ${SEED}`);
  console.log(`  users:         ${USER_COUNT}`);
  console.log(`  follow-prob:   ${FOLLOW_PROB}`);
  console.log(`  like-prob:     ${LIKE_PROB}`);
  console.log(`  comment-prob:  ${COMMENT_PROB}`);
  console.log(`  tag-count:     ${TAG_COUNT}`);
  console.log(`  max-posts:     ${MAX_POSTS}`);
  console.log(`  concurrency:   ${CONCURRENCY}`);
  console.log(`  output:        ${OUTPUT}`);
  console.log('');

  const tagPool: string[] = [];
  for (let i = 0; i < TAG_COUNT; i++) {
    tagPool.push(pick(TOPICS, rand).split(' ').join(''));
  }

  const timings: StepTiming[] = [];

  // Step 1: Create users
  let stepStart = performance.now();
  console.log('Step 1/5: Creating users...');
  const userInputs = Array.from({ length: USER_COUNT }, (_, i) => generateUser(i, rand));
  const userResults = await mapConcurrent(userInputs, signup, CONCURRENCY, (c, t) =>
    console.log(`  [users]   ${c} / ${t}`),
  );
  const users: SeedUser[] = userInputs.map((u, i) => ({
    ...u,
    userId: userResults[i].userId,
    token: userResults[i].token,
  }));
  timings.push({ label: 'users', elapsed: performance.now() - stepStart });
  console.log(`  Created ${users.length} users ✓  [${(timings[0].elapsed / 1000).toFixed(1)}s]`);

  // Step 2: Create posts
  stepStart = performance.now();
  console.log('Step 2/5: Creating posts...');
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
  timings.push({ label: 'posts', elapsed: performance.now() - stepStart });
  console.log(`  Created ${allPosts.length} posts ✓  [${(timings[1].elapsed / 1000).toFixed(1)}s]`);

  // Step 3: Create follows
  stepStart = performance.now();
  console.log('Step 3/5: Creating follows...');
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
  timings.push({ label: 'follows', elapsed: performance.now() - stepStart });
  console.log(`  Created ${followStatus.format()} ✓  [${(timings[2].elapsed / 1000).toFixed(1)}s]`);

  // Step 4: Create likes
  stepStart = performance.now();
  console.log('Step 4/5: Creating likes...');
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
  timings.push({ label: 'likes', elapsed: performance.now() - stepStart });
  console.log(`  Created ${likeStatus.format()} ✓  [${(timings[3].elapsed / 1000).toFixed(1)}s]`);

  // Step 5: Create comments
  stepStart = performance.now();
  console.log('Step 5/5: Creating comments...');
  const commentTargets: Array<{ userId: number; postId: number; comment: SeedComment }> = [];

  for (const post of allPosts) {
    const candidates = users.filter((u) => u.userId !== post.userId);
    const shuffled = shuffleArray(candidates, rand);
    const commentCount = Math.floor(COMMENT_PROB * 3) + 1;
    const picked = shuffled.slice(0, commentCount);
    for (const user of picked) {
      commentTargets.push({
        userId: user.userId!,
        postId: post.postId!,
        comment: generateComment(rand),
      });
    }
  }

  const commentLatency = new LatencyTracker('  [comment]');
  const commentStatus = new StatusTracker();
  await mapConcurrent(
    commentTargets,
    async ({ userId, postId, comment }) => {
      const start = performance.now();
      const token = userMap.get(userId)!;
      const status = await createComment(token, postId, comment.content);
      commentStatus.record(status);
      commentLatency.record(performance.now() - start);
    },
    CONCURRENCY,
    (c, t) => console.log(`${commentLatency.snapshot(c, t)}  ${commentStatus.format()}`),
  );
  timings.push({ label: 'comments', elapsed: performance.now() - stepStart });
  console.log(
    `  Created ${commentStatus.format()} ✓  [${(timings[4].elapsed / 1000).toFixed(1)}s]`,
  );

  // Summary
  console.log('\n── Seed Complete ──');
  for (const t of timings) {
    console.log(`  ${t.label.padEnd(10)} ${(t.elapsed / 1000).toFixed(1)}s`);
  }
  console.log('');
  console.log(`  Users:    ${users.length}`);
  console.log(`  Posts:    ${allPosts.length}`);
  console.log(`  Follows:  ${followStatus.format()}`);
  console.log(`  Likes:    ${likeStatus.format()}`);
  console.log(`  Comments: ${commentStatus.format()}`);

  // Write output file
  const outputData = {
    seed: SEED,
    profile: profile || undefined,
    generatedAt: new Date().toISOString(),
    users: users.map((u) => ({
      name: u.name,
      email: u.email,
      password: u.password,
      userId: u.userId,
      token: u.token,
    })),
    posts: allPosts.map((p) => ({ id: p.postId, title: p.title, userId: p.userId, tags: p.tags })),
    stats: {
      users: users.length,
      posts: allPosts.length,
      follows: followStatus.count2xx(),
      likes: likeStatus.count2xx(),
      comments: commentStatus.count2xx(),
    },
    timings: Object.fromEntries(timings.map((t) => [t.label, `${(t.elapsed / 1000).toFixed(1)}s`])),
  };

  writeFileSync(OUTPUT, JSON.stringify(outputData, null, 2));
  console.log(`\n  Output: ${OUTPUT}`);

  if (!SKIP_VERIFY) {
    await verifyGraphState(
      users.length,
      allPosts.length,
      followStatus.count2xx(),
      likeStatus.count2xx(),
      commentStatus.count2xx(),
    );
  }

  console.log('\nDone.');
}

void main();
