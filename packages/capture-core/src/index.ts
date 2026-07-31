import type { ISODateTime, NodeId } from "../../shared-types/src";

export const MAX_CAPTURE_LENGTH = 20_000;
export const MIN_IDEMPOTENCY_KEY_LENGTH = 8;
export const MAX_IDEMPOTENCY_KEY_LENGTH = 128;

export interface CaptureCommandInput {
  readonly rawContent: unknown;
  readonly occurredAt?: unknown;
  readonly idempotencyKey: unknown;
}

export interface CaptureCommand {
  readonly rawContent: string;
  readonly occurredAt: ISODateTime;
  readonly idempotencyKey: string;
}

export interface CapturedEvent {
  readonly id: NodeId;
  readonly rawContent: string;
  readonly occurredAt: ISODateTime;
  readonly capturedAt: ISODateTime;
  readonly contentSha256: string;
  readonly replayed: boolean;
}

export class CaptureValidationError extends Error {
  readonly code:
    | "EMPTY_CONTENT"
    | "CONTENT_TOO_LONG"
    | "INVALID_OCCURRED_AT"
    | "INVALID_IDEMPOTENCY_KEY";

  constructor(code: CaptureValidationError["code"], message: string) {
    super(message);
    this.name = "CaptureValidationError";
    this.code = code;
  }
}

export function validateCaptureCommand(
  input: CaptureCommandInput,
  now = new Date(),
): CaptureCommand {
  if (typeof input.rawContent !== "string" || input.rawContent.trim().length === 0) {
    throw new CaptureValidationError("EMPTY_CONTENT", "经历内容不能为空。");
  }

  if (input.rawContent.length > MAX_CAPTURE_LENGTH) {
    throw new CaptureValidationError(
      "CONTENT_TOO_LONG",
      `经历内容不能超过 ${MAX_CAPTURE_LENGTH} 个字符。`,
    );
  }

  if (typeof input.idempotencyKey !== "string") {
    throw new CaptureValidationError(
      "INVALID_IDEMPOTENCY_KEY",
      "缺少有效的幂等键。",
    );
  }

  const idempotencyKey = input.idempotencyKey.trim();
  if (
    idempotencyKey.length < MIN_IDEMPOTENCY_KEY_LENGTH ||
    idempotencyKey.length > MAX_IDEMPOTENCY_KEY_LENGTH
  ) {
    throw new CaptureValidationError(
      "INVALID_IDEMPOTENCY_KEY",
      `幂等键长度必须在 ${MIN_IDEMPOTENCY_KEY_LENGTH} 到 ${MAX_IDEMPOTENCY_KEY_LENGTH} 个字符之间。`,
    );
  }

  const occurredAtValue = input.occurredAt ?? now.toISOString();
  if (typeof occurredAtValue !== "string") {
    throw new CaptureValidationError(
      "INVALID_OCCURRED_AT",
      "发生时间必须是 ISO 日期时间字符串。",
    );
  }

  const parsedOccurredAt = Date.parse(occurredAtValue);
  if (Number.isNaN(parsedOccurredAt)) {
    throw new CaptureValidationError("INVALID_OCCURRED_AT", "发生时间无效。");
  }

  if (parsedOccurredAt > now.getTime() + 5 * 60 * 1000) {
    throw new CaptureValidationError(
      "INVALID_OCCURRED_AT",
      "发生时间不能明显晚于当前时间。",
    );
  }

  return {
    // Preserve the exact user-authored string. Do not trim or rewrite it.
    rawContent: input.rawContent,
    occurredAt: new Date(parsedOccurredAt).toISOString() as ISODateTime,
    idempotencyKey,
  };
}
