# Open Questions

Last updated: 2026-08-11

## P0 — blocks active work

### TB-Q02 — Can Codex bootstrap correctly from Team Brain with no prior Uli OS context?

- Owner: Codex / Implementation Engineer
- Status: ready now
- Handoff: `TB-HO-001`
- Needed evidence: Codex reads repository-native context, runs `pnpm team:check` and `pnpm team:context`, writes a structured comprehension note, and makes no business-code changes.

## P1 — blocks M01 acceptance

### M01-Q01 — Are production runtime secrets wired correctly?

- Owner: Codex / Implementation Engineer after Team Brain bootstrap
- Status: open
- Known: database credentials must never be committed or pasted into Team Brain.
- Needed evidence: runtime can connect to Neon using secret-managed configuration without exposing the value.

### M01-Q02 — Does an authenticated real browser session save and read back the exact original Event?

- Owner: Codex + Uli acceptance
- Status: open
- Needed evidence: successful create, returned Event ID, exact read-back, and database persistence.

### M00-Q01 — Does a non-authorized email remain blocked after attempting authentication?

- Owner: QA / Independent Validator
- Status: deferred
- Reason: no second test mailbox was available during M00 acceptance.
- Impact: residual Access-policy negative-test gap; does not currently block M01 engineering.

## P2 — product/canonical-document debt

### DOC-Q01 — Expand `PRD.md` from MVP summary into full Codex-grade canonical PRD

- Owner: ChatGPT / Product & Architecture Lead
- Status: open
- Rule: until expanded, missing requirements must remain unknown rather than inferred from code or UI.

### TEAM-Q01 — Which additional named AI employees should receive persistent role files?

- Owner: Uli + ChatGPT
- Status: open
- Current default roles: Product & Architecture Lead, Codex Implementation Engineer, QA Independent Validator.
- This does not block Team Brain v1; new employees can be added incrementally.

## Resolved

### TB-Q01 — Does Team Brain v1 pass repository verification?

- Status: resolved 2026-08-11
- Evidence: PR #3 Team Brain Verification passed; context export passed; existing Cognitive Core regression and OpenNext Cloudflare build verification also passed; PR #3 merged to `main` as squash commit `436c6b234caccee2c8f653de31ad009ee88e8992`.
