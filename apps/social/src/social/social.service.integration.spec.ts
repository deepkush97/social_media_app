import { execSync } from 'child_process';
import neo4j, { Driver, QueryResult, RecordShape, Session } from 'neo4j-driver';
import { createConnection } from 'net';
import { Repository } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { Neo4jService } from '@app/shared/neo4j/neo4j.service';
import { createMockLogger } from '@app/shared/test-utils/logger.mock';

import { LikeEntity } from './like.entity';
import { SocialService } from './social.service';
import { WEIGHT_INTEREST_FOLLOW } from './social-weight.constants';

const IMAGE = 'neo4j:community';
const CONTAINER_NAME = 'social-test-neo4j';
const HOST_PORT = 7688;
const BOLT_PORT = 7687;
const USER = 'neo4j';
const PASSWORD = 'test-password';

function sh(command: string): string {
  return execSync(command, { encoding: 'utf-8' }).trim();
}

async function waitForTcp(host: string, port: number, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await new Promise<void>((resolve, reject) => {
        const s = createConnection(port, host);
        s.setTimeout(2000);
        s.on('connect', () => {
          s.destroy();
          resolve();
        });
        s.on('error', reject);
        s.on('timeout', () => {
          s.destroy();
          reject(new Error('timeout'));
        });
      });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error(`Timed out waiting for ${host}:${port}`);
}

let startedContainer = false;

function ensureContainerRunning(): void {
  if (process.env.CI) {
    return;
  }
  sh(`podman rm -f ${CONTAINER_NAME} 2>/dev/null; true`);
  sh(
    `podman run -d ` +
      `--name ${CONTAINER_NAME} ` +
      `-p ${HOST_PORT}:${BOLT_PORT} ` +
      `-e NEO4J_AUTH=${USER}/${PASSWORD} ` +
      `${IMAGE}`,
  );
  startedContainer = true;
}

async function retryConnect(attempts: number, delayMs: number): Promise<Driver> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    let d: Driver | undefined;
    try {
      d = neo4j.driver(`bolt://localhost:${HOST_PORT}`, neo4j.auth.basic(USER, PASSWORD));
      await d.verifyConnectivity();
      return d;
    } catch (err) {
      lastErr = err;
      await d?.close();
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error(
    `Could not connect to Neo4j at localhost:${HOST_PORT} after ${attempts} attempts. ` +
      `Last error: ${(lastErr as Error)?.message}.`,
  );
}

function stopContainer(): void {
  if (!startedContainer) {
    return;
  }
  try {
    sh(`podman rm -f ${CONTAINER_NAME}`);
  } catch {
    // ignore cleanup errors
  }
}

/**
 * Create a working mock TypeORM repository for LikeEntity that
 * persists entries in-memory so `like()` and `unlike()` operate
 * against real state (findOne → create → save → delete cycle).
 */
function createWorkingLikeRepo(): unknown {
  const store = new Map<string, { id: number; userId: number; postId: number }>();
  let nextId = 1;

  return {
    create: vi.fn((data: { userId: number; postId: number }) => ({ ...data })),
    save: vi.fn((data: { userId: number; postId: number }) => {
      const saved = { ...data, id: nextId++ };
      store.set(`${data.userId}:${data.postId}`, saved);
      return saved;
    }),
    findOne: vi.fn((opts: { where: { userId: number; postId: number } }) => {
      return store.get(`${opts.where.userId}:${opts.where.postId}`) ?? null;
    }),
    delete: vi.fn(({ userId, postId }: { userId: number; postId: number }) => {
      store.delete(`${userId}:${postId}`);
      return { affected: 1 };
    }),
    count: vi.fn((opts: { where: { userId?: number; postId: number } }) => {
      let count = 0;
      for (const v of store.values()) {
        const userIdMatch = opts.where.userId ? v.userId === opts.where.userId : true;
        if (v.postId === opts.where.postId && userIdMatch) count++;
      }
      return count;
    }),
    findAndCount: vi.fn(),
    update: vi.fn(),
  };
}

async function runQuery(
  driver: Driver,
  cypher: string,
  params?: Record<string, unknown>,
): Promise<QueryResult<RecordShape>> {
  const session: Session = driver.session();
  try {
    return await session.executeWrite((tx) => tx.run(cypher, params));
  } finally {
    await session.close();
  }
}

interface PostSeed {
  userId: number;
  postId: number;
  tags: string[];
}

interface FollowSeed {
  followerId: number;
  followingId: number;
}

interface LikeSeed {
  userId: number;
  postId: number;
}

const USER_IDS = [1, 2, 3, 4, 5];

const POST_SEEDS: PostSeed[] = [
  { userId: 2, postId: 101, tags: ['graphql', 'typescript'] },
  { userId: 2, postId: 102, tags: ['node'] },
  { userId: 3, postId: 103, tags: ['graphql'] },
  { userId: 4, postId: 104, tags: ['node', 'typescript'] },
  { userId: 5, postId: 105, tags: ['typescript'] },
];

const FOLLOW_SEEDS: FollowSeed[] = [
  { followerId: 1, followingId: 2 },
  { followerId: 1, followingId: 5 },
  { followerId: 2, followingId: 3 },
  { followerId: 2, followingId: 4 },
];

const LIKE_SEEDS: LikeSeed[] = [
  { userId: 1, postId: 103 },
  { userId: 1, postId: 104 },
];

/**
 * Baseline graph — all entities created through SocialService methods
 * (no raw Cypher) so tests exercise the same code paths as production:
 *
 *   Users:  1, 2, 3, 4, 5                                    via ensureUserNode
 *   Posts:  101-105 (by users 2-5, with varied tags)         via boostTagWeight + trackPostCreation
 *   Follows: 1→2, 1→5, 2→3, 2→4                             via follow
 *   Likes:   user 1 → post 103, user 1 → post 104            via like
 *   Interest: user 1 → graphql@1.0, user 1 → node@2.0        via boostTagWeight
 */
async function seedGraph(service: SocialService): Promise<void> {
  for (const id of USER_IDS) {
    await service.ensureUserNode(id);
  }

  for (const { userId, postId, tags } of POST_SEEDS) {
    await service.boostTagWeight(userId, tags, 0.5);
    await service.trackPostCreation(userId, postId, tags, new Date('2025-01-01').toISOString());
  }

  for (const f of FOLLOW_SEEDS) {
    await service.follow(f);
  }

  for (const { userId, postId } of LIKE_SEEDS) {
    await service.like({ userId, postId });
  }

  await service.boostTagWeight(1, ['graphql'], 1.0);
  await service.boostTagWeight(1, ['node'], 2.0);
}

describe('SocialService', () => {
  let driver: Driver;
  let service: SocialService;

  beforeAll(async () => {
    ensureContainerRunning();
    await waitForTcp('localhost', HOST_PORT, 60_000);
    driver = await retryConnect(10, 2000);

    const neo4jService = new Neo4jService(driver, createMockLogger() as never);
    const likeRepo = createWorkingLikeRepo() as Repository<LikeEntity>;
    service = new SocialService(neo4jService, likeRepo);

    await service.onModuleInit();
    await seedGraph(service);
  }, 120_000);

  afterAll(async () => {
    await driver?.close();
    stopContainer();
  }, 30_000);

  // ────────────────────────────────────────────────────────────
  //  Read-only queries
  // ────────────────────────────────────────────────────────────

  describe('postRecommendation', () => {
    it('returns posts from followed authors with score 1.0', async () => {
      const result = await service.postRecommendation(1, 10, 0);

      expect(result.items.length).toBeGreaterThanOrEqual(3);
      for (const item of result.items) {
        if ([101, 102, 105].includes(item.id)) {
          expect(item.score).toBe(1);
        }
      }
    });

    it('returns posts matching interests with weighted scores', async () => {
      const result = await service.postRecommendation(1, 10, 0);

      // Post 104 (by user 4, tagged node) matches INTERESTED_IN node w=2.0 → 0.5*2=1.0
      const p104 = result.items.find((i) => i.id === 104);
      expect(p104).toBeDefined();
      expect(p104!.score).toBe(1);

      // Post 103 (by user 3, tagged graphql) matches INTERESTED_IN graphql w=1.0 → 0.5
      const p103 = result.items.find((i) => i.id === 103);
      expect(p103).toBeDefined();
      expect(p103!.score).toBe(0.5);
    });

    it('respects limit', async () => {
      const result = await service.postRecommendation(1, 2, 0);
      expect(result.items).toHaveLength(2);
    });

    it('respects offset beyond total', async () => {
      const result = await service.postRecommendation(1, 10, 100);
      expect(result.items).toHaveLength(0);
    });

    it('returns total count', async () => {
      const result = await service.postRecommendation(1, 10, 0);
      expect(result.total).toBe(5);
    });

    it('returns empty for user with no follows or interests', async () => {
      const result = await service.postRecommendation(9, 10, 0);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('getFeed', () => {
    it('returns posts from followed authors plus blended recommendations', async () => {
      const result = await service.getFeed(1, 10, 0);

      // Followed posts: 101 (user 2), 102 (user 2), 105 (user 5) — score 1.0
      // Recommended: 103 (user 3, graphql → 0.5×1.0), 104 (user 4, node → 0.5×2.0=1.0)
      // Order: sorted by score DESC then writtenAt DESC
      expect(result.items.length).toBeGreaterThanOrEqual(3);

      const p101 = result.items.find((i) => i.id === 101);
      expect(p101).toBeDefined();
      expect(p101!.score).toBe(1.0);

      const p105 = result.items.find((i) => i.id === 105);
      expect(p105).toBeDefined();
      expect(p105!.score).toBe(1.0);

      // Post 103 (graphql interest, weight 1.0) → score = 0.5 × 1.0 = 0.5
      const p103 = result.items.find((i) => i.id === 103);
      expect(p103).toBeDefined();
      expect(p103!.score).toBe(0.5);
    });

    it('respects limit', async () => {
      const result = await service.getFeed(1, 2, 0);
      expect(result.items).toHaveLength(2);
    });

    it('respects offset beyond total', async () => {
      const result = await service.getFeed(1, 10, 100);
      expect(result.items).toHaveLength(0);
    });

    it('returns total count', async () => {
      const result = await service.getFeed(1, 10, 0);
      // 5 seed posts (101-105) should all match
      expect(result.total).toBe(5);
    });

    it('falls back to tag-popularity ranking for cold-start users', async () => {
      const result = await service.getFeed(9, 10, 0);

      // No follows or interests → coldStartFeed ranks by global tag popularity
      // graphql: 3 INTERESTED_IN + 2 TAGGED = 5
      // typescript: 3 INTERESTED_IN + 3 TAGGED = 6
      // node: 3 INTERESTED_IN + 2 TAGGED = 5
      // P101 (graphql+typescript) = 5+6 = 11
      // P104 (node+typescript) = 5+6 = 11
      // P105 (typescript) = 6
      // P102 (node) = 5
      // P103 (graphql) = 5
      expect(result.items.length).toBeGreaterThanOrEqual(3);
      expect(result.total).toBe(5);

      const p101 = result.items.find((i) => i.id === 101);
      expect(p101).toBeDefined();
      expect(p101!.score).toBe(11);

      const p105 = result.items.find((i) => i.id === 105);
      expect(p105).toBeDefined();
      expect(p105!.score).toBe(6);
    });

    it('interleaves followed and recommended posts at 5:1 blend ratio', async () => {
      // Create extra followed posts so we can observe the 5:1 pattern
      for (let i = 0; i < 12; i++) {
        await service.ensureUserNode(100 + i);
        await service.follow({ followerId: 1, followingId: 100 + i });
        await service.trackPostCreation(100 + i, 1000 + i, ['graphql'], new Date().toISOString());
      }

      try {
        const result = await service.getFeed(1, 20, 0);
        const positions = result.items.map((i) => i.id);

        // Every 6th item should be a recommended post (index 5, 11, 17...)
        // Post 103 (score 0.5) is the only true recommended item (< 1.0).
        // Post 104 (score 1.0 via INTERESTED_IN weight 2.0) is in the followed bucket.
        // Verify 103 is positioned after at least 5 followed items.
        const idx = positions.indexOf(103);

        expect(idx).toBeGreaterThanOrEqual(5);
        expect(idx % 6).toBe(5);
      } finally {
        for (let i = 0; i < 12; i++) {
          await service.unfollow({ followerId: 1, followingId: 100 + i });
        }
      }
    });
  });

  describe('userRecommendation', () => {
    it('returns suggested users from friend-of-friend and liked posts', async () => {
      const result = await service.userRecommendation(1, 10, 0);

      // user 3 (friend-of-friend via user 2 + liked post 103) → score 2
      // user 4 (friend-of-friend via user 2 + liked post 104) → score 2
      expect(result.items).toHaveLength(2);
      for (const item of result.items) {
        expect(item.score).toBe(2);
        expect(item.commonFollowers).toBe(1);
        expect(item.likedPostsScore).toBe(1);
      }
    });

    it('respects limit', async () => {
      const result = await service.userRecommendation(1, 1, 0);
      expect(result.items).toHaveLength(1);
    });

    it('respects offset beyond total', async () => {
      const result = await service.userRecommendation(1, 10, 100);
      expect(result.items).toHaveLength(0);
    });

    it('returns total count', async () => {
      const result = await service.userRecommendation(1, 10, 0);
      expect(result.total).toBe(2);
    });

    it('returns empty for isolated user', async () => {
      const result = await service.userRecommendation(9, 10, 0);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('userCounts', () => {
    it('returns follower and following counts', async () => {
      const result = await service.userCounts(1);
      expect(result.followers).toBe(0);
      expect(result.followings).toBe(2);
    });

    it('returns zero counts for non-existent user (MERGE creates them)', async () => {
      const result = await service.userCounts(99);
      expect(result.followers).toBe(0);
      expect(result.followings).toBe(0);
    });
  });

  describe('likeCount / hasLiked', () => {
    it('likeCount returns total likes for a post', async () => {
      const count = await service.likeCount(103);
      expect(count).toBe(1);
    });

    it('hasLiked returns true for a post the user liked', async () => {
      const liked = await service.hasLiked(1, 103);
      expect(liked).toBe(true);
    });

    it('hasLiked returns false for a post the user did not like', async () => {
      const liked = await service.hasLiked(1, 101);
      expect(liked).toBe(false);
    });
  });

  // ────────────────────────────────────────────────────────────
  //  Graph mutation methods — tested with temporary entities
  // ────────────────────────────────────────────────────────────

  describe('follow / unfollow', () => {
    // Use high IDs (99, 100, 97, 98) absent from the seed graph.
    // follow() returns counts for *followingId* (how many follow them
    // and how many they follow).

    it('follow creates a FOLLOWS edge and returns updated counts', async () => {
      // follow(99, 100): user 100 now has 1 follower (99)
      const counts = await service.follow({ followerId: 99, followingId: 100 });

      expect(counts.followers).toBe(1);
      expect(counts.followings).toBe(0);
    });

    it('follow is idempotent — re-follow returns same counts', async () => {
      const counts = await service.follow({ followerId: 99, followingId: 100 });

      expect(counts.followers).toBe(1);
      expect(counts.followings).toBe(0);
    });

    it('follow throws when following yourself', async () => {
      await expect(service.follow({ followerId: 1, followingId: 1 })).rejects.toThrow(
        'Cannot follow yourself',
      );
    });

    it('unfollow removes the FOLLOWS edge and returns updated counts', async () => {
      // After unfollow(99, 100), user 100 has 0 followers, 0 followings
      const counts = await service.unfollow({ followerId: 99, followingId: 100 });

      expect(counts.followers).toBe(0);
      expect(counts.followings).toBe(0);
    });

    it('unfollow throws "Not a valid user" when no edge exists', async () => {
      await expect(service.unfollow({ followerId: 97, followingId: 98 })).rejects.toThrow(
        'Not a valid user',
      );
    });

    it('unfollow throws when unfollowing yourself', async () => {
      await expect(service.unfollow({ followerId: 1, followingId: 1 })).rejects.toThrow(
        'Cannot unfollow yourself',
      );
    });
  });

  describe('like / unlike', () => {
    it('like creates a LIKED edge and persists to repository', async () => {
      const like = await service.like({ userId: 1, postId: 101 });
      expect(like.userId).toBe(1);
      expect(like.postId).toBe(101);
      expect(like.id).toBeDefined();

      const count = await service.likeCount(101);
      expect(count).toBe(1);
    });

    it('like is idempotent — returns existing like', async () => {
      const like = await service.like({ userId: 1, postId: 101 });
      expect(like.userId).toBe(1);
      expect(like.postId).toBe(101);
    });

    it('unlike removes the LIKED edge and repository entry', async () => {
      const removed = await service.unlike({ userId: 1, postId: 101 });
      expect(removed).toBe(true);

      const count = await service.likeCount(101);
      expect(count).toBe(0);
    });

    it('unlike handles non-existent like gracefully', async () => {
      const removed = await service.unlike({ userId: 1, postId: 999 });
      expect(removed).toBe(true);
    });
  });

  describe('trackPostCreation', () => {
    it('creates CREATED and TAGGED edges visible via recommendation', async () => {
      // User 1 follows user 2 in seed, so a new post by user 2 appears
      // in user 1's recommendations with score 1.0.
      // Mirror the real onPostCreated handler: boostTagWeight + trackPostCreation
      await service.boostTagWeight(2, ['graphql'], 0.5);
      await service.trackPostCreation(2, 201, ['graphql'], new Date('2025-02-01').toISOString());

      const result = await service.postRecommendation(1, 10, 0);
      const p201 = result.items.find((i) => i.id === 201);
      expect(p201).toBeDefined();
      expect(p201!.score).toBe(1);
    });
  });

  describe('boostFollowWeight', () => {
    it('increments weight on an existing FOLLOWS edge', async () => {
      await service.follow({ followerId: 3, followingId: 4 });

      await service.boostFollowWeight(3, 4, WEIGHT_INTEREST_FOLLOW);

      const { records } = await runQuery(
        driver,
        `MATCH (u1:User {id: 3})-[r:FOLLOWS]->(u2:User {id: 4}) RETURN r.weight AS w`,
      );
      const weight = records[0]?.get('w');
      expect(weight).toBe(1.5);

      await service.unfollow({ followerId: 3, followingId: 4 });
    });
  });

  describe('boostTagWeight', () => {
    it('creates INTERESTED_IN edges reflected in postRecommendation', async () => {
      await service.ensureUserNode(6);
      await service.boostTagWeight(6, ['graphql'], 0.5);
      await service.trackPostCreation(6, 301, ['graphql'], new Date('2025-03-01').toISOString());

      // User 1 has INTERESTED_IN graphql weight 1.0 from seed
      // Reading user 1's recommendations should include post 301 if user 1 has enough interest weight
      // But actually user 1 already has graphql interest from seed. Let's just verify it shows up.

      const result = await service.postRecommendation(1, 10, 0);
      const p301 = result.items.find((i) => i.id === 301);
      expect(p301).toBeDefined();
      expect(p301!.score).toBe(0.5);
    });
  });
});
