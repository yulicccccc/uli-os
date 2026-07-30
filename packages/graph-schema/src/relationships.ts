import type { EdgeId, ISODateTime, NodeId, ReasoningRecordId } from "../../shared-types/src";
import type { NodeType } from "./nodes";

export const RELATIONSHIP_KEYS = [
  "TRIGGERS",
  "DERIVED_FROM",
  "SUPPORTS",
  "CHALLENGES",
  "UNEXPLAINED_BY",
  "PROPOSES",
  "REVISES",
  "GENERALIZES",
  "SPECIALIZES",
  "INFORMS_IDENTITY",
  "SHAPES_NARRATIVE",
  "TESTED_BY",
  "ANSWERS",
  "REFERENCES",
  "RESOLVES"
] as const;

export type RelationshipKey = (typeof RELATIONSHIP_KEYS)[number];
export type EdgeStatus = "proposed" | "confirmed" | "deprecated" | "archived";
export type Cardinality = "one_to_one" | "one_to_many" | "many_to_one" | "many_to_many";

export interface RelationshipTypeDefinition {
  readonly key: RelationshipKey;
  readonly sourceTypes: readonly NodeType[];
  readonly targetTypes: readonly NodeType[];
  readonly direction: "directed";
  readonly cardinality: Cardinality;
  readonly requiresConfirmation: boolean;
  readonly confidenceAllowed: boolean;
  readonly description: string;
}

export interface GraphEdge {
  readonly id: EdgeId;
  readonly relationshipType: RelationshipKey;
  readonly sourceNodeId: NodeId;
  readonly targetNodeId: NodeId;
  readonly confidence?: number;
  readonly status: EdgeStatus;
  readonly reasoningRecordId?: ReasoningRecordId;
  readonly createdBy: "uli" | "ai" | "system";
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
}
