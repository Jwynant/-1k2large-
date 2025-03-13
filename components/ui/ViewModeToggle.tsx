import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { ViewMode } from '../../app/types';
import { useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';

type ViewModeToggleProps = {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
};

export default function ViewModeToggle({ currentMode, onModeChange }: ViewModeToggleProps) {
  // Create animated value for position
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Update animation when mode changes
  useEffect(() => {
    let toValue = 0;
    if (currentMode === 'months') {
      toValue = 1;
    } else if (currentMode === 'years') {
      toValue = 2;
    }
    
    Animated.spring(slideAnim, {
      toValue,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [currentMode, slideAnim]);
  
  // Calculate the position of the highlight ellipse
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 90, 180] // Adjust these values based on your toggle width
  });
  
  // Handle mode change with haptic feedback
  const handleModeChange = (mode: ViewMode) => {
    if (mode !== currentMode) {
      // Provide haptic feedback when changing modes
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onModeChange(mode);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        {/* Animated highlight ellipse */}
        <Animated.View 
          style={[
            styles.highlightEllipse,
            { transform: [{ translateX }] }
          ]} 
        />
        
        {/* Toggle buttons */}
        <Pressable 
          style={[styles.toggleButton, styles.leftButton]}
          onPress={() => handleModeChange('weeks')}
        >
          <Text 
            style={[
              styles.toggleText, 
              currentMode === 'weeks' && styles.activeText
            ]}
          >
            Weeks
          </Text>
        </Pressable>
        
        <Pressable 
          style={[styles.toggleButton, styles.middleButton]}
          onPress={() => handleModeChange('months')}
        >
          <Text 
            style={[
              styles.toggleText, 
              currentMode === 'months' && styles.activeText
            ]}
          >
            Months
          </Text>
        </Pressable>
        
        <Pressable 
          style={[styles.toggleButton, styles.rightButton]}
          onPress={() => handleModeChange('years')}
        >
          <Text 
            style={[
              styles.toggleText, 
              currentMode === 'years' && styles.activeText
            ]}
          >
            Years
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E', // iOS system gray 6
    borderRadius: 25,
    width: 280,
    height: 40,
    justifyContent: 'space-between',
    position: 'relative', // For absolute positioning of the highlight
  },
  highlightEllipse: {
    position: 'absolute',
    width: 90, // Adjust width to fit a single toggle option
    height: 36,
    backgroundColor: '#0A84FF', // iOS blue
    borderRadius: 20,
    top: 2,
    left: 2,
    zIndex: 1,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    zIndex: 2, // Ensure buttons are above the highlight
  },
  leftButton: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  middleButton: {
    // No need for margin since we're using absolute positioning for the highlight
  },
  rightButton: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
}); 