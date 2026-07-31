"use client";

import { useEffect, useState } from "react";

interface CapturedEvent {
  readonly id: string;
  readonly rawContent: string;
  readonly occurredAt: string;
  readonly capturedAt: string;
  readonly contentSha256: string;
}

export default function EventView({ id }: { readonly id: string }) {
  const [event, setEvent] = useState<CapturedEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/events/${encodeURIComponent(id)}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as { event?: CapturedEvent; error?: string };
        if (!response.ok || !payload.event) throw new Error(payload.error || "读取失败。");
        if (active) setEvent(payload.event);
      })
      .catch((caught) => {
        if (active) setError(caught instanceof Error ? caught.message : "读取失败。");
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (error) return <p role="alert">🟥 {error}</p>;
  if (!event) return <p>正在读取原始经历…</p>;

  return (
    <article>
      <dl style={{ display: "grid", gap: 12, color: "#5b616e" }}>
        <div>
          <dt style={{ fontWeight: 700 }}>发生时间</dt>
          <dd style={{ margin: "4px 0 0" }}>{new Date(event.occurredAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 700 }}>Event ID</dt>
          <dd style={{ margin: "4px 0 0", overflowWrap: "anywhere" }}>{event.id}</dd>
        </div>
      </dl>
      <pre style={{ marginTop: 24, padding: 22, whiteSpace: "pre-wrap", overflowWrap: "anywhere", border: "1px solid #e0e4eb", borderRadius: 18, background: "white", fontFamily: "inherit", fontSize: 17, lineHeight: 1.8 }}>
        {event.rawContent}
      </pre>
      <details style={{ marginTop: 20, color: "#626977" }}>
        <summary>完整性证据</summary>
        <p style={{ overflowWrap: "anywhere" }}>SHA-256: {event.contentSha256}</p>
      </details>
    </article>
  );
}
