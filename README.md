# Uli OS

Uli OS is a graph-centric cognitive operating system designed to turn lived experience into evidence-backed model, identity, and narrative evolution.

## Current checkpoint

This repository contains the first executable Cognitive Core slice:

```text
Capture → Event → Reasoning Record → Evidence → Model Update Candidate
```

The reasoner is currently deterministic and local. It validates architecture without claiming that an external AI integration has been tested.

## Run verified core tests

```bash
npm test
```

## Run the demo

```bash
npm run demo
```

## Web shell

The `apps/web` package targets Next.js 16.2.11 and React 19.2.0. Install workspace dependencies before running it:

```bash
corepack enable
pnpm install
pnpm --filter @uli-os/web dev
```

## Truth layers

1. Canonical source: repository Markdown, TypeScript, SQL migrations, and Git history
2. Interactive review: future web UI
3. Evidence: automated tests, demo output, commit hash, and checkpoint evidence card

## Key documents

- `PRD.md`
- `docs/architecture/TECHNICAL_SPEC.md`
- `docs/schema/GRAPH_SCHEMA.md`
- `docs/api/openapi.yaml`
- `IMPLEMENTATION_STATE.md`
