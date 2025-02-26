import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import LoadingScreen from '../components/ui/LoadingScreen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

// Main app content with loading state
function AppContent() {
  const { state } = useAppContext();
  const router = useRouter();
  
  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  // Check if user needs onboarding
  useEffect(() => {
    if (!state.isLoading && !state.userBirthDate) {
      // Navigate to onboarding if no birth date is set
      router.replace('/onboarding');
    }
  }, [state.isLoading, state.userBirthDate, router]);

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

// Root layout with providers
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <AppContent />
        <StatusBar style="auto" />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
