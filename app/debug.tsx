import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from './context/AppContext';

// The storage key used in OnboardingContext
const ONBOARDING_STORAGE_KEY = 'onboarding_state';

export default function DebugScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { dispatch } = useAppContext();

  const resetOnboarding = async () => {
    try {
      // Clear onboarding state
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
      
      // Reset birth date in app context - use empty string instead of null
      dispatch({ type: 'SET_USER_BIRTH_DATE', payload: '' });
      
      Alert.alert(
        'Onboarding Reset',
        'Onboarding state has been reset. The app will now redirect to the onboarding flow.',
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/onboarding')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset onboarding state.');
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text style={styles.title}>Debug Menu</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Onboarding</Text>
        <Pressable 
          style={styles.button}
          onPress={resetOnboarding}
        >
          <Text style={styles.buttonText}>Reset Onboarding</Text>
        </Pressable>
      </View>
      
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Back to App</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    marginTop: 'auto',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
}); 