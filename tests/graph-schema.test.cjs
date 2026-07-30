const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateRelationshipShape,
  validateGraphEdge
} = require("../dist/packages/graph-schema/src/index.js");

function node(id, nodeType, createdBy = "uli") {
  return {
    id,
    nodeType,
    status: "active",
    sourceType: createdBy === "ai" ? "ai" : "user",
    createdBy,
    createdAt: "2026-07-30T12:00:00-05:00",
    updatedAt: "2026-07-30T12:00:00-05:00"
  };
}

test("SUPPORTS accepts evidence -> model", () => {
  const result = validateRelationshipShape("SUPPORTS", "evidence", "model");
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("SUPPORTS rejects event -> place", () => {
  const result = validateRelationshipShape("SUPPORTS", "event", "place");
  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 2);
});

test("AI-created edges require a reasoning record", () => {
  const source = node("evidence_1", "evidence", "ai");
  const target = node("model_1", "model");
  const result = validateGraphEdge({
    sourceNode: source,
    targetNode: target,
    edge: {
      id: "edge_1",
      relationshipType: "SUPPORTS",
      sourceNodeId: "evidence_1",
      targetNodeId: "model_1",
      confidence: 0.8,
      status: "proposed",
      createdBy: "ai",
      createdAt: "2026-07-30T12:00:00-05:00",
      updatedAt: "2026-07-30T12:00:00-05:00"
    }
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(" "), /reasoning record/i);
});

test("confirmation-required relationships cannot be AI-confirmed", () => {
  const source = node("reasoning_1", "reasoning_record", "ai");
  const target = node("model_1", "model");
  const result = validateGraphEdge({
    sourceNode: source,
    targetNode: target,
    edge: {
      id: "edge_2",
      relationshipType: "PROPOSES",
      sourceNodeId: "reasoning_1",
      targetNodeId: "model_1",
      confidence: 0.8,
      status: "confirmed",
      createdBy: "ai",
      reasoningRecordId: "reasoning_1",
      createdAt: "2026-07-30T12:00:00-05:00",
      updatedAt: "2026-07-30T12:00:00-05:00"
    }
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(" "), /user confirmation/i);
});
