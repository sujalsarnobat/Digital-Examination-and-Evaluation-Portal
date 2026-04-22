import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function EvaluateAnswers() {
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [examId, setExamId] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [answerId, setAnswerId] = useState("");
  const [awardedMarks, setAwardedMarks] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/exams")
      .then((res) => setExams(res.data))
      .catch(() => setExams([]));
  }, []);

  useEffect(() => {
    if (!examId) {
      setQuestions([]);
      setQuestionId("");
      setAnswers([]);
      setAnswerId("");
      return;
    }

    api.get(`/questions/exam/${examId}`)
      .then((res) => {
        setQuestions(res.data.filter((q) => q.questionType === "DESCRIPTIVE"));
        setQuestionId("");
        setAnswers([]);
        setAnswerId("");
      })
      .catch(() => {
        setQuestions([]);
        setQuestionId("");
        setAnswers([]);
        setAnswerId("");
      });
  }, [examId]);

  useEffect(() => {
    if (!examId || !questionId) {
      setAnswers([]);
      setAnswerId("");
      return;
    }

    api.get(`/answers/exam/${examId}/question/${questionId}`)
      .then((res) => {
        setAnswers(res.data.filter((a) => a.evaluationStatus === "MANUAL_REVIEW_PENDING"));
        setAnswerId("");
      })
      .catch(() => {
        setAnswers([]);
        setAnswerId("");
      });
  }, [examId, questionId]);

  const selectedQuestion = useMemo(
    () => questions.find((q) => String(q.id) === String(questionId)),
    [questions, questionId]
  );

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/answers/evaluate", {
        answerId: Number(answerId),
        awardedMarks: Number(awardedMarks)
      });
      setMsg("Answer evaluated successfully");
    } catch {
      setMsg("Failed to evaluate answer");
    }
  };

  const msgClass = msg
    ? `status ${msg.toLowerCase().includes("success") ? "status-success" : "status-error"}`
    : "";

  return (
    <section className="panel">
      <div className="hero">
        <h1>Evaluate Answers</h1>
        <p>Select exam, question, and answer before submitting manual evaluation marks.</p>
      </div>

      <form className="form-stack" onSubmit={submit}>
        <div className="field">
          <label htmlFor="evaluate-exam-id">Exam</label>
          <select
            id="evaluate-exam-id"
            className="select"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
          >
            <option value="">Choose exam</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title} (ID: {exam.id})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="evaluate-question-id">Question</label>
          <select
            id="evaluate-question-id"
            className="select"
            value={questionId}
            onChange={(e) => setQuestionId(e.target.value)}
            disabled={!examId}
          >
            <option value="">Choose question</option>
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                Q{q.id}: {q.questionText}
              </option>
            ))}
          </select>
          {examId && questions.length === 0 ? (
            <p className="muted" style={{ margin: "0.4rem 0 0" }}>
              No descriptive questions found for this exam.
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="evaluate-answer-id">Answer</label>
          <select
            id="evaluate-answer-id"
            className="select"
            value={answerId}
            onChange={(e) => setAnswerId(e.target.value)}
            disabled={!questionId}
          >
            <option value="">Choose answer</option>
            {answers.map((a) => (
              <option key={a.id} value={a.id}>
                Answer #{a.id} - {a.responseText || a.selectedOption || "No response text"}
              </option>
            ))}
          </select>
          {questionId && answers.length === 0 ? (
            <p className="muted" style={{ margin: "0.4rem 0 0" }}>
              No pending answers for manual review on this question.
            </p>
          ) : null}
        </div>

        <div className="grid-2">
          <div className="field">
            <label htmlFor="evaluate-answer-id-manual">Answer ID</label>
            <input
              id="evaluate-answer-id-manual"
              className="input"
              type="number"
              value={answerId}
              onChange={(e) => setAnswerId(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="evaluate-marks">Awarded Marks</label>
            <input
              id="evaluate-marks"
              className="input"
              type="number"
              placeholder={selectedQuestion ? `Max ${selectedQuestion.marks}` : "Enter marks"}
              value={awardedMarks}
              onChange={(e) => setAwardedMarks(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={!answerId || !awardedMarks}>Submit Evaluation</button>
        {msg ? <p className={msgClass}>{msg}</p> : null}
      </form>
    </section>
  );
}
