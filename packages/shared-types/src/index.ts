export type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand };

export type NodeId = Brand<string, "NodeId">;
export type EdgeId = Brand<string, "EdgeId">;
export type ReasoningRecordId = Brand<string, "ReasoningRecordId">;
export type ModelId = Brand<string, "ModelId">;
export type ModelUpdateCandidateId = Brand<string, "ModelUpdateCandidateId">;
export type EvidenceLedgerEntryId = Brand<string, "EvidenceLedgerEntryId">;

export type ISODateTime = Brand<string, "ISODateTime">;

export function asNodeId(value: string): NodeId {
  return value as NodeId;
}

export function asEdgeId(value: string): EdgeId {
  return value as EdgeId;
}

export function asReasoningRecordId(value: string): ReasoningRecordId {
  return value as ReasoningRecordId;
}

export function asModelId(value: string): ModelId {
  return value as ModelId;
}

export function asModelUpdateCandidateId(value: string): ModelUpdateCandidateId {
  return value as ModelUpdateCandidateId;
}

export function asEvidenceLedgerEntryId(value: string): EvidenceLedgerEntryId {
  return value as EvidenceLedgerEntryId;
}

export function asISODateTime(value: string): ISODateTime {
  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`Invalid ISO date-time: ${value}`);
  }
  return value as ISODateTime;
}

export function assertNever(value: never, message = "Unexpected value"): never {
  throw new Error(`${message}: ${String(value)}`);
}
