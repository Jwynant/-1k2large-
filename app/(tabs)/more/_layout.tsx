import { Stack } from 'expo-router';

export default function MoreLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'More',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: 'About',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: 'Help',
          headerShown: true,
        }}
      />
    </Stack>
  );
}