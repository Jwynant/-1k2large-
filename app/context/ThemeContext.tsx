import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useAppContext } from './AppContext';
import { StorageService } from '../services/StorageService';

// Define theme colors
export const COLORS = {
  dark: {
    background: '#1C1C1E',
    card: '#2C2C2E',
    cardAlt: '#3A3A3C',
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    border: 'rgba(255, 255, 255, 0.1)',
    primary: '#0A84FF',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
  },
  light: {
    background: '#F2F2F7',
    card: '#FFFFFF',
    cardAlt: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: 'rgba(0, 0, 0, 0.1)',
    primary: '#007AFF',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
  },
};

// Define theme type
export type ThemeMode = 'dark' | 'light' | 'system';
export type ThemeColors = typeof COLORS.dark | typeof COLORS.light;

// Define theme context type
interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  colors: COLORS.dark,
  isDark: true,
  setTheme: () => {},
});

// Hook to use theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { state, dispatch } = useAppContext();
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>(state.theme || 'system');
  
  // Determine if dark mode is active
  const isDark = theme === 'system' 
    ? systemColorScheme === 'dark' 
    : theme === 'dark';
  
  // Get colors based on current theme
  const colors = isDark ? COLORS.dark : COLORS.light;
  
  // Set theme and persist to storage
  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    dispatch({ type: 'SET_THEME', payload: newTheme });
    await StorageService.saveTheme(newTheme);
  };
  
  // Initialize theme from app state
  useEffect(() => {
    if (state.theme) {
      setThemeState(state.theme);
    }
  }, [state.theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, colors, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 