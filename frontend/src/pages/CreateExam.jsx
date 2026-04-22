import { useState } from "react";
import api from "../services/api";

export default function CreateExam() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    durationMinutes: 60,
    totalMarks: 100
  });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams", form);
      setMsg("Exam created in DRAFT state");
    } catch {
      setMsg("Failed to create exam");
    }
  };

  const msgClass = msg
    ? `status ${msg.toLowerCase().includes("created") ? "status-success" : "status-error"}`
    : "";

  return (
    <section className="panel">
      <div className="hero">
        <h1>Create Exam</h1>
        <p>Define title, schedule, duration, and marks. New exams are saved as DRAFT.</p>
      </div>

      <form className="form-stack" onSubmit={submit}>
        <div className="field">
          <label htmlFor="exam-title">Exam Title</label>
          <input
            id="exam-title"
            className="input"
            placeholder="OOAD Midterm"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="exam-desc">Description</label>
          <textarea
            id="exam-desc"
            className="textarea"
            placeholder="Add instructions and scope for this exam"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid-2">
          <div className="field">
            <label htmlFor="exam-start">Start Time</label>
            <input
              id="exam-start"
              className="input"
              type="datetime-local"
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="exam-end">End Time</label>
            <input
              id="exam-end"
              className="input"
              type="datetime-local"
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="field">
            <label htmlFor="exam-duration">Duration (minutes)</label>
            <input
              id="exam-duration"
              className="input"
              type="number"
              placeholder="60"
              onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
            />
          </div>

          <div className="field">
            <label htmlFor="exam-marks">Total Marks</label>
            <input
              id="exam-marks"
              className="input"
              type="number"
              placeholder="100"
              onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
            />
          </div>
        </div>

        <button className="btn btn-primary" type="submit">Create Exam</button>
        {msg ? <p className={msgClass}>{msg}</p> : null}
      </form>
    </section>
  );
}
