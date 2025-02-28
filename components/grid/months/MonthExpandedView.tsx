import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const { isCurrentMonth, isMonthInPast, isInCurrentYear } = useDateCalculations();
  const { width } = useWindowDimensions();
  
  // Calculate age from the year
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const isCurrentYearSelected = year === currentYear;
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

  // Calculate cell size - changed to 3 per row for 50% bigger cells
  const cellsPerRow = 3;
  const cellMargin = 10;
  const horizontalPadding = 20 * 2;
  const availableWidth = width - horizontalPadding;
  const cellSize = (availableWidth - (cellMargin * 2 * (cellsPerRow - 1))) / cellsPerRow;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.yearTitle}>{year}</Text>
          <Text style={styles.ageTitle}>Age {age}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.monthsGridContainer}>
        <View style={styles.monthsGrid}>
          {months.map((month) => {
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
              <TouchableOpacity
                key={month.index}
                style={[
                  styles.monthCell,
                  { width: cellSize, height: cellSize, margin: cellMargin },
                  cellStyle
                ]}
                onPress={() => onMonthPress(month.index)}
              >
                <Text style={textStyle}>
                  {month.name}
                </Text>
                
                {month.hasContent && (
                  <View style={styles.contentIndicatorContainer}>
                    <CellContentIndicator 
                      content={month.content} 
                      size="medium" // Increased from small to medium for larger cells
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '95%',
    maxWidth: 450,
  },
  monthCell: {
    borderRadius: 12, // Slightly larger border radius for bigger cells
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
    fontSize: 20, // Larger font for bigger cells
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
    fontSize: 20, // Larger font for bigger cells
    fontWeight: '600',
  },
  // 3. Future cells: no fill with white border and white text
  futureCell: {
    backgroundColor: 'transparent', // No fill
    borderWidth: 1,
    borderColor: '#FFFFFF', // White border
  },
  futureCellText: {
    color: '#FFFFFF', // White text
    fontSize: 20, // Larger font for bigger cells
    fontWeight: '600',
  },
  contentIndicatorContainer: {
    position: 'absolute',
    bottom: 10, // More bottom padding for larger cells
    alignItems: 'center',
    justifyContent: 'center',
  }
}); 