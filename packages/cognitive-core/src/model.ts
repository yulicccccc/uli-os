import type {
  ISODateTime,
  ModelId,
  ModelUpdateCandidateId,
  NodeId,
  ReasoningRecordId
} from "../../shared-types/src";

export type ModelMaturity = "emerging" | "supported" | "stable" | "under_tension";

export interface BoundaryCondition {
  readonly condition: string;
  readonly evidenceNodeIds: readonly NodeId[];
}

export interface ModelBoundary {
  readonly verifiedApplicable: readonly BoundaryCondition[];
  readonly unverified: readonly string[];
  readonly knownFailures: readonly BoundaryCondition[];
}

export interface CognitiveModel {
  readonly id: ModelId;
  readonly graphNodeId: NodeId;
  readonly lineageRootId: ModelId;
  readonly version: number;
  readonly statement: string;
  readonly maturity: ModelMaturity;
  readonly boundary: ModelBoundary;
  readonly previousModelId?: ModelId;
  readonly parentModelId?: ModelId;
  readonly confirmedBy: "uli";
  readonly confirmedAt: ISODateTime;
}

export type ModelUpdateCandidateStatus = "pending" | "observing" | "confirmed" | "rejected";

export interface ModelUpdateCandidate {
  readonly id: ModelUpdateCandidateId;
  readonly previousModelId?: ModelId;
  readonly previousStatement?: string;
  readonly proposedStatement: string;
  readonly triggerEvidenceNodeIds: readonly NodeId[];
  readonly boundary: ModelBoundary;
  readonly applicableContexts: readonly string[];
  readonly unresolvedQuestions: readonly string[];
  readonly confidence: number;
  readonly status: ModelUpdateCandidateStatus;
  readonly reasoningRecordId: ReasoningRecordId;
  readonly createdAt: ISODateTime;
}

export type ModelUpdateDecision =
  | { readonly action: "confirm"; readonly finalStatement?: string }
  | { readonly action: "modify_and_confirm"; readonly finalStatement: string }
  | { readonly action: "continue_observing" }
  | { readonly action: "reject"; readonly reason?: string };

export function assertValidBoundary(boundary: ModelBoundary): void {
  const total =
    boundary.verifiedApplicable.length +
    boundary.unverified.length +
    boundary.knownFailures.length;

  if (total === 0) {
    throw new Error("Every model must declare at least one boundary condition");
  }
}

export function applyModelUpdateDecision(
  candidate: ModelUpdateCandidate,
  decision: ModelUpdateDecision
): ModelUpdateCandidate {
  if (candidate.status !== "pending" && candidate.status !== "observing") {
    throw new Error(`Cannot decide candidate in status ${candidate.status}`);
  }

  switch (decision.action) {
    case "confirm":
      return {
        ...candidate,
        proposedStatement: decision.finalStatement ?? candidate.proposedStatement,
        status: "confirmed"
      };
    case "modify_and_confirm":
      if (!decision.finalStatement.trim()) {
        throw new Error("A modified model statement cannot be empty");
      }
      return {
        ...candidate,
        proposedStatement: decision.finalStatement.trim(),
        status: "confirmed"
      };
    case "continue_observing":
      return { ...candidate, status: "observing" };
    case "reject":
      return { ...candidate, status: "rejected" };
  }
}
