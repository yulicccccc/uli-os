# Cloudflare Connection State

Status: `USER_ACTION_REQUIRED`

## Completed

- Uli reported that the temporary Worker deployment was claimed on 2026-07-30.
- Cloudflare/OpenNext deployment configuration is committed.
- The deployment URL previously passed an HTTP 200 smoke test and contained the expected `Uli OS` marker.
- GitHub contains an independent Cognitive Core + OpenNext build-verification workflow.

## Remaining account-level action

Connect the claimed Cloudflare Worker `uli-os-web` to the GitHub repository `yulicccccc/uli-os` through Cloudflare Workers Builds.

Use these settings:

```text
Production branch: main
Root directory: apps/web
Build command: npx @opennextjs/cloudflare build
Deploy command: npx @opennextjs/cloudflare deploy
Non-production deploy command: npx @opennextjs/cloudflare upload
```

## Why this cannot be automated here

The current tool environment can write the GitHub repository but has no connected Cloudflare account tool. Cloudflare requires the account owner to authorize its GitHub App or create deployment credentials. No API token or OAuth credential may be placed in this public repository.

## Acceptance evidence

After connection, push a harmless verified commit and confirm:

1. Cloudflare Workers Builds starts automatically.
2. Build and deployment succeed.
3. `https://uli-os-web.flint-oak.workers.dev` returns HTTP 200.
4. The page contains `Uli OS`.
