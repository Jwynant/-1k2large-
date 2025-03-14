import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationBadgeProps {
  enabled: boolean;
  type?: 'goal' | 'lesson' | 'reflection';
  size?: 'small' | 'medium' | 'large';
}

export default function NotificationBadge({
  enabled,
  type = 'goal',
  size = 'medium'
}: NotificationBadgeProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Define icon and color based on notification type
  let icon: keyof typeof Ionicons.glyphMap = 'notifications';
  let color = '#5856D6'; // Default purple
  
  switch (type) {
    case 'goal':
      icon = 'flag';
      color = '#FF9500'; // Orange
      break;
    case 'lesson':
      icon = 'book';
      color = '#FF2D55'; // Pink
      break;
    case 'reflection':
      icon = 'camera';
      color = '#32D74B'; // Green
      break;
  }
  
  // Define size based on prop
  let iconSize = 16;
  let badgeSize = 24;
  
  switch (size) {
    case 'small':
      iconSize = 12;
      badgeSize = 20;
      break;
    case 'large':
      iconSize = 20;
      badgeSize = 32;
      break;
  }
  
  // Create the outline icon name
  const outlineIcon = `${icon}-outline` as keyof typeof Ionicons.glyphMap;
  
  return (
    <View style={[
      styles.container,
      { 
        width: badgeSize, 
        height: badgeSize,
        backgroundColor: enabled ? color : isDarkMode ? '#3A3A3C' : '#E5E5EA',
        opacity: enabled ? 1 : 0.6
      }
    ]}>
      <Ionicons 
        name={enabled ? icon : outlineIcon}
        size={iconSize}
        color="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 