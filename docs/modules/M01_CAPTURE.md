# M01 — Capture / 经历捕捉

Status: IMPLEMENTATION IN PROGRESS
Risk: HIGH (personal data persistence)

## Scope

Input one raw experience, preserve the exact user-authored string, return a unique Event ID, and read the same record back from PostgreSQL.

## Explicitly excluded

- AI summarization or interpretation
- tags and search
- evidence extraction
- model updates
- identity and narrative logic

## Security gates

1. Cloudflare Access protects the production Worker.
2. API routes independently verify the `Cf-Access-Jwt-Assertion` signature, issuer, audience, subject, and allowed email.
3. Database credentials remain Cloudflare runtime secrets and never enter GitHub.
4. Event rows are append-only at the database layer.
5. Every write requires an idempotency key.

## Acceptance tests

- exact whitespace and line breaks are preserved
- blank input is rejected
- over-length input is rejected
- future timestamps beyond clock-skew allowance are rejected
- repeated identical command returns the existing Event
- reused idempotency key with different content is rejected
- unauthorized API request is rejected
- saved Event can be read by its owner
- production build succeeds
- real PostgreSQL migration and browser save/read remain required before completion

## M00 residual risk

The allowed-email policy and successful login were verified. A second-email negative test was not run because no alternate mailbox was available.
