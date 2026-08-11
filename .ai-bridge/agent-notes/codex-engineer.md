# Codex / Implementation Engineer — Latest Note

Updated: 2026-08-11
Status: Team Brain bootstrap comprehension complete

## Task

Execute `TB-HO-001`: bootstrap Uli OS understanding entirely from repository-native canonical documents, Team Brain state, and PR #2; run the Team Brain verifier and context exporter; make no business-code changes.

## Observed facts

- Uli OS MVP exists to help a person transform experiences into judgment through continuous high-quality dialogue. Its north star is evidence-backed life-narrative evolution, and its growth loop is Capture → Dialogue → Understand → Apply → Reflect → Become.
- The first vertical slice preserves the original Event unchanged, creates an auditable Reasoning Record, proposes Evidence and possibly a Model Update candidate, and requires Uli confirmation before any candidate creates or revises a canonical Model.
- Locked product rules include: AI proposes and Uli confirms; Model Update is the minimum growth unit; Evidence Ledger remains separate; every Model has a Boundary; contradictory evidence and reasoning disagreements remain visible; model versions and correction history are preserved; low-confidence input may remain unclassified.
- Locked technical rules include: hybrid graph nodes; a universal edge table with a controlled relationship registry; PostgreSQL as canonical storage; immutable structured Reasoning Records; versioned Models and append-only Evidence; command-oriented idempotent writes; a strict AI adapter with no direct canonical writes; pnpm/Turborepo; evidence-first risk-based tests; and vertical-slice implementation order.
- Team Brain is the repository-native handoff interface for ChatGPT, Codex, QA, and future AI employees. It stores concise observed facts, judgment, evidence, uncertainty, open questions, and next actions, not raw chat history or hidden chain-of-thought.
- Source precedence is: `PRD.md` and `DECISIONS.md` for product truth; `IMPLEMENTATION_STATE.md` for implemented/verified truth; the active module spec for the module contract; `.ai-bridge/*` for temporary shared state; code/UI only as implementation evidence.
- Canonical production is `https://uli-os-web.harmless-kitten.workers.dev/` in the Cloudflare `Harmless Kitten` account. GitHub `main` is connected to automatic OpenNext deployment. The older `flint-oak` deployment is non-canonical.
- Cloudflare Access blocks unauthenticated access and allowed `qchen9108@gmail.com` to reach the Chinese Uli OS shell. A login attempt using a second unauthorized mailbox remains untested.
- Neon project `uli-os`, branch/database `production / neondb`, has migrations `0001_cognitive_graph.sql` and `0002_capture_module.sql` applied. The latter includes append-only Event protection. A previously exposed credential was rotated; current credentials are not in the repository and must not be requested or recorded in Team Brain.
- M00 is provisionally accepted. Its only recorded residual evidence gap is the second-unauthorized-email negative login test.
- M01 is implemented on `feature/m01-capture` in draft PR #2, but is not accepted and not merged. Its contract is raw Event capture with exact read-back from PostgreSQL. AI interpretation, tags/search, Evidence extraction, Model Updates, and identity/narrative logic are explicitly excluded.
- PR #2 contains Event capture/read APIs, Access JWT verification, transactional PostgreSQL storage, idempotency, append-only migration, UI, tests, and `docs/modules/M01_CAPTURE.md`. Its current check rollup reports successful M01 Capture Verification, Cloudflare Build Verification, and Workers build checks.
- M01 acceptance still requires secret-managed production database/Access runtime configuration, a real authenticated browser create/read test against Neon, negative/error-path runtime tests, and a final evidence card/review.
- Team Brain v1 is merged and structurally verified. This bootstrap is the remaining operational smoke test for `INFRA-TB01`.

## Current judgment

The repository provides enough coherent context for Codex to reconstruct the MVP, its non-negotiable rules, infrastructure state, M00/M01 status, active risks, and permitted next action without receiving the originating ChatGPT history. No factual conflict requiring an addition to `OPEN_QUESTIONS.md` was found.

Team Brain therefore passes the Codex comprehension portion of the smoke test. This note does not accept M01 or authorize implementation. Codex is permitted only to return this evidence to ChatGPT / Product & Architecture Lead and wait for the next explicit repository-native handoff.

## Evidence

- `AGENTS.md`, `PRD.md`, `DECISIONS.md`, and `IMPLEMENTATION_STATE.md` on `main` at bootstrap commit `b3d8871cc1c5e03599ef5fe2f959fa89b8e13f19`.
- `.ai-bridge/TEAM_STATE.md`, `.ai-bridge/CURRENT_DECISION.md`, `.ai-bridge/OPEN_QUESTIONS.md`, and `.ai-bridge/HANDOFF.md` (`TB-HO-001`).
- `pnpm team:check`: PASS, 13 required files checked, using the repository-declared pnpm `10.14.0`.
- `pnpm team:context`: PASS; generated a non-empty 737-line `ULI OS TEAM CONTEXT PACKET` containing `AGENTS.md` and the active handoff.
- PR #2: `M01 Capture module`, open draft on `feature/m01-capture`; inspected its commits, changed files, check rollup, and `docs/modules/M01_CAPTURE.md`.
- PR #2 check rollup at inspection: all reported checks successful, including M01 Capture Verification, Cloudflare Build Verification, and `Workers Builds: uli-os-web`.
- Git working-tree scope after bootstrap is limited to this employee note; no M01 or other business-code file was intentionally modified.

## Uncertainty / risk

- `PRD.md` remains an MVP summary and `DECISIONS.md` is not the full historical log. Missing requirements must remain unknown rather than inferred from code or UI.
- The active M01 module spec exists only on the feature branch, and PR #2 has not yet been rebased or updated against the merged Team Brain mainline.
- Real personal-data capture remains high risk until production secret wiring, exact live Neon save/read, and failure-path evidence pass.
- M00 still lacks the second-mailbox unauthorized-login attempt.
- A global pnpm 11 invocation stopped on unapproved dependency build scripts. Using the repository-declared pnpm `10.14.0` through Corepack reproduced CI and passed both required Team Brain commands; future agents should honor `packageManager` rather than an unrelated global pnpm.

## Recommended next action

ChatGPT / Product & Architecture Lead reviews this note directly from GitHub, marks the Team Brain comprehension smoke test accepted if the reconstruction is accurate, resolves any documentation gaps with Uli, and issues a new explicit M01 handoff. That handoff should first reconcile/rebase PR #2 with current `main`, then scope secret-managed runtime wiring and live acceptance evidence without exposing credentials.

## Recommended next owner

ChatGPT / Product & Architecture Lead.
