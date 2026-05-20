import React, { useState } from "react";
import { PlusCircle, Image as ImageIcon, Mic, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const QuizForm = ({ onSubmit }) => {
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    image: "",
    audio: "",
    questions: [],
  });

  const [question, setQuestion] = useState({
    question: "",
    options: ["", ""],
    correctAnswer: "",
  });

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleCorrectAnswerChange = (value) => {
    setQuestion({ ...question, correctAnswer: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setQuiz({ ...quiz, image: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setQuiz({ ...quiz, audio: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const addOption = () => {
    setQuestion({ ...question, options: [...question.options, ""] });
  };

  const addQuestion = () => {
    if (!question.question || !question.correctAnswer) {
      alert("Please enter a question and select the correct answer.");
      return;
    }
    setQuiz({ ...quiz, questions: [...quiz.questions, question] });
    setQuestion({ question: "", options: ["", ""], correctAnswer: "" });
  };

  const submitQuiz = () => {
    if (!quiz.title || quiz.questions.length === 0) {
      alert("Please add a title and at least one question.");
      return;
    }
    onSubmit(quiz);
    setQuiz({ title: "", description: "", image: "", audio: "", questions: [] });
  };

  return (
    <div className="quiz-form-card glass-card">
      <h3>Quiz Details</h3>
      <div className="form-group" style={{ marginBottom: '16px' }}>
        <input type="text" name="title" className="input-field" value={quiz.title} onChange={handleQuizChange} placeholder="Quiz Title" />
      </div>
      <div className="form-group" style={{ marginBottom: '16px' }}>
        <textarea name="description" className="input-field" value={quiz.description} onChange={handleQuizChange} placeholder="Quiz Description" rows={3} />
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <label className="upload-btn" style={{ flex: 1 }}>
          <ImageIcon size={20} />
          {quiz.image ? "Image Selected" : "Upload Image"}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        <label className="upload-btn" style={{ flex: 1 }}>
          <Mic size={20} />
          {quiz.audio ? "Audio Selected" : "Upload Audio"}
          <input type="file" accept="audio/*" onChange={handleAudioUpload} />
        </label>
      </div>

      <h3>Add Question</h3>
      <div className="form-group" style={{ marginBottom: '16px' }}>
        <input type="text" name="question" className="input-field" value={question.question} onChange={handleQuestionChange} placeholder="Type your question..." />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Options (Select the correct one)</p>
        {question.options.map((option, index) => (
          <div key={index} className="option-row">
            <input
              type="text"
              className="input-field"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <input
              type="radio"
              name="correctAnswer"
              checked={question.correctAnswer === option && option !== ""}
              onChange={() => handleCorrectAnswerChange(option)}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button onClick={addOption} className="btn-secondary" style={{ flex: 1 }}>Add Option</button>
        <button onClick={addQuestion} className="btn-primary" style={{ flex: 1 }}><PlusCircle size={18}/> Save Question</button>
      </div>

      {quiz.questions.length > 0 && (
        <div className="question-preview">
          <h4 style={{ marginBottom: '12px', color: 'var(--primary)' }}>Added Questions ({quiz.questions.length})</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {quiz.questions.map((q, idx) => (
              <li key={idx} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                <CheckCircle size={14} color="var(--primary)" style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
                {q.question}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={submitQuiz} className="btn-primary" style={{ width: '100%', marginTop: '24px', padding: '14px', fontSize: '1.1rem' }}>Publish Quiz</button>
    </div>
  );
};

export default QuizForm;
