import Link from "next/link";

const phases = [
  ["🌱 捕捉", "保留原始经历，不覆盖、不改写。"],
  ["🧠 推理", "生成可审计的结构化推理记录。"],
  ["📚 证据", "区分支持、反对与尚不确定的部分。"],
  ["🧠 模型更新", "只提出候选变化，由 Uli 最终确认。"],
];

const principles = [
  "原始内容永远保留",
  "AI 负责整理，人负责判断",
  "每个结论都能追溯到证据",
  "成长以模型更新为最小单位",
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f8fb 0%, #ffffff 52%)",
        color: "#17181c",
        fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "72px 24px 96px" }}>
        <header style={{ marginBottom: 56 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              border: "1px solid #dfe3ea",
              borderRadius: 999,
              background: "rgba(255,255,255,0.85)",
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            🔴 Uli OS · 认知核心 v0.1
          </div>

          <h1
            style={{
              margin: 0,
              maxWidth: 760,
              fontSize: "clamp(42px, 7vw, 72px)",
              lineHeight: 1.05,
              letterSpacing: "-0.045em",
            }}
          >
            让经历通过证据，逐渐变成判断。
          </h1>

          <p
            style={{
              maxWidth: 680,
              margin: "24px 0 0",
              fontSize: 20,
              lineHeight: 1.7,
              color: "#5b616e",
            }}
          >
            Uli OS 不是普通笔记软件。它通过持续、高质量的对话，帮助一个人把真实经历转化为模型、身份与人生叙事。
          </p>

          <Link
            href="/capture"
            style={{
              display: "inline-block",
              marginTop: 28,
              padding: "13px 22px",
              borderRadius: 999,
              background: "#17181c",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            进入经历捕捉 →
          </Link>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 56,
          }}
        >
          {phases.map(([title, description], index) => (
            <article
              key={title}
              style={{
                minHeight: 180,
                padding: 24,
                border: "1px solid #e1e4ea",
                borderRadius: 20,
                background: "rgba(255,255,255,0.9)",
                boxShadow: "0 12px 36px rgba(25, 32, 56, 0.05)",
              }}
            >
              <div style={{ fontSize: 13, color: "#8a91a0", marginBottom: 24 }}>
                0{index + 1}
              </div>
              <h2 style={{ margin: "0 0 10px", fontSize: 22 }}>{title}</h2>
              <p style={{ margin: 0, lineHeight: 1.7, color: "#626977" }}>{description}</p>
            </article>
          ))}
        </section>

        <section
          style={{
            padding: 32,
            borderRadius: 24,
            background: "#17181c",
            color: "#ffffff",
          }}
        >
          <p style={{ margin: "0 0 20px", color: "#aeb5c2", fontSize: 14 }}>当前锁定原则</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px 28px",
            }}
          >
            {principles.map((principle) => (
              <div key={principle} style={{ lineHeight: 1.6 }}>
                <span style={{ color: "#8ee7b3", marginRight: 8 }}>✓</span>
                {principle}
              </div>
            ))}
          </div>
        </section>

        <footer style={{ marginTop: 36, color: "#8a91a0", fontSize: 14 }}>
          M01 只处理原始经历的安全保存与读取；AI 推理尚未接入。
        </footer>
      </div>
    </main>
  );
}
