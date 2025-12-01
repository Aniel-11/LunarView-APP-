import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './ResetPassword.module.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validatie
    if (!email || !newPassword || !confirmPassword) {
      setError('Vul alle velden in');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    if (newPassword.length < 6) {
      setError('Wachtwoord moet minimaal 6 karakters zijn');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        email,
        new_password: newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Wachtwoord reset mislukt. Controleer je e-mailadres.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <span className={styles.successIcon}>✅</span>
          <h2>Wachtwoord Gereset!</h2>
          <p>Je wordt doorgestuurd naar de login pagina...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img 
            src="https://customer-assets.emergentagent.com/job_solarlunarapp/artifacts/99c984g7_IMG_0233.jpg" 
            alt="Lunar View" 
            className={styles.logo}
          />
          <h1>Wachtwoord Herstellen</h1>
          <p>Voer je e-mailadres en nieuw wachtwoord in</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mailadres</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="je@email.com"
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">Nieuw Wachtwoord</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimaal 6 karakters"
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Bevestig Wachtwoord</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Herhaal je wachtwoord"
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? '⏳ Bezig...' : '🔐 Wachtwoord Herstellen'}
          </button>

          <div className={styles.links}>
            <Link to="/login" className={styles.link}>
              ← Terug naar Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
