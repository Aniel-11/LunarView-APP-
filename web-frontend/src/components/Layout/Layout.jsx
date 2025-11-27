import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Layout.module.css';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <img 
            src="https://customer-assets.emergentagent.com/job_solarlunarapp/artifacts/99c984g7_IMG_0233.jpg" 
            alt="Lunar View" 
            className={styles.logo}
          />
        </div>
        <div className={styles.navLinks}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            end
          >
            🏠 Home
          </NavLink>
          <NavLink 
            to="/favorites" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            ⭐ Favorites
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            👤 Profile
          </NavLink>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;