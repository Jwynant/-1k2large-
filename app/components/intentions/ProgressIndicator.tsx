import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';

type ProgressIndicatorProps = {
  progress: number; // 0-100
  color?: string;
  size?: 'small' | 'medium' | 'large';
  type?: 'linear' | 'radial';
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
};

type Dimensions = {
  size: number;
  strokeWidth: number;
} | {
  height: number;
};

/**
 * A reusable component that displays progress visually using either
 * a linear bar or radial circle indicator
 */
export default function ProgressIndicator({
  progress,
  color = '#0A84FF',
  size = 'medium',
  type = 'linear',
  showPercentage = true,
  label,
  animated = true,
}: ProgressIndicatorProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Get dimensions based on size
  const getDimensions = (): Dimensions => {
    switch (size) {
      case 'small':
        return type === 'radial' ? { size: 60, strokeWidth: 4 } : { height: 4 };
      case 'large':
        return type === 'radial' ? { size: 120, strokeWidth: 8 } : { height: 8 };
      case 'medium':
      default:
        return type === 'radial' ? { size: 80, strokeWidth: 6 } : { height: 6 };
    }
  };
  
  const dimensions = getDimensions();
  
  // Get color based on progress if no color specified
  const getProgressColor = () => {
    if (color) return color;
    
    if (progress >= 80) return '#4CD964'; // iOS green
    if (progress >= 50) return '#FFCC00'; // iOS yellow
    return '#FF3B30'; // iOS red
  };
  
  const progressColor = getProgressColor();
  
  // For linear progress bar
  if (type === 'linear') {
    const { height } = dimensions as { height: number };
    return (
      <View style={styles.container}>
        <View style={[styles.progressBarContainer, label && styles.withLabel]}>
          {label && (
            <Text style={[
              styles.label, 
              isDarkMode && styles.darkText,
              showPercentage && styles.labelWithPercentage
            ]}>
              {label}
            </Text>
          )}
          
          <View style={[
            styles.progressBarTrack, 
            { height }, 
            isDarkMode && styles.darkProgressBarTrack
          ]}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progress}%`, backgroundColor: progressColor }
              ]} 
            />
          </View>
          
          {showPercentage && (
            <Text style={[styles.percentageText, { color: progressColor }]}>
              {Math.round(progress)}%
            </Text>
          )}
        </View>
      </View>
    );
  }
  
  // For radial progress indicator
  const { size: circleSize, strokeWidth } = dimensions as { size: number, strokeWidth: number };
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);
  
  return (
    <View style={styles.radialContainer}>
      <Svg width={circleSize} height={circleSize}>
        {/* Background circle */}
        <Circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          stroke={isDarkMode ? '#333333' : '#E5E5EA'}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <Circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90, ${circleSize / 2}, ${circleSize / 2})`}
        />
      </Svg>
      
      {showPercentage && (
        <View style={styles.percentageContainer}>
          <Text style={[styles.percentageTextRadial, isDarkMode && styles.darkText]}>
            {Math.round(progress)}%
          </Text>
        </View>
      )}
      
      {label && (
        <Text style={[styles.radialLabel, isDarkMode && styles.darkSecondaryText]}>
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  withLabel: {
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: '#000000',
    marginRight: 10,
    flex: 1,
  },
  labelWithPercentage: {
    flex: 2,
  },
  progressBarTrack: {
    flex: 3,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 10,
  },
  darkProgressBarTrack: {
    backgroundColor: '#333333',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  // Radial styles
  radialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageTextRadial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  radialLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSecondaryText: {
    color: '#EBEBF5',
  },
}); 