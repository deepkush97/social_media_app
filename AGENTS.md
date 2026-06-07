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
- In codebase, never typecast using `any`, `as`, or `Record` without highlighting the intent by it.
- In codebase, do not create interface randomly, it should be created only in `libs/shared/src/interfaces` folder in appropriate domain sub folder

## Commands

| Command                     | Purpose                                                                       |
| --------------------------- | ----------------------------------------------------------------------------- |
| `pnpm run typecheck`        | `tsc --noEmit` — run before committing                                        |
| `pnpm run lint`             | `eslint --fix` — auto-fixes imports                                           |
| `pnpm run test`             | vitest run — unit tests only                                                  |
| `pnpm run test:integration` | vitest run (60s timeout) — requires Neo4j container on port 7688              |
| `pnpm run generate-schema`  | regenerate `.graphql` schemas + genql client (needs infra up + `.env.router`) |
| `pnpm run start:fresh`      | `podman compose down -v && up -d` + wait for health + `pm2 start`             |

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
- `@typescript-eslint/no-floating-promises` — no floating promises
- `@typescript-eslint/no-misused-promises` — no misused promises
- `@typescript-eslint/no-unused-vars` — error, allow `^_` prefix
- `@typescript-eslint/no-empty-function` — error (except constructors)
- `no-console` — no console.log
- `simple-import-sort/imports` — groups: `@nestjs`/node → external → `@app` → relative with parent → relative with dot → side-effect
- `simple-import-sort/exports`

## Style & Syntax

- Single quotes, trailing commas, print width 100, semicolons, LF endings

## Naming Conventions

| Category               | Convention                              | Example                              |
| ---------------------- | --------------------------------------- | ------------------------------------ |
| **Files**              | kebab-case                              | `app.service.ts`, `create-user.input.ts` |
| **Classes**            | PascalCase                              | `AppService`, `CreateUserInput`      |
| **Interfaces**         | PascalCase + `I` prefix                 | `IAppResponse`, `IUser`, `IPaginatedData` |
| **Types (payload)**    | PascalCase, no prefix                   | `PostCreatedEventPayload`, `PostSource` |
| **Enums**              | PascalCase                              | `AppCodes`, `NatsEvents`, `ContentStatusEnum` |
| **Enum values**        | UPPER_SNAKE_CASE                        | `OPERATION_SUCCESS`, `POST_CREATED`, `ACTIVE` |
| **DTOs (output)**      | PascalCase + `Dto` suffix               | `UserOutputDto`, `BooleanOutputDto`  |
| **Input classes**      | PascalCase + `Input` suffix             | `CreateUserInput`, `FollowUnfollowInput` |
| **Methods**            | lowerCamelCase                          | `createUser`, `findPostById`         |
| **Variables/params**   | lowerCamelCase                          | `userId`, `sessionId`, `postData`    |
| **Constants**          | UPPER_SNAKE_CASE                        | `CACHE_TTL_IN_SECONDS`, `WEIGHT_INTEREST_LIKE` |
| **Private methods**    | lowerCamelCase, no underscore prefix    | `prepareProfilePayload`              |
| **Unused params**      | Prefixed with `_`                       | `{ password: _, ...data }`           |
| **Directories**        | kebab-case                              | `social/`, `user/`, `session/`       |
| **Table names**        | `DOMAIN_TABLE`                          | `POSTS_POSTS`, `SOCIAL_LIKES`, `AUTH_USERS` |
| **Index names**        | `IDX_Table_field1_field2`               | `IDX_posts_userId_status_createdAt`  |
| **Cache keys**         | `domain:id:suffix`                      | `post:123`, `user_counts:456`        |
| **NATS events**        | `entity.action` (dot-separated)         | `user.created`, `post.liked`         |

## Coding Practices

### 1. Response Wrapper Pattern
Every service method MUST return `IAppResponse<T>` — never throw exceptions at the service boundary. Use `AppCodes` enum for result codes:
```typescript
async findUserById(id: number): Promise<IAppResponse<IUser>> {
  const data = await this.userService.findOneById(id);
  if (!data) {
    return new AppResponse({ code: AppCodes.BAD_REQUEST });
  }
  return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
}
```
Only Neo4j/subgraph services may throw for domain violations (e.g., "Cannot follow yourself").

### 2. Interface Location
Interfaces MUST be defined ONLY in `libs/shared/src/interfaces/<domain>/` — never in app code. Entity classes, input classes, and DTOs all `implements` their shared interface. Payload types (no `I` prefix) may live alongside their event classes.

### 3. GraphQL Input Classes
Every `@InputType()` class MUST `implements` its shared interface. Each field gets `@Field()` + class-validator decorators:
```typescript
@InputType()
export class CreateUserInput implements INewUser {
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
```
Nullable numeric fields: `@Field(() => Int, { nullable: true })` + `@IsOptional()` + `@IsPositive()`.

### 4. GraphQL Output DTOs
Use factory functions to reduce boilerplate — NEVER hand-write wrapper classes:
- **Single item**: `class FooOutputDto extends AppGraphqlResponse(FooOutput) {}`
- **Paginated**: `class FooListOutputDto extends AppPaginatedDataGraphqlResponse(FooOutput) {}`
Where `FooOutput` is a plain `@ObjectType()` class `implements IFoo`.

### 5. Service Layer (AppService)
- `@Injectable()` decorator, constructor DI with `private readonly`
- All public methods return `Promise<IAppResponse<T>>`
- Internal/repository methods return raw types or `null`: `Promise<IPost | null>`
- Implement lifecycle hooks when needed: `OnModuleInit`, `OnModuleDestroy`, `OnApplicationBootstrap`

### 6. Resolver / Controller Layer
Keep resolvers and controllers thin — delegate ALL business logic to the service layer:
```typescript
@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Mutation(() => UserOutputDto)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserOutputDto> {
    return this.appService.createUser(input);
  }
}
```

### 7. TypeORM Entities
- `@Entity(TableNamesEnum.X)` — use enum, not string literals
- `@PrimaryGeneratedColumn()` for IDs
- `@CreateDateColumn()` / `@UpdateDateColumn()` for timestamps
- Indexes via `@Index()` with naming: `IDX_Table_field1_field2`
- Unique constraints via `@Unique()` with naming: `UNQ_Table_field1_field2`

### 8. Neo4j Access
- Use `Neo4jService.executeWrite(fn, context)` and `executeRead(fn, context)`
- Convert Neo4j Integer to JS number via `toInt()` from `@app/shared/utils/to-int`
- Session management handled by service (do NOT manually open/close sessions)

### 9. NATS Event Contracts
- Events extend `BaseEvent<T>` with a typed payload
- Payloads use `Pick<Interface, Keys>` to select only needed fields
- Emit via `EventBusEmitter.emit(event, this.constructor.name)`
- Consume via `@EventHandler(NatsEvents.X)` on methods in subscriber services

### 10. Gateway Cache Pattern (Cache-Aside)
```typescript
async getPost(id: number): Promise<IAppResponse<IPost>> {
  const cached = await this.cacheService.get<IPost>(`post:${id}`);
  if (cached) return new AppResponse({ data: cached, code: AppCodes.OPERATION_SUCCESS });
  const result = await this.routerComposite.findPostById(id, { ... });
  if (result.data) await this.cacheService.set(`post:${id}`, result.data, CACHE_TTL);
  return result;
}
```
After mutations: invalidate relevant cache keys via `cacheService.del(key)` or `delAll(pattern)`.

### 11. GraphQL Router Composite
The `GraphqlRouterComposite` wraps genql client calls. Each method accepts `__args` + a projection selection set using `*GenqlSelection` types. Two request types:
- `client.query({ ... })` — for queries
- `client.mutation({ ... })` — for mutations

### 12. Testing Conventions
- **Manual instantiation**: `service = new Service(mockRepo as unknown as Repository<X>)` — avoid `Test.createTestingModule`
- **Mock repositories**: use `createMockRepo()` from `@app/shared/test-utils/repository.mock`
- **Mock logger**: use `createMockLogger()` from `@app/shared/test-utils/logger.mock`
- **Stub helpers**: define per-test `stubX(overrides?)` returning domain entity with defaults
- **Integration tests**: seed graph via service methods (not raw Cypher), mirror event handler order
- **File suffixes**: `*.spec.ts` for unit, `*.integration.spec.ts` for integration

### 13. Guards (Gateway)
- Implement `CanActivate` as `@Injectable()` class
- Export a decorator function combining `applyDecorators(UseGuards(GuardClass))`:
```typescript
@Injectable()
export class PostExistsGuard implements CanActivate { ... }

export function PostExists(): ReturnType<typeof applyDecorators> {
  return applyDecorators(UseGuards(PostExistsGuard));
}
```

### 14. Error Handling in Gateway
After calling `routerComposite.method()`, always check the code:
```typescript
if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
  return new AppResponse({ code: AppCodes[result.code ?? AppCodes.INTERNAL_ERROR] });
}
```

### 15. Event Handler Pattern
Wrap in try/catch, log warning, queue retry via NATS:
```typescript
@EventHandler(NatsEvents.POST_CREATED)
async onPostCreated(payload: PostCreatedEventPayload): Promise<void> {
  try {
    await this.socialService.processPost(payload);
  } catch (error) {
    this.logger.warn('Failed to process post', error, SocialSubscriberService.name);
    throw error; // triggers nak → redelivery
  }
}
```

### 16. Private Methods
NO underscore prefix (`_privateMethod` is forbidden). Use standard `privateMethod` naming.

## Testing

- Vitest with globals enabled. `pnpm run test` for all.
- Unit tests are `*.spec.ts` files (or `*.unit.spec.ts`). Integration tests are `*.integration.spec.ts`.
- `pnpm run test` runs only unit tests (excludes `*.integration.spec.ts`).
- `pnpm run test:integration` runs integration tests with a 60s timeout.
- Social integration tests spin a real Neo4j container (`podman run`, port 7688). May need `podman` available.
- Mock helpers: `@app/shared/test-utils/repository.mock`, `logger.mock`, `elasticsearch.mock`, `search-service.mock`.
- Tower tests (`apps/social/src/social/social.service.integration.spec.ts`) use seed graph via service methods (not raw Cypher), mirroring real event handler order.
