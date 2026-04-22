import { useEffect, useState } from "react";
import api from "../services/api";

function formatDateTime(value) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

export default function ViewExams() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    api.get("/exams")
      .then((res) => setExams(res.data))
      .catch(() => setExams([]));
  }, []);

  return (
    <section className="panel">
      <div className="hero">
        <h1>View Exams</h1>
        <p>See all available exams, schedules, and current publication status.</p>
      </div>

      {exams.length === 0 ? (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>No exams available at the moment.</p>
        </div>
      ) : (
        <div className="list">
          {exams.map((exam) => (
            <article className="list-item" key={exam.id}>
              <div>
                <h4 style={{ margin: 0 }}>{exam.title}</h4>
                <p className="muted" style={{ margin: "0.3rem 0 0" }}>
                  {exam.description || "No description provided"}
                </p>
                <p className="muted" style={{ margin: "0.2rem 0 0" }}>
                  Start: {formatDateTime(exam.startTime)}
                </p>
                <p className="muted" style={{ margin: "0.2rem 0 0" }}>
                  End: {formatDateTime(exam.endTime)}
                </p>
              </div>
              <div className="chips">
                <span className="chip">ID: {exam.id}</span>
                <span className="chip">{exam.examStatus}</span>
                <span className="chip">{exam.durationMinutes} mins</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
