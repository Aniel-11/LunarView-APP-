import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import LocationModal from '../../components/LocationModal/LocationModal';
import styles from './Home.module.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function Home() {
  const [loading, setLoading] = useState(true);
  const [astronomyData, setAstronomyData] = useState(null);
  const [locationName, setLocationName] = useState('Current Location');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const { token } = useAuth();
  const { sendAstronomyNotification } = useNotifications();

  useEffect(() => {
    requestLocationAndFetchData();
  }, []);

  const requestLocationAndFetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });

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

          await fetchAstronomyData(latitude, longitude);
        },
        (err) => {
          setError('Unable to get your location. Please enable location permissions or select manually.');
          setLoading(false);
        }
      );
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleManualLocation = (location) => {
    setCurrentLocation({ latitude: location.latitude, longitude: location.longitude });
    setLocationName(location.name);
    fetchAstronomyData(location.latitude, location.longitude);
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
      
      // Send notification for sunset/sunrise
      if (response.data.sun_status) {
        sendAstronomyNotification(
          'Astronomy Update',
          `Sun Status: ${response.data.sun_status} | Sunrise: ${response.data.sunrise} | Sunset: ${response.data.sunset}`
        );
      }
    } catch (err) {
      setError('Failed to fetch astronomy data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!currentLocation || !locationName) {
      alert('No location to save');
      return;
    }

    setSaving(true);
    try {
      await axios.post(
        `${API_URL}/api/favorites`,
        {
          location_name: locationName,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Location saved to favorites!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save location');
    } finally {
      setSaving(false);
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
        <div className={styles.errorButtons}>
          <button onClick={requestLocationAndFetchData} className={styles.retryButton}>
            📍 Try GPS Again
          </button>
          <button onClick={() => setShowLocationModal(true)} className={styles.manualButton}>
            🗺️ Select Manually
          </button>
        </div>
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
        <div className={styles.headerButtons}>
          <button onClick={() => setShowLocationModal(true)} className={styles.selectButton}>
            🗺️ Select Location
          </button>
          <button onClick={handleSaveLocation} className={styles.saveButton} disabled={saving}>
            {saving ? '⏳ Saving...' : '⭐ Save Location'}
          </button>
          <button onClick={requestLocationAndFetchData} className={styles.refreshButton}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {astronomyData && (
        <>
          <div className={styles.dateCard}>
            <h3>{astronomyData.date}</h3>
            <p>{astronomyData.current_time}</p>
          </div>

          <div className={styles.cardsGrid}>
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

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleManualLocation}
      />
    </div>
  );
}

export default Home;
