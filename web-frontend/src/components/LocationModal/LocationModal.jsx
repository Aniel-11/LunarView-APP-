import React, { useState } from 'react';
import styles from './LocationModal.module.css';

function LocationModal({ isOpen, onClose, onLocationSelect }) {
  const [searchType, setSearchType] = useState('coordinates'); // 'coordinates' or 'city'
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (searchType === 'coordinates') {
        const lat = parseFloat(latitude);
        const long = parseFloat(longitude);

        if (isNaN(lat) || isNaN(long) || lat < -90 || lat > 90 || long < -180 || long > 180) {
          setError('Please enter valid coordinates');
          setLoading(false);
          return;
        }

        onLocationSelect({ latitude: lat, longitude: long, name: `${lat.toFixed(4)}, ${long.toFixed(4)}` });
      } else {
        // Search by city using Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`
        );
        const data = await response.json();

        if (data.length === 0) {
          setError('City not found. Please try another name.');
          setLoading(false);
          return;
        }

        const location = data[0];
        onLocationSelect({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          name: location.display_name.split(',')[0]
        });
      }

      handleClose();
    } catch (err) {
      setError('Failed to search location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLatitude('');
    setLongitude('');
    setCityName('');
    setError('');
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Select Location</h2>
          <button onClick={handleClose} className={styles.closeButton}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.tabContainer}>
            <button
              className={searchType === 'coordinates' ? styles.tabActive : styles.tab}
              onClick={() => setSearchType('coordinates')}
            >
              📍 Coordinates
            </button>
            <button
              className={searchType === 'city' ? styles.tabActive : styles.tab}
              onClick={() => setSearchType('city')}
            >
              🏙️ City Name
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {searchType === 'coordinates' ? (
              <>
                <div className={styles.inputGroup}>
                  <label>Latitude</label>
                  <input
                    type="text"
                    placeholder="e.g., 52.3676"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                  />
                  <small>Range: -90 to 90</small>
                </div>
                <div className={styles.inputGroup}>
                  <label>Longitude</label>
                  <input
                    type="text"
                    placeholder="e.g., 4.9041"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                  />
                  <small>Range: -180 to 180</small>
                </div>
              </>
            ) : (
              <div className={styles.inputGroup}>
                <label>City Name</label>
                <input
                  type="text"
                  placeholder="e.g., Amsterdam, Netherlands"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  required
                />
                <small>Enter city name or address</small>
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.modalFooter}>
              <button type="button" onClick={handleClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Searching...' : 'Select Location'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;
