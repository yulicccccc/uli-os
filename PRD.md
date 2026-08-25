# Uli OS — MVP PRD

Status: ACTIVE

## Mission

Help a person gradually transform experiences into judgment through continuous high-quality dialogue.

## North Star

Evidence-backed life-narrative evolution.

## Growth loop

Capture → Dialogue → Understand → Apply → Reflect → Become

## First vertical slice

1. Uli captures an experience.
2. The original Event is preserved unchanged.
3. A unified Reasoning Engine creates an auditable Reasoning Record.
4. The system extracts proposed Evidence.
5. The system may create a Model Update candidate.
6. Uli confirms, modifies, observes, or rejects the candidate.
7. Only confirmed candidates create or revise canonical Models.

## Cognitive interface principles

### Visual Status Architecture

Uli OS must externalize meaningful status instead of requiring the user to reconstruct it mentally from prose or scattered records.

For every meaningful long-running process, the interface should expose, whenever the underlying data supports it:

1. **Current state** — where am I now?
2. **Progress** — how far has this process actually moved?
3. **Direction / trend** — improving, stable, declining, or unresolved?
4. **Current bottleneck** — what most constrains the next meaningful advance?
5. **Next meaningful state** — what does the next stage look like?
6. **Next best move** — what concrete action is most useful now?

Prefer a visual representation when it communicates status faster and more accurately than prose. Text remains available for explanation and evidence drill-down.

### Visual grammar

Use the visualization that matches the question rather than decorating every screen with charts:

- **Progress bar / ratio** — bounded completion such as 7/10 tasks or 68% of a defined milestone.
- **Stage / maturity track** — qualitative progress such as Emerging → Supported → Stable → Under Tension.
- **Radar chart** — multidimensional status across comparable, explicitly defined dimensions.
- **Line / sparkline** — change over time and direction of travel.
- **Timeline / chapter map** — sequence of events, milestones, and life phases.
- **Heatmap** — repeated activity, exposure, or evidence density over time.
- **Graph / concept map** — relationships among Evidence, Models, skills, identity hypotheses, and narrative threads.
- **Counts / gauges** — only when the quantity itself is meaningful and interpretable.

### Honest quantification

Visual clarity must not create false precision.

- Use exact percentages only when a defensible denominator exists.
- Use stages, maturity, confidence, or evidence counts when the phenomenon is not meaningfully measurable as a percentage.
- A radar-chart axis must have a defined scale and comparable interpretation; arbitrary self-ratings must not be presented as objective growth.
- Model and Identity status must remain evidence-backed and expandable to supporting and contradictory evidence.
- Visual summaries must show provenance or allow drill-down to the records that generated them.
- No streak debt or punitive loss mechanics for missed days.

### Layered status presentation

The default view should make status understandable in seconds, with progressive disclosure:

**visual summary → concise interpretation → evidence / history / reasoning on demand**

The user should not need to read a long report merely to answer “Where am I right now?”

## Acceptance criteria

- Original user content is unchanged.
- AI-derived content is distinguishable from user content.
- Every AI-created graph relationship cites a Reasoning Record.
- Model updates cannot become formal without Uli confirmation.
- Every model has an explicit boundary.
- Supporting and contradictory evidence remain visible.
- Old model versions are preserved.
- Low-confidence input may remain unclassified without pressure.
- Meaningful long-running states expose an interpretable current status when sufficient data exists.
- Quantitative visuals do not imply precision unsupported by the underlying data.
- Visual summaries provide a path to their supporting evidence or source records.

## Out of scope for MVP v0.1

- complete identity and narrative user interfaces
- full Life RPG / gamification layer
- punitive streaks or streak debt
- mobile apps
- reminders
- Neo4j
- MCP
- multi-agent orchestration
