# Social Media App — Roadmap

## Phase 1: Bug Fixes & Hardening

### Neo4j Edge Cases

- [x] **`userCounts` fails for new users** — `MATCH (u:User {id})` throws when the node doesn't exist in Neo4j (user has zero followers/followings). Fix: changed to `MERGE (u:User {id: $userId})` so the node is created on first count lookup; returns zeroes instead of error.
- [x] **`follow` returns follower's counts instead of target's** — the Neo4j query in the `follow`/`unfollow` resolver returned `COUNT { (u1)<-[:FOLLOWS]-() }` / `COUNT { (u1)-[:FOLLOWS]->() }` where `u1` was the follower. Changed to `WITH u2` (the target user) so the response reflects the target user's follower/following counts. Gateway cache also updated: target user's count cached under `followingId`, follower's cache busted with `cacheService.del`.
- [x] **No self-follow validation** — `follow`/`unfollow` now check `followerId === followingId` and throw `BAD_REQUEST` at both the gateway and social service layers.
- [x] **Neo4j indexes/constraints** — added `CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE`, `FOR (p:Post) REQUIRE p.id IS UNIQUE`, `FOR (t:Tag) REQUIRE t.name IS UNIQUE` in `SocialService.onModuleInit`.

### Dual-Write Consistency

- [x] **Like/unlike MySQL + Neo4j rollback** — added `try/catch` around Neo4j write in `social.service.ts:like()`. If Neo4j write fails, the MySQL row is deleted via `this.likeRepository.delete(saved.id)` as a compensating action.

### Events & Async Flows

- [x] **Emit `POST_LIKED` / `POST_UNLIKED`** — defined in `NatsEvents` enum but never emitted. The gateway `likes.service.ts` now emits `PostLikedEvent` / `PostUnlikedEvent` after successful like/unlike operations.
- [x] **Emit `USER_FOLLOWED` / `USER_UNFOLLOWED`** — defined but never emitted. The gateway `users.service.ts` now emits `UserFollowedEvent` / `UserUnfollowedEvent` after successful follow/unfollow.
- [x] **Emit `POST_LIKED` consumed in social subgraph** — `SocialSubscriberService.onPostLiked()` calls `boostFollowWeight()` (follow edge weight +0.5) and `boostTagWeight()` (tag interest +1.0 per hashtag extracted from post content).
- [ ] **Emit `POST_CREATED` consumed** — when a post is created with tags, fire event to create impressions (tag interest, post reach).
- [ ] **Emit `POST_UPDATED`** — event exists but no edit endpoint calls it.
- [ ] **Emit `USER_UPDATED`** — event exists but no profile edit endpoint calls it.
- [ ] **Create a `notifications` subscriber** — consume `POST_LIKED`, `USER_FOLLOWED` events to build a notification feed.

### Security & Config

- [ ] **Replace hardcoded `JWT_SECRET`** — `this_is_a_newbie` in all env files → move to env var with a strong generated default for dev.
- [ ] **Set `DB_SYNCHRONIZE=false` for production** — or gate it behind `NODE_ENV=development`.
- [ ] **Password exposure in `findByEmail`** — `app.service.ts` explicitly selects `password` with `.addSelect('password')`. Consider a separate method or lean projection for auth flows.

### Consistency

- [ ] **Pagination off-by-one** — GraphQL resolvers (`findPostsByUserId`) use `page: 0` (0-indexed) while REST endpoints default `page: 1` (1-indexed). Pick one convention and align everywhere.
- [ ] **Check like existence before insert** — `likePost` should verify the user hasn't already liked the post (currently relies on the DB unique constraint, which throws a 500 instead of a 409).

---

## Phase 2: Core Social Features

### Tags System

Tags are a **predefined enum** chosen at post creation time. This avoids NLP extraction, keeps lookups O(1), and enables clean recommendation queries.

- [ ] **Create `TagEnum`** — shared enum in `libs/shared/src/enums/tag.enum.ts`:

  ```ts
  export enum TagEnum {
    TECHNOLOGY = 'technology',
    SPORTS = 'sports',
    MUSIC = 'music',
    ART = 'art',
    FOOD = 'food',
    TRAVEL = 'travel',
    FASHION = 'fashion',
    GAMING = 'gaming',
    SCIENCE = 'science',
    FITNESS = 'fitness',
    // extend as needed — no DB migration required
  }
  ```

- [ ] **Add `tags` column to `Post` entity** — stored as a simple JSON array (`@Column('simple-json')`) on the `posts_posts` table, OR a `post_tags` junction table if querying by tag is needed:
  - **Option A (simple-json)**: `@Column('simple-json', { nullable: true }) tags: TagEnum[]` — no join needed, fast write, limited querying.
  - **Option B (junction table)**: `post_tags(postId, tag)` with index on `tag` — queryable (e.g. "all posts tagged 'sports'"), more complex.
- [ ] **Update `CreatePostInput`** — add optional `tags?: TagEnum[]` field with `@IsArray()` + `@ArrayNotEmpty()` + `@IsEnum(TagEnum, { each: true })` validation.
- [ ] **Update `PostOutput`** — expose `tags` in GraphQL schema.
- [ ] **Emit `POST_CREATED` with tags** — include `tags: TagEnum[]` in `PostCreatedEventPayload`.

### Comments

- [ ] **Create `Comment` entity** (MySQL) — `id`, `postId`, `userId`, `content`, `createdAt`, `updatedAt`, (optional `parentId` for threaded replies).
- [ ] **Add comments service** — new `apps/comments` NestJS service or add to `apps/posts`.
- [ ] **GraphQL resolvers** — `createComment`, `deleteComment`, `findCommentsByPostId` (paginated, with reply nesting).
- [ ] **REST endpoints** — `POST /posts/:postId/comments`, `DELETE /comments/:id`, `GET /posts/:postId/comments`.
- [ ] **Emit `COMMENT_CREATED` event** — add to `NatsEvents` enum, emit from gateway, consume in notifications.
- [ ] **Index comments in Elasticsearch** — add a `comments` index for full-text search.
- [ ] **Gateway endpoints** — wire through the existing gateway patterns (JWT auth, Redis caching, NATS events).

### Home Feed / Timeline

- [ ] **Design feed data model** — needs to aggregate posts from followed users. Options:
  - **Fan-out-on-write** (push): when a user creates a post, write it to a feed timeline for all followers (uses Redis sorted sets or a `feed_entries` table). Best for read-heavy.
  - **Fan-out-on-read** (pull): at read time, fetch followed user IDs from Neo4j + their posts from MySQL. Simpler, works for smaller graphs.
  - **Hybrid**: fan-out to active followers, pull for inactive.
- [ ] **Build feed endpoint** — `GET /feed?page=1&limit=20`.
- [ ] **Feed ranking** — start with `createdAt DESC`, add impression-based scoring later.
- [ ] **Cache feed** — Redis cache with TTL, invalidate on new post creation by followed users.

### Notifications

- [ ] **Create `Notification` entity** (MySQL) — `id`, `userId` (recipient), `actorId`, `type` (like/follow/comment), `targetId` (postId or userId), `read`, `createdAt`.
- [ ] **Create `notifications` subscriber** — consume NATS events (`POST_LIKED`, `USER_FOLLOWED`, `COMMENT_CREATED`) and persist to DB.
- [ ] **REST endpoints** — `GET /notifications` (paginated, unread first), `POST /notifications/:id/read`, `POST /notifications/read-all`.
- [ ] **Real-time delivery** — optional: WebSocket or SSE for live notification push.

### Profile & Content Management

- [ ] **User profile editing** — `PATCH /auth/profile` (name, email, bio, avatar URL, password change). Add `bio` and `avatar` columns to `auth_users`.
- [ ] **Post editing** — `PATCH /posts/:id` (title, content, image, tags). Validate ownership. Emit `POST_UPDATED`.
- [ ] **Image upload** — add file upload infrastructure (multer + local disk or S3-compatible). Wire to post `image` field and user `avatar` field.
- [ ] **User deletion / deactivation** — soft-delete user, archive their posts, remove from Elasticsearch.

---

## Phase 3: Social Graph & Weightage System

### Weighted Follows

The follow relationship should carry metadata that feeds into recommendation and feed ranking algorithms.

- [x] **Add weight properties to `[:FOLLOWS]` edge in Neo4j**:
  ```cypher
  (:User)-[r:FOLLOWS {
    weight: 1.0,           // base weight, decays/increases over time
    createdAt: datetime(),  // when they followed
    source: "search" | "suggested" | "profile" | "feed",  // how they found this user
    interactions: 0         // how many times they've engaged with this user's content
  }]->(:User)
  ```
- [x] **Update follow resolver** — `FollowUnfollowInput` now accepts optional `source` param (`search`/`suggested`/`profile`/`feed`); Cypher query uses `ON CREATE SET` to populate `weight`, `createdAt`, `source`, `interactions` on new edges.
- [ ] **Weight decay cron** — periodically reduce weight of stale follows (no interaction in N days).
- [x] **Weight boost on interaction** — `SocialService.boostFollowWeight()` increments `interactions` + `weight` on the `[:FOLLOWS]` edge. Called from `SocialSubscriberService.onPostLiked()` (boosts by 0.5 per like).

### Tag Interest (Impression Seeds)

- [x] **`INTERESTED_IN` edge from User to Tag** — `SocialService.boostTagWeight()` creates/updates `(User)-[:INTERESTED_IN {weight}]->(Tag {name})` in Neo4j.
- [x] **Boosted on post like** — `SocialSubscriberService.onPostLiked()` extracts `#hashtags` from content and calls `boostTagWeight(tag, 1.0)` for each.
- [ ] **Boosted on post creation** — consume `POST_CREATED` event, create `INTERESTED_IN` edges for the post author's chosen tags (weight 1.0).
- [ ] **Boosted on `POST_LIKED` with enum tags** — when tags are enum-based (not NLP), boost `INTERESTED_IN` weight for each tag on the liked post.

---

## Phase 4: Recommendation Engine (Impressions Model)

### Architecture Overview

The recommendation engine is built on a **weighted impressions graph** in Neo4j. Every user action creates impression edges with different weights. Direct actions (user likes post → user interested in tags) carry more weight than indirect ones (user liked a post → post author's other content).

```
[User] --[:FOLLOWS {weight}]--> [User]           (direct)
[User] --[:LIKED {weight}]----> [Post]           (direct)
[User] --[:INTERESTED_IN]-----> [Tag]            (direct)
[Post] --[:TAGGED]------------> [Tag]            (direct)
[User] --[:CREATED]-----------> [Post]           (direct)
```

**Derived impressions** (computed, not stored — evaluated at query time):
```
User A liked Post P tagged "sports"
  → "A is interested in sports" (INTERESTED_IN, weight 1.0)
  → "A might like P's author's other posts" (via [:LIKED]->[:CREATED] traversal)
  → "A might want to follow P's author" (via [:LIKED]->[:CREATED]<-[:CREATED])
```

Indirect paths are penalized at query time by multiplying weights along the path.

### Impressions Data Model

| Edge | Source → Target | When Created | Weight |
|------|----------------|--------------|--------|
| `[:LIKED]` | User → Post | User likes a post | 1.0 |
| `[:CREATED]` | User → Post | User creates a post | 1.0 (set once) |
| `[:FOLLOWS]` | User → User | User follows another | 1.0 (base), 0.5 boost per like |
| `[:INTERESTED_IN]` | User → Tag | User likes a post containing this tag, or creates a post with this tag | 1.0 (base), accumulates |
| `[:TAGGED]` | Post → Tag | Post created with tags | 1.0 (set once) |

### Scoring: Direct vs. Indirect

When computing recommendations, direct edges score higher than multi-hop paths:

```
Direct:     User --[:INTERESTED_IN]--> Tag --[:TAGGED]<-- Post = weight * 1.0
Indirect:   User --[:LIKED]--> Post --[:TAGGED]--> Tag = weight * 0.5 (1 hop decay)
            User --[:LIKED]--> Post <--[:CREATED]-- OtherUser = weight * 0.3 (2 hop decay)
```

Decay factors per hop:
- 1 hop (direct): 1.0
- 2 hops: 0.5
- 3 hops: 0.25
- N hops: `1 / (2^(hops-1))`

### Recommendation Queries

**What posts to show in feed (timeline):**

```cypher
// Posts from followed users (direct)
MATCH (me:User {id: $userId})-[:FOLLOWS]->(author:User)-[:CREATED]->(post:Post)
RETURN post, 1.0 AS score

UNION

// Posts tagged with tags the user is interested in (2 hops)
MATCH (me:User {id: $userId})-[:INTERESTED_IN]->(tag:Tag)<-[:TAGGED]-(post:Post)
WHERE NOT EXISTS { (me)-[:FOLLOWS]->(post)<-[:CREATED]-() }  // exclude already followed
RETURN post, 0.5 * r.weight AS score
ORDER BY score DESC
```

**Who to follow:**

```cypher
// Friend-of-friend
MATCH (me:User {id: $userId})-[:FOLLOWS]->(following:User)-[:FOLLOWS]->(suggestion:User)
WHERE NOT (me)-[:FOLLOWS]->(suggestion) AND me <> suggestion
RETURN suggestion, COUNT(*) AS commonFollowers, 0.5 AS score
ORDER BY commonFollowers DESC

UNION

// Users who created posts the user liked
MATCH (me:User {id: $userId})-[:LIKED]->(post:Post)<-[:CREATED]-(author:User)
WHERE NOT (me)-[:FOLLOWS]->(author) AND me <> author
RETURN author, 0.3 AS score
ORDER BY score DESC
```

### New Service: `apps/recommendations`

- [ ] **Scaffold `apps/recommendations`** — NestJS module with GraphQL + Neo4j + NATS integration.
- [ ] **Wire into Apollo Federation** — add to `supergraph-config.yaml` and `router.yaml`.
- [ ] **Endpoints**:
  - `GET /recommendations/posts?userId=1&limit=20` — timeline recommendations
  - `GET /recommendations/users?userId=1&limit=10` — who to follow
  - `GET /recommendations/tags?userId=1` — suggested tags to explore
- [ ] **Cache results** in Redis with user-scoped TTL (5 minutes).
- [ ] **Personalized vs. global** — serve personalized (for logged-in users) and trending/global (for anonymous).

### Trending & Discovery

- [ ] **Trending posts** — posts with high recent engagement velocity (likes per hour). Query Neo4j or Redis sorted set.
- [ ] **Trending tags** — tags with the most recent posts or highest engagement.
- [ ] **Trending users** — users with the highest follower growth rate, or most liked posts recently.
- [ ] **Similar users** — users who share `INTERESTED_IN` tags (Jaccard similarity query in Neo4j):
  ```cypher
  MATCH (me:User {id: $userId})-[r1:INTERESTED_IN]->(tag:Tag)<-[r2:INTERESTED_IN]-(other:User)
  WHERE me <> other
  WITH other, COUNT(tag) AS commonTags, COLLECT(tag.name) AS tags
  ORDER BY commonTags DESC
  LIMIT 10
  RETURN other, commonTags, tags
  ```

---

## Phase 5: Data Seeding & Testing

### Seed Data Generator

A script or dedicated seeder module that populates the system with realistic test data for development and load testing.

- [ ] **Create `scripts/seed.ts`** (or `apps/seeder`) that:
  - Creates N users (e.g. 100) with random names via `POST /auth/register`
  - Creates M posts per user (e.g. 5-10) with `title`, `content`, and `tags` picked randomly from `TagEnum`
  - Creates follow relationships (random, ~30% probability between any two users)
  - Creates likes (random, ~20% probability user likes a post)
  - Results in a realistic Neo4j graph: `User → Post`, `User → Tag`, `User → User` relationships with weights
- [ ] **Use deterministic seeds** — `seed: 42` always produces the same data (via `seedrandom` or similar).
- [ ] **Customize density** — cli flags: `--users 1000 --follow-prob 0.3 --like-prob 0.2 --tag-count 10`
- [ ] **Verify with assertions** — after seeding, run queries to confirm:
  - Each user has expected follower/following counts
  - `INTERESTED_IN` edges exist for liked post tags
  - Recommendation queries return non-empty results

### Testing Strategy

| Layer | Tool | What to Test |
|-------|------|-------------|
| Neo4j queries | Integration (testcontainers or embedded) | Cypher correctness, index usage, weight decay |
| NATS event flow | Integration | `POST_LIKED` → `boostTagWeight` side effect |
| Recommendation endpoints | e2e (supertest) | Auth, caching, pagination, empty states |
| Feed ranking | Snapshot/unit | Weighted scoring formula, decay factors |
| Seed data pipeline | Snapshot | Reproducible data, graph density metrics |

- [ ] **Neo4j test setup** — use `@testcontainers/neo4j` or a lightweight embedded Neo4j for CI.
- [ ] **Weight formula tests** — unit test the scoring functions with known inputs/outputs.
- [ ] **k6 load tests** — extend existing `k6/` scripts to test recommendation endpoints under load.

---

## Phase 6: Frontend (Vite + React + Tailwind + Shadcn)

A new frontend application consuming the gateway REST + GraphQL APIs.

- [ ] **Scaffold `apps/web`** — Vite + React + TypeScript + Tailwind CSS + shadcn/ui.
- [ ] **Authentication flow** — login/register pages, JWT token storage, axios/fetch wrapper with auth header.
- [ ] **Feed / Timeline page** — displays recommended posts from Phase 4, infinite scroll or pagination.
- [ ] **Post creation** — form with title, content, image upload, **tag selector** (multi-select from `TagEnum`).
- [ ] **Post interactions** — like/unlike (optimistic UI), comment (inline expand).
- [ ] **User profile** — display user posts, follower/following counts, follow/unfollow button.
- [ ] **Who to follow sidebar** — consume `GET /recommendations/users`.
- [ ] **Search** — search posts via the gateway search endpoint.
- [ ] **Notifications** — dropdown with unread count, mark as read.

---

## Phase 7: Content Moderation & Safety

- [ ] **Report content** — `POST /reports` (postId/commentId, reason category).
- [ ] **Auto-moderation** — basic text filtering (profanity, spam patterns) on post/comment creation using a blocklist or ML model.
- [ ] **Admin review queue** — dashboard or endpoints to review reported content and take action (remove, warn, ban).
- [ ] **User blocking / muting** — `POST /users/block/:id`, `POST /users/mute/:id`. Filter blocked users from feed, search, and suggestions.

---

## Appendix: Architecture Decisions

### Communication Patterns

| Pattern | Use Case | Tech |
|---------|----------|------|
| REST | Gateway → Client | HTTP (existing) |
| GraphQL Federation | Router → Subgraphs | Apollo Router + GenQL (existing) |
| Events | Async service communication | NATS JetStream (existing) |
| Direct DB | Service → MySQL / Neo4j | TypeORM / neo4j-driver (existing) |

### Database Decisions

| Store | Used For | Why |
|-------|----------|-----|
| MySQL | Users, Posts, Likes, Comments, Notifications | Reliable persistence, complex queries, ACID |
| Neo4j | Social graph, Impressions, Recommendations | Native graph traversal, weighted edges, multi-hop path queries |
| Redis | Cache (API responses, feed, recommendations) | Fast reads, TTL-based expiry, sorted sets for trending |
| Elasticsearch | Full-text search (posts, comments) | Fuzzy matching, relevance scoring, `more_like_this` |

> **Do we need a separate relational database?** No — MySQL already serves as the single relational store. The `post_tags` association (if using a junction table) lives in MySQL in the `posts` database. Neo4j handles all graph-native data (follows, likes, impressions, tag interest). Adding another relational DB would add operational complexity without benefit.

### Why Tags as an Enum (Not a DB Table)

- **No joins** — tags are selected from a fixed set, no `tagID` foreign key lookups
- **No migrations** — adding a new tag is a code change, not a `CREATE TABLE` + insert
- **Validation** — `@IsEnum(TagEnum)` in DTO catches invalid tags at the API boundary
- **Recommendation queries** — tag names are string constants in Cypher, no join needed

Trade-off: cannot dynamically create tags from user input. Acceptable for v1 — the enum can be extended over time.

### Weight Storage

| Store | For | Why |
|-------|-----|-----|
| Neo4j edge properties | Follow weights, tag interest, impressions | Native to graph traversal, perfect for multi-hop scoring |
| Redis sorted sets | Trending scores, real-time counts | Fast increments, TTL-based expiry |

### Feed Strategy Recommendation

Start with **fan-out-on-read** (simplest):
```sql
SELECT p.* FROM posts_posts p
JOIN post_tags pt ON p.id = pt.postId
WHERE p.userId IN (
  SELECT followingId FROM social_follows WHERE followerId = :userId
)
ORDER BY p.createdAt DESC
LIMIT :limit OFFSET :offset
```

Later, migrate to **impression-based ranking** in Phase 4: score each candidate post by the weighted impression graph instead of simple `createdAt DESC`.

### Recommendation Service Options

**Option A: Separate `apps/recommendations` service**
- Pro: clean isolation, can scale independently, own data stores (Neo4j + Redis)
- Con: new service to deploy and maintain

**Option B: Add to existing `apps/social` service**
- Pro: already has Neo4j access, fewer moving parts
- Con: mixes concerns, harder to scale independently

> **Recommendation:** Start with Option B (add endpoints to `apps/social`) for fast iteration, extract to `apps/recommendations` if query complexity or load demands it.

---

## Appendix: Data Model Changes

### MySQL — `post_tags` junction table (if using Option B for tags)

```sql
CREATE TABLE post_tags (
  postId BIGINT NOT NULL,
  tag    VARCHAR(32) NOT NULL,
  PRIMARY KEY (postId, tag),
  INDEX idx_tag (tag),
  FOREIGN KEY (postId) REFERENCES posts_posts(id)
);
```

### MySQL — `comments` table

```sql
CREATE TABLE comments (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  postId     BIGINT NOT NULL,
  userId     BIGINT NOT NULL,
  parentId   BIGINT DEFAULT NULL,
  content    VARCHAR(1000) NOT NULL,
  status     ENUM('ACTIVE', 'ARCHIVED') DEFAULT 'ACTIVE',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_post (postId),
  INDEX idx_user (userId),
  INDEX idx_parent (parentId),
  FOREIGN KEY (parentId) REFERENCES comments(id)
);
```

### MySQL — `notifications` table

```sql
CREATE TABLE notifications (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  userId     BIGINT NOT NULL,
  actorId    BIGINT NOT NULL,
  type       ENUM('like', 'follow', 'comment', 'repost') NOT NULL,
  targetId   BIGINT DEFAULT NULL,
  targetType ENUM('post', 'user', 'comment') DEFAULT NULL,
  read       BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_unread (userId, read),
  INDEX idx_created (created_at)
);
```

### Neo4j Graph Model

```
Nodes:
  (User {id})                    — users
  (Post {id})                    — posts  
  (Tag {name})                   — tags (predefined enum values)

Edges:
  (u:User)-[:FOLLOWS {weight, source, interactions, createdAt}]->(u2:User)
  (u:User)-[:LIKED {weight, createdAt}]->(p:Post)
  (u:User)-[:CREATED]->(p:Post)
  (u:User)-[:INTERESTED_IN {weight, createdAt}]->(t:Tag)
  (p:Post)-[:TAGGED {weight}]->(t:Tag)
```
