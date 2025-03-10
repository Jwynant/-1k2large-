import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ContentType } from '../types';

export default function NewContentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  
  // Get the content type from params
  const contentType = (params.type === 'memory' || params.type === 'goal') 
    ? params.type as ContentType 
    : 'memory';
  
  // Redirect to the appropriate dedicated form
  useEffect(() => {
    console.log('Redirecting to dedicated form:', contentType);
    
    // Small timeout to ensure navigation works properly
    const timer = setTimeout(() => {
      if (contentType === 'memory') {
        router.replace('/content/memory');
      } else if (contentType === 'goal') {
        router.replace('/content/goal');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [contentType, router]);
  
  // Show loading indicator while redirecting
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0A84FF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 