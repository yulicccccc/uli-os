# Implementation State

Checkpoint: `v0.1.0-cognitive-core-skeleton`

## Implemented

- Monorepo scaffold
- Graph node types
- Controlled relationship registry
- Relationship validation
- Structured Reasoning Record types
- Model Update candidate state machine
- Mandatory Model Boundary validation
- Deterministic Evidence Ledger maturity assessment
- Deterministic mock reasoning adapter
- Executable Capture → Reasoning → Evidence → Model Update Candidate slice
- PostgreSQL migration draft
- Relationship registry seed
- OpenAPI draft
- Minimal Next.js shell
- Automated offline tests

## Not yet implemented

- Dependency installation and Next.js build
- Drizzle schema and generated migrations
- PostgreSQL migration execution
- Transactional repository layer
- OpenAI adapter and structured-output validation
- API route handlers
- Review UI
- Authentication and encryption policy
- Browser tests
- Deployment

## Risk

HIGH: cognitive-state changes and user-authored personal data require strict provenance, confirmation gates, privacy controls, and regression evidence.
