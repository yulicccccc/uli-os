# Cloudflare Deployment

## Current state

- Worker name: `uli-os-web`
- Verified URL: `https://uli-os-web.flint-oak.workers.dev`
- Temporary deployment was claimed by Uli on 2026-07-30.
- Claim completion is user-confirmed; this repository has no direct Cloudflare account connector with which to independently inspect account ownership.

## Canonical deployment configuration

The Next.js application lives in `apps/web` and uses the OpenNext Cloudflare adapter.

Required Cloudflare Workers Builds settings:

```text
Git repository: yulicccccc/uli-os
Production branch: main
Root directory: apps/web
Build command: npx @opennextjs/cloudflare build
Deploy command: npx @opennextjs/cloudflare deploy
Non-production deploy command: npx @opennextjs/cloudflare upload
```

The Cloudflare Worker name must remain `uli-os-web` because it must match `apps/web/wrangler.jsonc`.

## Verification before deployment

GitHub Actions independently verifies every relevant change with:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm --filter @uli-os/web cf:build
```

This verifies the Cognitive Core regression suite, the Next.js production build, and the OpenNext Worker bundle before Cloudflare deploys the repository.

## Security boundaries

- Never commit Cloudflare API tokens, claim URLs, account IDs, or deployment credentials.
- The deployed shell must not accept real personal data until authentication, privacy controls, and encryption policy are implemented.
- Cloudflare runtime secrets belong in Worker Settings > Variables & Secrets.
- Next.js build-time secrets belong in Worker Settings > Builds > Build variables and secrets.

## Rollback

- Revert the relevant Git commit and let Workers Builds redeploy `main`.
- Cloudflare deployment configuration does not modify Cognitive Core logic.
- No production database exists at this checkpoint.
