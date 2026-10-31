import { useState } from "react";
import { evaluateAnswer } from "../services/interview.api";
  
const PracticeBox = ({ reportId, question }) => {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError("Write your answer first");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setFeedback(null);
      const data = await evaluateAnswer(reportId, question, answer);
      setFeedback(data.feedback);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't get feedback. Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="practice">
      <span className="q-card__tag">Practice</span>

      <textarea
        className="practice__input"
        rows={5}
        placeholder="Type your answer here to practice..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button
        type="button"
        className="practice__btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Checking..." : "Get AI Feedback"}
      </button>

      {error && <p className="practice__error">{error}</p>}

      {feedback && (
        <div className="practice__result">
          <h4>Score: {feedback.score} / 10</h4>

          <strong>What was good</strong>
          <ul>{feedback.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>

          <strong>What to improve</strong>
          <ul>{feedback.improvements?.map((s, i) => <li key={i}>{s}</li>)}</ul>

          <strong>Better answer</strong>
          <p>{feedback.betterAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default PracticeBox;