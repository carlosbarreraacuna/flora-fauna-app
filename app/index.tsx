import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Flora & Fauna</ThemedText>
        <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />
        <ThemedText style={styles.subtitle}>Cargando...</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32',
  },
  loader: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
});