import { useEffect, useState } from "react";
import api from "../services/api";

export default function Result() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get("/results/me")
      .then((res) => setResults(res.data))
      .catch(() => setResults([]));
  }, []);

  return (
    <section className="panel">
      <div className="hero">
        <h1>View Result</h1>
        <p>Track your scores and grades across completed examinations.</p>
      </div>

      {results.length === 0 ? (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>No published results yet.</p>
        </div>
      ) : (
        <div className="list">
          {results.map((r) => (
            <article className="list-item" key={r.id}>
              <div>
                <h4 style={{ margin: 0 }}>{r.exam?.title || `Exam #${r.exam?.id}`}</h4>
                <p className="muted" style={{ margin: "0.3rem 0 0" }}>
                  Score: {r.totalScore}
                </p>
                <p className="muted" style={{ margin: "0.2rem 0 0" }}>
                  Published: {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div className="chips">
                <span className="chip">Grade {r.grade}</span>
                <span className="chip">{Number(r.percentage).toFixed(2)}%</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
