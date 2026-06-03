# Social media app

Event-driven social media platform with a recommendation engine powered by Neo4j.

## Architecture

```
Client → Gateway (REST) → Apollo Router → Subgraphs (GraphQL Federation)
                                            ├─ auth    — users, sessions, JWT
                                            ├─ posts   — CRUD, tag extraction via NLP
                                            ├─ social  — follows, likes, Neo4j recommendations
                                            └─ search  — MeiliSearch full-text search
```

Events flow through NATS (JetStream): `POST_CREATED`, `POST_LIKED`, `POST_UNLIKED`, `USER_FOLLOWED`, `USER_UNFOLLOWED` — consumers in the social subgraph build a knowledge graph in Neo4j with `User`, `Post`, and `Tag` nodes connected by `[:FOLLOWS]`, `[:LIKED]`, `[:CREATED]`, `[:TAGGED]`, and `[:INTERESTED_IN]` edges.

## Recommendation Engine

Two scored Cypher queries power the `GET /recommendations` endpoints:

- **`GET /recommendations/posts`** — posts from followed users (score 1.0) + tag-matched posts from non-followed authors (score `0.5 × INTERESTED_IN.weight`), deduplicated by `max(score)`, paginated.
- **`GET /recommendations/users`** — friend-of-followed users + liked-post authors, scored by `commonFollowers + likedPostsScore`, paginated.

Both cached per-user with 60s TTL.

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js, NestJS, TypeScript |
| GraphQL | Apollo Federation 2 (`@nestjs/graphql` + Mercurius) |
| Router | Apollo Router (Rust) |
| Databases | PostgreSQL (TypeORM), Neo4j, Redis, MeiliSearch |
| Messaging | NATS JetStream |
| NLP | compromise (hashtag + noun-phrase extraction) |
| Client SDK | genql (type-safe GraphQL client for the gateway) |
