import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../../app/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// We're using the global mock for react-native from jest.setup.js

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock the AppContext
jest.mock('../../app/context/AppContext', () => {
  const mockDispatch = jest.fn();
  return {
    useAppContext: jest.fn(() => ({
      state: { theme: 'dark' },
      dispatch: mockDispatch,
    })),
  };
});

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides theme values', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    // The default theme is 'dark' because of our AppContext mock
    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(result.current.colors).toBeDefined();
  });

  it('calls AsyncStorage.setItem when setTheme is called', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });
    
    await act(async () => {
      result.current.setTheme('light');
    });

    // The key includes the app name prefix
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@1000Months:theme', 'light');
  });
}); 