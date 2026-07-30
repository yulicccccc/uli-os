# ADR-001 — PostgreSQL is canonical

Status: Accepted

## Context

Uli OS is graph-centric, but its early workload does not justify the operational cost and synchronization risk of a primary graph database.

## Decision

PostgreSQL stores all canonical nodes, edges, reasoning records, evidence, model versions, and confirmation states. A graph database may later receive a rebuildable projection.

## Consequences

Positive:

- one transactional source of truth
- simpler backup and migrations
- reliable audit history
- no dual-write failures in the MVP

Negative:

- deep traversal queries may eventually require a projection
- relationship constraints require application and database enforcement

## Reversal plan

Introduce a change-data-capture or outbox projection pipeline. Rebuild the graph projection from PostgreSQL. Do not migrate canonical ownership.
