import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyMemoriesProps {
  isDarkMode: boolean;
}

export const EmptyMemories: React.FC<EmptyMemoriesProps> = ({ isDarkMode }) => (
  <View style={styles.emptyStateContainer}>
    <View style={[styles.emptyStateIconContainer, isDarkMode && { backgroundColor: '#2C2C2E' }]}>
      <Ionicons name="images" size={40} color={isDarkMode ? '#30D158' : '#34C759'} />
    </View>
    <Text style={[styles.emptyStateTitle, isDarkMode && styles.darkText]}>No Memories Yet</Text>
    <Text style={[styles.emptyStateDescription, isDarkMode && styles.darkSecondaryText]}>
      Capture and revisit meaningful moments from your life journey.
    </Text>
    <Pressable style={styles.emptyStateButton}>
      <Text style={styles.emptyStateButtonText}>Record a Memory</Text>
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

export default EmptyMemories; 