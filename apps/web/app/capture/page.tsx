import Link from "next/link";
import CaptureForm from "./CaptureForm";

export const dynamic = "force-dynamic";

export default function CapturePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f8fb 0%, #fff 60%)",
        color: "#17181c",
        fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 96px" }}>
        <Link href="/" style={{ color: "#5d6572", textDecoration: "none" }}>
          ← 返回 Uli OS
        </Link>
        <header style={{ margin: "38px 0 32px" }}>
          <p style={{ color: "#6f7684", fontWeight: 700 }}>M01 · 🌱 经历捕捉</p>
          <h1 style={{ margin: "10px 0 16px", fontSize: "clamp(38px, 7vw, 60px)", lineHeight: 1.08 }}>
            先保留真实发生的事。
          </h1>
          <p style={{ maxWidth: 650, color: "#5b616e", fontSize: 18, lineHeight: 1.75 }}>
            这一层只保存你的原始经历，不总结、不解释，也不替你改写。AI 模块尚未接入。
          </p>
        </header>
        <section style={{ padding: 28, border: "1px solid #e0e4eb", borderRadius: 22, background: "rgba(255,255,255,0.92)", boxShadow: "0 16px 50px rgba(25,32,56,0.06)" }}>
          <CaptureForm />
        </section>
      </div>
    </main>
  );
}
