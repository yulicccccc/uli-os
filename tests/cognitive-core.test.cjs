const test = require("node:test");
const assert = require("node:assert/strict");

const {
  DeterministicMockReasoner,
  runCognitiveSlice,
  applyModelUpdateDecision,
  assertValidBoundary,
  assessModelMaturity
} = require("../dist/packages/cognitive-core/src/index.js");

const baseInput = {
  eventId: "event_1",
  reasoningRecordId: "reasoning_1",
  evidenceNodeId: "evidence_1",
  candidateId: "candidate_1",
  rawContent: "今天我已经把拉伸缩小成只做一分钟，但我还是没有开始，因为身体非常累。",
  occurredAt: "2026-07-30T20:00:00-05:00",
  capturedAt: "2026-07-30T20:05:00-05:00"
};

const context = {
  knownModelStatements: ["只要把任务缩小，我就能够开始。"],
  relatedEvidenceSummaries: []
};

test("vertical slice preserves original event and creates a pending candidate", () => {
  const result = runCognitiveSlice(baseInput, new DeterministicMockReasoner(), context);
  assert.equal(result.event.rawContent, baseInput.rawContent);
  assert.equal(result.evidence.sourceEventId, result.event.id);
  assert.equal(result.reasoningRecord.recommendedAction, "propose_model_update");
  assert.ok(result.modelUpdateCandidate);
  assert.equal(result.modelUpdateCandidate.status, "pending");
  assert.ok(result.modelUpdateCandidate.boundary.unverified.length > 0);
});

test("a model update remains non-final until Uli confirms it", () => {
  const result = runCognitiveSlice(baseInput, new DeterministicMockReasoner(), context);
  const candidate = result.modelUpdateCandidate;
  assert.ok(candidate);
  assert.equal(candidate.status, "pending");

  const confirmed = applyModelUpdateDecision(candidate, { action: "confirm" });
  assert.equal(confirmed.status, "confirmed");
});

test("every model requires an explicit boundary", () => {
  assert.throws(
    () => assertValidBoundary({ verifiedApplicable: [], unverified: [], knownFailures: [] }),
    /at least one boundary/i
  );
});

function ledgerEntry(id, contextKey, polarity = "support", strength = 0.7) {
  return {
    id,
    modelId: "model_1",
    evidenceNodeId: `evidence_${id}`,
    polarity,
    contextKey,
    strength,
    reasoningRecordId: `reasoning_${id}`,
    addedAt: "2026-07-30T12:00:00-05:00"
  };
}

test("maturity becomes supported across two contexts", () => {
  const result = assessModelMaturity([
    ledgerEntry("1", "dance"),
    ledgerEntry("2", "work")
  ]);
  assert.equal(result.maturity, "supported");
});

test("maturity becomes stable across repeated evidence in three contexts", () => {
  const result = assessModelMaturity([
    ledgerEntry("1", "dance"),
    ledgerEntry("2", "work"),
    ledgerEntry("3", "life-maintenance"),
    ledgerEntry("4", "dance")
  ]);
  assert.equal(result.maturity, "stable");
});

test("a strong contradiction moves a stable model under tension", () => {
  const result = assessModelMaturity([
    ledgerEntry("1", "dance"),
    ledgerEntry("2", "work"),
    ledgerEntry("3", "life-maintenance"),
    ledgerEntry("4", "dance"),
    ledgerEntry("5", "illness", "challenge", 0.9)
  ]);
  assert.equal(result.maturity, "under_tension");
});

test("no model update is created when evidence is too weak", () => {
  const result = runCognitiveSlice(
    { ...baseInput, rawContent: "今天我看了一篇文章。" },
    new DeterministicMockReasoner(),
    context
  );
  assert.equal(result.reasoningRecord.recommendedAction, "continue_observing");
  assert.equal(result.modelUpdateCandidate, null);
});
