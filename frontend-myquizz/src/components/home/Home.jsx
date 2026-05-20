import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, PlayCircle, Trophy } from "lucide-react";
import "../styles/home.css";
import Footer from "../firstpage/Footer";

function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="home-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="home-header" variants={itemVariants}>
        <h1>Welcome to <span className="text-gradient">QuizGen</span> Dashboard</h1>
        <p>What would you like to do today?</p>
      </motion.div>

      <motion.div className="card-container" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Link to="/CreateQuiz" className="action-card glass-card">
            <div className="action-icon">
              <PlusCircle size={40} />
            </div>
            <h2>Create Quiz</h2>
            <p>Design your own quizzes with custom questions and media to challenge others.</p>
            <button className="btn-primary">Create Now</button>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/takequiz" className="action-card glass-card">
            <div className="action-icon">
              <PlayCircle size={40} />
            </div>
            <h2>Start Quiz</h2>
            <p>Test your knowledge across various topics and improve your skills.</p>
            <button className="btn-primary">Start Learning</button>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/ranking" className="action-card glass-card">
            <div className="action-icon">
              <Trophy size={40} />
            </div>
            <h2>Leaderboard</h2>
            <p>Check your rankings, view top scorers, and track your progress.</p>
            <button className="btn-primary">View Grades</button>
          </Link>
        </motion.div>
      </motion.div>

      <Footer />
    </motion.div>
  );
}

export default Home;