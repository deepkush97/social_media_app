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

| Type       | Usage                                                           |
| ---------- | --------------------------------------------------------------- |
| feat       | A new feature                                                   |
| fix        | A bug fix                                                       |
| build      | Changes that affect the build system or dependencies            |
| chore      | Other changes that don't modify src or test files               |
| ci         | Changes to CI configuration files and scripts                   |
| docs       | Documentation only changes                                      |
| perf       | A code change that improves performance                         |
| refactor   | A code change that neither fixes a bug nor adds a feature       |
| revert     | Reverts a previous commit                                       |
| style      | Changes that do not affect the meaning of the code (formatting) |
| test       | Adding missing tests or correcting existing tests               |

## Rules

1. Type MUST be lowercase, followed by a colon and a space.
2. Scope is optional - a noun in parentheses after the type, like feat(auth):.
3. Description is a short imperative summary right after the colon. No period.
4. Body is separated from the description by one blank line. Free form paragraphs.
5. Footers are separated from the body by one blank line. Use git trailer format Token: value. Multi-word tokens use hyphens (Reviewed-by). BREAKING CHANGE is the exception - it stays uppercase.
6. Breaking changes use an exclamation mark before the colon, like feat!: drop support for Node 16. Or put BREAKING CHANGE in the footer. If you use the exclamation mark, the footer is optional.
7. Multiple commits - if staged changes cover multiple concerns, prefer separate commits. Draft only the most significant one.

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

## Examples

```
feat(posts): add comment creation with threaded reply support
```

```
fix(auth): validate token expiry before profile lookup
```

```
refactor(gateway): merge CommentsModule into PostsModule

- Delete CommentsModule (controller, service, module, DTOs)
- Add comment routes to PostsController at /posts/:postId/comments
- Register PostExistsGuard in PostsModule
```

```
feat!: drop support for Node 16

BREAKING CHANGE: requires Node greater than or equal to 18 for native fetch
```

```
test: add k6 load test for comment CRUD flow
```

```
chore(schema): regenerate graphql types after comment addition
```
