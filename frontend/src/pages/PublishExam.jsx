import { useEffect, useState } from "react";
import api from "../services/api";

function formatDateTime(value) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

export default function PublishExam() {
  const [exams, setExams] = useState([]);
  const [msg, setMsg] = useState("");

  const loadExams = () => {
    api.get("/exams")
      .then((res) => setExams(res.data))
      .catch(() => setExams([]));
  };

  useEffect(() => {
    loadExams();
  }, []);

  const publishExam = async (examId) => {
    try {
      await api.patch(`/exams/${examId}/status`, null, {
        params: { status: "LIVE" }
      });
      setMsg(`Exam ${examId} published and now LIVE`);
      loadExams();
    } catch {
      setMsg("Failed to publish exam");
    }
  };

  const msgClass = msg
    ? `status ${msg.toLowerCase().includes("live") ? "status-success" : "status-error"}`
    : "";

  return (
    <section className="panel">
      <div className="hero">
        <h1>Publish Exam</h1>
        <p>Publish exams to LIVE so students can attempt them.</p>
      </div>

      {msg ? <p className={msgClass}>{msg}</p> : null}

      {exams.length === 0 ? (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>No exams available for publishing.</p>
        </div>
      ) : (
        <div className="list">
          {exams.map((exam) => (
            <article className="list-item" key={exam.id}>
              <div>
                <h4 style={{ margin: 0 }}>{exam.title}</h4>
                <p className="muted" style={{ margin: "0.3rem 0 0" }}>Exam ID: {exam.id}</p>
                <p className="muted" style={{ margin: "0.2rem 0 0" }}>
                  Start: {formatDateTime(exam.startTime)}
                </p>
                <p className="muted" style={{ margin: "0.2rem 0 0" }}>
                  End: {formatDateTime(exam.endTime)}
                </p>
              </div>
              <div className="chips" style={{ alignItems: "center" }}>
                <span className="chip">{exam.examStatus}</span>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => publishExam(exam.id)}
                  disabled={exam.examStatus === "LIVE"}
                >
                  {exam.examStatus === "LIVE" ? "Already LIVE" : "Publish LIVE"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
