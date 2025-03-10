import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  Animated, 
  Dimensions,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '../../context/OnboardingContext';
import * as Haptics from 'expo-haptics';

// Tooltip component for explanations
function Tooltip({ text, position, visible, onClose }: { 
  text: string; 
  position: { top: number; left: number }; 
  visible: boolean;
  onClose: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <Animated.View 
      style={[
        styles.tooltip, 
        position,
        { opacity: fadeAnim }
      ]}
    >
      <Text style={styles.tooltipText}>{text}</Text>
      <Pressable style={styles.tooltipCloseButton} onPress={onClose}>
        <Ionicons name="close-circle" size={24} color="rgba(255,255,255,0.8)" />
      </Pressable>
    </Animated.View>
  );
}

// Grid cell component
function GridCell({ isActive, isPast, isCurrent }: { 
  isActive?: boolean; 
  isPast?: boolean;
  isCurrent?: boolean;
}) {
  return (
    <View 
      style={[
        styles.gridCell,
        isPast && styles.pastCell,
        isCurrent && styles.currentCell,
        isActive && styles.activeCell,
      ]} 
    />
  );
}

// Grid cluster component (represents a year)
function GridCluster({ 
  year, 
  birthYear, 
  currentYear, 
  isActive,
  onPress
}: { 
  year: number; 
  birthYear: number;
  currentYear: number;
  isActive?: boolean;
  onPress?: () => void;
}) {
  const isPastYear = year < currentYear;
  const isCurrentYear = year === currentYear;
  
  return (
    <Pressable 
      style={[
        styles.gridCluster,
        isActive && styles.activeCluster
      ]}
      onPress={onPress}
    >
      <Text style={styles.yearLabel}>{year}</Text>
      <View style={styles.monthsContainer}>
        {Array.from({ length: 12 }, (_, monthIndex) => (
          <GridCell 
            key={monthIndex} 
            isPast={isPastYear || (isCurrentYear && monthIndex <= new Date().getMonth())}
            isCurrent={isCurrentYear && monthIndex === new Date().getMonth()}
          />
        ))}
      </View>
    </Pressable>
  );
}

export default function GridExplanationScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { state, setCurrentStep } = useOnboarding();
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentView, setCurrentView] = useState<'birth' | 'present' | 'future'>('birth');
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Calculate years
  const birthYear = state.birthDate.getFullYear();
  const currentYear = new Date().getFullYear();
  const endYear = birthYear + state.lifeExpectancy;
  
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
  
  // Handle view transitions
  useEffect(() => {
    if (!scrollViewRef.current) return;
    
    let targetIndex = 0;
    
    if (currentView === 'present') {
      targetIndex = currentYear - birthYear;
    } else if (currentView === 'future') {
      targetIndex = endYear - birthYear - 3; // Show a few years before the end
    }
    
    // Calculate scroll position (each cluster is about 180px tall plus margin)
    const scrollPosition = targetIndex * 200;
    
    // Scroll with animation
    scrollViewRef.current.scrollTo({ y: scrollPosition, animated: true });
    
    // Show tooltip after scrolling
    setTimeout(() => {
      setShowTooltip(true);
    }, 1000);
  }, [currentView]);
  
  // Get tooltip text based on current view
  const getTooltipText = () => {
    switch (currentView) {
      case 'birth':
        return "Each cell represents one month of your life. A cluster of 12 cells makes up one year.";
      case 'present':
        return "This is where you are now. Past months are filled, future months are empty.";
      case 'future':
        return "By default, we've set your life expectancy to 83 years (approximately 1000 months).";
      default:
        return "";
    }
  };
  
  // Get tooltip position based on current view
  const getTooltipPosition = () => {
    switch (currentView) {
      case 'birth':
        return { top: height * 0.3, left: width * 0.1 };
      case 'present':
        return { top: height * 0.4, left: width * 0.1 };
      case 'future':
        return { top: height * 0.3, left: width * 0.1 };
      default:
        return { top: 0, left: 0 };
    }
  };
  
  // Handle continue button press
  const handleContinue = () => {
    if (currentView === 'birth') {
      setShowTooltip(false);
      setCurrentView('present');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (currentView === 'present') {
      setShowTooltip(false);
      setCurrentView('future');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      // Move to next step (lifespan customization)
      setCurrentStep(3);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Animated.View 
        style={[
          styles.header,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.title}>
          {currentView === 'birth' 
            ? `Welcome to your life grid, ${state.userName}` 
            : currentView === 'present'
              ? "Here's where you are now"
              : "Looking ahead to your future"}
        </Text>
        <Text style={styles.subtitle}>
          {currentView === 'birth' 
            ? "This is a visualization of your entire life in months" 
            : currentView === 'present'
              ? `You've lived ${(currentYear - birthYear)} years so far`
              : "Plan for a long and fulfilling life"}
        </Text>
      </Animated.View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: endYear - birthYear + 1 }, (_, index) => {
          const year = birthYear + index;
          return (
            <GridCluster 
              key={year}
              year={year}
              birthYear={birthYear}
              currentYear={currentYear}
              isActive={
                (currentView === 'birth' && index < 3) ||
                (currentView === 'present' && year === currentYear) ||
                (currentView === 'future' && year >= endYear - 3)
              }
            />
          );
        })}
      </ScrollView>
      
      <Tooltip 
        text={getTooltipText()}
        position={getTooltipPosition()}
        visible={showTooltip}
        onClose={() => setShowTooltip(false)}
      />
      
      <View style={styles.footer}>
        <Pressable 
          style={styles.backButton}
          onPress={() => {
            if (currentView === 'present') {
              setShowTooltip(false);
              setCurrentView('birth');
            } else if (currentView === 'future') {
              setShowTooltip(false);
              setCurrentView('present');
            } else {
              setCurrentStep(1);
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        
        <Pressable 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            {currentView === 'future' ? 'Continue' : 'Next'}
          </Text>
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
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  gridCluster: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeCluster: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  yearLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  monthsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCell: {
    width: 24,
    height: 24,
    margin: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pastCell: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  currentCell: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  activeCell: {
    borderColor: '#007AFF',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    padding: 16,
    maxWidth: 250,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  tooltipCloseButton: {
    position: 'absolute',
    top: -10,
    right: -10,
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
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 