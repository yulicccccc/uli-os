# Implementation State

Last updated: 2026-08-11
Checkpoint: `team-brain-v1-candidate`

## Canonical infrastructure state

### Repository and deployment

- Repository: `yulicccccc/uli-os`
- Default branch: `main`
- Production Worker: `https://uli-os-web.harmless-kitten.workers.dev/`
- Cloudflare account currently used for the canonical deployment: `Harmless Kitten`
- GitHub `main` is connected to Cloudflare automatic build/deploy through OpenNext.
- The older `flint-oak` deployment is not canonical and must not be used as the current production address.

### Access control

- Production Worker is protected by Cloudflare Access.
- Current allowed email: `qchen9108@gmail.com`.
- Positive test passed:
  - unauthenticated/incognito access was intercepted by Cloudflare Access;
  - the allowed email successfully authenticated and reached the Uli OS page.
- Deferred evidence gap: a second unauthorized mailbox was not available for a full negative-login attempt.

### Database

- Neon project: `uli-os`
- Application branch/database: `production / neondb`
- PostgreSQL base migration `db/migrations/0001_cognitive_graph.sql` was executed successfully in Neon SQL Editor.
- Capture migration `db/migrations/0002_capture_module.sql` was executed successfully in Neon SQL Editor.
- Append-only Event trigger creation completed as part of `0002`.
- A database credential that was accidentally exposed during setup was rotated. The exposed credential is invalid and must never be reused.
- Current database credentials are not stored in this repository.

## Implemented on `main`

- pnpm monorepo scaffold
- Graph node types
- Controlled relationship registry and relationship validation
- Structured Reasoning Record types
- Model Update candidate state machine
- Mandatory Model Boundary validation
- Deterministic Evidence Ledger maturity assessment
- Deterministic mock reasoning adapter
- Executable Capture → Reasoning → Evidence → Model Update Candidate core slice
- PostgreSQL cognitive-graph migration
- Relationship registry seed
- OpenAPI draft
- Minimal Chinese Next.js shell
- Automated offline regression tests
- Workspace lockfile
- Next.js production build
- OpenNext Cloudflare Worker bundle
- Cloudflare Worker configuration
- GitHub-to-Cloudflare continuous deployment
- Cloudflare Access protection on the canonical Worker

## M00 — Private Access Gate

Status: **provisionally accepted**

Passed:

- unauthenticated access blocked;
- authorized email login succeeded;
- Chinese Uli OS shell remained available after authentication.

Residual risk:

- unauthorized second-email negative login test deferred because no second mailbox was available.

## M01 — Capture

Status: **implemented on feature branch; not accepted; not merged**

- Draft PR: `#2 — M01 Capture module`
- Branch: `feature/m01-capture`
- The PR is open and draft.
- M01 code includes raw Event capture, exact read-back, idempotency, database transaction handling, Access request verification, UI, tests, and append-only Event protection.
- Prior CI evidence on the feature branch passed 16/16 deterministic tests, Next.js production build, OpenNext Cloudflare build, and frozen-lockfile verification.
- The real Neon database has now received both required migrations.

Still required before M01 acceptance/merge:

1. secure production runtime configuration for database connectivity and Access verification;
2. real authenticated browser create/read test against Neon;
3. negative/error-path runtime tests;
4. final evidence card and acceptance review.

## INFRA-TB01 — Uli OS Team Brain v1

Status: **candidate on `infra/team-brain-v1`; not yet merged**

Purpose:

- provide one repository-native structured reasoning/handoff interface for ChatGPT, Codex, QA, and future AI employees;
- prevent Uli from manually retransmitting project context between employees;
- preserve a strict distinction between canonical product truth, current working reasoning, and implementation evidence.

Acceptance requires:

- Team Brain structural verifier passes;
- context exporter produces a coherent packet;
- CI passes;
- first Codex no-business-code comprehension smoke test succeeds after merge.

## Known documentation debt

- `PRD.md` is still an MVP-level canonical summary, not yet a full product PRD.
- `DECISIONS.md` contains the most implementation-critical locked decisions but not yet the complete historical decision log.
- Missing product requirements must remain unknown; implementation agents must not infer them from code or UI.

## Current risk

**HIGH for real personal-data capture until M01 acceptance is complete.**

Do not input real personal experiences into the application until runtime secrets, database connectivity, exact save/read behavior, and failure-path validation have all been evidenced.
