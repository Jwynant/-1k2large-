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
  const { isCurrentWeek, isWeekInPast, isCurrentYear } = useDateCalculations();
  const { width, height } = useWindowDimensions();
  
  // Determine year state
  const currentYear = new Date().getFullYear();
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

  // Calculate optimal cell size to fit all cells in the container
  // Use 13 rows and 4 columns format (52 weeks)
  const cellsPerRow = 4;
  const rowCount = 13;
  const cellMargin = 2;
  const containerPadding = 16;
  const headerHeight = 80;
  const footerSpace = 120;
  const additionalPadding = 20;
  
  // Calculate available space
  const availableWidth = width - (containerPadding * 2) - additionalPadding;
  const availableHeight = height - headerHeight - footerSpace - (containerPadding * 2) - additionalPadding;
  
  // Calculate cell size based on available space
  const cellWidthFromWidth = (availableWidth / cellsPerRow) - (cellMargin * 3);
  const cellHeightFromHeight = (availableHeight / rowCount) - (cellMargin * 3);
  
  // Use the smaller dimension to ensure cells are square and fit within both width and height constraints
  // Add a size reduction factor to ensure everything fits
  const cellSize = Math.min(cellWidthFromWidth, cellHeightFromHeight) * 0.8;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.yearLabelContainer}>
          <Text style={styles.yearLabel}>{year}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.gridContainer}>
        <View style={[
          styles.weeksGrid,
          { width: (cellSize + cellMargin * 2) * cellsPerRow, maxHeight: (cellSize + cellMargin * 2) * rowCount }
        ]}>
          {weeks.map((week) => {
            // Determine cell style based on year and week
            let cellStyle;
            
            if (isPastYear || week.isPast) {
              // Past years or past weeks - white fill
              cellStyle = styles.pastCell;
            } else if (week.isCurrent) {
              // Current week - blue border
              cellStyle = styles.currentCell;
            } else {
              // Future weeks - white border
              cellStyle = styles.futureCell;
            }
            
            return (
              <TouchableOpacity
                key={week.index}
                style={[
                  styles.weekCell,
                  { width: cellSize, height: cellSize, margin: cellMargin },
                  cellStyle
                ]}
                onPress={() => onWeekPress(week.index)}
              >
                {week.hasContent && (
                  <View style={styles.contentIndicatorContainer}>
                    <CellContentIndicator 
                      content={week.content} 
                      size="small" 
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
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
  },
  yearLabelContainer: {
    alignItems: 'flex-start',
  },
  yearLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  weeksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekCell: {
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  // Past cells: white fill
  pastCell: {
    backgroundColor: '#FFFFFF',
  },
  // Current cells: transparent with blue border
  currentCell: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#0A84FF',
  },
  // Future cells: transparent with white border
  futureCell: {
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
  },
  contentIndicatorContainer: {
    position: 'absolute',
    bottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  }
}); 