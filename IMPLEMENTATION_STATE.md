# Implementation State

Checkpoint: `m01-capture-code-verified-awaiting-database`

## Canonical deployment

- Cloudflare account: `Harmless Kitten`
- Production Worker: `uli-os-web`
- Canonical URL: `https://uli-os-web.harmless-kitten.workers.dev/`
- GitHub repository: `yulicccccc/uli-os`
- Production branch: `main`
- GitHub → Cloudflare automatic deployment: verified

## M00 — Private access gate

Status: `PROVISIONALLY_ACCEPTED`

Implemented and verified:

- Production Worker URL is restricted by Cloudflare Access.
- Policy `uli-os-web - Production` uses action `Allow`.
- Allowed identity: `qchen9108@gmail.com`.
- Incognito unauthenticated access is redirected to Cloudflare Access.
- Email OTP login for the allowed identity succeeds and returns to the Chinese Uli OS homepage.

Residual risk:

- A second-mailbox negative test was not run because no alternate mailbox was available.
- M01 APIs add independent Access JWT verification before accepting personal data.

## M01 — Raw experience capture

Status: `CODE_VERIFIED_NOT_MERGED`

Implemented on Draft PR `#2` / branch `feature/m01-capture`:

- Exact raw-content preservation contract
- Input validation and 20,000-character limit
- Required idempotency key
- Cloudflare Access JWT signature, issuer, audience, subject, and email verification
- PostgreSQL transactional repository
- Event + graph node + idempotency record atomic write
- Owner-subject-scoped event reads
- SHA-256 content-integrity evidence
- Append-only database trigger for event rows
- Capture form and Event detail page
- Database migration `0002_capture_module.sql`

Verified evidence:

- Cognitive Core regression + Capture tests: `16/16 PASS`
- Next.js production build: `PASS`
- OpenNext Cloudflare build: `PASS`
- Frozen pnpm lockfile install: `PASS`
- Locked runtime dependencies:
  - `@neondatabase/serverless 1.1.0`
  - `jose 6.2.5`

## Required before M01 acceptance

- Create canonical Neon PostgreSQL project.
- Execute migrations `0001_cognitive_graph.sql` and `0002_capture_module.sql` against an empty database.
- Configure Cloudflare runtime values:
  - `DATABASE_URL` as a secret
  - `POLICY_AUD`
  - `TEAM_DOMAIN`
  - `ULI_ALLOWED_EMAIL`
- Merge Draft PR only after database migration evidence exists.
- Perform real authenticated browser tests:
  - save raw experience
  - receive unique Event ID
  - reread exact original content
  - verify blank/invalid inputs fail
  - verify missing or invalid Access assertion fails

## Explicitly not implemented in M01

- AI reasoning
- evidence extraction
- tags and search
- model updates
- identity and narrative logic

## Risk

HIGH: M01 introduces persistence of personal user-authored data. The production `main` branch still contains only the protected presentation shell. Do not enter real personal experiences until M01 database migration, runtime secrets, merge, and real-run acceptance tests are complete.
