import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Sparkles, Zap, ShieldCheck, Share2, BarChart } from "lucide-react";
import "../styles/landing.css";
import Footer from "../firstpage/Footer";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="landing-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.header className="hero-section" variants={itemVariants}>
        <div className="hero-content">
          <h1>
            Unleash the Power of <br/>
            <span className="text-gradient">Interactive Quizzes</span>
          </h1>
          <p>
            Create engaging quizzes with images, audio, and video. Test knowledge dynamically and get real-time feedback with our modern platform.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/login" className="btn-primary">
              <Play size={20} /> Start Creating
            </Link>
            <Link to="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Features Section */}
      <motion.section className="features-section" variants={itemVariants}>
        <h2>Why Choose QuizGen?</h2>
        <div className="features">
          <div className="feature glass-card">
            <div className="feature-icon"><Sparkles size={32} /></div>
            <h3>Multimedia Support</h3>
            <p>Add rich media content like videos, audio, and images to make your quizzes truly engaging.</p>
          </div>
          <div className="feature glass-card">
            <div className="feature-icon"><Zap size={32} /></div>
            <h3>Lightning Fast</h3>
            <p>Built with modern web technologies for a smooth, lag-free experience on any device.</p>
          </div>
          <div className="feature glass-card">
            <div className="feature-icon"><ShieldCheck size={32} /></div>
            <h3>Secure & Reliable</h3>
            <p>Your data is protected with industry-standard encryption and secure authentication.</p>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section className="how-it-works" variants={itemVariants}>
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step glass-card">
            <div className="step-icon"><Play size={32} /></div>
            <h3>1. Create</h3>
            <p>Design your custom questions, set the correct answers, and add rich media.</p>
          </div>
          <div className="step glass-card">
            <div className="step-icon"><Share2 size={32} /></div>
            <h3>2. Share</h3>
            <p>Generate a unique link and share your quiz with students, friends, or colleagues.</p>
          </div>
          <div className="step glass-card">
            <div className="step-icon"><BarChart size={32} /></div>
            <h3>3. Analyze</h3>
            <p>View real-time leaderboards and track performance instantly.</p>
          </div>
        </div>
      </motion.section>

      <Footer/>
    </motion.div>
  );
};

export default LandingPage;
