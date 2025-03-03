import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyLessonsProps {
  isDarkMode: boolean;
}

export const EmptyLessons: React.FC<EmptyLessonsProps> = ({ isDarkMode }) => (
  <View style={styles.emptyStateContainer}>
    <View style={[styles.emptyStateIconContainer, isDarkMode && { backgroundColor: '#2C2C2E' }]}>
      <Ionicons name="sparkles" size={40} color={isDarkMode ? '#BF5AF2' : '#AF52DE'} />
    </View>
    <Text style={[styles.emptyStateTitle, isDarkMode && styles.darkText]}>No Lessons Yet</Text>
    <Text style={[styles.emptyStateDescription, isDarkMode && styles.darkSecondaryText]}>
      Document insights and lessons learned throughout your experiences.
    </Text>
    <Pressable style={styles.emptyStateButton}>
      <Text style={styles.emptyStateButtonText}>Capture Your First Insight</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
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
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
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

export default EmptyLessons; 