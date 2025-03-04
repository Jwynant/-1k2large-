import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme, Theme } from '../theme';

// Type for styles
type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Hook for creating theme-aware styles
 * @param styleCreator Function that creates styles using theme values
 * @returns StyleSheet with theme values applied
 */
export function useStyles<T extends NamedStyles<T>>(
  styleCreator: (theme: Theme) => T
): T {
  const theme = useTheme();
  return StyleSheet.create(styleCreator(theme));
}

/**
 * Helper to create a border with gradient
 * @returns Function to create gradient border styles
 */
export function useGradientBorder() {
  const theme = useTheme();
  
  return {
    /**
     * Creates styles for a gradient border
     * @param width Border width
     * @param radius Border radius
     * @param type Gradient type
     * @returns View style object with border properties
     */
    createBorderStyle: (
      width = theme.borders.width.normal,
      radius = theme.borders.radius.md,
      type: keyof typeof theme.gradients = 'primary'
    ): ViewStyle => ({
      borderWidth: width,
      borderRadius: radius,
      borderColor: theme.gradients[type].colors[0],
      // Note: For actual gradient borders, we'd need to implement a custom component
      // This is just a simplified version using the first color of the gradient
    })
  };
}

export default useStyles; 