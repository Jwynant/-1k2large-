import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Animated,
  useWindowDimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '../../context/OnboardingContext';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Grid visualization component
function LifeGrid({ lifeExpectancy }: { lifeExpectancy: number }) {
  const { width } = useWindowDimensions();
  const { state } = useOnboarding();
  
  // Calculate years
  const birthYear = state.birthDate.getFullYear();
  const currentYear = new Date().getFullYear();
  const totalYears = lifeExpectancy;
  
  // Calculate grid dimensions
  const cellSize = Math.max(6, Math.min(10, width / 25));
  const cellsPerRow = Math.floor(width / (cellSize + 4));
  
  // Generate years based on birth year and life expectancy
  const years = useMemo(() => {
    return Array.from(
      { length: totalYears }, 
      (_, index) => birthYear + index
    );
  }, [birthYear, totalYears]);
  
  // Group years into rows (5 per row)
  const yearRows = useMemo(() => {
    const rows = [];
    const YEARS_PER_ROW = 5;
    
    for (let i = 0; i < years.length; i += YEARS_PER_ROW) {
      rows.push(years.slice(i, i + YEARS_PER_ROW));
    }
    
    return rows;
  }, [years]);
  
  return (
    <View style={styles.gridContainer}>
      <View style={styles.grid}>
        {yearRows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.yearRow}>
            {row.map((year) => {
              const isPastYear = year < currentYear;
              const isCurrentYear = year === currentYear;
              
              // Create a small cluster for each year
              return (
                <View 
                  key={year} 
                  style={[
                    styles.yearCluster,
                    isCurrentYear && styles.currentYearCluster
                  ]}
                >
                  {/* Create a simplified representation of months */}
                  <View style={styles.monthsContainer}>
                    {Array.from({ length: 12 }, (_, monthIndex) => {
                      const isPast = isPastYear || (isCurrentYear && monthIndex <= new Date().getMonth());
                      const isCurrent = isCurrentYear && monthIndex === new Date().getMonth();
                      
                      return (
                        <View 
                          key={monthIndex} 
                          style={[
                            styles.gridCell,
                            isPast && styles.pastCell,
                            isCurrent && styles.currentCell
                          ]} 
                        />
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

export default function LifespanCustomizationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, setLifeExpectancy, completeOnboarding, setCurrentStep } = useOnboarding();
  
  const [lifespan, setLifespan] = useState(state.lifeExpectancy);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  // Animate in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Handle slider change
  const handleLifespanChange = (value: number) => {
    setLifespan(Math.round(value));
  };
  
  // Handle slider complete
  const handleSlidingComplete = (value: number) => {
    const roundedValue = Math.round(value);
    setLifespan(roundedValue);
    setLifeExpectancy(roundedValue);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Handle complete button press
  const handleComplete = () => {
    // Save lifespan to context
    setLifeExpectancy(lifespan);
    
    // Complete onboarding
    completeOnboarding();
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Navigate to main app
    router.replace('/');
  };

  // Handle back button press
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Go back to grid explanation screen
    setCurrentStep(2);
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.title}>Customize Your Life Expectancy</Text>
        <Text style={styles.subtitle}>
          By default, we've set your life expectancy to 83 years (approximately 1000 months).
          You can adjust this based on your personal goals and expectations.
        </Text>
        
        <View style={styles.lifespanContainer}>
          <View style={styles.lifespanValueContainer}>
            <Text style={styles.lifespanValue}>{lifespan}</Text>
            <Text style={styles.lifespanUnit}>years</Text>
          </View>
          
          <Text style={styles.monthsText}>
            ({lifespan * 12} months)
          </Text>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>70</Text>
            <Slider
              style={styles.slider}
              minimumValue={70}
              maximumValue={120}
              step={1}
              value={lifespan}
              onValueChange={handleLifespanChange}
              onSlidingComplete={handleSlidingComplete}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="rgba(255,255,255,0.2)"
              thumbTintColor="#007AFF"
            />
            <Text style={styles.sliderLabel}>120</Text>
          </View>
        </View>
        
        <View style={styles.gridSection}>
          <Text style={styles.gridTitle}>Your Life in Months</Text>
          <LifeGrid lifeExpectancy={lifespan} />
        </View>
        
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={20} color="rgba(255,255,255,0.7)" />
          <Text style={styles.infoText}>
            You can always change this setting later in your profile.
          </Text>
        </View>
      </Animated.View>
      
      <View style={styles.footer}>
        <Pressable 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        
        <Pressable 
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  lifespanContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  lifespanValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  lifespanValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  lifespanUnit: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    marginLeft: 8,
  },
  monthsText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    width: 30,
    textAlign: 'center',
  },
  gridSection: {
    marginTop: 20,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  gridContainer: {
    alignItems: 'center',
    maxHeight: 200,
    overflow: 'hidden',
  },
  grid: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  yearRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  yearCluster: {
    width: 40,
    height: 40,
    margin: 2,
    padding: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
  },
  currentYearCluster: {
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  monthsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridCell: {
    width: 6,
    height: 6,
    margin: 1,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  pastCell: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  currentCell: {
    backgroundColor: '#007AFF',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 