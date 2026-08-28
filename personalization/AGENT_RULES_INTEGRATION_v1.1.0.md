---
title: "Kira Personalization Agent Integration v1.1.0"
status: "integration-note"
last_updated: "2026-08-28"
---

# Kira Personalization — Agent Integration v1.1.0

This document records how the existing Kira MASTER and Antigravity global rules were reconciled.

The design intentionally separates:

```text
Kira-level preferences
        ↓
KIRA_GLOBAL_PERSONALIZATION_MASTER.md
        ↓
Agent-specific execution behavior
        ↓
agent_overrides/<AGENT>.md
        ↓
Project-specific PRD / state
        ↓
Current task
```

The goal is to preserve Kira's global preferences while preventing tool-specific instructions from polluting the universal user model.

---

# 1. Rules Elevated as Shared Cross-Agent Principles

The following Antigravity ideas are broadly valuable and are already compatible with the MASTER:

- Root-cause-first debugging.
- Surgical changes and regression protection.
- Read the PRD before significant implementation.
- Distinguish implementation from verified completion.
- Evidence-first validation.
- Preserve finalized/locked product behavior.
- Dangerous-operation preflight and rollback thinking.
- Template/asset preservation.
- Visual-first communication for complex systems.
- Git as durable code history.
- Avoid making Kira perform unnecessary manual technical steps.

These principles should guide both ChatGPT and Antigravity when relevant.

---

# 2. Rules Kept Antigravity-Specific

The following are execution details and therefore live in `agent_overrides/ANTIGRAVITY_GLOBAL_EXECUTION_RULES.md`, not in the universal MASTER:

- local artifact discovery,
- repository-local incoming/scratch handling,
- automatic local Git commands,
- local template backup conventions,
- deployment-tool execution,
- local command-running behavior.

Machine-specific filesystem paths must remain local and should not be committed to this public repository unless necessary.

---

# 3. Conflicts Resolved

## Conflict A — “ChatGPT = architect only; Antigravity = executor only”

### Old rule
Rigid role separation.

### Problem
This creates unnecessary handoffs. Kira explicitly prefers that ChatGPT directly execute when it has the necessary tools rather than sending instructions back and forth.

### Resolution
Use **capability-based execution**:

- ChatGPT often leads architecture/review and may execute directly when tools permit.
- Antigravity remains the preferred local-machine executor.
- Avoid unnecessary delegation loops.

---

## Conflict B — “Every change must automatically commit and push”

### Problem
Unqualified auto-push can accidentally modify shared/main branches.

### Resolution
Antigravity may automatically commit/push to an **authorized feature/docs branch**.

Protected by default:

- `main`,
- force pushes,
- destructive history rewrites,
- remote branch deletion.

Those require explicit authorization or a clearly defined project policy.

---

## Conflict C — “Every web change automatically deploys Cloudflare”

### Problem
This conflicts with production safety and review workflows.

### Resolution
Deployment is **task-authorized**, not automatic.

Production deployment only occurs when:

- Kira explicitly requests it, or
- the project workflow explicitly includes it in the authorized scope.

---

## Conflict D — “Mandatory 100/100 self-check score”

### Problem
A self-score can create false confidence and is not evidence.

### Resolution
Keep the three review passes, but prioritize:

- logs,
- tests,
- diffs,
- artifacts,
- real-environment validation,
- remaining risks.

A score may be secondary, never proof.

---

## Conflict E — “Mermaid is mandatory”

### Problem
The best visual format depends on the task. Kira recently showed a strong preference for polished visual flowcharts/infographics, not one specific diagramming technology.

### Resolution
Preserve the **visual-first aesthetic preference**, not Mermaid as a hard requirement.

Preferred when useful:

- landscape composition,
- pastel stage colors,
- clear boundaries,
- low cognitive load,
- infographic / flowchart / Mermaid / table chosen by fit.

---

# 4. Effective Rule Hierarchy

When an agent is working, apply rules in this order:

1. Current explicit instruction from Kira.
2. Safety / platform restrictions.
3. Active project-specific PRD / locked scope / project state.
4. `KIRA_GLOBAL_PERSONALIZATION_MASTER.md`.
5. Relevant `agent_overrides/<AGENT>.md`.
6. Stable remembered context.
7. Generic agent defaults.

An agent override may refine execution behavior but must not weaken higher-priority safety or user-preference rules.

---

# 5. Recommended Repository Structure

```text
personalization/
├── KIRA_GLOBAL_PERSONALIZATION_MASTER.md
├── CHATGPT_UI_CUSTOM_INSTRUCTIONS.md
├── PERSONALIZATION_SYNC_PROTOCOL.md
├── AGENT_RULES_INTEGRATION_v1.1.0.md
├── agent_overrides/
│   └── ANTIGRAVITY_GLOBAL_EXECUTION_RULES.md
└── archive/
```

Future agent-specific files can be added without bloating the universal MASTER:

```text
agent_overrides/
├── ANTIGRAVITY_GLOBAL_EXECUTION_RULES.md
├── CHATGPT_EXECUTION_RULES.md          # only if genuinely needed
└── CODEX_EXECUTION_RULES.md            # only if genuinely needed
```

---

# 6. What Does NOT Need to Change in ChatGPT UI

The current distilled ChatGPT Custom Instructions already contain the highest-value user-facing behavior:

- map first for complex tasks,
- one step at a time,
- reduce branching,
- Utility vs Mastery,
- English/communication defaults,
- root-cause technical reasoning,
- zero-trust validation,
- continuity protection.

Therefore Antigravity's local execution rules do **not** need to be pasted into the ChatGPT Personalization UI.

This prevents the UI prompt from becoming unnecessarily long and tool-specific.

---

# 7. v1.1.0 Integration Summary

The integration adds four important improvements to the personalization system:

1. **Agent-specific overrides** instead of one giant universal prompt.
2. **Capability-based collaboration** instead of rigid ChatGPT-vs-Antigravity role boundaries.
3. **Safe Git/deployment automation** instead of unconditional push/deploy rules.
4. **Evidence-first self-checking** instead of treating self-scores as proof.

The original MASTER v1.0.0 remains preserved in Git history. No old personalization rule is deleted by this integration.
