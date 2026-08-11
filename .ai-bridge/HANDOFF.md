# Current Handoff

Handoff ID: TB-HO-001
From: ChatGPT / Product & Architecture Lead
To: Codex / Implementation Engineer
Status: READY NOW
Date: 2026-08-11

## Task

Perform a **bidirectional context reconciliation smoke test** for Uli OS Team Brain v1.

You are not assumed to be blank. Use both:

1. the repository-native Team Brain and canonical docs; and
2. any relevant context already present in your current Codex conversation/session about Uli OS.

Do not implement M01 yet.

The goal is to reconcile what ChatGPT currently knows with what Codex already knows, so future work starts from one shared external state rather than two partially overlapping memories.

## Required reading

Read `AGENTS.md` and all start-of-task files it requires. Run:

```bash
pnpm team:check
pnpm team:context
```

Also review PR #2 and any relevant prior Uli OS context already available in your current Codex session.

## Reconciliation rules

Classify Codex-local context into four buckets:

### A. Already shared

Context that is already accurately represented in canonical docs or `.ai-bridge/*`. No duplicate write is needed.

### B. Codex-only, user-confirmed context

A fact, requirement, decision, preference, or implementation constraint that Uli explicitly confirmed in Codex but is missing from Team Brain.

Record it in `.ai-bridge/agent-notes/codex-engineer.md` with its provenance. If it may change product truth, also add it to `.ai-bridge/OPEN_QUESTIONS.md` for ChatGPT/Uli review. Do **not** silently promote it into `PRD.md` or `DECISIONS.md`.

### C. Codex-only engineering discovery

A repository/runtime/test fact discovered by Codex that is not yet reflected in shared state.

Record the evidence and recommended canonical destination. Do not label it verified unless evidence exists.

### D. Conflict or uncertainty

Anything in Codex-local context that conflicts with Team Brain, canonical docs, or current repository evidence.

Preserve both sides, cite the conflicting sources, and add an explicit open question. Do not guess which side wins.

## Important boundary

Do not persist hidden chain-of-thought or private scratch reasoning. Share only concise external reasoning state: facts, judgments, evidence, uncertainty, decisions/proposals, and next actions.

Do not treat an earlier Codex suggestion as a product requirement merely because it exists in conversation history. User-confirmed decisions outrank agent suggestions; canonical docs remain authoritative until explicitly updated.

## Scope

Allowed:

- read repository files, PR #2, branches, CI, and relevant existing Codex-session context;
- run `pnpm team:check` and `pnpm team:context`;
- update `.ai-bridge/agent-notes/codex-engineer.md` with the reconciliation result;
- update `.ai-bridge/OPEN_QUESTIONS.md` with discrepancies or Codex-only context that needs review;
- recommend canonical-doc updates without making product decisions on Uli's behalf.

Not allowed in this handoff:

- change M01 business logic;
- add M02 or later modules;
- silently change `PRD.md` or locked decisions based only on Codex-local history;
- expose or request database credentials;
- mark M01 complete.

## Required Codex note structure

Update `.ai-bridge/agent-notes/codex-engineer.md` with:

1. **Shared understanding** — what Team Brain and Codex agree on.
2. **Codex-only user-confirmed context** — items Uli explicitly established in Codex but Team Brain lacks.
3. **Codex-only engineering discoveries** — evidence-backed implementation facts not yet shared.
4. **Conflicts / uncertainties** — anything that cannot be reconciled safely.
5. **Current judgment** — your concise engineering interpretation.
6. **Evidence** — files, commits, PRs, CI, runtime evidence, or explicit Uli instructions.
7. **Recommended next action**.
8. **Recommended next owner**.

If a bucket is empty, write `None found` rather than inventing content.

## Acceptance evidence

- `pnpm team:check` passes;
- `pnpm team:context` produces a coherent packet;
- Codex explicitly compares repository context with its own relevant existing session context;
- Codex writes the reconciliation result to its agent note;
- unresolved conflicts are surfaced in `OPEN_QUESTIONS.md`;
- no business-code files are modified during this smoke test.

## Next owner after acceptance

ChatGPT / Product & Architecture Lead reads the Codex note directly from GitHub, reconciles any remaining product-level gaps with Uli, updates canonical docs where appropriate, and then issues the next M01 handoff.
