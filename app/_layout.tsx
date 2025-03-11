import { Stack } from 'expo-router';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { NetworkProvider } from './context/NetworkContext';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import ErrorBoundary from './components/shared/ErrorBoundary';
import NetworkStatus from './components/shared/NetworkStatus';
import { IconProvider } from './components/shared/IconProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  return (
    <ErrorBoundary>
      <AppProvider>
        <ThemeProvider>
          <NetworkProvider>
            <IconProvider>
              <ToastProvider>
                <StatusBar style={isDarkMode ? 'light' : 'dark'} />
                <Stack
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
                    },
                    headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
                    headerShadowVisible: false,
                    contentStyle: {
                      backgroundColor: isDarkMode ? '#121212' : '#F2F2F7',
                    },
                  }}
                >
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
                <NetworkStatus />
              </ToastProvider>
            </IconProvider>
          </NetworkProvider>
        </ThemeProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
