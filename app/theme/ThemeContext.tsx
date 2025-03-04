import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { getColors } from './colors';
import { gradients } from './gradients';
import { typography } from './typography';
import { spacing } from './spacing';
import { borders } from './borders';

// Define theme type
export type Theme = {
  colors: ReturnType<typeof getColors>;
  gradients: typeof gradients;
  typography: typeof typography;
  spacing: typeof spacing;
  borders: typeof borders;
  isDark: boolean;
};

// Create context
const ThemeContext = createContext<Theme | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { state } = useAppContext();
  const deviceColorScheme = useColorScheme();
  
  // Determine if dark mode based on app settings and device
  const isDark = useMemo(() => {
    if (state.theme === 'system') {
      return deviceColorScheme === 'dark';
    }
    return state.theme === 'dark';
  }, [state.theme, deviceColorScheme]);
  
  // Build the theme object
  const theme = useMemo<Theme>(() => ({
    colors: getColors(isDark),
    gradients,
    typography,
    spacing,
    borders,
    isDark,
  }), [isDark]);
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider; 