import { useEffect, useState } from "react";
import api from "../services/api";

export default function PublishResults() {
  const [exams, setExams] = useState([]);
  const [examId, setExamId] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  // Fetch all exams on mount
  useEffect(() => {
    api.get("/exams")
      .then((res) => setExams(res.data))
      .catch(() => setExams([]));
  }, []);

  // Fetch count of students ready when exam is selected
  useEffect(() => {
    if (!examId) {
      setResultCount(0);
      return;
    }

    api.get(`/results/exam/${examId}/students-ready`)
      .then((res) => {
        setResultCount(res.data.length);
      })
      .catch(() => {
        setResultCount(0);
      });
  }, [examId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!examId) {
      setMsg("Please select an exam");
      return;
    }

    if (resultCount === 0) {
      setMsg("No results ready to publish for this exam");
      return;
    }

    setMsg("");
    setIsLoading(true);
    try {
      await api.post(`/results/publish-all/${examId}`);
      setMsg(`Successfully published ${resultCount} result(s)`);
      setExamId("");
      setResultCount(0);
    } catch (error) {
      setMsg(
        "Failed to publish results: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const msgClass = msg
    ? `status ${msg.toLowerCase().includes("success") ? "status-success" : "status-error"}`
    : "";

  return (
    <section className="panel">
      <div className="hero">
        <h1>Publish Results</h1>
        <p>Select an exam to publish all evaluated results for all students at once.</p>
      </div>

      <form className="form-stack" onSubmit={submit}>
        <div className="field">
          <label htmlFor="publish-exam-select">Select Exam</label>
          <select
            id="publish-exam-select"
            className="select"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
          >
            <option value="">Choose an exam</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title} (ID: {exam.id})
              </option>
            ))}
          </select>
        </div>

        {examId && (
          <div className="card" style={{ background: "rgba(26, 155, 140, 0.08)", border: "1px solid rgba(26, 155, 140, 0.2)" }}>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>
              📊 <strong>{resultCount}</strong> student result{resultCount !== 1 ? "s" : ""} ready for publishing
            </p>
          </div>
        )}

        <button
          className="btn btn-primary"
          type="submit"
          disabled={!examId || resultCount === 0 || isLoading}
        >
          {isLoading ? "Publishing..." : "Publish All Results"}
        </button>
        {msg ? <p className={msgClass}>{msg}</p> : null}
      </form>
    </section>
  );
}
