import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import "./ranking.css";

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
    transports: ["websocket"],
    withCredentials: true
});

const RankingPage = () => {
    const [users, setUsers] = useState([]);
    const [hasTakenQuiz, setHasTakenQuiz] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/leaderboard`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError("Please log in to view the leaderboard.");
                        return;
                    }
                    throw new Error("Failed to fetch leaderboard.");
                }

                const data = await response.json();
                setHasTakenQuiz(data.hasTakenQuiz);
                setUsers(data.leaderboard || []);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                setError("Failed to fetch leaderboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();

        socket.on("leaderboardUpdated", (updatedLeaderboard) => {
            setHasTakenQuiz((currentHasTakenQuiz) => {
                if (currentHasTakenQuiz) {
                    setUsers(updatedLeaderboard);
                }
                return currentHasTakenQuiz;
            });
        });

        return () => {
            socket.off("leaderboardUpdated");
        };
    }, []);

    return (
        <motion.div
            className="ranking-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="ranking-header">
                <Trophy size={48} color="var(--primary)" />
                <h2>Global <span className="text-gradient">Leaderboard</span></h2>
                <p>See how you stack up against the best quiz takers!</p>
            </div>

            {loading && <div className="loading-state">Loading rankings...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && (
                !hasTakenQuiz ? (
                    <div className="glass-card empty-state" style={{ flexDirection: 'column', gap: '16px', padding: '40px' }}>
                        <Award size={48} color="var(--primary)" style={{ opacity: 0.7 }} />
                        <h3>Leaderboard Locked</h3>
                        <p style={{ color: "var(--text-muted)", maxWidth: '400px', margin: '0 auto' }}>
                            You must complete at least one quiz to view your rank and the global leaderboard!
                        </p>
                    </div>
                ) : users.length > 0 ? (
                    <div className="ranking-card glass-card">
                        <table className="ranking-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Username</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <motion.tr
                                        key={index}
                                        className={`rank-row ${user.rank <= 3 ? `top-${user.rank}` : ""}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <td className="rank-cell">
                                            {user.rank === 1 && <Trophy size={20} color="#FFD700" />}
                                            {user.rank === 2 && <Medal size={20} color="#C0C0C0" />}
                                            {user.rank === 3 && <Award size={20} color="#CD7F32" />}
                                            {user.rank > 3 && `#${user.rank}`}
                                        </td>
                                        <td className="username-cell">{user.username}</td>
                                        <td className="score-cell">{user.correctAnswer || 0}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="glass-card empty-state">No completed quizzes available yet.</div>
                )
            )}
        </motion.div>
    );
};

export default RankingPage;
