import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

interface GradientBorderProps {
  children: ReactNode;
  gradientType?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'blueTeal';
  width?: number;
  style?: ViewStyle;
  radius?: number;
  activeOpacity?: number;
}

/**
 * Helper function to ensure colors are in the correct format
 * LinearGradient expects a tuple of at least two strings
 */
function ensureColorsFormat(colors: string[]): readonly [string, string, ...string[]] {
  if (colors.length < 2) {
    // Ensure we have at least 2 colors, duplicating the first one if needed
    return [colors[0] || '#FFFFFF', colors[0] || '#FFFFFF'] as const;
  }
  return colors as unknown as readonly [string, string, ...string[]];
}

/**
 * A component that wraps its children with a gradient border
 */
export const GradientBorder: React.FC<GradientBorderProps> = ({
  children,
  gradientType = 'primary',
  width = 2,
  style,
  radius = 12,
  activeOpacity = 1,
}) => {
  const theme = useTheme();
  const gradient = theme.gradients[gradientType];
  
  return (
    <View
      style={[
        {
          position: 'relative',
          borderRadius: radius,
          padding: width, // This creates space for the gradient border
        },
        style,
      ]}
    >
      {/* Gradient border layer */}
      <LinearGradient
        colors={ensureColorsFormat(gradient.colors)}
        start={gradient.start}
        end={gradient.end}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: radius,
          opacity: activeOpacity,
        }}
      />
      
      {/* Content layer */}
      <View
        style={{
          borderRadius: radius - width,
          overflow: 'hidden',
          flex: 1,
          backgroundColor: theme.colors.background.primary,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default GradientBorder; 