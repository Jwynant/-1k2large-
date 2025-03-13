import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  Animated, 
  useWindowDimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '../../context/OnboardingContext';
import * as Haptics from 'expo-haptics';

// Improved explanation card component
function ExplanationCard({ text, visible }: { 
  text: string; 
  visible: boolean;
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
        styles.explanationCard, 
        { opacity: fadeAnim }
      ]}
    >
      <Ionicons name="information-circle" size={24} color="#007AFF" style={styles.explanationIcon} />
      <Text style={styles.explanationText}>{text}</Text>
    </Animated.View>
  );
}

// Month cell component
function MonthCell({ isPast, isCurrent }: { isPast?: boolean; isCurrent?: boolean }) {
  return (
    <View 
      style={[
        styles.monthCell,
        isPast && styles.pastCell,
        isCurrent && styles.currentCell,
      ]} 
    />
  );
}

// Month cluster component (represents a year)
function MonthCluster({ 
  year, 
  birthYear, 
  currentYear, 
  isActive
}: { 
  year: number; 
  birthYear: number;
  currentYear: number;
  isActive?: boolean;
}) {
  const isPastYear = year < currentYear;
  const isCurrentYear = year === currentYear;
  
  // Create a simplified visual representation of the months in a 3x4 grid
  const renderMonths = () => {
    const rows = [];
    
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const rowMonths = [];
      for (let colIndex = 0; colIndex < 3; colIndex++) {
        const month = rowIndex * 3 + colIndex;
        const isPast = isPastYear || (isCurrentYear && month <= new Date().getMonth());
        const isCurrent = isCurrentYear && month === new Date().getMonth();
        
        rowMonths.push(
          <MonthCell 
            key={month} 
            isPast={isPast}
            isCurrent={isCurrent}
          />
        );
      }
      rows.push(
        <View key={rowIndex} style={styles.monthRow}>
          {rowMonths}
        </View>
      );
    }
    
    return rows;
  };
  
  return (
    <View 
      style={[
        styles.monthCluster,
        isActive && styles.activeCluster
      ]}
    >
      <View style={styles.monthsContainer}>
        {renderMonths()}
      </View>
    </View>
  );
}

export default function GridTourView() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { state, setCurrentStep } = useOnboarding();
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentView, setCurrentView] = useState<'birth' | 'present' | 'future'>('birth');
  const [showExplanation, setShowExplanation] = useState(true);
  
  // Calculate years
  const birthYear = state.birthDate.getFullYear();
  const currentYear = new Date().getFullYear();
  const endYear = birthYear + state.lifeExpectancy;
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  // Generate all years from birth to life expectancy
  const years = useMemo(() => {
    return Array.from(
      { length: endYear - birthYear + 1 }, 
      (_, index) => birthYear + index
    );
  }, [birthYear, endYear]);
  
  // Group years into rows (5 per row)
  const yearRows = useMemo(() => {
    const rows = [];
    const YEARS_PER_ROW = 5;
    
    for (let i = 0; i < years.length; i += YEARS_PER_ROW) {
      rows.push(years.slice(i, i + YEARS_PER_ROW));
    }
    
    return rows;
  }, [years]);
  
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
      // Calculate row index for current year
      targetIndex = Math.floor((currentYear - birthYear) / 5);
    } else if (currentView === 'future') {
      // Calculate row index for end year
      targetIndex = Math.floor((endYear - birthYear) / 5) - 1;
    }
    
    // Calculate scroll position (each row is about 120px tall)
    const scrollPosition = targetIndex * 120;
    
    // Scroll with animation
    scrollViewRef.current.scrollTo({ y: scrollPosition, animated: true });
    
    // Show explanation after scrolling
    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  }, [currentView, birthYear, currentYear, endYear]);
  
  // Get explanation text based on current view
  const getExplanationText = () => {
    switch (currentView) {
      case 'birth':
        return "Each cell represents one month of your life. A cluster of 12 cells makes up one year.";
      case 'present':
        return "This is where you are now. White cells are your past, empty cells are your future.";
      case 'future':
        return `Based on a life expectancy of ${state.lifeExpectancy} years, you can see your entire life journey at a glance.`;
      default:
        return "";
    }
  };
  
  // Handle continue button press
  const handleContinue = () => {
    if (currentView === 'birth') {
      setShowExplanation(false);
      setCurrentView('present');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (currentView === 'present') {
      setShowExplanation(false);
      setCurrentView('future');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      // Move to next step (lifespan customization)
      setCurrentStep(3);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
        
        <ExplanationCard 
          text={getExplanationText()}
          visible={showExplanation}
        />
      </Animated.View>
      
      <View style={styles.gridContainer}>
        <View style={styles.ageLabelsContainer}>
          {yearRows.map((row, index) => (
            <Text key={index} style={styles.ageLabel}>
              {Math.floor(index * 5)}
            </Text>
          ))}
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {yearRows.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.yearRow}>
              {row.map((year) => (
                <MonthCluster 
                  key={year} 
                  year={year} 
                  birthYear={birthYear}
                  currentYear={currentYear}
                  isActive={
                    (currentView === 'birth' && year < birthYear + 3) ||
                    (currentView === 'present' && year === currentYear) ||
                    (currentView === 'future' && year > endYear - 3)
                  }
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
      
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable 
          style={styles.backButton}
          onPress={() => {
            if (currentView === 'present') {
              setShowExplanation(false);
              setCurrentView('birth');
            } else if (currentView === 'future') {
              setShowExplanation(false);
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
          <Ionicons 
            name="arrow-forward" 
            size={18} 
            color="#FFFFFF" 
            style={styles.continueButtonIcon} 
          />
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
    fontSize: 28,
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
  explanationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  explanationIcon: {
    marginRight: 12,
  },
  explanationText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  ageLabelsContainer: {
    width: 30,
    paddingTop: 10,
    alignItems: 'center',
  },
  ageLabel: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: '500',
    height: 120,
    textAlignVertical: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  yearRow: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  monthCluster: {
    width: 65,
    margin: 1,
    padding: 4,
    backgroundColor: 'rgba(30, 30, 30, 0.5)',
    borderRadius: 8,
  },
  activeCluster: {
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  monthsContainer: {
    width: '100%',
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  monthCell: {
    width: 16,
    height: 16,
    borderRadius: 2,
    margin: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'transparent',
  },
  pastCell: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  currentCell: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueButtonIcon: {
    marginLeft: 8,
  },
}); 