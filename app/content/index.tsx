import { Redirect } from 'expo-router';

// Redirect to the tabs screen if someone navigates to /content directly
export default function ContentIndex() {
  return <Redirect href="/(tabs)" />;
} 