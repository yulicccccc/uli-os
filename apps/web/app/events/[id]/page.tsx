import Link from "next/link";
import EventView from "./EventView";

export const dynamic = "force-dynamic";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fb", color: "#17181c", fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif' }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 96px" }}>
        <Link href="/capture" style={{ color: "#5d6572", textDecoration: "none" }}>
          ← 返回经历捕捉
        </Link>
        <h1 style={{ margin: "38px 0 28px", fontSize: "clamp(36px, 6vw, 54px)" }}>原始经历</h1>
        <EventView id={id} />
      </div>
    </main>
  );
}
