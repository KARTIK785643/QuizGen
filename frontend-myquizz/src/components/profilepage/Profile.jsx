import React, { useState, useEffect } from "react";
import styles from "../styles/Profile.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Camera, Save } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data. Please log in again.");
        }

        const data = await response.json();
        if (!data.user || !data.user.email) {
          throw new Error("User data is incomplete. Please log in again.");
        }

        setUser(data.user);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    };

    fetchUserProfile();

    const savedImage = localStorage.getItem("userProfileImage");
    if (savedImage) {
      setImagePreview(savedImage);
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (uploadedImage) {
      localStorage.setItem("userProfileImage", imagePreview);
      alert("Image saved locally!");
      setUploadedImage(null);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>Loading profile...</div>;
  }

  if (error || !user) {
    return <div style={{ textAlign: 'center', padding: '100px', color: '#ff4d4d' }}>{error || "Profile not found"}</div>;
  }

  return (
    <motion.div 
      className={styles.profileContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`${styles.profileCard} glass-card`}>
        <div className={styles.profileHeader}>
          <div className={styles.imageSection}>
            <div className={styles.avatarWrapper}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className={styles.avatarImage} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <label htmlFor="profile-upload" className={styles.uploadOverlay}>
                <Camera size={20} />
              </label>
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
            {uploadedImage && (
              <button onClick={handleImageUpload} className={`btn-primary ${styles.saveBtn}`}>
                <Save size={16} /> Save Image
              </button>
            )}
          </div>
          
          <div className={styles.infoSection}>
            <h2>{user.username}</h2>
            <p className={styles.badge}>Quiz Creator</p>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h3>Account Details</h3>
          <div className={styles.detailRow}>
            <User color="var(--primary)" size={20} />
            <div>
              <p className={styles.label}>Username</p>
              <p className={styles.value}>{user.username}</p>
            </div>
          </div>
          <div className={styles.detailRow}>
            <Mail color="var(--primary)" size={20} />
            <div>
              <p className={styles.label}>Email Address</p>
              <p className={styles.value}>{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
