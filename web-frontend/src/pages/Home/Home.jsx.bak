import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Home.module.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function Home() {
  const [loading, setLoading] = useState(true);
  const [astronomyData, setAstronomyData] = useState(null);
  const [locationName, setLocationName] = useState('Current Location');
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    requestLocationAndFetchData();
  }, []);

  const requestLocationAndFetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Request browser geolocation
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Fetch location name (reverse geocoding)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            if (data.address) {
              setLocationName(
                `${data.address.city || data.address.town || data.address.village || ''}, ${data.address.country || ''}`
              );
            }
          } catch (err) {
            console.error('Geocoding error:', err);
          }

          // Fetch astronomy data
          await fetchAstronomyData(latitude, longitude);
        },
        (err) => {
          setError('Unable to get your location. Please enable location permissions.');
          setLoading(false);
        }
      );
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchAstronomyData = async (lat, long) => {
    try {
      const response = await axios.get(`${API_URL}/api/astronomy`, {
        params: { lat, long },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAstronomyData(response.data);
    } catch (err) {
      setError('Failed to fetch astronomy data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <img 
          src="https://customer-assets.emergentagent.com/job_solarlunarapp/artifacts/99c984g7_IMG_0233.jpg" 
          alt="Lunar View" 
          className={styles.loadingLogo}
        />
        <div className={styles.loader}></div>
        <p>Fetching astronomical data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
        <button onClick={requestLocationAndFetchData} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.locationInfo}>
          <span className={styles.locationIcon}>📍</span>
          <h2>{locationName}</h2>
        </div>
        <button onClick={requestLocationAndFetchData} className={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>

      {astronomyData && (
        <>
          {/* Date and Time Card */}
          <div className={styles.dateCard}>
            <h3>{astronomyData.date}</h3>
            <p>{astronomyData.current_time}</p>
          </div>

          <div className={styles.cardsGrid}>
            {/* Sun Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>☀️</span>
                <h3>Sun</h3>
              </div>
              <div className={styles.cardDivider}></div>
              <div className={styles.dataList}>
                <div className={styles.dataRow}>
                  <span>Status</span>
                  <span>{astronomyData.sun_status}</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Sunrise</span>
                  <span>{astronomyData.sunrise}</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Sunset</span>
                  <span>{astronomyData.sunset}</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Solar Noon</span>
                  <span>{astronomyData.solar_noon}</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Day Length</span>
                  <span>{astronomyData.day_length}</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Altitude</span>
                  <span>{astronomyData.sun_altitude.toFixed(2)}°</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Azimuth</span>
                  <span>{astronomyData.sun_azimuth.toFixed(2)}°</span>
                </div>
              </div>
            </div>

            {/* Moon Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>🌙</span>
                <h3>Moon</h3>
              </div>
              <div className={styles.cardDivider}></div>
              <div className={styles.dataList}>
                <div className={styles.dataRow}>
                  <span>Status</span>
                  <span>{astronomyData.moon_status}</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Moonrise</span>
                  <span>{astronomyData.moonrise}</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Moonset</span>
                  <span>{astronomyData.moonset}</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Altitude</span>
                  <span>{astronomyData.moon_altitude.toFixed(2)}°</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Azimuth</span>
                  <span>{astronomyData.moon_azimuth.toFixed(2)}°</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Distance</span>
                  <span>{astronomyData.moon_distance.toFixed(0)} km</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
