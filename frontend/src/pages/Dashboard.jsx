export default function Dashboard() {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");

  return (
    <section className="panel">
      <div className="hero">
        <h1>Dashboard</h1>
        <p>Welcome back. Here is your account overview and quick actions.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: "0.9rem" }}>
        <article className="card">
          <h3>Logged In As</h3>
          <p className="muted" style={{ margin: 0 }}>{auth.email || "-"}</p>
        </article>

        <article className="card">
          <h3>Role</h3>
          <div className="chips">
            <span className="chip">{auth.role || "UNKNOWN"}</span>
          </div>
        </article>

        <article className="card">
          <h3>Workspace</h3>
          <p className="muted" style={{ margin: 0 }}>Digital Examination & Evaluation Portal</p>
        </article>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Quick Navigation</h3>
        <p className="muted">Use the top navigation to create exams, add questions, attempt tests, and check results.</p>
      </div>
    </section>
  );
}
