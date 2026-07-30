import type { GraphNode, NodeType } from "./nodes";
import type { GraphEdge, RelationshipKey } from "./relationships";
import { getRelationshipDefinition } from "./relationship-registry";

export interface EdgeValidationInput {
  readonly edge: GraphEdge;
  readonly sourceNode: GraphNode;
  readonly targetNode: GraphNode;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

function includesNodeType(types: readonly NodeType[], value: NodeType): boolean {
  return types.includes(value);
}

export function validateRelationshipShape(
  relationshipType: RelationshipKey,
  sourceType: NodeType,
  targetType: NodeType
): ValidationResult {
  const definition = getRelationshipDefinition(relationshipType);
  const errors: string[] = [];

  if (!includesNodeType(definition.sourceTypes, sourceType)) {
    errors.push(`${relationshipType} does not allow source node type ${sourceType}`);
  }
  if (!includesNodeType(definition.targetTypes, targetType)) {
    errors.push(`${relationshipType} does not allow target node type ${targetType}`);
  }

  return { valid: errors.length === 0, errors };
}

export function validateGraphEdge(input: EdgeValidationInput): ValidationResult {
  const errors: string[] = [];
  const { edge, sourceNode, targetNode } = input;
  const definition = getRelationshipDefinition(edge.relationshipType);

  if (sourceNode.id !== edge.sourceNodeId) {
    errors.push("Source node ID does not match edge.sourceNodeId");
  }
  if (targetNode.id !== edge.targetNodeId) {
    errors.push("Target node ID does not match edge.targetNodeId");
  }

  const shape = validateRelationshipShape(
    edge.relationshipType,
    sourceNode.nodeType,
    targetNode.nodeType
  );
  errors.push(...shape.errors);

  if (edge.confidence !== undefined) {
    if (!definition.confidenceAllowed) {
      errors.push(`${edge.relationshipType} does not allow confidence`);
    }
    if (edge.confidence < 0 || edge.confidence > 1) {
      errors.push("Confidence must be between 0 and 1");
    }
  }

  if (definition.requiresConfirmation && edge.status === "confirmed" && edge.createdBy === "ai") {
    errors.push(`${edge.relationshipType} requires user confirmation before becoming confirmed`);
  }

  if (edge.createdBy === "ai" && !edge.reasoningRecordId) {
    errors.push("AI-created edges must reference a reasoning record");
  }

  return { valid: errors.length === 0, errors };
}
