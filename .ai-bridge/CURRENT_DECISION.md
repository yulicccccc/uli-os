# Current Decision

Decision ID: INFRA-TB01-D01
Status: ACTIVE FOR IMPLEMENTATION
Owner: ChatGPT / Product & Architecture Lead
Date: 2026-08-11

## Decision

Uli OS AI employees will coordinate through a repository-native **Team Brain** that stores structured external reasoning state. The Team Brain is the handoff interface between ChatGPT, Codex, QA, and future AI employees.

## Observed facts

- ChatGPT and Codex do not automatically share the full state of this long-running product conversation.
- Uli wants multiple AI employees to operate as one team without Uli manually retransmitting context.
- The GitHub repository is accessible to implementation agents and already functions as the durable engineering source of truth.
- Long chat history contains exploration, superseded ideas, and implementation details that should not automatically be treated as current requirements.

## Current judgment

The correct shared interface is not raw conversation history and not hidden chain-of-thought. It is a compact, auditable reasoning state stored beside canonical product and implementation documents.

The Team Brain therefore separates:

- long-term canonical truth (`PRD.md`, `DECISIONS.md`, `IMPLEMENTATION_STATE.md`);
- current shared reasoning (`.ai-bridge/*`);
- employee-specific latest notes (`.ai-bridge/agent-notes/*`);
- durable implementation evidence (`docs/evidence/*` and CI/PR records).

## Why this design

- It prevents one employee from treating an abandoned idea as a requirement.
- It lets another employee continue from facts, judgments, uncertainty, and next action without reconstructing the entire conversation.
- It is human-readable for Uli and machine-readable enough for agents.
- It can be versioned, reviewed, diffed, reverted, and audited in Git.

## Guardrails

- Never store hidden chain-of-thought.
- Never store secrets or personal-data payloads.
- Never let Team Brain working state silently override canonical product decisions.
- Every material handoff names the next owner and acceptance condition.
- Every agent records uncertainty instead of guessing.

## Confidence

High.

## Next action

Implement and verify Team Brain v1 files, context exporter, structural checker, and CI gate; then hand the repository to Codex for a no-code comprehension smoke test before resuming M01 engineering.
