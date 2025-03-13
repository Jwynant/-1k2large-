import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function ContentLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_bottom',
        presentation: 'modal',
        headerStyle: {
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        },
        headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#F2F2F7',
        },
      }}
    />
  );
} 