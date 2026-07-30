import type {
  ISODateTime,
  NodeId,
  ReasoningRecordId
} from "../../shared-types/src";

export type ConfidenceLevel = "low" | "medium" | "high";
export type RecommendedReasoningAction =
  | "stay_silent"
  | "ask_one_question"
  | "continue_observing"
  | "propose_model_update"
  | "propose_identity_hypothesis"
  | "propose_narrative_thread";

export interface CandidateExplanation {
  readonly key: string;
  readonly statement: string;
  readonly confidence: number;
  readonly supportingGroundIds: readonly string[];
  readonly competingWith?: readonly string[];
}

export interface ReasoningGround {
  readonly id: string;
  readonly statement: string;
  readonly sourceNodeIds: readonly NodeId[];
  readonly kind: "observed_fact" | "historical_pattern" | "model_boundary" | "user_correction";
}

export type ReasoningOutputType =
  | "create_evidence"
  | "support_model"
  | "challenge_model"
  | "expose_boundary"
  | "propose_model_update"
  | "ask_question"
  | "no_action";

export interface ReasoningOutput {
  readonly type: ReasoningOutputType;
  readonly targetNodeId?: NodeId;
  readonly statement: string;
  readonly confidence: number;
}

export interface ReasoningRecord {
  readonly id: ReasoningRecordId;
  readonly schemaVersion: "1.0";
  readonly engineVersion: string;
  readonly promptVersion: string;
  readonly inputNodeIds: readonly NodeId[];
  readonly candidateExplanations: readonly CandidateExplanation[];
  readonly grounds: readonly ReasoningGround[];
  readonly outputs: readonly ReasoningOutput[];
  readonly confidenceLevel: ConfidenceLevel;
  readonly uncertainties: readonly string[];
  readonly recommendedAction: RecommendedReasoningAction;
  readonly summary: string;
  readonly createdAt: ISODateTime;
}

export interface ReasoningRecordDraft extends Omit<ReasoningRecord, "id" | "createdAt"> {}

export interface ReasonerContext {
  readonly knownModelStatements: readonly string[];
  readonly relatedEvidenceSummaries: readonly string[];
}
