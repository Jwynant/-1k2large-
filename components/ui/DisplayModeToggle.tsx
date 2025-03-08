import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DisplayMode } from '../../app/types';

type DisplayModeToggleProps = {
  currentMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
};

export default function DisplayModeToggle({ currentMode, onModeChange }: DisplayModeToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          currentMode === 'grid' && styles.activeToggleButton
        ]}
        onPress={() => onModeChange('grid')}
        accessibilityLabel="Grid view"
        accessibilityRole="button"
        accessibilityState={{ selected: currentMode === 'grid' }}
      >
        <Ionicons
          name="grid-outline"
          size={22}
          color={currentMode === 'grid' ? '#FFFFFF' : '#8E8E93'}
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.toggleButton,
          currentMode === 'timeline' && styles.activeToggleButton
        ]}
        onPress={() => onModeChange('timeline')}
        accessibilityLabel="Timeline view"
        accessibilityRole="button"
        accessibilityState={{ selected: currentMode === 'timeline' }}
      >
        <Ionicons
          name="time-outline"
          size={22}
          color={currentMode === 'timeline' ? '#FFFFFF' : '#8E8E93'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    width: 40,
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeToggleButton: {
    backgroundColor: '#0A84FF',
  },
}); 