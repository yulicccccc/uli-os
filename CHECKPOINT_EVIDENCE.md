# Evidence Card — Cognitive Core Skeleton

## Scope

Create a new Uli OS repository and implement the first offline, executable Cognitive Core vertical slice without adding unrequested product features.

## Must not change

- User-authored Event content must remain unchanged.
- AI cannot confirm a model update.
- AI-created edges require a Reasoning Record.
- Models cannot exist without an explicit Boundary.
- Old versions and evidence must remain traceable.

## Acceptance tests defined before implementation

1. legal relationship shape passes
2. illegal relationship shape fails
3. AI edge without reasoning provenance fails
4. AI cannot confirm a confirmation-required edge
5. original Event content is preserved
6. Model Update remains pending until Uli confirms
7. empty Model Boundary fails
8. maturity changes deterministically with cross-context evidence
9. strong contradictory evidence creates `under_tension`
10. weak input does not force a Model Update

## Files changed

See Git commit and repository tree.

## Verification commands

```bash
npm test
npm run demo
```

## Remaining risks

- PostgreSQL migration has not been executed in this environment.
- Next.js dependencies could not be installed in this environment.
- No external AI API call has been made or validated.
- No privacy, authentication, encryption, or deployment review has been completed.

## Rollback

Return to the initial Git commit or delete this standalone checkpoint directory. No external services or databases were changed.

## Actual results

- TypeScript strict build: PASS
- Automated tests: 11 passed, 0 failed
- Deterministic real-run demo: PASS
- Negative/fault-oriented checks: invalid relationship shapes, missing AI provenance, unauthorized AI confirmation, empty boundaries, strong contradictory evidence, and weak-input overclassification

Artifacts:

- `TEST_RESULTS.txt`
- `DEMO_OUTPUT.json.txt`
