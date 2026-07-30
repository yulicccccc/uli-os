# Reasoning Pipeline v0.1

```text
User capture
  ↓
Immutable Event node
  ↓
Context assembler (bounded neighborhood only)
  ↓
Reasoner adapter
  ↓
Structured schema validation
  ↓
Relationship-policy validation
  ↓
Immutable Reasoning Record
  ↓
Proposed Evidence + Model Update Candidate
  ↓
Reasoning Summary shown to Uli
  ↓
Uli confirms / modifies / observes / rejects
  ↓
Canonical model state changes transactionally
```

## Safety gates

- Empty captures are rejected.
- The reasoner must produce explicit evidence before proposing a model update.
- Every model update must include a boundary.
- AI may create only proposed objects and edges.
- Confirmation-required relationships cannot be AI-confirmed.
- Every AI-created edge must cite a Reasoning Record.
- Low-confidence evidence defaults to observation, not model change.

## Current adapter

`DeterministicMockReasoner` exists solely to validate architecture and state flow without pretending that an AI call was tested.
