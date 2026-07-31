import { NextResponse } from "next/server";
import { AccessDeniedError, verifyAccessRequest } from "../../../../lib/access";
import {
  DatabaseUnavailableError,
  getCapturedEvent,
} from "../../../../lib/capture-repository";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const identity = await verifyAccessRequest(request);
    const { id } = await context.params;

    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ error: "Event ID 无效。" }, { status: 400 });
    }

    const event = await getCapturedEvent(id, identity);
    if (!event) {
      return NextResponse.json({ error: "没有找到这条经历。" }, { status: 404 });
    }

    return NextResponse.json(
      { event },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      return NextResponse.json({ error: "未授权访问。" }, { status: 403 });
    }
    if (error instanceof DatabaseUnavailableError) {
      return NextResponse.json(
        { error: "安全存储尚未连接。" },
        { status: 503 },
      );
    }

    console.error("read_event_failed", error);
    return NextResponse.json({ error: "读取失败。" }, { status: 500 });
  }
}
