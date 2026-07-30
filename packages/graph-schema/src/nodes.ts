import type { ISODateTime, NodeId, ReasoningRecordId } from "../../shared-types/src";

export const NODE_TYPES = [
  "event",
  "evidence",
  "insight",
  "reasoning_record",
  "reasoning_disagreement",
  "disagreement_resolution",
  "model",
  "identity_hypothesis",
  "identity_version",
  "narrative_thread",
  "experiment",
  "question",
  "dialogue",
  "resource",
  "person",
  "place"
] as const;

export type NodeType = (typeof NODE_TYPES)[number];

export type NodeStatus = "proposed" | "active" | "silent" | "deprecated" | "archived";
export type NodeSourceType = "user" | "ai" | "system" | "import";

export interface GraphNode {
  readonly id: NodeId;
  readonly nodeType: NodeType;
  readonly status: NodeStatus;
  readonly sourceType: NodeSourceType;
  readonly sourceId?: string;
  readonly createdBy: "uli" | "ai" | "system";
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
}

export interface EventNode extends GraphNode {
  readonly nodeType: "event";
  readonly rawContent: string;
  readonly occurredAt: ISODateTime;
  readonly capturedAt: ISODateTime;
}

export type EvidencePolarity = "support" | "challenge" | "unknown";

export interface EvidenceNode extends GraphNode {
  readonly nodeType: "evidence";
  readonly claim: string;
  readonly polarity: EvidencePolarity;
  readonly sourceEventId: NodeId;
  readonly reasoningRecordId: ReasoningRecordId;
}

export function isNodeType(value: string): value is NodeType {
  return (NODE_TYPES as readonly string[]).includes(value);
}
