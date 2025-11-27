import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>👤</div>
        </div>
        <h2>{user?.name || 'User'}</h2>
        <p className={styles.email}>{user?.email}</p>
      </div>

      <div className={styles.settingsSection}>
        <h3>Settings</h3>
        <div className={styles.settingsList}>
          <button className={styles.settingItem}>
            <span>🔔 Notifications</span>
            <span>›</span>
          </button>
          <button className={styles.settingItem}>
            <span>🌙 Theme</span>
            <span>›</span>
          </button>
          <button className={styles.settingItem}>
            <span>ℹ️ About</span>
            <span>›</span>
          </button>
        </div>
      </div>

      <button onClick={handleLogout} className={styles.logoutButton}>
        🚪 Logout
      </button>

      <p className={styles.version}>Lunar View v1.0.0</p>
    </div>
  );
}

export default Profile;