import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

// Screen size breakpoints
export const BREAKPOINTS = {
  SMALL: 375,
  MEDIUM: 768,
  LARGE: 1024,
};

// Screen size types
export type ScreenSize = 'small' | 'medium' | 'large';

// Spacing scale based on screen size
export const SPACING = {
  small: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
  },
  medium: {
    xs: 6,
    s: 12,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  large: {
    xs: 8,
    s: 16,
    m: 24,
    l: 32,
    xl: 48,
    xxl: 64,
  },
};

// Font sizes based on screen size
export const FONT_SIZES = {
  small: {
    xs: 10,
    s: 12,
    m: 14,
    l: 16,
    xl: 20,
    xxl: 24,
  },
  medium: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 24,
    xxl: 30,
  },
  large: {
    xs: 14,
    s: 16,
    m: 18,
    l: 20,
    xl: 28,
    xxl: 36,
  },
};

/**
 * Hook for responsive layouts
 * Returns screen dimensions, screen size category, and responsive spacing and font sizes
 */
export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  
  // Determine screen size category
  const screenSize = useMemo((): ScreenSize => {
    if (width < BREAKPOINTS.SMALL) return 'small';
    if (width < BREAKPOINTS.MEDIUM) return 'medium';
    return 'large';
  }, [width]);
  
  // Get spacing scale for current screen size
  const spacing = useMemo(() => SPACING[screenSize], [screenSize]);
  
  // Get font sizes for current screen size
  const fontSizes = useMemo(() => FONT_SIZES[screenSize], [screenSize]);
  
  // Calculate if device is in landscape orientation
  const isLandscape = useMemo(() => width > height, [width, height]);
  
  // Calculate safe horizontal padding based on screen width
  const horizontalPadding = useMemo(() => {
    if (width < BREAKPOINTS.SMALL) return 16;
    if (width < BREAKPOINTS.MEDIUM) return 24;
    return 32;
  }, [width]);
  
  // Calculate column layout based on screen width
  const columns = useMemo(() => {
    if (width < BREAKPOINTS.SMALL) return 1;
    if (width < BREAKPOINTS.MEDIUM) return isLandscape ? 2 : 1;
    return isLandscape ? 3 : 2;
  }, [width, isLandscape]);
  
  return {
    width,
    height,
    screenSize,
    spacing,
    fontSizes,
    isLandscape,
    horizontalPadding,
    columns,
  };
}

export default useResponsiveLayout; 