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
  const { isCurrentMonth, isMonthInPast, isCurrentYear, getBirthDate } = useDateCalculations();
  const { width } = useWindowDimensions();
  
  // Get birth date information
  const birthDate = getBirthDate();
  
  // Calculate age from the year
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const isCurrentYearSelected = isCurrentYear(year);
  const isPastYear = year < currentYear;
  const isFutureYear = year > currentYear;
  
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
            entering={FadeIn.delay(100).duration(300)}
          >
            <Text style={styles.yearTitle}>{year}</Text>
            <Text style={styles.ageTitle}>Age {age}</Text>
          </Animated.View>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.monthsGridContainer}>
          <View style={styles.monthsGrid}>
            {months.length > 0 ? (
              months.map((month, index) => {
                // Determine cell style based on year and month
                let cellStyle;
                let textStyle;
                
                if (isPastYear) {
                  // Past year - all cells have white fill with dark text
                  cellStyle = styles.pastCell;
                  textStyle = styles.pastCellText;
                } else if (isFutureYear) {
                  // Future year - all cells are transparent with white border and white text
                  cellStyle = styles.futureCell;
                  textStyle = styles.futureCellText;
                } else {
                  // Current year - mixed styles based on month
                  if (month.isPast) {
                    // Past months - white fill with dark text
                    cellStyle = styles.pastCell;
                    textStyle = styles.pastCellText;
                  } else if (month.isCurrent) {
                    // Current month - transparent with blue border and white text
                    cellStyle = styles.currentCell;
                    textStyle = styles.currentCellText;
                  } else {
                    // Future months - transparent with white border and white text
                    cellStyle = styles.futureCell;
                    textStyle = styles.futureCellText;
                  }
                }
                
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
                        <Text style={[textStyle, styles.monthText]}>
                          {month.name}
                        </Text>
                        
                        {month.hasContent && (
                          <Animated.View 
                            style={styles.contentIndicator}
                            entering={FadeIn.delay(300 + index * 30).duration(300)}
                          >
                            <CellContentIndicator 
                              content={month.content} 
                              size="medium" 
                            />
                          </Animated.View>
                        )}
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
  // 2. Present cells: no fill with blue border and white text
  currentCell: {
    backgroundColor: '#4A90E2', // Blue fill
  },
  currentCellText: {
    color: '#FFFFFF', // White text
    fontSize: 20,
    fontWeight: '600',
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
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  contentIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  noDataText: {
    padding: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
  },
}); 