# @nenichat/domain

Shared Nenichat domain logic — the private, single source of truth for our
business rules, consumed by our other projects (starting with `nenichat-web`).

**This is proprietary IP. It must stay in a private repository and must never be
published to the public npm registry.**

## What's inside

The package is organised by context, each with three layers:

```
src/
  {Context}/
    domain/   entities, value objects, repository interfaces  (pure, no I/O)
    app/      use cases / application services
    infra/    adapters: GoWapp API clients, Supabase / pg repositories, LLM client
```

Contexts: `Audiences`, `Campaigns`, `Chats`, `Contacts`, `Containers`,
`Expenses`, `Messages`, `Orders`, `Products`, `Shared`, `Suggestions`,
`Templates`, `Wapp`.

Consumers should prefer **deep imports** so that server-only adapters (`pg`,
`openai`, `@supabase/supabase-js`) are not pulled into bundles that don't need
them:

```ts
import { IContact } from "@nenichat/domain/Contacts/domain/IContact";
import { SupabaseContactRepository } from "@nenichat/domain/Contacts/infra/persistance/SupabaseContactRepository";
```

A root barrel (`@nenichat/domain`) also exists for convenience.

## How it is distributed

It is consumed as a **git dependency** straight from this private repo — no npm
registry involved. A consumer's `package.json` just includes:

```jsonc
"dependencies": {
  "@nenichat/domain": "github:MindSetFPS/domain#main"
}
```

`#main` tracks the latest commit on the default branch. `pnpm` records the
resolved commit in the lockfile, so installs stay reproducible until you run
`pnpm install` again. To pin a released version instead, push a tag and use
`github:MindSetFPS/domain#v0.1.0`.

Because the repo is private, the machine running the install needs read access
(a GitHub token in `GH_TOKEN`/`NODE_AUTH_TOKEN`, or SSH-key access for local
installs — pnpm/git uses your normal git credentials).

### Why the built `dist/` is committed

The package ships **pre-compiled CommonJS + type declarations** in `dist/`, and
`dist/` is committed to this repo. That means installing it needs no build step
— it works the same under pnpm, npm, yarn and bun.

The alternative (a `prepare` build script) does **not** work well for a private
git dependency with modern pnpm: pnpm blocks git-dependency build scripts behind
an allowlist whose key includes the resolved commit hash, so it would break on
every release. Committing `dist/` avoids that entirely.

**Consequence:** whenever you change anything under `src/`, you must rebuild and
commit `dist/` or consumers will keep using the old build:

```bash
pnpm build          # tsc -> dist/
git add -A
git commit -m "your change"
git push
```

## Peer dependencies

The libraries that cross the package's public API surface are declared as
(optional) **peer dependencies**: `@supabase/supabase-js`, `pg`, `openai`,
`zod`, `cron-parser`, `@tanstack/react-table`.

They are peers rather than direct dependencies so that the consumer and this
package share **one** copy of each library. If they were bundled, TypeScript
would see two different `SupabaseClient` types (they have protected members) and
refuse to compile — this was the main obstacle in the migration.

A consumer that only uses the pure `domain/` layer needs none of them. A
consumer that uses `infra/` must have the matching library installed itself.

## Adding it to another project

```bash
# pnpm / npm / yarn
pnpm add "github:MindSetFPS/domain#main"
```

```jsonc
// bun (package.json)
"dependencies": {
  "@nenichat/domain": "github:MindSetFPS/domain#main"
}
```

Then import via the deep paths shown above.

## Local development

```bash
pnpm install         # install deps for compiling/testing
pnpm build           # emit dist/
pnpm typecheck       # type-check without emitting
```

## First-time push to GitHub

This directory is already an initialised git repository (branch `main`) with the
source and the built `dist/` committed. Create an empty **private** repo named
`domain` under the `MindSetFPS` account, then:

```bash
git remote add origin https://github.com/MindSetFPS/domain.git
git push -u origin main
```
# nenichat-domain
