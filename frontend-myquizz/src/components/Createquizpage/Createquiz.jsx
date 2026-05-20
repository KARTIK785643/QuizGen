import React, { useState, useEffect } from "react";
import QuizForm from "./Quizform";
import { motion } from "framer-motion";
import { Link, Copy, Trash2, ExternalLink } from "lucide-react";
import "../styles/style.css";
import axios from "axios";

const CreateQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizLinks, setQuizLinks] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      setQuizzes([]);
      setIsLoading(false);
      return;
    }
    
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quizzes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setQuizzes(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching quizzes:", error);
        setIsLoading(false);
      });
  }, []);
  
  const handleQuizSubmit = async (quizData) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("You must be logged in to create a quiz.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/quizzes`, quizData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setQuizzes(prevQuizzes => [...prevQuizzes, response.data]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error submitting quiz:", error.response ? error.response.data : error.message);
      alert("Quiz submission failed! Check console for details.");
      setIsLoading(false);
    }
  };

  const generateQuizLink = (quizId) => {
    const link = `${window.location.origin}/quiz/${quizId}`;
    setQuizLinks(prev => ({ ...prev, [quizId]: link }));
  };

  const deleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        setIsLoading(true);
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}`);
        
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
        
        const newQuizLinks = { ...quizLinks };
        delete newQuizLinks[quizId];
        setQuizLinks(newQuizLinks);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error deleting quiz:", error);
        setIsLoading(false);
        alert("Failed to delete quiz. Please try again.");
      }
    }
  };

  return (
    <motion.div 
      className="create-quiz-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-section">
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
          Create a <span className="text-gradient">New Quiz</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Fill in the details below to generate an interactive quiz. You can add multimedia elements to make it engaging.
        </p>
        <QuizForm onSubmit={handleQuizSubmit} />
      </div>
      
      <div className="list-section">
        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-light)' }}>
          Your Quizzes
        </h2>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading quizzes...</div>
        ) : quizzes.length > 0 ? (
          <div className="quiz-list-wrapper">
            {quizzes.map((quiz, index) => (
              <motion.div 
                key={quiz._id || index} 
                className="quiz-item glass-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{quiz?.title || "Untitled Quiz"}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                      {quiz?.description || "No description provided."}
                    </p>
                    <span style={{ background: 'rgba(57, 255, 20, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {quiz?.questions?.length || 0} Questions
                    </span>
                  </div>
                  
                  {quiz.image && (
                    <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, marginLeft: '16px' }}>
                      <img src={quiz.image} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
                
                {quiz.audio && (
                  <div style={{ marginTop: '12px' }}>
                    <audio controls src={quiz.audio} style={{ width: '100%', height: '36px' }}></audio>
                  </div>
                )}
                
                <div className="quiz-actions">
                  <button className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.9rem' }} onClick={() => generateQuizLink(quiz._id)}>
                    <Link size={16} /> Generate Link
                  </button>
                  <button className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => deleteQuiz(quiz._id)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
                
                {quizLinks[quiz._id] && (
                  <div className="quiz-link-box" style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                    <input 
                      type="text"
                      readOnly
                      value={quizLinks[quiz._id]}
                      className="input-field"
                      style={{ fontSize: '0.9rem', padding: '8px' }}
                    />
                    <button
                      className="btn-primary"
                      style={{ padding: '8px 16px' }}
                      onClick={() => navigator.clipboard.writeText(quizLinks[quiz._id])}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <p style={{ color: 'var(--text-muted)' }}>You haven't created any quizzes yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CreateQuiz;
