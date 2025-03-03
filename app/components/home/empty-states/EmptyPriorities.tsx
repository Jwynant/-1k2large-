import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyPrioritiesProps {
  isDarkMode: boolean;
}

export const EmptyPriorities: React.FC<EmptyPrioritiesProps> = ({ isDarkMode }) => (
  <View style={styles.emptyPrioritiesContainer}>
    <View style={[styles.emptyStateIconContainer, isDarkMode && { backgroundColor: '#2C2C2E' }]}>
      <Ionicons name="compass" size={36} color={isDarkMode ? '#FF9F0A' : '#FF9500'} />
    </View>
    <Text style={[styles.emptyPrioritiesTitle, isDarkMode && styles.darkText]}>Define Your Focus Areas</Text>
    <Text style={[styles.emptyPrioritiesDescription, isDarkMode && styles.darkSecondaryText]}>
      What life domains need your attention right now? Set high-level focus areas to guide your daily decisions.
    </Text>
    <Pressable style={styles.emptyStateButton}>
      <Text style={styles.emptyStateButtonText}>Set Focus Areas</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  emptyPrioritiesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyPrioritiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyPrioritiesDescription: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSecondaryText: {
    color: '#EBEBF5',
  },
});

export default EmptyPriorities; 