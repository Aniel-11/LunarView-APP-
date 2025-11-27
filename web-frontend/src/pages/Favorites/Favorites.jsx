import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Favorites.module.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFavorite = async (id) => {
    if (!window.confirm('Are you sure you want to remove this location?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/favorites/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(favorites.filter((fav) => fav.id !== id));
    } catch (error) {
      alert('Failed to delete favorite');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>⭐ Favorite Locations</h1>

      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>⭐</span>
          <h3>No favorite locations yet</h3>
          <p>Save locations from the home screen to view them here</p>
        </div>
      ) : (
        <div className={styles.favoritesList}>
          {favorites.map((favorite) => (
            <div key={favorite.id} className={styles.favoriteCard}>
              <div className={styles.favoriteInfo}>
                <span className={styles.locationIcon}>📍</span>
                <div>
                  <h3>{favorite.location_name}</h3>
                  <p>
                    {favorite.latitude.toFixed(4)}, {favorite.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteFavorite(favorite.id)}
                className={styles.deleteButton}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;