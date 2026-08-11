# Uli OS Team State

Last updated: 2026-08-11
State owner: ChatGPT / Product & Architecture Lead

## Current objective

Validate that Codex can reconstruct the Uli OS project state from repository-native Team Brain context alone, without Uli manually retransmitting this ChatGPT conversation.

## Active work

- Infrastructure task: `INFRA-TB01 — Uli OS Team Brain v1`
- Status: merged and structurally verified
- Merge evidence: PR `#3`, squash commit `436c6b234caccee2c8f653de31ad009ee88e8992`
- Current handoff: `TB-HO-001` to Codex / Implementation Engineer
- Product module intentionally paused until the Team Brain handoff smoke test passes: `M01 — Capture`

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
- Team Brain Verification CI passed: structure/secret-hygiene check and context export both succeeded.
- Existing Cognitive Core regression and OpenNext Cloudflare build verification also passed on PR #3.

## M01 Capture status

- Draft PR: `#2 — M01 Capture module`
- Branch: `feature/m01-capture`
- PR state: open, draft, not merged.
- M01 includes raw Event capture, read-back, idempotency handling, database transaction logic, Access verification, append-only Event protection, UI, tests, and migration `0002_capture_module.sql`.
- Prior verification evidence showed 16/16 deterministic tests passing plus Next.js and OpenNext Cloudflare builds passing.
- Database migrations are executed in the real Neon database.
- M01 is not yet accepted or merged because runtime secret configuration and real browser save/read validation are still pending.

## Active module spec

`docs/modules/M01_CAPTURE.md` exists on the M01 feature branch, not on current `main`. Do not infer M01 requirements from UI or code if the module spec is unavailable; inspect PR #2 or wait for the feature branch to be rebased after the Team Brain smoke handoff.

## Current blockers

1. Codex must complete `TB-HO-001` and prove it can reconstruct project state from Team Brain without business-code changes.
2. M01 still needs production runtime secret wiring without exposing secrets.
3. M01 still needs real authenticated browser save/read tests against Neon.
4. `PRD.md` remains an MVP-level summary and needs later canonical expansion; missing requirements must remain unknown rather than inferred.

## Next intended sequence

1. Codex executes `TB-HO-001` exactly as written in `.ai-bridge/HANDOFF.md`.
2. ChatGPT reviews Codex's agent note and resolves any discrepancies.
3. Rebase/update M01 against Team Brain.
4. Issue the next repository-native M01 engineering handoff to Codex.
5. Run live M01 save/read and negative-path acceptance tests.
6. Only after M01 acceptance, move to the next product module.
