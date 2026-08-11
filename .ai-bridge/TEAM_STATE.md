# Uli OS Team State

Last updated: 2026-08-11
State owner: ChatGPT / Product & Architecture Lead

## Current objective

Establish `Uli OS Team Brain v1` so ChatGPT, Codex, QA, and future AI employees share one structured external reasoning state through the repository.

## Active work

- Infrastructure task: `INFRA-TB01 — Uli OS Team Brain v1`
- Branch: `infra/team-brain-v1`
- Status: in progress
- Product module intentionally paused during this infrastructure task: `M01 — Capture`

## Verified project state

- Repository: `yulicccccc/uli-os`
- Canonical production Worker: `https://uli-os-web.harmless-kitten.workers.dev/`
- GitHub `main` is connected to Cloudflare automatic builds/deployments.
- Cloudflare Access protects the production Worker.
- Allowed identity currently configured: `qchen9108@gmail.com`.
- Positive Access test passed: unauthenticated access was blocked and the allowed email successfully authenticated.
- Negative test with a second unauthorized email is deferred because no second test mailbox was available.
- Neon project `uli-os` exists.
- Neon branch/database used for the application: `production / neondb`.
- Database migrations `0001_cognitive_graph.sql` and `0002_capture_module.sql` were manually executed successfully in Neon SQL Editor.
- A previously exposed Neon database credential was rotated and must not be reused.

## M01 Capture status

- Draft PR: `#2 — M01 Capture module`
- Branch: `feature/m01-capture`
- PR state: open, draft, not merged.
- M01 includes raw Event capture, read-back, idempotency handling, database transaction logic, Access verification, append-only Event protection, UI, tests, and migration `0002_capture_module.sql`.
- Prior verification evidence showed 16/16 deterministic tests passing plus Next.js and OpenNext Cloudflare builds passing.
- Database migrations are now executed in the real Neon database.
- M01 is not yet accepted or merged because runtime secret configuration and real browser save/read validation are still pending.

## Active module spec

`docs/modules/M01_CAPTURE.md` exists on the M01 feature branch, not on current `main`. Do not infer M01 requirements from UI or code if the module spec is unavailable; inspect PR #2 or wait for the feature branch to be rebased after Team Brain is merged.

## Current blockers

1. Team Brain v1 must pass repository-level verification and be merged before it becomes the shared employee interface.
2. M01 still needs production runtime secret wiring without exposing secrets.
3. M01 still needs real authenticated browser save/read tests against Neon.
4. `PRD.md` remains an MVP-level summary and will need a fuller canonical expansion; do not silently invent missing product requirements.

## Next intended sequence

1. Finish and verify `INFRA-TB01`.
2. Merge Team Brain to `main`.
3. Rebase/update M01 against Team Brain.
4. Hand M01 engineering continuation to Codex with a repository-native handoff.
5. Run live M01 save/read and negative-path acceptance tests.
6. Only after M01 acceptance, move to the next product module.
