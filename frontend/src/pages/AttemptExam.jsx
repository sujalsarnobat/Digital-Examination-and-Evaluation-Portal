import { useEffect, useState } from "react";
import api from "../services/api";

function formatDateTime(value) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

export default function AttemptExam() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live exams on mount
  useEffect(() => {
    api.get("/exams/live/available")
      .then((res) => setExams(res.data))
      .catch(() => setExams([]));
  }, []);

  // Fetch questions when exam is selected
  const handleAttemptExam = async (exam) => {
    setSelectedExam(exam);
    setAnswers({});
    setMsg("");
    try {
      const res = await api.get(`/questions/exam/${exam.id}`);
      setQuestions(res.data);
    } catch {
      setMsg("Failed to load questions");
      setQuestions([]);
    }
  };

  // Handle answer change
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Submit all answers
  const handleSubmitAnswers = async () => {
    setMsg("");
    setIsLoading(true);
    try {
      for (const question of questions) {
        const answerValue = answers[question.id];
        if (!answerValue) {
          setMsg("Please answer all questions");
          setIsLoading(false);
          return;
        }

        const dto = {
          examId: selectedExam.id,
          questionId: question.id,
          responseText:
            question.questionType === "DESCRIPTIVE" ? answerValue : undefined,
          selectedOption: question.questionType === "MCQ" ? answerValue : undefined,
        };

        await api.post("/answers/submit", dto);
      }
      setMsg("All answers submitted successfully!");
      setExams((prev) => prev.filter((exam) => exam.id !== selectedExam.id));
      setTimeout(() => {
        setSelectedExam(null);
        setQuestions([]);
        setAnswers({});
      }, 1500);
    } catch (error) {
      setMsg(
        "Failed to submit answers: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Back to exam list
  const handleBackToExams = () => {
    setSelectedExam(null);
    setQuestions([]);
    setAnswers({});
    setMsg("");
  };

  const msgClass = msg
    ? `status ${msg.toLowerCase().includes("success") ? "status-success" : "status-error"}`
    : "";

  // Show questions if exam is selected
  if (selectedExam) {
    return (
      <section className="panel">
        <div className="hero">
          <h1>{selectedExam.title}</h1>
          <p>Answer all questions below. Total marks: {selectedExam.totalMarks}</p>
        </div>

        {questions.length === 0 ? (
          <div className="card">
            <p className="muted" style={{ margin: 0 }}>
              No questions available for this exam.
            </p>
          </div>
        ) : (
          <div className="form-stack">
            {questions.map((question, idx) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <h4 style={{ margin: 0, flex: 1 }}>
                    Q{idx + 1}. {question.questionText}
                  </h4>
                  <span className="chip">{question.marks} marks</span>
                </div>

                {question.questionType === "MCQ" ? (
                  <div className="question-content">
                    <div className="mcq-options">
                      {question.optionsData.split("|").map((option) => (
                        <label key={option} className="option-label">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) =>
                              handleAnswerChange(question.id, e.target.value)
                            }
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="question-content">
                    <textarea
                      className="textarea"
                      placeholder="Write your answer here..."
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.2rem" }}>
              <button
                className="btn btn-primary"
                onClick={handleSubmitAnswers}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Answers"}
              </button>
              <button
                className="btn btn-ghost"
                onClick={handleBackToExams}
                disabled={isLoading}
              >
                Back to Exams
              </button>
            </div>

            {msg ? <p className={msgClass}>{msg}</p> : null}
          </div>
        )}
      </section>
    );
  }

  // Show exam list
  return (
    <section className="panel">
      <div className="hero">
        <h1>Attempt Exam</h1>
        <p>Only exams published as LIVE are shown here for student attempts.</p>
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
                <p className="muted" style={{ margin: "0.2rem 0 0" }}>
                  Start: {formatDateTime(exam.startTime)}
                </p>
                <p className="muted" style={{ margin: "0.2rem 0 0" }}>
                  End: {formatDateTime(exam.endTime)}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <span className="chip">{exam.examStatus}</span>
                <span className="chip">{exam.durationMinutes} mins</span>
                <span className="chip">{exam.totalMarks} marks</span>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAttemptExam(exam)}
                >
                  Attempt
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
