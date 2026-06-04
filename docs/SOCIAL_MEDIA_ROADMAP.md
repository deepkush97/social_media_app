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
- [x] **Emit `POST_LIKED` consumed in social subgraph** — `SocialSubscriberService.onPostLiked()` calls `boostFollowWeight()` (follow edge weight +0.5) and `boostTagWeight()` (tag interest +1.0). Tags now come pre-extracted in the event payload (`post.tags` stored on the entity).
- [x] **Emit `POST_CREATED` consumed** — `SocialSubscriberService.onPostCreated()` receives `tags` in payload and calls `boostTagWeight()`. Tags are extracted once at creation time by the posts service and stored on the entity.
- [ ] **Emit `POST_UPDATED`** — event exists but no edit endpoint calls it.
- [ ] **Emit `USER_UPDATED`** — event exists but no profile edit endpoint calls it.
- [ ] **Create a `notifications` subscriber** — consume `POST_LIKED`, `USER_FOLLOWED` events to build a notification feed.

### Security & Config

- [ ] **Replace hardcoded `JWT_SECRET`** — `this_is_a_newbie` in all env files → move to env var with a strong generated default for dev.
- [ ] **Set `DB_SYNCHRONIZE=false` for production** — or gate it behind `NODE_ENV=development`.
- [x] **Password exposure in `findByEmail`** — `app.service.ts` explicitly selects `password` with `.addSelect('password')`. Consider a separate method or lean projection for auth flows.

### Consistency

- [x] **Pagination off-by-one** — GraphQL resolvers (`findPostsByUserId`) use `page: 0` (0-indexed) while REST endpoints default `page: 1` (1-indexed). Pick one convention and align everywhere.
- [x] **Check like existence before insert** — `likePost` should verify the user hasn't already liked the post (currently relies on the DB unique constraint, which throws a 500 instead of a 409).

### Tech Debt

- [x] **Schema generation initializes all modules** — `GENERATE_SCHEMA=true` still boots TypeORM (connects to MySQL), NATS, etc., printing connection logs and failing if infra isn't running. Fix: create a lightweight schema module per service that only imports resolvers + `GraphQLModule.forRoot()` — no TypeORM, NATS, Neo4j, or Redis. Register it conditionally when `GENERATE_SCHEMA=true`, or write a standalone script using `@nestjs/graphql`'s `GraphQLSchemaBuilder` directly without booting the full app.
- [x] **Page index unification** — `PaginationInput.page` default changed from `0` to `1` (1-indexed) across `PaginationInput`, `PostsPaginationInput`, and `RecommendedPostsInput`. All consumers now consistently use `(page - 1) * take` for offset computation. Gateway no longer converts between 1-indexed and 0-indexed on input or output.
- [ ] **Migrate from Docker Compose to Kubernetes** — currently all services and infrastructure run via `docker-compose.yml` on a single host. For production readiness, scalability, and self-healing, migrate to a Kubernetes cluster. This involves:

  **Namespace breakdown:**

  | Namespace    | Components                                                                 | Purpose                                         |
  | ------------ | -------------------------------------------------------------------------- | ----------------------------------------------- |
  | `infra`      | Redis, MySQL 8.0, Neo4j (Community + GDS), NATS JetStream, Elasticsearch   | Stateful data stores; persistent volumes + PVCs |
  | `app`        | auth, posts, social, search, gateway (NestJS microservices), Apollo Router | Stateless application services; HPA for scaling |
  | `monitoring` | Jaeger (all-in-one), Prometheus, Grafana                                   | Observability stack with configured datasources |

  **What each namespace needs:**
  - **`infra`** — StatefulSets for MySQL, Neo4j, Redis, NATS (JetStream), Elasticsearch. Each with PersistentVolumeClaims, headless services, config maps for init scripts and health checks. MySQL needs `init-db` scripts from `./init-db` mounted via ConfigMap. Neo4j needs GDS plugin and auth config. NATS needs JetStream storage directory and monitoring port (8222). Elasticsearch needs single-node discovery config and heap limits (`ES_JAVA_OPTS`).

  - **`app`** — Deployments for each NestJS service: `gateway` (REST, port 3000), `auth`, `posts`, `social`, `search` (each serving GraphQL federation on port 3001-3004). The Apollo Router as a Deployment on port 4000. All services read env vars from a shared ConfigMap + Secrets (JWT secret, DB passwords). HorizontalPodAutoscaler based on CPU/memory for gateway and Apollo Router. Init containers or sidecars for OTel SDK initialization. Liveness/readiness probes on health endpoints.

  - **`monitoring`** — Jaeger all-in-one Deployment with OTLP gRPC port 4317. Prometheus Deployment scraping `/metrics` from all app pods (via pod annotations or a ServiceMonitor). Grafana Deployment with pre-provisioned datasources (Prometheus + Jaeger) and dashboards (from `./grafana/` directory) mounted via ConfigMap.

  **Deployment strategy:**
  - Migrate `.env.*` files to Kubernetes `Secrets` (DB passwords, JWT secret) and `ConfigMap` (non-sensitive env vars)
  - Replace `docker-compose.yml` service dependencies with `DNS` resolution via K8s Services (e.g., `mysql.infra.svc.cluster.local`)
  - Use an Ingress controller (e.g., nginx-ingress or Traefik) to expose the gateway (REST) and potentially the Apollo Router
  - CI/CD pipeline (GitHub Actions or ArgoCD) to build Docker images for each NestJS service and deploy via Helm or kustomize
  - Cluster management: `kubectl` context per environment (dev/staging/prod), with `kustomize` overlays for environment-specific config
  - Load testing with `k6` can be run as a K8s Job against the cluster

---

## Phase 2: Core Social Features

### Tags System

Tags are extracted from post content at creation time via `#hashtag` + NLP (`extractTags`) and stored as a `json` column on the entity. This means:

- Any unique tag from any user becomes a `Tag` node in Neo4j automatically
- No UI constraints, no picker — users just type `#music` in their post
- The `compromise` NLP library also extracts noun phrases, so even posts without explicit hashtags generate tag signals

- [x] **Add `tags` column to `Post` entity** — stored as `json` column on `posts_posts`, populated once at creation by `extractTags()`.
- [x] **Update `PostOutput`** — expose `tags: [String!]` in GraphQL schema.
- [x] **Emit `POST_CREATED` with tags** — `PostCreatedEventPayload` includes `tags: string[]`; consumer creates `INTERESTED_IN` edges directly from payload.

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

- [x] **`INTERESTED_IN` edge from User to Tag** — `SocialService.boostTagWeight()` creates/updates `(User)-[:INTERESTED_IN {weight}]->(Tag {name})` in Neo4j. Accepts an array of tags, uses `UNWIND` for a single batch query.
- [x] **Boosted on post creation** — `SocialSubscriberService.onPostCreated()` consumes `POST_CREATED` event with pre-extracted tags, calls `boostTagWeight(userId, tags, 1.0)`.
- [x] **Boosted on post like** — `SocialSubscriberService.onPostLiked()` receives pre-stored tags in event payload, calls `boostTagWeight(userId, tags, 1.0)` in a single batch call.

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

| Edge               | Source → Target | When Created                                                           | Weight                         |
| ------------------ | --------------- | ---------------------------------------------------------------------- | ------------------------------ |
| `[:LIKED]`         | User → Post     | User likes a post                                                      | 1.0                            |
| `[:CREATED]`       | User → Post     | User creates a post                                                    | 1.0 (set once)                 |
| `[:FOLLOWS]`       | User → User     | User follows another                                                   | 1.0 (base), 0.5 boost per like |
| `[:INTERESTED_IN]` | User → Tag      | User likes a post containing this tag, or creates a post with this tag | 1.0 (base), accumulates        |
| `[:TAGGED]`        | Post → Tag      | Post created with tags                                                 | 1.0 (set once)                 |

### Step-by-Step Implementation

Each step builds on the previous. You can stop and verify at each stage before moving on.

---

#### Step 1: Build Graph Structure for Recommendations

The recommendation Cypher queries need `[:CREATED]` (User→Post) and `[:TAGGED]` (Post→Tag) edges. These are now created by the `POST_CREATED` event handler.

- [x] **Add `trackPostCreation(userId, postId, tags)`** — `SocialService` method that creates `(User)-[:CREATED]->(Post)` and `(Post)-[:TAGGED {weight: 1.0}]->(Tag)` in a single batch query.
- [x] **Update POST_CREATED handler** — `SocialSubscriberService.onPostCreated()` now calls both `boostTagWeight` (user interest) and `trackPostCreation` (graph structure).

**Graph is now complete:** `[:FOLLOWS]`, `[:LIKED]`, `[:CREATED]`, `[:INTERESTED_IN]`, `[:TAGGED]` all populated on events.

#### Step 2: Recommendation Queries in Social Service

Add the Cypher queries that power recommendations to `SocialService`. No endpoints yet — just methods you can call and inspect.

- [x] **Add `recommendedPosts(userId, limit, offset)`** — Cypher query returning posts scored by:
  1. Posts from followed users (score 1.0)
  2. Posts tagged with tags the user is interested in (score = `0.5 * INTERESTED_IN.weight`), excluding already-followed authors
  3. Return distinct posts, ordered by score DESC

  ```cypher
  MATCH (me:User {id: $userId})-[:FOLLOWS]->(author:User)-[:CREATED]->(post:Post)
  RETURN post.id AS postId, 1.0 AS score

  UNION

  MATCH (me:User {id: $userId})-[interest:INTERESTED_IN]->(tag:Tag)<-[:TAGGED]-(post:Post)<-[:CREATED]-(author:User)
  WHERE NOT (me)-[:FOLLOWS]->(author)
  RETURN post.id AS postId, 0.5 * interest.weight AS score
  ORDER BY score DESC
  SKIP $offset LIMIT $limit
  ```

- [x] **Add `userRecommendation(userId, limit, offset)`** — Cypher query:
  1. Friend-of-friend (users followed by people you follow), ordered by common followers count
  2. Users whose posts you've liked (exclude already-followed + self)
  3. Combined score = commonFollowers + likedPostsScore

- [x] **Debug / inspect** — run queries directly against Neo4j (via Neo4j Browser at `http://localhost:7474`) with manual parameters to verify results.

- [ ] **Unit test queries** — write a test that seeds 3 users, 2 posts, 1 follow, 1 like, and asserts `recommendedPosts` returns the expected post with the right score.

**Verify:** Call `socialService.recommendedPosts(1, 10, 0)` from a test or controller → get back a sorted list of post IDs. Run the same Cypher in Neo4j Browser to confirm.

---

#### Step 3: Expose Recommendation Endpoints

Wire the queries through GraphQL (social subgraph) → Apollo Router → gateway REST endpoints.

- [x] **Add GraphQL query in social subgraph** — `recommendedPosts(userId: Int!, limit: Int, offset: Int): RecommendedPostsOutput`.
- [x] **Define output types** — `RecommendedPost { postId: Int!, score: Float! }`, `RecommendedPostList { items: [RecommendedPost!]! }`.
- [x] **Regenerate schema** — updated `social.graphql`, composed supergraph, generated genql client.
- [x] **Add gateway REST endpoint** — `GET /recommendations/posts` (authenticated, uses JWT userId).
- [x] **Add Redis caching** — cache per-user results with 60s TTL.
- [x] **Add gateway REST endpoint** — `GET /recommendations/users` for `userRecommendation`.

**Verify:** Hit `GET /recommendations/posts?userId=1` → get back scored post list. Hit `GET /recommendations/users?userId=1` → get back suggested users.

---

#### Step 4: Seed Realistic Data

A script to fill the system with test data so you can see recommendations working with non-trivial graphs.

- [ ] **Create `scripts/seed.ts`** — creates:
  - 100 users (via `POST /auth/register` or direct DB insert)
  - 5-10 posts per user with random `#hashtags` sprinkled into content
  - Follows (~30% probability between any two users)
  - Likes (~20% probability user likes a post)
- [ ] **Deterministic** — `--seed 42` always produces the same data.
- [ ] **Verify graph state** — after seeding, query Neo4j to confirm edge counts.

**Verify:** Run the seeder → Neo4j has 100s of User/Post/Tag nodes with FOLLOWS, CREATED, LIKED, INTERESTED_IN, TAGGED edges. Recommendation endpoints return non-empty results.

---

#### Step 5: Feed Endpoint with Impression Ranking

Build the main timeline endpoint that users see. Combine organic followed content with recommended content.

- [ ] **Build `GET /feed`** — returns posts for the user's timeline:
  1. Fetch recommended posts via `recommendedPosts` (scored)
  2. Fall back to simple `createdAt DESC` for unfilled slots or cold-start users
- [ ] **Pagination** — cursor-based or offset-based, consistent with the rest of the API.
- [ ] **Blend strategy** — interleave: first 5 from followed users, then 1 recommended, repeat.
- [ ] **Cache** — Redis with short TTL (30s) so feed feels fast but stays fresh.

**Verify:** Open `GET /feed?userId=1` → see a mix of posts from followed users and tag-matched posts, ordered by score.

---

#### Step 6: Refine Weights & Trending

Tune the scoring parameters and add discovery signals.

- [ ] **Add `POST_UNLIKED` handler** — decrement `INTERESTED_IN.weight` (or apply a smaller decay, like -0.3) when user unlikes a post.
- [ ] **Trending posts** — posts with highest like velocity in the last 24h. Use Redis sorted set with score = `likes_in_window / hours_since_posted`.
- [ ] **Trending tags** — tags with most posts created in the last N hours.
- [ ] **Similar users** — Jaccard similarity on `INTERESTED_IN` tags:
  ```cypher
  MATCH (me:User {id: $userId})-[r1:INTERESTED_IN]->(tag:Tag)<-[r2:INTERESTED_IN]-(other:User)
  WHERE me <> other
  RETURN other, COUNT(tag) AS commonTags, COLLECT(tag.name) AS tags
  ORDER BY commonTags DESC LIMIT 10
  ```
- [ ] **A/B test framework** — serve different decay factors or blend ratios to different user buckets.

---

## Phase 5: Data Seeding & Testing

### Seed Data Generator

A script or dedicated seeder module that populates the system with realistic test data for development and load testing.

- [ ] **Create `scripts/seed.ts`** (or `apps/seeder`) that:
  - Creates N users (e.g. 100) with random names via `POST /auth/register`
  - Creates M posts per user (e.g. 5-10) with `#hashtags` randomly sprinkled into content
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

| Layer                    | Tool                                     | What to Test                                  |
| ------------------------ | ---------------------------------------- | --------------------------------------------- |
| Neo4j queries            | Integration (testcontainers or embedded) | Cypher correctness, index usage, weight decay |
| NATS event flow          | Integration                              | `POST_LIKED` → `boostTagWeight` side effect   |
| Recommendation endpoints | e2e (supertest)                          | Auth, caching, pagination, empty states       |
| Feed ranking             | Snapshot/unit                            | Weighted scoring formula, decay factors       |
| Seed data pipeline       | Snapshot                                 | Reproducible data, graph density metrics      |

- [ ] **Neo4j test setup** — use `@testcontainers/neo4j` or a lightweight embedded Neo4j for CI.
- [ ] **Weight formula tests** — unit test the scoring functions with known inputs/outputs.
- [ ] **k6 load tests** — extend existing `k6/` scripts to test recommendation endpoints under load.

---

## Phase 6: Frontend (Vite + React + Tailwind + Shadcn)

A new frontend application consuming the gateway REST + GraphQL APIs.

- [ ] **Scaffold `apps/web`** — Vite + React + TypeScript + Tailwind CSS + shadcn/ui.
- [ ] **Authentication flow** — login/register pages, JWT token storage, axios/fetch wrapper with auth header.
- [ ] **Feed / Timeline page** — displays recommended posts from Phase 4, infinite scroll or pagination.
- [ ] **Post creation** — form with title, content, image upload; tags extracted automatically from `#hashtags` in content.
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

| Pattern            | Use Case                    | Tech                              |
| ------------------ | --------------------------- | --------------------------------- |
| REST               | Gateway → Client            | HTTP (existing)                   |
| GraphQL Federation | Router → Subgraphs          | Apollo Router + GenQL (existing)  |
| Events             | Async service communication | NATS JetStream (existing)         |
| Direct DB          | Service → MySQL / Neo4j     | TypeORM / neo4j-driver (existing) |

### Database Decisions

| Store         | Used For                                     | Why                                                            |
| ------------- | -------------------------------------------- | -------------------------------------------------------------- |
| MySQL         | Users, Posts, Likes, Comments, Notifications | Reliable persistence, complex queries, ACID                    |
| Neo4j         | Social graph, Impressions, Recommendations   | Native graph traversal, weighted edges, multi-hop path queries |
| Redis         | Cache (API responses, feed, recommendations) | Fast reads, TTL-based expiry, sorted sets for trending         |
| Elasticsearch | Full-text search (posts, comments)           | Fuzzy matching, relevance scoring, `more_like_this`            |

> **Do we need a separate relational database?** No — MySQL already serves as the single relational store. Tags are stored as a `json` column on `posts_posts` (no junction table needed). Neo4j handles all graph-native data (follows, likes, impressions, tag interest). Adding another relational DB would add operational complexity without benefit.

### Why Dynamic Tags (Not a DB Table or Enum)

Tags are **extracted from content at creation time** via `#hashtag` regex + NLP noun extraction. This approach:

- **No UI constraints** — users naturally type `#music` in their post, no picker needed
- **Every tag is a Neo4j node** — `extractTags` creates `Tag` nodes on the fly, `compromise` also extracts noun phrases for implicit tagging
- **Scale-free** — new tags emerge organically without code changes or migrations
- **Recommendations improve naturally** — the more unique tags in the system, the richer the `INTERESTED_IN` graph

Trade-off: `compromise` NLP adds ~7MB to the bundle and ~50ms per extraction. This is acceptable — extraction happens once at post creation, not on read.

### Weight Storage

| Store                 | For                                       | Why                                                      |
| --------------------- | ----------------------------------------- | -------------------------------------------------------- |
| Neo4j edge properties | Follow weights, tag interest, impressions | Native to graph traversal, perfect for multi-hop scoring |
| Redis sorted sets     | Trending scores, real-time counts         | Fast increments, TTL-based expiry                        |

### Feed Strategy Recommendation

Start with the **recommendation-driven feed** from Phase 4 Step 5. The `GET /feed` endpoint returns posts scored by the impression graph, blending followed content (score 1.0) with tag-matched content (score 0.5 × weight).

For cold-start users (no follows, no likes), fall back to `createdAt DESC`:

```sql
SELECT * FROM posts_posts ORDER BY createdAt DESC LIMIT :limit OFFSET :offset
```

Later, add **Redis sorted set caching** for the top N feed results per user to avoid hitting Neo4j on every page load.

### Recommendation Service Strategy

Recommendations live in `apps/social` (already has Neo4j access). One new file (`social.recommendations.service.ts`) keeps it separable if we later extract to `apps/recommendations`.

---

## Appendix: Data Model Changes

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
  (Tag {name})                   — tags (extracted from post content, any unique string)

Edges:
  (u:User)-[:FOLLOWS {weight, source, interactions, createdAt}]->(u2:User)
  (u:User)-[:LIKED {weight, createdAt}]->(p:Post)
  (u:User)-[:CREATED]->(p:Post)
  (u:User)-[:INTERESTED_IN {weight, createdAt}]->(t:Tag)
  (p:Post)-[:TAGGED {weight}]->(t:Tag)
```
