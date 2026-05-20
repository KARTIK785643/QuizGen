import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Info, User, LogOut, LogIn, BrainCircuit } from "lucide-react";
import "./Navbar.css";

const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logoutSuccess"));
    navigate("/");
  };

  return (
    <motion.nav
      className="navbar glass-panel"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={isLoggedIn ? "/home" : "/"} className="logo-container">
        <BrainCircuit className="logo-icon" size={32} />
        <h1 className="logo-text text-gradient">QuizGen</h1>
      </Link>

      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li>
              <Link
                to="/home"
                className="nav-item"
style={{ color: "black" }}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="nav-item"
                style={{ color: "black" }}
              >
                <Info size={20} />
                <span>About</span>
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="nav-item"
                style={{ color: "black" }}
              >
                <User size={20} />
                <span>Profile</span>
              </Link>
            </li>

            <li>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/about"
                className="nav-item"
                style={{ color: "green" }}
              >
                <Info size={20} />
                <span>About</span>
              </Link>
            </li>

            {/* Login button remains unchanged */}
            <li>
              <Link
                to="/login"
                className="btn-primary"
                style={{ textDecoration: "none" }}
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </motion.nav>
  );
};

export default Navbar;