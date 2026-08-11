# Uli OS Agent Protocol

This file applies repository-wide to every AI employee or coding agent working on Uli OS.

## 1. Start-of-task reading order

Before proposing or changing anything, read these files in order:

1. `PRD.md` — canonical product intent and non-negotiable product rules.
2. `DECISIONS.md` — locked product and technical decisions.
3. `IMPLEMENTATION_STATE.md` — current implementation truth.
4. `.ai-bridge/TEAM_STATE.md` — shared working state across AI employees.
5. `.ai-bridge/CURRENT_DECISION.md` — the one decision/problem currently being worked.
6. `.ai-bridge/OPEN_QUESTIONS.md` — unresolved questions and ownership.
7. `.ai-bridge/HANDOFF.md` — current explicit handoff.
8. The active module spec named in `TEAM_STATE.md`, if it exists.

If any of these sources conflict, do not guess. Record the conflict in `.ai-bridge/OPEN_QUESTIONS.md` and stop before making a product-changing decision.

## 2. Source-of-truth hierarchy

Use this precedence order:

1. `PRD.md` and `DECISIONS.md` for product truth.
2. `IMPLEMENTATION_STATE.md` for what is actually implemented and verified.
3. Active module spec for the current module contract.
4. `.ai-bridge/*` for temporary shared reasoning state and handoffs.
5. Code and UI as implementation evidence, not as authority for product intent when they conflict with the files above.

No agent may silently change a locked product decision. Proposed changes must be written as proposals and require Uli confirmation before becoming canonical.

## 3. Shared reasoning protocol

Do not write, request, or persist hidden chain-of-thought. The Team Brain stores only concise, auditable external reasoning state:

- observed facts;
- current judgment;
- evidence or files supporting that judgment;
- confidence or uncertainty;
- open questions;
- recommended next action.

This is the shared interface between ChatGPT, Codex, validators, designers, researchers, and future AI employees.

## 4. Before implementation

For every code or infrastructure change:

- restate the requested scope;
- state what must not change;
- define observable acceptance tests before coding;
- identify a rollback checkpoint or branch;
- keep the change limited to the active module or infrastructure task.

Do not start a future module because it appears easy or adjacent.

## 5. After implementation

Before handing off:

1. Run the relevant tests and builds.
2. Run `pnpm team:check`.
3. Update your file under `.ai-bridge/agent-notes/` with facts, judgment, evidence, risks, and next recommendation.
4. Update `.ai-bridge/HANDOFF.md` if ownership moves to another AI employee.
5. Update `.ai-bridge/TEAM_STATE.md` only when the shared project state actually changes.
6. Update `IMPLEMENTATION_STATE.md` only for implemented and evidenced changes; do not mark planned work as complete.

Never claim `done`, `verified`, `production-ready`, or equivalent without evidence.

## 6. Security and personal-data rules

- Never commit secrets, credentials, tokens, database URLs with passwords, or one-time login codes.
- `DATABASE_URL` and similar values belong only in an approved secret manager/runtime secret store.
- User-authored personal experiences are sensitive data.
- Do not enable real personal-data capture until authentication, database access, migrations, and live save/read tests have all passed.
- Preserve original user-authored Event content; do not overwrite it with AI-derived text.

## 7. Git and PR behavior

- Work on a focused branch unless explicitly instructed otherwise.
- Keep PRs scoped to one module or one infrastructure objective.
- Do not merge unrelated cleanup into a feature PR.
- A handoff must identify changed files, tests run, remaining risks, and the next owner.

## 8. Default employee roles

- **ChatGPT / Product & Architecture Lead**: product reasoning, scope, decisions, acceptance criteria, review, and canonical-document synchronization.
- **Codex / Implementation Engineer**: repository inspection, implementation, tests, build verification, and engineering handoff.
- **QA / Independent Validator**: adversarial validation, regression checks, negative tests, and evidence review.

Additional employees may be added, but all must use this protocol.
