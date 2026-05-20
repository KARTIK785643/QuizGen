import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Link2, MonitorPlay, Shield, Users } from "lucide-react";
import "./about.css";

function About() {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="about-container"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      <motion.div className="about-header" variants={itemVariants}>
        <h1>About <span className="text-gradient">QuizGen</span></h1>
        <p>Your ultimate platform for interactive learning and assessment.</p>
      </motion.div>

      <motion.div className="about-card glass-card" variants={itemVariants}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-light)', marginBottom: '32px' }}>
          <strong>QuizGen</strong> is an innovative platform that empowers educators, students, and quiz enthusiasts to create and participate in dynamic quizzes. With support for rich media like images and audio, we make learning engaging and fun.
        </p>

        <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Key Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <MonitorPlay size={24} color="var(--primary)" />
            <div>
              <h3>Multimedia Support</h3>
              <p>Enhance questions with images and audio for better engagement.</p>
            </div>
          </div>
          <div className="feature-item">
            <Link2 size={24} color="var(--primary)" />
            <div>
              <h3>Shareable Links</h3>
              <p>Instantly generate unique links to invite participants globally.</p>
            </div>
          </div>
          <div className="feature-item">
            <Users size={24} color="var(--primary)" />
            <div>
              <h3>Live Leaderboards</h3>
              <p>Track real-time rankings and foster healthy competition.</p>
            </div>
          </div>
          <div className="feature-item">
            <Shield size={24} color="var(--primary)" />
            <div>
              <h3>Secure & Private</h3>
              <p>Host public quizzes or keep them private for specific groups.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="how-it-works-card glass-card" variants={itemVariants}>
        <h2 style={{ marginBottom: '24px', color: 'var(--text-light)' }}>How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="step-row">
            <CheckCircle2 color="var(--primary)" />
            <p><strong>Create:</strong> Add your questions, configure options, and upload rich media.</p>
          </div>
          <div className="step-row">
            <CheckCircle2 color="var(--primary)" />
            <p><strong>Share:</strong> Distribute the generated link to your target audience.</p>
          </div>
          <div className="step-row">
            <CheckCircle2 color="var(--primary)" />
            <p><strong>Analyze:</strong> Watch as participants take the quiz and view live results on the leaderboard.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default About;
