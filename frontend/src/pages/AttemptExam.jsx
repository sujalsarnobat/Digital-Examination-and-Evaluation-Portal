import { useEffect, useState } from "react";
import api from "../services/api";

export default function AttemptExam() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    api.get("/exams/live")
      .then((res) => setExams(res.data))
      .catch(() => setExams([]));
  }, []);

  return (
    <section className="panel">
      <div className="hero">
        <h1>Attempt Exam</h1>
        <p>Browse live exams and proceed with your active attempt window.</p>
      </div>

      {exams.length === 0 ? (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>No live exams right now.</p>
        </div>
      ) : (
        <div className="list">
          {exams.map((exam) => (
            <article className="list-item" key={exam.id}>
              <div>
                <h4 style={{ margin: 0 }}>{exam.title}</h4>
                <p className="muted" style={{ margin: "0.3rem 0 0" }}>
                  Exam ID: {exam.id}
                </p>
              </div>
              <div className="chips">
                <span className="chip">{exam.durationMinutes} mins</span>
                <span className="chip">{exam.totalMarks} marks</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
