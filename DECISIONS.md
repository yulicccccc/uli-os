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

### Decision 064 — Visible Progress Principle

Status: ACTIVE

For every meaningful long-running process, Uli OS should expose the current state, meaningful progress, current bottleneck, next meaningful state, and next best move whenever the underlying data supports those representations.

The purpose is cognitive externalization: the user should be able to see “where am I now?” without reconstructing status mentally from scattered text.

### Decision 065 — Visual Status First

Status: ACTIVE

When a visual representation communicates status faster and more accurately than prose, Uli OS should prefer the visual representation and keep prose/evidence available as drill-down.

Visualization must match the question:

- progress bar / ratio for bounded completion;
- stage or maturity track for qualitative progression;
- radar chart for multidimensional comparable status;
- line or sparkline for change over time;
- timeline for event sequence and life chapters;
- heatmap for repeated activity/evidence density;
- graph or concept map for relationships;
- counts/gauges only when the quantity itself is meaningful.

Radar charts are encouraged when they make a multidimensional status immediately legible, but every axis must have a defined and comparable scale.

### Decision 066 — Honest Quantification

Status: ACTIVE

Uli OS must not create false precision merely to produce satisfying charts.

- Percentages require a defensible denominator.
- Non-quantifiable growth uses explicit stages, maturity, confidence, or evidence counts instead of invented percentages.
- Radar scores must be evidence-backed or clearly labeled as subjective; arbitrary self-ratings must not masquerade as objective capability.
- Model and Identity visual status must remain traceable to supporting and contradictory evidence.
- Visual summaries must support provenance drill-down.
- Missed days must not create streak debt or punitive regression by default.

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
