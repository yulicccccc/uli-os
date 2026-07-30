# Uli OS Technical Specification v0.1

Status: ACTIVE FOR MVP IMPLEMENTATION

## TS-001 — Graph Node Schema

Decision: hybrid node structure.

- `graph_nodes` supplies one graph identity and lifecycle.
- Type-specific tables enforce domain constraints.
- Metadata JSON is allowed only for non-critical extensions.
- Original user content is append-only and cannot be overwritten by AI-derived content.

Rejected:

- separate, disconnected tables with no unified node identity
- a single loose JSON node table

## TS-002 — Relationship Schema

Decision: one `graph_edges` table plus a controlled relationship registry.

Every edge has provenance, status, optional confidence, and optional reasoning-record linkage. Relationship legality is checked in both application code and persistence logic.

## TS-003 — PostgreSQL with optional graph projection

Decision: PostgreSQL is the only canonical source of truth.

- MVP traversal uses SQL indexes and bounded neighborhood queries.
- Neo4j is not installed in v0.1.
- A future Neo4j projection must be deletable and fully rebuildable from PostgreSQL.

Rejected:

- Neo4j as primary storage
- premature dual-write synchronization

## TS-004 — Reasoning Record Schema

Decision: immutable, structured, auditable records.

A Reasoning Record stores:

- inputs
- candidate explanations
- factual grounds
- outputs
- confidence level
- uncertainties
- recommended system action
- engine and prompt versions
- a compact user-visible summary
- the exact structured AI payload for reproducibility

The system does not store hidden chain-of-thought text. It stores sufficient grounds for review and challenge.

Reasoning Records are append-only. Later corrections create new records.

## TS-005 — Model and Evidence Engine

Decision: models are versioned graph nodes; the evidence ledger is append-only.

- A candidate is not a model until Uli confirms it.
- Every model must declare a boundary at creation.
- Maturity is derived from evidence rather than manually assigned.
- Strong contradictory evidence moves a model to `under_tension`.
- Revisions create new nodes and preserve lineage.
- Parent/child model structures support specialization and generalization.

Maturity heuristics in v0.1 are deterministic and intentionally conservative. They will be versioned before production use.

## TS-006 — API Contract

Decision: command-oriented HTTP API rather than unrestricted graph mutation.

Initial commands:

- capture an event
- run reasoning for a capture
- review a model-update candidate
- confirm, modify, observe, or reject a candidate
- retrieve a model with boundaries and evidence ledger
- retrieve a bounded graph neighborhood

Every write accepts an idempotency key. No public endpoint may insert arbitrary confirmed edges.

## TS-007 — AI Structured Outputs

Decision: AI is an adapter behind a strict interface.

Pipeline:

1. assemble bounded graph context
2. submit a versioned structured-output request
3. validate schema deterministically
4. validate graph relationships deterministically
5. persist a proposed Reasoning Record
6. expose a compact summary
7. wait for Uli confirmation before formal model, identity, or narrative changes

The AI adapter never writes directly to canonical tables. The repository includes a deterministic mock reasoner so the core can be tested without API access or cost.

## TS-008 — Repository Architecture

Decision: pnpm/Turborepo monorepo.

```text
apps/web
packages/shared-types
packages/graph-schema
packages/cognitive-core
db/migrations
docs
scripts
```

The web app depends on the cognitive packages; cognitive packages do not depend on Next.js.

## TS-009 — Testing Strategy

Risk level for the Cognitive Core: HIGH.

Required layers:

1. schema and relationship rule tests
2. deterministic model-maturity tests
3. negative tests for unauthorized AI confirmation
4. candidate state-machine tests
5. golden structured-output fixtures
6. migration tests against disposable PostgreSQL
7. API contract tests
8. prompt regression tests
9. real-run evidence before any release claim
10. mutation/fault-injection checks for confirmation, provenance, and model maturity

The current checkpoint verifies layers 1–4 offline. PostgreSQL, API, prompt, and browser integration tests remain open.

## TS-010 — MVP Implementation Plan

### Slice 1 — verified in this checkpoint

Capture → Event → Reasoning Record → Evidence → Model Update Candidate

### Slice 2

Persist the slice transactionally in PostgreSQL.

### Slice 3

Create the Review UI and explicit user-decision command.

### Slice 4

Create confirmed Model nodes, boundaries, and evidence ledger.

### Slice 5

Add model detail and bounded graph inspection.

### Deferred

- complete Identity Engine
- complete Narrative Engine
- Neo4j projection
- multi-agent orchestration
- MCP surface
- native mobile apps
- reminders and scheduled reviews
