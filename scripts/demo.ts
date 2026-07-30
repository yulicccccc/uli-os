import { DeterministicMockReasoner, runCognitiveSlice } from "../packages/cognitive-core/src";

const result = runCognitiveSlice(
  {
    eventId: "event_demo_001",
    reasoningRecordId: "reasoning_demo_001",
    evidenceNodeId: "evidence_demo_001",
    candidateId: "candidate_demo_001",
    rawContent: "今天我已经把拉伸缩小成只做一分钟，但我还是没有开始，因为身体非常累。",
    occurredAt: "2026-07-30T20:00:00-05:00",
    capturedAt: "2026-07-30T20:05:00-05:00"
  },
  new DeterministicMockReasoner(),
  {
    knownModelStatements: ["只要把任务缩小，我就能够开始。"],
    relatedEvidenceSummaries: []
  }
);

console.log(JSON.stringify(result, null, 2));
