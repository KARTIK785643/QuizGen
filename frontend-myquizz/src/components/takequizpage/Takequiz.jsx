import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, CheckCircle2, ChevronRight, PlayCircle, Trophy } from "lucide-react";
import "./quiz.css";

const TakeQuiz = () => {
  const [quizLink, setQuizLink] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizLoaded, setQuizLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuizLinkSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let id = quizLink.trim();
      if (id.includes("/quiz/")) {
        id = id.split("/quiz/").pop().split("/")[0];
      } else if (id.includes("/")) {
        id = id.split("/").pop();
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${id}`);

      if (!response.data || !response.data.questions || response.data.questions.length === 0) {
        throw new Error("Invalid quiz data format");
      }

      const validatedQuiz = {
        ...response.data,
        questions: response.data.questions.map((question, index) => {
          const processedQuestion = { ...question };
          if (!processedQuestion.text || processedQuestion.text.trim() === "") {
            const possibleTextFields = ['questionText', 'title', 'content', 'question', 'prompt'];
            for (const field of possibleTextFields) {
              if (processedQuestion[field] && processedQuestion[field].trim() !== "") {
                processedQuestion.text = processedQuestion[field];
                break;
              }
            }
            if (!processedQuestion.text || processedQuestion.text.trim() === "") {
              processedQuestion.text = `Question ${processedQuestion.id || index + 1}`;
            }
          }
          if (!Array.isArray(processedQuestion.options) || processedQuestion.options.length === 0) {
            if (Array.isArray(processedQuestion.choices)) {
              processedQuestion.options = processedQuestion.choices;
            } else if (Array.isArray(processedQuestion.answers)) {
              processedQuestion.options = processedQuestion.answers;
            }
          }
          return processedQuestion;
        })
      };

      setSelectedQuiz(validatedQuiz);
      setQuizLoaded(true);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setScore(0);
      setUserAnswers([]);
      setQuizCompleted(false);
    } catch (error) {
      setError("Invalid Quiz ID or Link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitQuizResult = async (finalUserAnswers) => {
    try {
      const userId = localStorage.getItem("userId") || "guest"; 
      const token = localStorage.getItem("token");
      const payload = {
        userId,
        quizId: selectedQuiz._id,
        answers: finalUserAnswers
      };
      // Adjusted to use the correct submit endpoint for score tracking
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${selectedQuiz._id}/submit`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleNext = async () => {
    if (!selectedQuiz) return;
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    const updatedAnswers = [...userAnswers, selectedOption];
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
    } else {
      await submitQuizResult(updatedAnswers);
      setQuizCompleted(true);
    }
  };

  const getCurrentQuestion = useCallback(() => {
    if (!selectedQuiz || !selectedQuiz.questions || selectedQuiz.questions.length === 0) {
      return null;
    }
    return selectedQuiz.questions[currentQuestionIndex];
  }, [selectedQuiz, currentQuestionIndex]);

  const currentQuestion = getCurrentQuestion();

  const getQuestionText = (question) => {
    if (!question) return "No question available";
    const textFields = ['text', 'questionText', 'title', 'content', 'question', 'prompt'];
    for (const field of textFields) {
      if (question[field] && typeof question[field] === 'string' && question[field].trim() !== '') {
        return question[field];
      }
    }
    return "Question text not found";
  };

  const progressPercentage = selectedQuiz ? ((currentQuestionIndex) / selectedQuiz.questions.length) * 100 : 0;

  return (
    <div className="take-quiz-container">
      {!quizLoaded ? (
        <motion.div 
          className="quiz-link-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            <Link size={48} color="var(--primary)" />
          </div>
          <h2>Join a Quiz</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Enter the unique link or ID of the quiz to get started.</p>
          
          <input
            type="text"
            placeholder="Paste quiz link here..."
            value={quizLink}
            onChange={(e) => setQuizLink(e.target.value)}
            className="input-field quiz-link-input"
          />
          <button onClick={handleQuizLinkSubmit} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.2rem' }} disabled={loading}>
            {loading ? "Loading..." : <><PlayCircle size={24}/> Start Quiz</>}
          </button>
          {error && <p style={{ color: '#ff4d4d', marginTop: '16px' }}>{error}</p>}
        </motion.div>
      ) : quizCompleted ? (
        <motion.div 
          className="quiz-result-card glass-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            <Trophy size={64} color="var(--primary)" />
          </div>
          <h2>Quiz Completed!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Here is your final score:</p>
          <div className="score-display">
            {score} <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/ {selectedQuiz.questions.length}</span>
          </div>
          <button onClick={() => setQuizLoaded(false)} className="btn-primary">Take Another Quiz</button>
        </motion.div>
      ) : (
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQuestionIndex}
              className="quiz-question-card glass-card"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentQuestion ? (
                <>
                  <div className="question-header">
                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}</span>
                  </div>
                  
                  <h3 className="question-text">{getQuestionText(currentQuestion)}</h3>

                  {selectedQuiz.image && currentQuestionIndex === 0 && (
                     <img src={selectedQuiz.image} alt="Quiz Cover" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '24px' }} />
                  )}

                  {currentQuestion.image && (
                    <img src={currentQuestion.image} alt="Question" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', marginBottom: '24px' }} />
                  )}

                  {currentQuestion.audio && (
                    <audio controls style={{ width: '100%', marginBottom: '24px' }}>
                      <source src={currentQuestion.audio} />
                    </audio>
                  )}

                  <div className="options-grid">
                    {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        className={`option-btn ${selectedOption === option ? "selected" : ""}`}
                        onClick={() => setSelectedOption(option)}
                      >
                        {option}
                        {selectedOption === option && <CheckCircle2 size={20} />}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={handleNext} 
                      className="btn-primary"
                      disabled={selectedOption === null}
                      style={{ padding: '12px 32px' }}
                    >
                      {currentQuestionIndex === selectedQuiz.questions.length - 1 ? "Finish Quiz" : "Next Question"} <ChevronRight size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <h2>No Questions Available</h2>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
