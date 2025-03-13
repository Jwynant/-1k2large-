import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const insets = useSafeAreaInsets();
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.8);
  const textOpacity = new Animated.Value(0);
  const indicatorOpacity = new Animated.Value(0);

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]),
      
      // Fade in text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      
      // Fade in indicator
      Animated.timing(indicatorOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance after 3 seconds
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#121212', '#1E1E1E']}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.logoContainer, 
            { 
              opacity: logoOpacity,
              transform: [{ scale: logoScale }]
            }
          ]}
        >
          <View style={styles.gridLogo}>
            {Array.from({ length: 16 }, (_, i) => (
              <View 
                key={i} 
                style={[
                  styles.gridCell,
                  i % 4 === Math.floor(i / 4) && styles.highlightedCell
                ]} 
              />
            ))}
          </View>
        </Animated.View>
        
        <Animated.View style={{ opacity: textOpacity }}>
          <Text style={styles.title}>1000 Months</Text>
          <Text style={styles.subtitle}>Visualize your life journey</Text>
        </Animated.View>
      </View>
      
      <Animated.View style={[styles.indicator, { opacity: indicatorOpacity }]}>
        <Ionicons name="chevron-up" size={24} color="rgba(255,255,255,0.6)" />
        <Text style={styles.indicatorText}>Swipe to begin</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  gridLogo: {
    width: 160,
    height: 160,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCell: {
    width: 36,
    height: 36,
    margin: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  highlightedCell: {
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  indicatorText: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
    fontSize: 14,
  },
}); 