import { NextResponse } from "next/server";
import {
  CaptureValidationError,
  validateCaptureCommand,
} from "../../../../../packages/capture-core/src";
import { AccessDeniedError, verifyAccessRequest } from "../../../lib/access";
import {
  createCapturedEvent,
  DatabaseUnavailableError,
  IdempotencyConflictError,
} from "../../../lib/capture-repository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const identity = await verifyAccessRequest(request);
    const body = (await request.json()) as Record<string, unknown>;
    const command = validateCaptureCommand({
      rawContent: body.rawContent,
      occurredAt: body.occurredAt,
      idempotencyKey: request.headers.get("idempotency-key"),
    });

    const event = await createCapturedEvent(command, identity);
    return NextResponse.json(
      { event },
      {
        status: event.replayed ? 200 : 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      return NextResponse.json({ error: "未授权访问。" }, { status: 403 });
    }
    if (error instanceof CaptureValidationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 },
      );
    }
    if (error instanceof IdempotencyConflictError) {
      return NextResponse.json(
        { error: "同一个保存请求不能对应不同内容。" },
        { status: 409 },
      );
    }
    if (error instanceof DatabaseUnavailableError) {
      return NextResponse.json(
        { error: "安全存储尚未连接，暂时不能保存。" },
        { status: 503 },
      );
    }

    console.error("capture_event_failed", error);
    return NextResponse.json(
      { error: "保存失败，没有写入任何内容。" },
      { status: 500 },
    );
  }
}
