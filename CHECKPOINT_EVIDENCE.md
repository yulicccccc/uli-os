# Evidence Card — Cognitive Core + Cloudflare Shell

## Scope

Create the Uli OS repository, preserve the first executable Cognitive Core vertical slice, and deploy the minimal web shell without changing Cognitive Core behavior.

## Must not change

- User-authored Event content must remain unchanged.
- AI cannot confirm a model update.
- AI-created edges require a Reasoning Record.
- Models cannot exist without an explicit Boundary.
- Old versions and evidence must remain traceable.
- Cloudflare configuration must not alter model, evidence, graph, or reasoning logic.

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
11. Next.js production build completes
12. OpenNext generates a Cloudflare Worker bundle
13. Cloudflare deployment command succeeds
14. deployed URL returns HTTP `200`
15. returned page contains the expected `Uli OS` marker

## Verification commands

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm --filter @uli-os/web cf:build
```

Deployment and smoke-test evidence is recorded in `CLOUDFLARE_TEMP_DEPLOYMENT.md`.

## Actual results

- TypeScript strict build: PASS
- Automated Cognitive Core tests: 11 passed, 0 failed
- Deterministic real-run demo: PASS
- Next.js 16.2.11 production build: PASS
- OpenNext Cloudflare bundle: PASS
- Cloudflare Worker upload: PASS
- HTTP smoke test: PASS
- HTTP status: `200`
- Expected body marker: present
- Verified preview: `https://uli-os-web.flint-oak.workers.dev`
- Negative/fault-oriented checks: invalid relationship shapes, missing AI provenance, unauthorized AI confirmation, empty boundaries, strong contradictory evidence, and weak-input overclassification

## Remaining risks

- The current Cloudflare Worker was created under a temporary preview account and is not permanent until claimed.
- Authenticated continuous deployment has not been connected.
- PostgreSQL migration has not been executed.
- No external AI API call has been made or validated.
- No privacy, authentication, or encryption implementation exists.
- The deployed shell must not accept real personal data yet.

## Rollback

- Application changes are reversible through Git history.
- Cloudflare configuration changes do not modify Cognitive Core logic.
- The temporary Worker can expire without changing the canonical repository.
- No external database was modified.

## Evidence artifacts

- `TEST_RESULTS.txt`
- `DEMO_OUTPUT.json.txt`
- `CLOUDFLARE_TEMP_DEPLOYMENT.md`
- `CLOUDFLARE_TEMP_DEPLOYMENT.txt` (sanitized)
- GitHub Actions build-verification workflow
