import type {
  EvidenceLedgerEntryId,
  ISODateTime,
  ModelId,
  NodeId,
  ReasoningRecordId
} from "../../shared-types/src";
import type { ModelMaturity } from "./model";

export type EvidenceLedgerPolarity = "support" | "challenge" | "unknown";

export interface EvidenceLedgerEntry {
  readonly id: EvidenceLedgerEntryId;
  readonly modelId: ModelId;
  readonly evidenceNodeId: NodeId;
  readonly polarity: EvidenceLedgerPolarity;
  readonly contextKey: string;
  readonly strength: number;
  readonly reasoningRecordId: ReasoningRecordId;
  readonly addedAt: ISODateTime;
}

export interface MaturityAssessment {
  readonly maturity: ModelMaturity;
  readonly reasons: readonly string[];
  readonly supportCount: number;
  readonly challengeCount: number;
  readonly distinctSupportContexts: number;
}

export function assessModelMaturity(
  entries: readonly EvidenceLedgerEntry[]
): MaturityAssessment {
  for (const entry of entries) {
    if (entry.strength < 0 || entry.strength > 1) {
      throw new Error(`Evidence strength must be between 0 and 1: ${entry.id}`);
    }
  }

  const supports = entries.filter((entry) => entry.polarity === "support");
  const challenges = entries.filter((entry) => entry.polarity === "challenge");
  const distinctSupportContexts = new Set(supports.map((entry) => entry.contextKey)).size;
  const strongChallenge = challenges.some((entry) => entry.strength >= 0.8);

  if (strongChallenge) {
    return {
      maturity: "under_tension",
      reasons: ["At least one high-strength contradictory evidence item exists."],
      supportCount: supports.length,
      challengeCount: challenges.length,
      distinctSupportContexts
    };
  }

  if (supports.length >= 4 && distinctSupportContexts >= 3) {
    return {
      maturity: "stable",
      reasons: ["The model has repeated support across at least three distinct contexts."],
      supportCount: supports.length,
      challengeCount: challenges.length,
      distinctSupportContexts
    };
  }

  if (supports.length >= 2 && distinctSupportContexts >= 2) {
    return {
      maturity: "supported",
      reasons: ["The model has support in more than one distinct context."],
      supportCount: supports.length,
      challengeCount: challenges.length,
      distinctSupportContexts
    };
  }

  return {
    maturity: "emerging",
    reasons: ["Evidence is still limited or concentrated in one context."],
    supportCount: supports.length,
    challengeCount: challenges.length,
    distinctSupportContexts
  };
}
