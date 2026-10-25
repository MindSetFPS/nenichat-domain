# @nenichat/domain

Shared domain logic for Nenichat projects: entities, use cases and adapters, consumed
by `nenichat-web` and Node services.

The package ships compiled CommonJS and type declarations in `dist/`. Consumers install
it as a git dependency and import through the paths declared in `package.json#exports`.

Private package. Do not publish it to a public registry.

## Setup

```bash
pnpm install
pnpm typecheck
pnpm build
```

## Verifying a change

The package has no dev server. A change is correct when all five checks pass:

1. `pnpm typecheck` passes.
2. `pnpm test` passes.
3. `pnpm build` passes and the new files exist in `dist/`.
4. The new code runs from `dist/` through its public import path.
5. The consuming project works with the change.

### 1. Type check

```bash
pnpm typecheck
```

Use watch mode while editing:

```bash
pnpm exec tsc -p tsconfig.json --noEmit --watch
```

It rechecks on save and does not write `dist/`. Strict mode is enabled, so an interface
change breaks every implementation until all of them are updated.

### 2. Run the tests

```bash
pnpm test
```

Tests live beside the code in `__tests__/` and import from `src/` directly. See
[Testing](#testing) for the configuration and the live gateway suite.

### 3. Build

```bash
pnpm build
```

`tsc` writes CommonJS and `.d.ts` files to `dist/`. `dist/` is committed and is what
consumers install. A change that is not rebuilt and committed is not delivered.

### 4. Run the built code

Run from `dist/`, not from `src/`:

```bash
node -e "const { matchProduct } = require('./dist/Orders/app/product-matching'); \
         console.log(matchProduct('Choclate', { name: 'Chocolate' }))"
```

Expected output: `true`.

Or use a temporary file:

```js
// scratch.cjs
const { matchProduct } = require('./dist/Orders/app/product-matching')

console.log(matchProduct('Choclate', { name: 'Chocolate' })) // true
console.log(matchProduct('Laptop', { name: 'Notebook' }))    // false
```

```bash
node scratch.cjs
rm scratch.cjs
```

Require by package name to test the export map:

```bash
node -e "require('@nenichat/domain/Orders/app/product-matching')"
```

If this throws `ERR_PACKAGE_PATH_NOT_EXPORTED`, the path is not exported and consumers
cannot import it.

This step catches problems that `tsc` does not: files excluded from the build, missing
export entries, modules that read `process.env` at import, missing peer dependencies and
CommonJS interop errors.

### 5. Test in the consumer

```bash
# in domain/
pnpm build
pnpm link --global

# in web/
pnpm link --global @nenichat/domain
pnpm dev
```

Run the route, page or job that uses the change. Restart `next dev` after rebuilding the
package; Next does not watch `node_modules`.

To restore the dependency declared in `web/package.json`:

```bash
# in web/
pnpm install --force
```

Alternatively, set `"@nenichat/domain": "link:../domain"` in `web/package.json`, run
`pnpm install`, and revert it before committing.

## Adding a feature

Code is organised by context, each with three layers:

```
src/
  {Context}/
    domain/   entities, value objects, repository interfaces (no I/O)
    app/      use cases, services, read models in dto/
    infra/    adapters: Supabase, pg, GoWapp API, LLM
```

Contexts: `Audiences`, `Campaigns`, `Chats`, `Contacts`, `Containers`, `Expenses`,
`Messages`, `Orders`, `Products`, `Shared`, `Suggestions`, `Templates`, `Wapp`.

### Example: find a contact by username

Add the method to the repository interface in `domain/`:

```ts
// src/Contacts/domain/IContactRepository.ts
findByUsername(businessId: number, username: string): Promise<IContact | null>;
```

Implement it in every adapter. TypeScript reports an error until both are done:

```ts
// src/Contacts/infra/persistance/SupabaseContactRepository.ts
async findByUsername(businessId: number, username: string): Promise<IContact | null> {
  const { data, error } = await this.supabase
    .from("contacts")
    .select(ALL_ROWS_AND_JOIN_PHONE_NUMBER)
    .eq("business_id", businessId)
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data ? this.mapToContact(data) : null;
}
```

The same method is required in `src/Contacts/infra/persistance/ContactRepository.ts`
(the `pg` adapter).

Add a use case in `app/` only when there is behaviour to coordinate. Use kebab-case file
names and one exported function or class per file:

```ts
// src/Contacts/app/find-contact-by-username.ts
export async function findContactByUsername(
  repo: IContactRepository,
  businessId: number,
  username: string,
) {
  return repo.findByUsername(businessId, username);
}
```

Deep imports need no registration. The `"./*"` entry in `package.json#exports` maps them
directly into `dist/`. Add `src/{Context}/index.ts` when a stable alias is needed; see
`Containers/index.ts`. The root `src/index.ts` is limited to modules that are safe in
every bundle. It currently exports `Wapp`, `Chats/infra/api`, `Messages/infra/api`,
`Containers` and `Suggestions`. Adding server-only code there pulls it into every
consumer bundle.

### Checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes and the new files exist in `dist/`
- [ ] The new path resolves through `package.json#exports`
- [ ] Pure logic has a test in `__tests__/`
- [ ] The change has been exercised in the consumer
- [ ] `src/` and `dist/` are committed together

## Conventions

**Layering.** `domain/` contains no I/O. `app/` coordinates use cases. `infra/` holds
adapters. Keep dependencies pointing inward.

**Ports.** Adding a method to a repository interface requires implementing it in every
adapter. TypeScript enforces this; do not work around it with casts.

**Exports.** Consumers use deep imports. Server-only adapters (`pg`, `openai`,
`@supabase/supabase-js`) must not reach client bundles.

**Peer dependencies.** A third-party library used in the public API goes in all three
places:

```jsonc
"peerDependencies":     { "lib": "^x" },
"peerDependenciesMeta": { "lib": { "optional": true } },
"devDependencies":      { "lib": "^x" }
```

Do not add it to `dependencies`. The consumer must share one copy; duplicate copies
produce incompatible types, such as two `SupabaseClient` definitions.

**Environment.** `Shared/infra/persistance/db.ts` reads `DB_USER`, `DB_PASSWORD`,
`DB_HOST`, `DB_PORT` and `DB_NAME` at import time and throws when any is missing. Do not
import the `pg` adapters from `domain/`, `app/`, or from tests that do not provide these
variables.

**Runtime.** The output is CommonJS for Node. `nenichat-web` runs on Cloudflare Workers,
where `pg` cannot open a TCP connection. Adapters imported by `web` must use Supabase or
HTTP.

**Multitenancy.** Every query filters by `business_id`.

**Generated files.** Do not edit `dist/` by hand. `pnpm clean` deletes it and
`pnpm build` rewrites it.

## Testing

Tests run with Jest and `ts-jest`. They live in `__tests__/` beside the code and import
from `src/` directly. `tsconfig.build.json` excludes them from `dist/`, so they are not
part of the published artifact.

```bash
pnpm test          # run once
pnpm test:watch    # re-run on change
```

Configuration:

- `jest.config.cjs` selects `src/**/__tests__/**/*.test.ts` and `*.test.tsx`, using the
  Node environment.
- `tsconfig.json` includes `src/**/*`, including tests, and loads the Jest types.
- `tsconfig.build.json` excludes tests and is used by `pnpm build`.

Current suites:

| Suite | Scope |
|---|---|
| `Orders/app/__tests__/product-matching.test.ts` | product matching logic |
| `Chats/infra/api/__tests__/GoWappChatRepository.test.ts` | GoWapp chat adapter |
| `Containers/Infrastructure/Dokploy/__tests__/DokployContainerService.test.ts` | Dokploy container service |
| `Wapp/infra/__tests__/wapp-live.test.ts` | live gateway, skipped unless configured |

`wapp-live.test.ts` calls a real GoWhatsApp gateway. It reads `.env` at the repository
root. When the file or `NEXT_PUBLIC_GOWAPP_HOST_URL` is missing, the suite is skipped:

```dotenv
NEXT_PUBLIC_GOWAPP_HOST_URL=http://192.168.1.64:...
GOWAPP_USER=...
GOWAPP_PASSWORD=...
```

The business id is hardcoded as `115` in that file. The tests are read-only.

Tests that need a database, a network call or environment variables are integration
tests. Do not add them to the pure suite.

## Releasing

```bash
pnpm typecheck
pnpm build
git add -A
git commit -m "feat(Contacts): find by username"
git push
```

Consumers update with:

```bash
pnpm update @nenichat/domain
```

Tag releases that other projects depend on, so they can be pinned:

```bash
git tag v0.2.0
git push --tags
```

## Distribution

Consumers declare the package as a git dependency:

```jsonc
"dependencies": {
  "@nenichat/domain": "github:MindSetFPS/nenichat-domain#main"
}
```

`#main` tracks the latest commit. The lockfile pins the resolved commit until the
consumer runs an update. The repository is private, so the installing machine needs
read access through normal git credentials or a GitHub token.

`dist/` is committed instead of built during install because pnpm blocks build scripts
for git dependencies behind a per-commit allowlist. Committing the build works with
pnpm, npm, yarn and bun.

## Troubleshooting

**`web` runs old code after a change.**
Rebuild the package, confirm the link, and restart `next dev`:

```bash
cd domain && pnpm build && pnpm link --global
cd web && pnpm link --global @nenichat/domain && pnpm dev
```

**`tsc` passes but the consumer cannot import the module.**
Confirm `dist/<path>.js` exists and that `require('@nenichat/domain/<path>')` works from
this repository.

**`Error: Missing environment variable: DB_USER`.**
A `pg` adapter was imported. Use the Supabase adapter in `web`, or provide the `DB_*`
variables in a Node process.

**Two `SupabaseClient` types.**
The package has more than one installed copy of `@supabase/supabase-js`. It must be a
peer dependency in the consumer.

**Tests are missing from `dist/`.**
Test files are excluded by `tsconfig.json`. Tests are not published.

## Reference

| Command | Result |
|---|---|
| `pnpm install` | installs compiler dependencies and optional peers |
| `pnpm typecheck` | runs `tsc --noEmit` |
| `pnpm exec tsc -p tsconfig.json --noEmit --watch` | watch mode, no output |
| `pnpm test` | runs the Jest suite |
| `pnpm test:watch` | runs Jest in watch mode |
| `pnpm build` | writes CommonJS and declarations to `dist/` |
| `pnpm clean` | deletes `dist/` |
| `node -e "require('./dist/...')"` | runs the built code |

```
src/
  {Context}/
    domain/                    entities, value objects, repository interfaces
    app/                       use cases, services, dto/ read models
    infra/
      persistance/             Supabase*Repository, pg *Repository
      api/                     GoWapp HTTP clients
  Shared/
    infra/llm/                 OpenAI-compatible client, structured output, models
    infra/persistance/db.ts    pg pool, reads DB_* at import
  index.ts                     root barrel, keep small and bundle-safe
```
