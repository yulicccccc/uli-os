"use client";

import { useMemo, useState } from "react";

interface SavedEvent {
  readonly id: string;
  readonly rawContent: string;
  readonly occurredAt: string;
  readonly capturedAt: string;
  readonly contentSha256: string;
  readonly replayed: boolean;
}

function localDateTimeValue(date: Date) {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export default function CaptureForm() {
  const [rawContent, setRawContent] = useState("");
  const [occurredAt, setOccurredAt] = useState(() => localDateTimeValue(new Date()));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedEvent, setSavedEvent] = useState<SavedEvent | null>(null);
  const remaining = useMemo(() => 20_000 - rawContent.length, [rawContent]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);
    setSavedEvent(null);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          rawContent,
          occurredAt: new Date(occurredAt).toISOString(),
        }),
      });

      const payload = (await response.json()) as {
        event?: SavedEvent;
        error?: string;
      };

      if (!response.ok || !payload.event) {
        throw new Error(payload.error || "保存失败。");
      }

      setSavedEvent(payload.event);
      setRawContent("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "保存失败。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} style={{ display: "grid", gap: 18 }}>
        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontWeight: 700 }}>发生了什么？</span>
          <textarea
            value={rawContent}
            onChange={(event) => setRawContent(event.target.value)}
            rows={12}
            maxLength={20_000}
            placeholder="按你原本的说法记录。系统不会替你润色或改写原文。"
            style={{
              resize: "vertical",
              padding: 18,
              borderRadius: 16,
              border: "1px solid #d9dde6",
              font: "inherit",
              fontSize: 17,
              lineHeight: 1.7,
              background: "#fff",
            }}
          />
          <span style={{ fontSize: 13, color: remaining < 500 ? "#a33" : "#7b8290" }}>
            剩余 {remaining.toLocaleString()} 字
          </span>
        </label>

        <label style={{ display: "grid", gap: 8, maxWidth: 360 }}>
          <span style={{ fontWeight: 700 }}>发生时间</span>
          <input
            type="datetime-local"
            value={occurredAt}
            max={localDateTimeValue(new Date())}
            onChange={(event) => setOccurredAt(event.target.value)}
            required
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #d9dde6",
              font: "inherit",
            }}
          />
        </label>

        <button
          type="submit"
          disabled={saving || rawContent.trim().length === 0}
          style={{
            justifySelf: "start",
            border: 0,
            borderRadius: 999,
            padding: "13px 22px",
            background: saving ? "#737985" : "#17181c",
            color: "white",
            font: "inherit",
            fontWeight: 700,
            cursor: saving ? "wait" : "pointer",
          }}
        >
          {saving ? "正在安全保存…" : "保存原始经历"}
        </button>
      </form>

      {error ? (
        <section role="alert" style={{ marginTop: 24, padding: 18, borderRadius: 14, border: "1px solid #f0b8b8", background: "#fff6f6", color: "#821f1f" }}>
          🟥 {error}
        </section>
      ) : null}

      {savedEvent ? (
        <section style={{ marginTop: 28, padding: 24, borderRadius: 18, border: "1px solid #bfe2ca", background: "#f4fcf6" }}>
          <h2 style={{ marginTop: 0 }}>✅ 已保存</h2>
          <p style={{ color: "#52605a" }}>系统返回了唯一 Event ID，并重新读回了数据库中的原文。</p>
          <p><strong>Event ID：</strong>{savedEvent.id}</p>
          <pre style={{ margin: "18px 0 0", padding: 16, whiteSpace: "pre-wrap", overflowWrap: "anywhere", background: "white", borderRadius: 12, border: "1px solid #d9eadf", fontFamily: "inherit", lineHeight: 1.7 }}>
            {savedEvent.rawContent}
          </pre>
          <a href={`/events/${savedEvent.id}`} style={{ display: "inline-block", marginTop: 16, color: "#185c36", fontWeight: 700 }}>
            单独打开这条经历 →
          </a>
        </section>
      ) : null}
    </>
  );
}
