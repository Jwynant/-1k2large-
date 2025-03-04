// Export everything from the theme
export * from './colors';
export * from './gradients';
export * from './spacing';
export * from './typography';
export * from './borders';
export * from './ThemeContext';

// Default export for Expo Router
import { useTheme } from './ThemeContext';
export default useTheme; 