import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface AstronomyData {
  location: {
    latitude: number;
    longitude: number;
  };
  date: string;
  current_time: string;
  sunrise: string;
  sunset: string;
  sun_status: string;
  solar_noon: string;
  day_length: string;
  sun_altitude: number;
  sun_azimuth: number;
  moonrise: string;
  moonset: string;
  moon_status: string;
  moon_altitude: number;
  moon_azimuth: number;
  moon_distance: number;
  moon_parallactic_angle: number;
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [astronomyData, setAstronomyData] = useState<AstronomyData | null>(null);
  const [locationName, setLocationName] = useState('Current Location');
  const { token } = useAuth();

  useEffect(() => {
    requestLocationAndFetchData();
  }, []);

  const requestLocationAndFetchData = async () => {
    setLoading(true);
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location permissions to use this app.');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get location name
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address && address.length > 0) {
        const place = address[0];
        setLocationName(
          `${place.city || place.district || ''}, ${place.region || ''}`
        );
      }

      // Fetch astronomy data
      await fetchAstronomyData(latitude, longitude);
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Failed to get location or astronomy data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAstronomyData = async (lat: number, long: number) => {
    try {
      const response = await axios.get(`${API_URL}/api/astronomy`, {
        params: { lat, long },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAstronomyData(response.data);
    } catch (error: any) {
      console.error('Astronomy data error:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch astronomy data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await requestLocationAndFetchData();
    setRefreshing(false);
  };

  if (loading && !astronomyData) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <Image
          source={{ uri: 'https://customer-assets.emergentagent.com/job_solarlunarapp/artifacts/9co39lbx_image0.jpeg' }}
          style={styles.loadingLogo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#6B7AFF" style={styles.loader} />
        <Text style={styles.loadingText}>Fetching astronomical data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>LUNAR VIEW</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#A5B4FF" />
            <Text style={styles.locationText}>{locationName}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={requestLocationAndFetchData} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#6B7AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6B7AFF"
          />
        }
      >
        {astronomyData && (
          <View style={styles.content}>
            {/* Date and Time */}
            <View style={styles.dateCard}>
              <Text style={styles.dateText}>{astronomyData.date}</Text>
              <Text style={styles.timeText}>{astronomyData.current_time}</Text>
            </View>

            {/* Sun Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="sunny" size={32} color="#FFA500" />
                <Text style={styles.cardTitle}>Sun</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Status</Text>
                <Text style={styles.dataValue}>{astronomyData.sun_status}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Sunrise</Text>
                <Text style={styles.dataValue}>{astronomyData.sunrise}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Sunset</Text>
                <Text style={styles.dataValue}>{astronomyData.sunset}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Solar Noon</Text>
                <Text style={styles.dataValue}>{astronomyData.solar_noon}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Day Length</Text>
                <Text style={styles.dataValue}>{astronomyData.day_length}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Altitude</Text>
                <Text style={styles.dataValue}>{astronomyData.sun_altitude.toFixed(2)}°</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Azimuth</Text>
                <Text style={styles.dataValue}>{astronomyData.sun_azimuth.toFixed(2)}°</Text>
              </View>
            </View>

            {/* Moon Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="moon" size={32} color="#D8E0FF" />
                <Text style={styles.cardTitle}>Moon</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Status</Text>
                <Text style={styles.dataValue}>{astronomyData.moon_status}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Moonrise</Text>
                <Text style={styles.dataValue}>{astronomyData.moonrise}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Moonset</Text>
                <Text style={styles.dataValue}>{astronomyData.moonset}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Altitude</Text>
                <Text style={styles.dataValue}>{astronomyData.moon_altitude.toFixed(2)}°</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Azimuth</Text>
                <Text style={styles.dataValue}>{astronomyData.moon_azimuth.toFixed(2)}°</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Distance</Text>
                <Text style={styles.dataValue}>{astronomyData.moon_distance.toFixed(0)} km</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2550',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a2550',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingLogo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  loader: {
    marginVertical: 16,
  },
  loadingText: {
    color: '#A5B4FF',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#2a3a6b',
    borderBottomWidth: 1,
    borderBottomColor: '#3d4f7d',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7AFF',
    letterSpacing: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    color: '#A5B4FF',
    fontSize: 14,
    marginLeft: 4,
  },
  refreshButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  dateCard: {
    backgroundColor: '#2a3a6b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3d4f7d',
  },
  dateText: {
    color: '#6B7AFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timeText: {
    color: '#A5B4FF',
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#2a3a6b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3d4f7d',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#3d4f7d',
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dataLabel: {
    color: '#A5B4FF',
    fontSize: 16,
  },
  dataValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
