import { useState } from "react";
import api from "../services/api";

export default function PublishResults() {
  const [examId, setExamId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/results/publish", null, {
        params: {
          examId: Number(examId),
          studentId: Number(studentId)
        }
      });
      setMsg("Result published successfully");
    } catch {
      setMsg("Failed to publish result");
    }
  };

  const msgClass = msg
    ? `status ${msg.toLowerCase().includes("success") ? "status-success" : "status-error"}`
    : "";

  return (
    <section className="panel">
      <div className="hero">
        <h1>Publish Results</h1>
        <p>Publish final evaluated score for a specific student in an exam.</p>
      </div>

      <form className="form-stack" onSubmit={submit}>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="publish-exam-id">Exam ID</label>
            <input
              id="publish-exam-id"
              className="input"
              type="number"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="publish-student-id">Student ID</label>
            <input
              id="publish-student-id"
              className="input"
              type="number"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary" type="submit">Publish Result</button>
        {msg ? <p className={msgClass}>{msg}</p> : null}
      </form>
    </section>
  );
}
