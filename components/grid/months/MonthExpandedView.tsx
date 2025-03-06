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
  const { isCurrentMonth, isMonthInPast, isCurrentYear } = useDateCalculations();
  const { width } = useWindowDimensions();
  
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
    
    return monthsData;
  }, [year, isCurrentMonth, isMonthInPast, hasContent, getCellContent]);

  // Handle month press with animation
  const handleMonthPress = (month: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
            {months.map((month, index) => {
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
                <View key={month.index} style={styles.cellWrapper}>
                  <Animated.View
                    entering={FadeIn.delay(100 + index * 30).duration(300)}
                    style={styles.animatedCell}
                  >
                    <TouchableOpacity
                      style={[styles.monthCell, cellStyle]}
                      onPress={() => handleMonthPress(month.index)}
                      activeOpacity={0.7}
                    >
                      <Text style={[textStyle, styles.monthText]}>
                        {month.name}
                      </Text>
                      
                      {month.hasContent && (
                        <Animated.View 
                          entering={FadeIn.delay(300 + index * 20).duration(300)}
                          style={styles.contentIndicatorContainer}
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
            })}
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
    backgroundColor: '#FFFFFF', // White fill
  },
  pastCellText: {
    color: '#000000', // Dark text
    fontSize: 20,
    fontWeight: '600',
  },
  // 2. Present cells: no fill with blue border and white text
  currentCell: {
    backgroundColor: 'transparent', // No fill
    borderWidth: 2,
    borderColor: '#0A84FF', // Blue border
  },
  currentCellText: {
    color: '#FFFFFF', // White text
    fontSize: 20,
    fontWeight: '600',
  },
  // 3. Future cells: no fill with white border and white text
  futureCell: {
    backgroundColor: 'transparent', // No fill
    borderWidth: 2,
    borderColor: '#FFFFFF', // White border
  },
  futureCellText: {
    color: '#FFFFFF', // White text
    fontSize: 20,
    fontWeight: '600',
  },
  contentIndicatorContainer: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 