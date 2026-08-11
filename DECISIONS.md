# Decision Index

## Product decisions inherited from design phase

- Decision 050: Model Update is the minimum growth unit.
- Decision 051: AI proposes; Uli confirms.
- Decision 052: Models use dynamic maturity.
- Decision 053: Evidence Ledger is separate from Model Update.
- Decision 054: Every model has a Boundary.
- Decision 058: Graph-centric architecture.
- Decision 059: Unified Reasoning Engine.
- Decision 060: Structured Reasoning Record.
- Decision 061: Summary by default, full record on demand.
- Decision 062: Reasoning disagreements are preserved.
- Decision 063: Resolutions preserve the full correction history.

## Technical decisions

- TS-001: hybrid graph node schema.
- TS-002: universal edge table plus relationship registry.
- TS-003: PostgreSQL canonical; Neo4j only as a future projection.
- TS-004: immutable structured reasoning records.
- TS-005: versioned models and append-only evidence ledger.
- TS-006: command-oriented API with idempotent writes.
- TS-007: strict AI adapter; no direct canonical writes.
- TS-008: pnpm/Turborepo monorepo.
- TS-009: evidence-first, risk-based tests.
- TS-010: vertical-slice implementation order.

## Team coordination decisions

### INFRA-TB01 — Uli OS Team Brain

Status: ACTIVE
Date: 2026-08-11

- ChatGPT, Codex, QA, and future AI employees coordinate through repository-native structured external reasoning state.
- The shared interface is not raw chat history and not hidden chain-of-thought.
- `PRD.md` and `DECISIONS.md` remain canonical product truth.
- `IMPLEMENTATION_STATE.md` remains canonical implementation truth.
- `.ai-bridge/*` holds current working reasoning, open questions, handoffs, and employee notes.
- Team Brain may propose changes but may not silently override canonical product decisions.
- Every employee must surface uncertainty and hand off with evidence and a named next owner.
- Secrets and personal-data payloads are prohibited from Team Brain files.
