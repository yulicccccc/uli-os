# Personalization Sync Protocol

## Canonical Source

`personalization/KIRA_GLOBAL_PERSONALIZATION_MASTER.md`

This is the durable Source of Truth for global collaboration preferences.

## Derived Copy

`personalization/CHATGPT_UI_CUSTOM_INSTRUCTIONS.md`

This is the shorter version intended for the ChatGPT Personalization UI.

## Agent Rule

Before major work, ChatGPT / Antigravity / future agents should:

1. Read `KIRA_GLOBAL_PERSONALIZATION_MASTER.md`.
2. Read project-specific PRD/instructions.
3. Preserve any explicit current-session override.
4. Do not silently overwrite the MASTER file.

## Update Procedure

When Kira adds or changes a global preference:

1. Compare the new preference with the MASTER.
2. Preserve prior wording in Git history.
3. Merge the new rule.
4. Increment version:
   - PATCH = wording/clarity only
   - MINOR = new preference or behavior
   - MAJOR = hierarchy/behavior intentionally superseded
5. Add changelog entry.
6. Update `CHATGPT_UI_CUSTOM_INSTRUCTIONS.md` if the new rule belongs in the UI subset.
7. Commit with a message such as: `docs(personalization): add visual map-first workflow`

## Safety

Never store passwords, API tokens, authentication headers, or private security information in this folder.

## Recommended Repository Layout

```text
personalization/
├── KIRA_GLOBAL_PERSONALIZATION_MASTER.md
├── CHATGPT_UI_CUSTOM_INSTRUCTIONS.md
├── PERSONALIZATION_SYNC_PROTOCOL.md
└── archive/
```

## Sync Philosophy

“Sync” means:

> Canonical file → compare → merge → preserve history → update derived copies.

It does NOT mean blindly overwrite downstream copies.

## Conflict Resolution

Priority:

1. Current explicit user instruction
2. Project-specific instruction
3. MASTER personalization
4. remembered preference
5. generic defaults

If a conflict represents a permanent preference change, update the MASTER and changelog.
