import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppContext } from '../context/AppContext';

export default function TabLayout() {
  const systemColorScheme = useColorScheme();
  const { state } = useAppContext();
  
  // Use theme from context if available, otherwise default to dark mode
  // This can be toggled in settings
  const isDarkMode = state.theme === 'light' ? false : true;
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={90} tint={isDarkMode ? "dark" : "light"} style={{ height: '100%' }} />
          ) : (
            <View style={{ 
              height: '100%', 
              backgroundColor: isDarkMode ? '#121212' : '#ffffff' 
            }} />
          ),
        tabBarStyle: {
          ...(Platform.OS === 'web' && {
            height: 50,
            paddingBottom: 8,
          }),
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: '#000',
          borderTopColor: isDarkMode ? '#2C2C2E' : '#E5E5EA', // Appropriate border for theme
        },
        tabBarActiveTintColor: isDarkMode ? '#0A84FF' : '#007AFF', // iOS blue (dark/light)
        tabBarInactiveTintColor: isDarkMode ? '#8E8E93' : '#8E8E93', // iOS gray for both modes
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "today" : "today-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}