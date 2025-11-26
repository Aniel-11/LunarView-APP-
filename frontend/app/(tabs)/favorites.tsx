import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Favorite {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  saved_at: string;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
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
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      Alert.alert('Error', 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const deleteFavorite = async (id: string) => {
    Alert.alert(
      'Delete Favorite',
      'Are you sure you want to remove this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/api/favorites/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setFavorites(favorites.filter((fav) => fav.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete favorite');
            }
          },
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: Favorite }) => (
    <View style={styles.favoriteCard}>
      <View style={styles.favoriteContent}>
        <Ionicons name="location" size={24} color="#6B7AFF" />
        <View style={styles.favoriteInfo}>
          <Text style={styles.favoriteName}>{item.location_name}</Text>
          <Text style={styles.favoriteCoords}>
            {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => deleteFavorite(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#6B7AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite Locations</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="star-outline" size={64} color="#2a3a6b" />
          <Text style={styles.emptyText}>No favorite locations yet</Text>
          <Text style={styles.emptySubtext}>
            Save locations from the home screen to view them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#151b3f',
    borderBottomWidth: 1,
    borderBottomColor: '#2a3a6b',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7AFF',
    letterSpacing: 1,
  },
  listContent: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: '#151b3f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#2a3a6b',
  },
  favoriteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  favoriteInfo: {
    marginLeft: 12,
    flex: 1,
  },
  favoriteName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  favoriteCoords: {
    color: '#9CA3FF',
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#9CA3FF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#6B7AFF',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
