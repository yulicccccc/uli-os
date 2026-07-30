import type { EventNode } from "../../graph-schema/src";
import type { Reasoner } from "./pipeline";
import type { ReasonerContext, ReasoningRecordDraft } from "./reasoning";

const lowEnergySignals = ["很累", "非常累", "疲惫", "极度疲劳", "exhausted", "very tired"];
const reducedEntrySignals = ["一分钟", "一分鐘", "最小", "缩小", "縮小", "入口", "one minute", "smallest step"];

function containsAny(text: string, signals: readonly string[]): boolean {
  const normalized = text.toLowerCase();
  return signals.some((signal) => normalized.includes(signal.toLowerCase()));
}

export class DeterministicMockReasoner implements Reasoner {
  reason(event: EventNode, context: ReasonerContext): ReasoningRecordDraft {
    const hasLowEnergy = containsAny(event.rawContent, lowEnergySignals);
    const hasReducedEntry = containsAny(event.rawContent, reducedEntrySignals);
    const grounds = [
      {
        id: "ground_event_1",
        statement: event.rawContent,
        sourceNodeIds: [event.id],
        kind: "observed_fact" as const
      }
    ];

    if (hasLowEnergy && hasReducedEntry) {
      return {
        schemaVersion: "1.0",
        engineVersion: "mock-rule-engine@0.1.0",
        promptVersion: "mock-no-prompt",
        inputNodeIds: [event.id],
        candidateExplanations: [
          {
            key: "energy_boundary",
            statement: "Low physical energy may independently constrain action even when the task entry is clear.",
            confidence: 0.78,
            supportingGroundIds: ["ground_event_1"]
          },
          {
            key: "entry_method_failure",
            statement: "The reduced-entry method may have failed in this instance.",
            confidence: 0.42,
            supportingGroundIds: ["ground_event_1"],
            competingWith: ["energy_boundary"]
          }
        ],
        grounds,
        outputs: [
          {
            type: "create_evidence",
            statement: "A clearly reduced task entry did not lead to action during a very low-energy state.",
            confidence: 0.92
          },
          {
            type: "expose_boundary",
            statement: "Very low physical energy may be a boundary for task-entry interventions.",
            confidence: 0.78
          },
          {
            type: "propose_model_update",
            statement: "Task-entry friction and available physical energy are independent variables in starting action.",
            confidence: 0.78
          }
        ],
        confidenceLevel: "medium",
        uncertainties: [
          "The threshold between ordinary tiredness and very low energy is not yet defined.",
          "It is not yet known whether emotional threat also contributed."
        ],
        recommendedAction: "propose_model_update",
        summary: "The event challenges an overgeneralized start-method model and suggests an energy boundary."
      };
    }

    return {
      schemaVersion: "1.0",
      engineVersion: "mock-rule-engine@0.1.0",
      promptVersion: "mock-no-prompt",
      inputNodeIds: [event.id],
      candidateExplanations: [],
      grounds,
      outputs: [
        {
          type: "create_evidence",
          statement: "The event was captured, but current rules cannot infer a model update safely.",
          confidence: 0.55
        },
        {
          type: "no_action",
          statement: "Continue observing until stronger or cross-context evidence appears.",
          confidence: 0.8
        }
      ],
      confidenceLevel: "low",
      uncertainties: ["No stable explanatory difference was detected."],
      recommendedAction: "continue_observing",
      summary: `Captured without proposing a model update. Known models: ${context.knownModelStatements.length}.`
    };
  }
}
