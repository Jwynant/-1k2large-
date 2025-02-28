import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, useWindowDimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useContentManagement } from '../../../app/hooks/useContentManagement';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import CellContentIndicator from '../CellContentIndicator';

interface WeekExpandedViewProps {
  year: number;
  onClose: () => void;
  onWeekPress: (week: number) => void;
}

export default function WeekExpandedView({ year, onClose, onWeekPress }: WeekExpandedViewProps) {
  const { hasContent, getCellContent } = useContentManagement();
  const { isCurrentWeek, isWeekInPast, isInCurrentYear } = useDateCalculations();
  const { width } = useWindowDimensions();
  
  // Calculate age from the year
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const isCurrentYearSelected = year === currentYear;
  const isPastYear = year < currentYear;
  const isFutureYear = year > currentYear;
  
  // Generate week data with proper indicators
  const weeks = useMemo(() => {
    const weeksData = [];
    
    for (let i = 0; i < 52; i++) {
      const isCurrent = isCurrentWeek(year, i);
      const isPast = isWeekInPast(year, i);
      const hasContentForWeek = hasContent(year, undefined, i);
      const content = hasContentForWeek ? getCellContent(year, undefined, i) : [];
      
      weeksData.push({
        index: i,
        weekNumber: i + 1,
        isCurrent,
        isPast,
        hasContent: hasContentForWeek,
        content
      });
    }
    
    return weeksData;
  }, [year, isCurrentWeek, isWeekInPast, hasContent, getCellContent]);

  // Calculate cell size based on width with fixed columns
  const cellsPerRow = 4;
  const cellMargin = 4;
  const containerPadding = 16;
  const availableWidth = width - (containerPadding * 2);
  const cellSize = (availableWidth / cellsPerRow) - (cellMargin * 2);

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
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.weeksGridContainer}>
          <View style={styles.weeksGrid}>
            {weeks.map((week) => {
              // Determine cell style based on year and week
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
                // Current year - mixed styles based on week
                if (week.isPast) {
                  // Past weeks - white fill with dark text
                  cellStyle = styles.pastCell;
                  textStyle = styles.pastCellText;
                } else if (week.isCurrent) {
                  // Current week - transparent with blue border and white text
                  cellStyle = styles.currentCell;
                  textStyle = styles.currentCellText;
                } else {
                  // Future weeks - transparent with white border and white text
                  cellStyle = styles.futureCell;
                  textStyle = styles.futureCellText;
                }
              }
              
              return (
                <View key={week.index} style={styles.cellContainer}>
                  <TouchableOpacity
                    style={[
                      styles.weekCell,
                      { width: cellSize, height: cellSize },
                      cellStyle
                    ]}
                    onPress={() => onWeekPress(week.index)}
                  >
                    <Text style={textStyle}>
                      {week.weekNumber}
                    </Text>
                    
                    {week.hasContent && (
                      <View style={styles.contentIndicatorContainer}>
                        <CellContentIndicator 
                          content={week.content} 
                          size="tiny" 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: 10,
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
  scrollContent: {
    flexGrow: 1,
  },
  weeksGridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  weeksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  cellContainer: {
    width: '25%', // Force 4 columns
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  weekCell: {
    borderRadius: 6, // Smaller border radius for smaller cells
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
    fontSize: 13, // Smaller font size for smaller cells
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
    fontSize: 14, 
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
    fontSize: 14,
    fontWeight: '600',
  },
  contentIndicatorContainer: {
    position: 'absolute',
    bottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  }
}); 