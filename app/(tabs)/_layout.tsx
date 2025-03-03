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
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Life Grid',
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color }) => <Ionicons name="time" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Ionicons name="ellipsis-horizontal" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}