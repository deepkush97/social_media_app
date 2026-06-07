---
name: git-commit-msg
description: Give consistent commit message.
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## What I do

- Draft commit message based on git staged changes
- Follow Conventional Commits v1.0.0

## When to use me

Use this when you are asked to provide a message for latest git staged changes

## Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

| Type     | Usage                                                           |
| -------- | --------------------------------------------------------------- |
| feat     | A new feature                                                   |
| fix      | A bug fix                                                       |
| build    | Changes that affect the build system or dependencies            |
| chore    | Other changes that don't modify src or test files               |
| ci       | Changes to CI configuration files and scripts                   |
| docs     | Documentation only changes                                      |
| perf     | A code change that improves performance                         |
| refactor | A code change that neither fixes a bug nor adds a feature       |
| revert   | Reverts a previous commit                                       |
| style    | Changes that do not affect the meaning of the code (formatting) |
| test     | Adding missing tests or correcting existing tests               |

## Rules

1. Type MUST be lowercase, followed by a colon and a space.
2. Scope is optional - a noun in parentheses after the type, like feat(auth):.
3. Description is a short imperative summary right after the colon. No period.
4. Body is separated from the description by one blank line. Use bullet points (`- `) for listing specific changes.
5. Footers are separated from the body by one blank line. Use git trailer format Token: value. Multi-word tokens use hyphens (Reviewed-by). BREAKING CHANGE is the exception - it stays uppercase.
6. Breaking changes use an exclamation mark before the colon, like feat!: drop support for Node 16. Or put BREAKING CHANGE in the footer. If you use the exclamation mark, the footer is optional.
7. Multiple commits - if staged changes cover multiple concerns, prefer separate commits. Draft only the most significant one.
8. NEVER use non-standard types like `add`, `update`, `remove`, `wip` — these are violations. Map them:
   - `add:` → `feat:` (new code) or `refactor:` (new file extracted from existing)
   - `update:` → `feat:`, `fix:`, `refactor:`, `docs:`, or `test:` depending on intent
   - `remove:` → `refactor:` (deleting dead code) or `feat:` (removing a feature)
   - `wip:` → never commit WIP; squash into a meaningful commit
9. If a change spans multiple scopes, use no scope (just `type: description`) and detail the scopes in the body.
10. Schema/codegen regenerations belong under `chore(schema):` — never mix them with feature commits.

## Valid scopes

Scope must reflect a deployable service or a cross-cutting domain. Use the directory name from `apps/`:

| Scope   | App                            |
| ------- | ------------------------------ |
| auth    | `apps/auth` — authentication   |
| gateway | `apps/gateway` — REST API      |
| posts   | `apps/posts` — posts subgraph  |
| social  | `apps/social` — social graph   |
| search  | `apps/search` — search service |

Other valid scopes (cross-cutting):

| Scope    | When to use                                   |
| -------- | --------------------------------------------- |
| schema   | GraphQL schema regen, `.graphql` files, genql |
| k6       | Load/performance test scripts only            |
| seed     | Database seed scripts and seed data           |
| comments | Comment-specific changes (when extracted)     |
| shared   | `libs/shared/src/` — common lib changes       |
| nats     | NATS event bus, streams, event contracts      |
| neo4j    | Neo4j connection, indexes, queries            |
| redis    | Redis cache layer                             |
| ci       | GitHub Actions, CI/CD config                  |
| docker   | Docker/Podman compose files, Dockerfiles      |
| otel     | OpenTelemetry, tracing, observability         |
| router   | Apollo Router config, supergraph composition  |

Use no scope at all when the change is general (e.g., `fix: handle null coalescing in social service`).

## Determining the type from staged changes

- New features (new routes, services, mutations, controllers) -> feat
- Bug fixes (logic errors, crash fixes, incorrect behavior) -> fix
- Restructuring (moving code, renaming, merging modules, no behavior change) -> refactor
- Style-only (lint fixes, formatting, import sorting) -> style
- Dependencies (adding or removing packages, build config) -> build
- CI/CD (GitHub Actions, Dockerfile changes) -> ci
- Tests (adding or updating tests, k6 scripts, test helpers) -> test
- Docs (markdown files, comments, README) -> docs
- Schema or codegen (regenerating graphql schema, auto-generated code) -> chore
- Reverts -> revert

## Determining scope from staged changes

Check which `apps/*` directory has the most lines changed — that's the scope:

```
apps/auth/*     -> scope(auth)
apps/gateway/*  -> scope(gateway)
apps/posts/*    -> scope(posts)
apps/social/*   -> scope(social)
apps/search/*   -> scope(search)
```

If `libs/shared/` dominates, use `scope(shared)`. If schema files regenerate, use `scope(schema)`. If the change is spread evenly across apps, omit scope.

## Description style

- Use the imperative mood: "add", "fix", "remove", "merge", "extract", "upgrade", "bump", "migrate"
- Keep it under 72 characters
- Be specific enough to identify the change without reading the diff:
  - Good: `fix: validate token expiry before profile lookup`
  - Bad: `fix: fix stuff`
- For bug fixes, mention what was broken: `fix(social): handle null userCounts when user not found`
- Performance commits should mention the technique: `perf: add Neo4j indexes on (:User) and (:Post)`

## Body style

Use bullet points prefixed with `- ` to list concrete changes. Group related changes:

```
refactor(gateway): merge CommentsModule into PostsModule

- Delete CommentsModule (controller, service, module, DTOs)
- Add comment routes to PostsController at /posts/:postId/comments
- Register PostExistsGuard in PostsModule
```

For complex refactors, mention the "why" as the first paragraph, then list the "what":

```
refactor(social): extract Neo4j service from social service

The social service had raw Cypher queries scattered across methods.
Centralize into a Neo4jService with typed helpers.

- Add Neo4jService with follow/like/feed query methods
- Replace inline Cypher in SocialService with delegate calls
- Keep SocialService as the orchestration layer
```

## Examples from this codebase

```
feat(social): add feed query blending followed and recommended posts
```

```
feat(gateway): add PostExistsGuard, standardize :postId routes, eliminate redundant post lookups
```

```
refactor(gateway): merge CommentsModule into PostsModule

- Delete CommentsModule (controller, service, module, DTOs)
- Add comment routes to PostsController at /posts/:postId/comments
- Register PostExistsGuard in PostsModule
```

```
fix: change archive auth from AND to OR for comment/post owner
```

```
fix(schema): prevent pm2 restart from writing .graphql files with comment header
```

```
chore(schema): update schema
```

```
perf: add seed data script, MySQL pool, and Neo4j indexes
```

```
build: approve build scripts for swc, bcrypt, apollo, nestjs, and protobufjs deps
```

```
test(social): use service methods for seed graph, expand to 29 tests covering all Neo4j interactions
```

```
feat(seed): add comment seeding, profile presets, and credential export
```

```
feat(k6): add threaded comments test with create, reply, and archive flow
```

```
refactor(k6): replace inline checks with declarative expect() API and retry support
```

```
feat!: drop support for Node 16

BREAKING CHANGE: requires Node greater than or equal to 18 for native fetch
```

```
docs: update roadmap to mark seed script items as completed
```
