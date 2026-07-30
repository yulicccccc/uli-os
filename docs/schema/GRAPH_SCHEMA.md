# TS-001 and TS-002 — Cognitive Graph Schema

## Canonical principle

PostgreSQL is the canonical source of truth. A future graph database may be introduced only as a disposable projection.

## Node model

Every cognitive object receives a row in `graph_nodes`. Type-specific tables hold strict domain fields. Core fields must not be hidden inside arbitrary metadata JSON.

Current MVP type tables:

- `event_nodes`
- `evidence_nodes`
- `reasoning_records`
- `model_nodes`

Deferred type tables:

- identity hypotheses and versions
- narrative threads
- experiments
- questions and dialogue turns
- disagreement and resolution records

## Relationship model

Every edge is stored in `graph_edges`, but every allowed relationship is registered in `relationship_types`.

A relationship definition controls:

- legal source node types
- legal target node types
- direction
- cardinality
- whether Uli confirmation is required
- whether confidence is meaningful

AI-created edges must reference a Reasoning Record. Confirmation-required edges cannot become confirmed through an AI-only action.

## Versioning

Old model and identity versions are never overwritten. A new version receives a new graph node and links to the previous version through `REVISES`.
