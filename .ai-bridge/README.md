# Uli OS Team Brain

`/.ai-bridge` is the shared external reasoning state for Uli OS AI employees.

It is not a transcript store and it must not contain hidden chain-of-thought. It contains only concise, auditable state that another employee can safely continue from.

## Files

- `TEAM_STATE.md` — current shared execution state.
- `CURRENT_DECISION.md` — one active decision/problem and its structured reasoning summary.
- `OPEN_QUESTIONS.md` — unresolved issues, priority, and owner.
- `HANDOFF.md` — explicit current handoff between employees.
- `agent-notes/` — employee-specific latest notes.
- `history/` — durable snapshots when a handoff or decision is materially superseded.

## Write rules

1. Facts must be distinguishable from judgments.
2. Cite repository paths, PRs, commits, tests, or runtime evidence when available.
3. Unknowns remain explicit; do not fill them with guesses.
4. Product-changing proposals do not become canonical until Uli confirms them and canonical docs are updated.
5. Temporary working state belongs here; long-term truth belongs in `PRD.md`, `DECISIONS.md`, and `IMPLEMENTATION_STATE.md`.
6. Never store secrets or personal-data payloads here.

## Required reasoning shape

When an employee updates its note, use:

- Task
- Observed facts
- Current judgment
- Evidence
- Uncertainty / risk
- Recommended next action
- Recommended next owner

## Verification

Run:

```bash
pnpm team:check
```

To print the current handoff/context packet:

```bash
pnpm team:context
```
