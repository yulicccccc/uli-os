const phases = [
  ["🌱 Capture", "Preserve the original experience."],
  ["🧠 Reason", "Create an auditable reasoning record."],
  ["📚 Evidence", "Classify support, challenge, or uncertainty."],
  ["🧠 Model Update", "Propose a change for Uli to confirm."],
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 760, margin: "64px auto", fontFamily: "system-ui", padding: 24 }}>
      <p>Uli OS · Cognitive Core v0.1</p>
      <h1>Experience becomes judgment through evidence.</h1>
      <p>This checkpoint implements the first vertical slice before visual polish.</p>
      <section>
        {phases.map(([title, description]) => (
          <article key={title} style={{ borderTop: "1px solid #ddd", padding: "16px 0" }}>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
