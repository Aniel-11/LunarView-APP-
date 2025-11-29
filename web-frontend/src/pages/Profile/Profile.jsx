import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

function Profile() {
  const { user, logout } = useAuth();
  const { theme, changeTheme, autoTheme, toggleAutoTheme, themes } = useTheme();
  const { notificationsEnabled, permission, enableNotifications, disableNotifications, sendTestNotification } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
  };

  const handleNotificationToggle = async () => {
    if (notificationsEnabled) {
      disableNotifications();
    } else {
      await enableNotifications();
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

      {/* Theme Settings */}
      <div className={styles.settingsSection}>
        <h3>🎨 Theme Settings</h3>
        
        <div className={styles.themeGrid}>
          {themes.map((themeName) => (
            <button
              key={themeName}
              className={`${styles.themeCard} ${theme === themeName ? styles.themeCardActive : ''}`}
              onClick={() => handleThemeChange(themeName)}
            >
              <div className={styles.themePreview}>
                {themeName === 'dark' && '🌙'}
                {themeName === 'light' && '☀️'}
                {themeName === 'cosmic' && '🌌'}
              </div>
              <span className={styles.themeName}>
                {themeName === 'dark' && 'Dark'}
                {themeName === 'light' && 'Light'}
                {themeName === 'cosmic' && 'Cosmic'}
              </span>
              {theme === themeName && (
                <span className={styles.activeCheck}>✓</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.autoThemeToggle}>
          <label>
            <input
              type="checkbox"
              checked={autoTheme}
              onChange={toggleAutoTheme}
            />
            <span>Auto theme (follow system preference)</span>
          </label>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={styles.settingsSection}>
        <h3>🔔 Notifications</h3>
        
        <div className={styles.notificationCard}>
          <div className={styles.notificationInfo}>
            <h4>Browser Notifications</h4>
            <p>Get alerts for sunrise, sunset, and moon phases</p>
            {permission === 'denied' && (
              <p className={styles.permissionDenied}>
                ⚠️ Permission denied. Please enable in browser settings.
              </p>
            )}
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleNotificationToggle}
              disabled={permission === 'denied'}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        {notificationsEnabled && (
          <button onClick={sendTestNotification} className={styles.testButton}>
            🧪 Send Test Notification
          </button>
        )}
      </div>

      {/* Other Settings */}
      <div className={styles.settingsSection}>
        <h3>⚙️ Settings</h3>
        <div className={styles.settingsList}>
          <button className={styles.settingItem}>
            <span>ℹ️ About Lunar View</span>
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