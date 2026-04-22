import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <section className="landing-page panel">
      <header className="landing-hero">
        <p className="landing-kicker">PES University</p>
        <h1>Digital Examination and Evaluation Portal</h1>
        <p>
          Welcome to the official PES University assessment workspace. This portal supports
          transparent exam delivery, secure evaluation workflows, and faster result publication
          for students, faculty, and administrators.
        </p>
        <div className="landing-actions">
          <Link className="btn btn-cta btn-large" to="/register">Get Started -&gt;</Link>
          <Link className="btn btn-secondary btn-large" to="/login">Login</Link>
        </div>
        <div className="trust-strip">
          <span>Secure Role-Based Access</span>
          <span>Real-Time Evaluation</span>
          <span>Scalable System</span>
        </div>
      </header>

      <section className="landing-role-grid">
        <Link className="card role-card" to="/login">
          <h3>Student</h3>
          <ul>
            <li>Attempt Exams</li>
            <li>View Results</li>
          </ul>
        </Link>

        <Link className="card role-card" to="/login">
          <h3>Faculty</h3>
          <ul>
            <li>Create Exams</li>
            <li>Evaluate Answers</li>
          </ul>
        </Link>

        <Link className="card role-card" to="/login">
          <h3>Admin</h3>
          <ul>
            <li>Manage Users</li>
            <li>Publish Results</li>
          </ul>
        </Link>
      </section>

      <section className="landing-grid">
        <article className="card">
          <h3>Academic Excellence</h3>
          <p className="muted">
            Built to support rigorous and outcome-based assessments aligned with PES University
            academic standards.
          </p>
        </article>

        <article className="card">
          <h3>Secure Workflows</h3>
          <p className="muted">
            Role-based access ensures each user sees only relevant modules and actions across the
            system.
          </p>
        </article>

        <article className="card">
          <h3>Faster Results</h3>
          <p className="muted">
            Integrated evaluation and publishing flow helps departments release results quickly
            with better consistency.
          </p>
        </article>
      </section>

      <section className="flow-strip">
        <h4>System Flow</h4>
        <p>Create Exam -&gt; Attempt -&gt; Evaluate -&gt; Result</p>
      </section>

      <footer className="landing-footer muted">
        PES University Digital Examination Platform
      </footer>
    </section>
  );
}
