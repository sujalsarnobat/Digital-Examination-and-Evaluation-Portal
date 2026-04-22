import { useEffect, useState } from "react";
import api from "../services/api";

export default function AddQuestion() {
  const [examId, setExamId] = useState("");
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({ questionText: "", questionType: "MCQ", optionsData: "", answerKey: "", marks: 1 });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/exams")
      .then((res) => setExams(res.data))
      .catch(() => setExams([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/questions/exam/${examId}`, form);
      setMsg("Question added");
    } catch {
      setMsg("Failed to add question");
    }
  };

  const msgClass = msg
    ? `status ${msg.toLowerCase().includes("added") ? "status-success" : "status-error"}`
    : "";

  return (
    <section className="panel">
      <div className="hero">
        <h1>Add Question</h1>
        <p>Attach questions to an existing exam ID in your faculty workspace.</p>
      </div>

      <form className="form-stack" onSubmit={submit}>
        <div className="field">
          <label htmlFor="exam-id">Select Exam</label>
          <select
            id="exam-id"
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
          {exams.length === 0 ? <p className="muted" style={{ margin: 0 }}>No exams available to attach questions.</p> : null}
        </div>

        <div className="field">
          <label htmlFor="question-text">Question</label>
          <textarea
            id="question-text"
            className="textarea"
            placeholder="Write the full question statement"
            onChange={(e) => setForm({ ...form, questionText: e.target.value })}
          />
        </div>

        <div className="grid-2">
          <div className="field">
            <label htmlFor="question-type">Question Type</label>
            <select
              id="question-type"
              className="select"
              onChange={(e) => setForm({ ...form, questionType: e.target.value })}
            >
              <option value="MCQ">MCQ</option>
              <option value="DESCRIPTIVE">DESCRIPTIVE</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="question-marks">Marks</label>
            <input
              id="question-marks"
              className="input"
              type="number"
              placeholder="1"
              onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="question-options">Options (for MCQ)</label>
          <textarea
            id="question-options"
            className="textarea"
            placeholder="Option A | Option B | Option C | Option D"
            onChange={(e) => setForm({ ...form, optionsData: e.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="answer-key">Answer Key</label>
          <input
            id="answer-key"
            className="input"
            placeholder="Correct option or rubric hint"
            onChange={(e) => setForm({ ...form, answerKey: e.target.value })}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={!examId}>Add Question</button>
        {msg ? <p className={msgClass}>{msg}</p> : null}
      </form>
    </section>
  );
}
