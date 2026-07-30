import type { RelationshipKey, RelationshipTypeDefinition } from "./relationships";

const registryEntries: readonly RelationshipTypeDefinition[] = [
  {
    key: "TRIGGERS",
    sourceTypes: ["event"],
    targetTypes: ["evidence", "reasoning_record", "question"],
    direction: "directed",
    cardinality: "one_to_many",
    requiresConfirmation: false,
    confidenceAllowed: true,
    description: "A source event causes a derived cognitive object to be considered."
  },
  {
    key: "DERIVED_FROM",
    sourceTypes: ["evidence", "insight", "model", "identity_hypothesis", "identity_version", "narrative_thread"],
    targetTypes: ["event", "evidence", "reasoning_record", "model", "identity_hypothesis"],
    direction: "directed",
    cardinality: "many_to_many",
    requiresConfirmation: false,
    confidenceAllowed: true,
    description: "The source was derived from the target without overwriting it."
  },
  {
    key: "SUPPORTS",
    sourceTypes: ["evidence", "model"],
    targetTypes: ["model", "identity_hypothesis", "identity_version", "narrative_thread"],
    direction: "directed",
    cardinality: "many_to_many",
    requiresConfirmation: false,
    confidenceAllowed: true,
    description: "The source increases confidence in the target."
  },
  {
    key: "CHALLENGES",
    sourceTypes: ["evidence", "model"],
    targetTypes: ["model", "identity_hypothesis", "identity_version", "narrative_thread"],
    direction: "directed",
    cardinality: "many_to_many",
    requiresConfirmation: false,
    confidenceAllowed: true,
    description: "The source introduces meaningful contradictory evidence."
  },
  {
    key: "UNEXPLAINED_BY",
    sourceTypes: ["evidence"],
    targetTypes: ["model"],
    direction: "directed",
    cardinality: "many_to_many",
    requiresConfirmation: false,
    confidenceAllowed: true,
    description: "The current model does not yet explain the evidence."
  },
  {
    key: "PROPOSES",
    sourceTypes: ["reasoning_record"],
    targetTypes: ["model", "question", "experiment", "identity_hypothesis", "narrative_thread"],
    direction: "directed",
    cardinality: "one_to_many",
    requiresConfirmation: true,
    confidenceAllowed: true,
    description: "A reasoning record proposes a user-reviewable object."
  },
  {
    key: "REVISES",
    sourceTypes: ["model", "identity_version"],
    targetTypes: ["model", "identity_version"],
    direction: "directed",
    cardinality: "one_to_one",
    requiresConfirmation: true,
    confidenceAllowed: false,
    description: "A confirmed version supersedes an earlier version while preserving lineage."
  },
  {
    key: "GENERALIZES",
    sourceTypes: ["model"],
    targetTypes: ["model"],
    direction: "directed",
    cardinality: "one_to_many",
    requiresConfirmation: true,
    confidenceAllowed: true,
    description: "A higher-order model captures a shared mechanism across lower-order models."
  },
  {
    key: "SPECIALIZES",
    sourceTypes: ["model"],
    targetTypes: ["model"],
    direction: "directed",
    cardinality: "many_to_one",
    requiresConfirmation: true,
    confidenceAllowed: true,
    description: "A child model describes a stable mechanism under narrower boundaries."
  },
  {
    key: "INFORMS_IDENTITY",
    sourceTypes: ["model", "evidence"],
    targetTypes: ["identity_hypothesis", "identity_version"],
    direction: "directed",
    cardinality: "many_to_many",
    requiresConfirmation: true,
    confidenceAllowed: true,
    description: "A model or evidence item informs an identity hypothesis or version."
  },
  {
    key: "SHAPES_NARRATIVE",
    sourceTypes: ["identity_version", "model", "evidence", "insight"],
    targetTypes: ["narrative_thread"],
    direction: "directed",
    cardinality: "many_to_many",
    requiresConfirmation: true,
    confidenceAllowed: true,
    description: "The source has narrative-level significance for a life-story thread."
  },
  {
    key: "TESTED_BY",
    sourceTypes: ["model", "identity_hypothesis"],
    targetTypes: ["experiment"],
    direction: "directed",
    cardinality: "one_to_many",
    requiresConfirmation: true,
    confidenceAllowed: false,
    description: "A contextual experiment tests a model or identity hypothesis."
  },
  {
    key: "ANSWERS",
    sourceTypes: ["dialogue", "insight", "model"],
    targetTypes: ["question"],
    direction: "directed",
    cardinality: "many_to_many",
    requiresConfirmation: false,
    confidenceAllowed: true,
    description: "The source partially or fully answers a question."
  },
  {
    key: "REFERENCES",
    sourceTypes: ["event", "evidence", "insight", "reasoning_record", "model", "identity_hypothesis", "identity_version", "narrative_thread", "experiment", "question", "dialogue", "resource"],
    targetTypes: ["event", "evidence", "insight", "reasoning_record", "model", "identity_hypothesis", "identity_version", "narrative_thread", "experiment", "question", "dialogue", "resource", "person", "place"],
    direction: "directed",
    cardinality: "many_to_many",
    requiresConfirmation: false,
    confidenceAllowed: false,
    description: "A non-semantic reference used for traceability."
  },
  {
    key: "RESOLVES",
    sourceTypes: ["disagreement_resolution"],
    targetTypes: ["reasoning_disagreement"],
    direction: "directed",
    cardinality: "one_to_one",
    requiresConfirmation: true,
    confidenceAllowed: true,
    description: "A resolution record closes a reasoning disagreement without deleting it."
  }
] as const;

export const RELATIONSHIP_REGISTRY: ReadonlyMap<RelationshipKey, RelationshipTypeDefinition> =
  new Map(registryEntries.map((entry) => [entry.key, entry]));

export function getRelationshipDefinition(key: RelationshipKey): RelationshipTypeDefinition {
  const definition = RELATIONSHIP_REGISTRY.get(key);
  if (!definition) {
    throw new Error(`Unknown relationship type: ${key}`);
  }
  return definition;
}
