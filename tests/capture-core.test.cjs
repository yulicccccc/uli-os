const test = require("node:test");
const assert = require("node:assert/strict");

const {
  MAX_CAPTURE_LENGTH,
  CaptureValidationError,
  validateCaptureCommand,
} = require("../dist/packages/capture-core/src/index.js");

const NOW = new Date("2026-07-31T14:00:00.000Z");

test("capture preserves the exact original content", () => {
  const rawContent = "  我今天意识到：先开始，再优化。\n第二行保留。  ";
  const result = validateCaptureCommand(
    {
      rawContent,
      occurredAt: "2026-07-31T13:30:00.000Z",
      idempotencyKey: "capture-12345678",
    },
    NOW,
  );

  assert.equal(result.rawContent, rawContent);
});

test("capture rejects content that is only whitespace", () => {
  assert.throws(
    () => validateCaptureCommand({ rawContent: "   \n\t", idempotencyKey: "capture-12345678" }, NOW),
    (error) => error instanceof CaptureValidationError && error.code === "EMPTY_CONTENT",
  );
});

test("capture rejects content above the maximum length", () => {
  assert.throws(
    () => validateCaptureCommand({ rawContent: "a".repeat(MAX_CAPTURE_LENGTH + 1), idempotencyKey: "capture-12345678" }, NOW),
    (error) => error instanceof CaptureValidationError && error.code === "CONTENT_TOO_LONG",
  );
});

test("capture rejects a future occurredAt beyond clock-skew allowance", () => {
  assert.throws(
    () => validateCaptureCommand({ rawContent: "未来时间不应被接受", occurredAt: "2026-07-31T14:06:00.000Z", idempotencyKey: "capture-12345678" }, NOW),
    (error) => error instanceof CaptureValidationError && error.code === "INVALID_OCCURRED_AT",
  );
});

test("capture rejects short idempotency keys", () => {
  assert.throws(
    () => validateCaptureCommand({ rawContent: "测试", idempotencyKey: "short" }, NOW),
    (error) => error instanceof CaptureValidationError && error.code === "INVALID_IDEMPOTENCY_KEY",
  );
});
