import type { EventNode, EvidenceNode } from "../../graph-schema/src";
import type {
  ISODateTime,
  ModelUpdateCandidateId,
  NodeId,
  ReasoningRecordId
} from "../../shared-types/src";
import {
  asISODateTime,
  asModelUpdateCandidateId,
  asNodeId,
  asReasoningRecordId
} from "../../shared-types/src";
import type { ModelUpdateCandidate } from "./model";
import { assertValidBoundary } from "./model";
import type { ReasonerContext, ReasoningRecord, ReasoningRecordDraft } from "./reasoning";

export interface CaptureInput {
  readonly eventId: string;
  readonly reasoningRecordId: string;
  readonly evidenceNodeId: string;
  readonly candidateId: string;
  readonly rawContent: string;
  readonly occurredAt: string;
  readonly capturedAt: string;
}

export interface CognitiveSliceResult {
  readonly event: EventNode;
  readonly reasoningRecord: ReasoningRecord;
  readonly evidence: EvidenceNode;
  readonly modelUpdateCandidate: ModelUpdateCandidate | null;
}

export interface Reasoner {
  reason(event: EventNode, context: ReasonerContext): ReasoningRecordDraft;
}

function createEvent(input: CaptureInput): EventNode {
  const createdAt = asISODateTime(input.capturedAt);
  return {
    id: asNodeId(input.eventId),
    nodeType: "event",
    status: "active",
    sourceType: "user",
    createdBy: "uli",
    createdAt,
    updatedAt: createdAt,
    rawContent: input.rawContent.trim(),
    occurredAt: asISODateTime(input.occurredAt),
    capturedAt: createdAt
  };
}

function selectModelUpdateOutput(record: ReasoningRecord) {
  return record.outputs.find((output) => output.type === "propose_model_update");
}

export function runCognitiveSlice(
  input: CaptureInput,
  reasoner: Reasoner,
  context: ReasonerContext
): CognitiveSliceResult {
  if (!input.rawContent.trim()) {
    throw new Error("Capture content cannot be empty");
  }

  const event = createEvent(input);
  const draft = reasoner.reason(event, context);
  const reasoningRecordId: ReasoningRecordId = asReasoningRecordId(input.reasoningRecordId);
  const reasoningRecord: ReasoningRecord = {
    ...draft,
    id: reasoningRecordId,
    createdAt: asISODateTime(input.capturedAt)
  };

  const primaryEvidenceOutput = reasoningRecord.outputs.find(
    (output) => output.type === "create_evidence"
  );
  if (!primaryEvidenceOutput) {
    throw new Error("Reasoner must produce at least one create_evidence output");
  }

  const evidenceNodeId: NodeId = asNodeId(input.evidenceNodeId);
  const evidence: EvidenceNode = {
    id: evidenceNodeId,
    nodeType: "evidence",
    status: "proposed",
    sourceType: "ai",
    createdBy: "ai",
    createdAt: asISODateTime(input.capturedAt),
    updatedAt: asISODateTime(input.capturedAt),
    claim: primaryEvidenceOutput.statement,
    polarity: reasoningRecord.outputs.some((output) => output.type === "challenge_model")
      ? "challenge"
      : "unknown",
    sourceEventId: event.id,
    reasoningRecordId
  };

  const modelUpdateOutput = selectModelUpdateOutput(reasoningRecord);
  let modelUpdateCandidate: ModelUpdateCandidate | null = null;

  if (modelUpdateOutput) {
    const candidateId: ModelUpdateCandidateId = asModelUpdateCandidateId(input.candidateId);
    modelUpdateCandidate = {
      id: candidateId,
      proposedStatement: modelUpdateOutput.statement,
      triggerEvidenceNodeIds: [evidenceNodeId],
      boundary: {
        verifiedApplicable: [],
        unverified: reasoningRecord.uncertainties.length > 0
          ? reasoningRecord.uncertainties
          : ["The model has not yet been tested across distinct contexts."],
        knownFailures: []
      },
      applicableContexts: [],
      unresolvedQuestions: reasoningRecord.uncertainties,
      confidence: modelUpdateOutput.confidence,
      status: "pending",
      reasoningRecordId,
      createdAt: asISODateTime(input.capturedAt)
    };
    assertValidBoundary(modelUpdateCandidate.boundary);
  }

  return { event, reasoningRecord, evidence, modelUpdateCandidate };
}
