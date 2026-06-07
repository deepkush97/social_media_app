# AGENTS.md

## Operational Rules

- **No system command execution without user confirmation** — always ask before running any shell command, script, or build step
- **No delete operations without confirmation** — never delete files without explicit approval
- **No git commits, pushes, or branch operations** without confirmation
- **Give standardized commit message** every time you create feature, or fix something, you should also end the reply with a standard commit message
- **No package installs or dependency changes** without confirmation
- Confirm each action individually; batch confirmations only when the user explicitly offers them
- After any graphql file changes, you should run `generate-schema` command to make sure our schema is synced.
- Acknowledge mistakes or suggestion with deep thinking, and update AGENTS.md when some improvement is provided.

## Commands

| Command                    | Purpose                                                                       |
| -------------------------- | ----------------------------------------------------------------------------- |
| `pnpm run typecheck`       | `tsc --noEmit` — run before committing                                        |
| `pnpm run lint`            | `eslint --fix` — auto-fixes imports                                           |
| `pnpm run test`            | vitest run — unit tests only                                                  |
| `pnpm run test:integration` | vitest run (60s timeout) — requires Neo4j container on port 7688            |
| `pnpm run generate-schema` | regenerate `.graphql` schemas + genql client (needs infra up + `.env.router`) |
| `pnpm run start:fresh`     | `podman compose down -v && up -d` + wait for health + `pm2 start`             |

Order: `typecheck → lint` before commit. Pre-commit hook runs `lint-staged` (prettier + eslint on staged `.ts` files).

## Architecture

```
Client → Gateway (REST, port 3000) → Apollo Router (port 4000) → Subgraphs (GraphQL Federation v2)
                                                                  ├─ auth (3001)
                                                                  ├─ posts (3002)
                                                                  ├─ social (3003)
                                                                  └─ search (3004)
```

Events flow through NATS JetStream — subgraphs consume via `@EventHandler` decorator (auto-discovered at boot).

## Key Patterns

**Env loading** — each service loads its own `.env.<service>` (e.g., `.env.auth` for auth subgraph). Set `SERVICE=<name>` env var. The `scripts/start-fresh.sh` script shows which files exist.

**NATS** — `EventBusEmitter.emit(event, context)` for publishing; `@EventHandler(NatsEvents.X)` decorator on methods for consuming. Auto-discovers handlers at boot via `DiscoveryService`. Streams created on demand by emitter (503 → `ensureStream` + retry).

**GraphQL schema gen** — run subgraph with `GENERATE_SCHEMA=true` to produce `.graphql` file. Then `pnpm run generate-schema` composes supergraph + regenerates `libs/shared/src/graphql/client/` via genql. Client dir is lint/prettier-ignored.

**genql client** — `libs/shared/src/graphql/client/` is auto-generated, do not edit. Types imported as `import { FooOutputDto } from '@app/shared/graphql/client'`.

**Import alias** — `@app/shared/*` → `libs/shared/src/*`, `@app/*` → `src/*`.

**Shared lib** at `libs/shared/src/` — common modules: nats, cache (Redis), database (TypeORM), neo4j, logger, elasticsearch, graphql router composite, utils (`extractTags`, `toInt`, `createPaginatedResponse`).

**SWC** used for compilation (vitest + dev via `unplugin-swc`).

**OpenTelemetry** auto-initialized in `libs/shared/src/opentelemetry/` — reads `SERVICE` env var, exports OTLP traces to `http://localhost:4317`.

**Neo4j** — manage test container manually (`podman run neo4j:community` on port 7688). See `apps/social/src/social/social.service.spec.ts` for integration test setup. Use `toInt()` from `@app/shared/utils/to-int` for Neo4j Integer → JS number conversion.

**TypeORM** — `DB_SYNCHRONIZE=true` in all `.env.*` for dev. Three databases: `auth`, `posts`, `social`.

## ESLint Enforces

- `@typescript-eslint/explicit-function-return-type` — every function needs return type
- `@typescript-eslint/explicit-module-boundary-types` — every exported function needs return type
- `@typescript-eslint/no-explicit-any` — no `any` type
- `no-console` — no console.log
- `simple-import-sort/imports` — groups: `@nestjs`/node → external → `@app` → relative with parent → relative with dot → side-effect
- `simple-import-sort/exports`

## Style

- Single quotes, trailing commas, print width 100, semicolons, LF endings
- `@IsOptional()` + `@IsPositive()` on nullable number fields
- GraphQL input classes `implements` their shared interface

## Testing

- Vitest with globals enabled. `pnpm run test` for all.
- Unit tests are `*.spec.ts` files (or `*.unit.spec.ts`). Integration tests are `*.integration.spec.ts`.
- `pnpm run test` runs only unit tests (excludes `*.integration.spec.ts`).
- `pnpm run test:integration` runs integration tests with a 60s timeout.
- Social integration tests spin a real Neo4j container (`podman run`, port 7688). May need `podman` available.
- Mock helpers: `@app/shared/test-utils/repository.mock`, `logger.mock`, `elasticsearch.mock`, `search-service.mock`.
- Tower tests (`apps/social/src/social/social.service.integration.spec.ts`) use seed graph via service methods (not raw Cypher), mirroring real event handler order.
