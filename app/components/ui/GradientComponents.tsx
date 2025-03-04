import React from 'react';
import { ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

// Type for gradient component props
type GradientProps = {
  style?: ViewStyle;
  children?: React.ReactNode;
};

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
 * Hook that provides gradient components for different purposes
 * @returns Object with gradient components
 */
export function useGradientContainer() {
  const theme = useTheme();
  
  return {
    PrimaryGradient: ({ style, children }: GradientProps) => {
      return (
        <LinearGradient
          colors={ensureColorsFormat(theme.gradients.primary.colors)}
          start={theme.gradients.primary.start}
          end={theme.gradients.primary.end}
          style={style}
        >
          {children}
        </LinearGradient>
      );
    },
    
    SuccessGradient: ({ style, children }: GradientProps) => {
      return (
        <LinearGradient
          colors={ensureColorsFormat(theme.gradients.success.colors)}
          start={theme.gradients.success.start}
          end={theme.gradients.success.end}
          style={style}
        >
          {children}
        </LinearGradient>
      );
    },
    
    ErrorGradient: ({ style, children }: GradientProps) => {
      return (
        <LinearGradient
          colors={ensureColorsFormat(theme.gradients.error.colors)}
          start={theme.gradients.error.start}
          end={theme.gradients.error.end}
          style={style}
        >
          {children}
        </LinearGradient>
      );
    },
    
    WarningGradient: ({ style, children }: GradientProps) => {
      return (
        <LinearGradient
          colors={ensureColorsFormat(theme.gradients.warning.colors)}
          start={theme.gradients.warning.start}
          end={theme.gradients.warning.end}
          style={style}
        >
          {children}
        </LinearGradient>
      );
    },
    
    InfoGradient: ({ style, children }: GradientProps) => {
      return (
        <LinearGradient
          colors={ensureColorsFormat(theme.gradients.info.colors)}
          start={theme.gradients.info.start}
          end={theme.gradients.info.end}
          style={style}
        >
          {children}
        </LinearGradient>
      );
    }
  };
}

// Default export for Expo Router
export default function GradientComponents() {
  return useGradientContainer();
} 