import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  Easing, 
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useContentManagement } from '../../../app/hooks/useContentManagement';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import CellContentIndicator from '../CellContentIndicator';

interface MonthExpandedViewProps {
  year: number;
  onClose: () => void;
  onMonthPress: (month: number) => void;
}

export default function MonthExpandedView({ year, onClose, onMonthPress }: MonthExpandedViewProps) {
  const { hasContent, getCellContent } = useContentManagement();
  const { isCurrentMonth, isMonthInPast, isCurrentYear, getBirthDate, getAgeForYear } = useDateCalculations();
  const { width } = useWindowDimensions();
  
  // Get birth date information
  const birthDate = getBirthDate();
  
  // Calculate age from the year
  const currentYear = new Date().getFullYear();
  
  // Get the correct age for this year based on birth date
  const age = getAgeForYear(year);
  
  const isCurrentYearSelected = isCurrentYear(year);
  const isPastYear = year < currentYear;
  const isFutureYear = year > currentYear;
  
  // Calculate the date range for this birth-aligned year
  const dateRange = useMemo(() => {
    if (!birthDate) return `${year}`;
    
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();
    
    // Format the start and end dates of this birth-aligned year
    const startDate = new Date(year, birthMonth, birthDay);
    const endDate = new Date(year + 1, birthMonth, birthDay - 1);
    
    // Format dates as MMM YYYY
    const formatDate = (date: Date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }, [year, birthDate]);
  
  // Generate month data with proper indicators
  const months = useMemo(() => {
    const monthsData = [];
    
    // Month names
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    if (!birthDate) {
      // If no birth date, use calendar months
      for (let i = 0; i < 12; i++) {
        const isCurrent = isCurrentMonth(year, i);
        const isPast = isMonthInPast(year, i);
        const hasContentForMonth = hasContent(year, i);
        const content = hasContentForMonth ? getCellContent(year, i) : [];
        
        monthsData.push({
          index: i,
          name: monthNames[i],
          isCurrent,
          isPast,
          hasContent: hasContentForMonth,
          content
        });
      }
    } else {
      // If birth date exists, start with birth month
      const birthMonth = birthDate.getMonth();
      const birthYear = birthDate.getFullYear();
      const today = new Date();
      const currentMonth = today.getMonth();
      
      // Calculate total months lived
      const totalMonthsLived = (currentYear - birthYear) * 12 + (currentMonth - birthMonth + 1);
      
      // Calculate months from birth to the start of this cluster
      const monthsFromBirthToClusterStart = (year - birthYear) * 12;
      
      for (let i = 0; i < 12; i++) {
        // Calculate the actual calendar month this represents
        const actualMonth = (birthMonth + i) % 12;
        const actualYear = year + Math.floor((birthMonth + i) / 12);
        
        // Calculate how many months from birth this cell represents
        const monthsFromBirth = monthsFromBirthToClusterStart + i;
        
        // A month is in the past if the user has lived it
        const isPast = monthsFromBirth >= 0 && monthsFromBirth < totalMonthsLived;
        
        // This is the current month if it's the last filled month
        const isCurrent = monthsFromBirth === totalMonthsLived - 1;
        
        // Check if this month has content
        const hasContentForMonth = hasContent(actualYear, actualMonth);
        const content = hasContentForMonth ? getCellContent(actualYear, actualMonth) : [];
        
        monthsData.push({
          index: actualMonth,
          name: monthNames[actualMonth],
          isCurrent,
          isPast,
          hasContent: hasContentForMonth,
          content,
          actualYear // Store the actual year for content lookup
        });
      }
    }
    
    console.log('Generated months data:', monthsData);
    return monthsData;
  }, [year, isCurrentMonth, isMonthInPast, hasContent, getCellContent, birthDate, currentYear]);

  // Handle month press with animation
  const handleMonthPress = (month: number, actualYear?: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // If we have an actual year (for birth alignment), use that
    // Otherwise use the cluster year
    onMonthPress(month);
  };

  // Handle back button press
  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300).springify()}
      exiting={FadeOut.duration(200)}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Animated.View 
            style={styles.titleContainer}
            entering={FadeIn.delay(50).duration(300)}
          >
            <Text style={styles.yearTitle}>{dateRange}</Text>
            <Text style={styles.ageTitle}>
              {age !== null ? (
                isPastYear ? `Age ${age}` : 
                isFutureYear ? `In ${Math.abs(currentYear - year)} years` : 
                'Current Year'
              ) : 'Before Birth'}
            </Text>
          </Animated.View>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.monthsGridContainer}>
          <View style={styles.monthsGrid}>
            {months.length > 0 ? (
              months.map((month, index) => {
                // Determine cell style based on month state, not year state
                let cellStyle;
                let textStyle;
                
                if (month.isPast) {
                  // Past months - white fill with dark text
                  cellStyle = styles.pastCell;
                  textStyle = styles.pastCellText;
                } else if (month.isCurrent) {
                  // Current month - blue fill with white text
                  cellStyle = styles.currentCell;
                  textStyle = styles.currentCellText;
                } else {
                  // Future months - transparent with white border and white text
                  cellStyle = styles.futureCell;
                  textStyle = styles.futureCellText;
                }
                
                // Check if this is the first month of a new calendar year (January)
                const isYearBoundary = month.index === 0 && index > 0;
                
                // Get the actual year for display
                const displayYear = month.actualYear || year;
                
                return (
                  <View key={`month-${index}`} style={styles.cellWrapper}>
                    <Animated.View
                      entering={FadeIn.delay(100 + index * 30).duration(300)}
                      style={styles.animatedCell}
                    >
                      <TouchableOpacity
                        style={[styles.monthCell, cellStyle]}
                        onPress={() => handleMonthPress(month.index, month.actualYear)}
                        activeOpacity={0.7}
                      >
                        {month.hasContent && (
                          <View style={styles.contentDot} />
                        )}
                        
                        <View style={styles.monthLabelContainer}>
                          <Text style={[textStyle, styles.monthText]}>
                            {month.name}
                          </Text>
                          <Text style={[textStyle, styles.yearText]}>
                            '{displayYear.toString().slice(-2)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noDataText}>No month data available</Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E', // iOS system gray 6
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    alignItems: 'center',
  },
  yearTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF', // White text
  },
  ageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93', // iOS system gray
    marginTop: 2,
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  monthsGridContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  cellWrapper: {
    width: '33.33%', // Exactly 3 columns
    aspectRatio: 1,
    padding: 6,
  },
  animatedCell: {
    flex: 1,
  },
  monthCell: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  // 1. Past cells: white fill with dark text
  pastCell: {
    backgroundColor: '#FFF5EA', // Light cream fill
  },
  pastCellText: {
    color: '#000000', // Dark text
    fontSize: 20,
    fontWeight: '600',
  },
  // 2. Present cells: enhanced styling for better visibility
  currentCell: {
    backgroundColor: '#007AFF', // Brighter blue fill
    borderWidth: 2,
    borderColor: '#4FC3F7', // Light blue border for glow effect
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 6, // For Android
  },
  currentCellText: {
    color: '#FFFFFF', // White text
    fontSize: 22, // Larger font size
    fontWeight: '700', // Bolder text
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // 3. Future cells: no fill with white border and white text
  futureCell: {
    backgroundColor: 'transparent', // No fill
    borderWidth: 1,
    borderColor: '#333333', // Dark border
  },
  futureCellText: {
    color: '#FFFFFF', // White text
    fontSize: 20,
    fontWeight: '600',
  },
  monthLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  yearText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: -2,
    opacity: 0.8, // Slightly transparent to be less prominent than the month
  },
  contentDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9500', // Orange dot
    opacity: 0.9,
  },
  noDataText: {
    padding: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
  },
}); 