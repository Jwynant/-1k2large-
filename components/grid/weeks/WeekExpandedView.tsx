import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, useWindowDimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useContentManagement } from '../../../app/hooks/useContentManagement';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import CellContentIndicator from '../CellContentIndicator';
import Animated, { FadeIn } from 'react-native-reanimated';

interface WeekExpandedViewProps {
  year: number;
  onClose: () => void;
  onWeekPress: (week: number) => void;
}

export default function WeekExpandedView({ year, onClose, onWeekPress }: WeekExpandedViewProps) {
  const { hasContent, getCellContent } = useContentManagement();
  const { isCurrentWeek, isWeekInPast, getBirthDate, getWeekNumber, getAgeForYear } = useDateCalculations();
  const { width, height } = useWindowDimensions();
  
  // Determine year state
  const currentYear = new Date().getFullYear();
  const isPastYear = year < currentYear;
  const isFutureYear = year > currentYear;
  
  // Get the correct age for this year based on birth date
  const age = getAgeForYear(year);
  
  // Calculate the date range for this birth-aligned year
  const dateRange = useMemo(() => {
    if (!getBirthDate()) return `${year}`;
    
    const birthDate = getBirthDate()!;
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
  }, [year, getBirthDate]);
  
  // Generate week data with proper indicators
  const weeks = useMemo(() => {
    const weeksData = [];
    const birthDate = getBirthDate();
    
    if (!birthDate) {
      // Fallback if no birth date is set
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
    } else {
      // Use birth date alignment
      const birthWeek = getWeekNumber(birthDate);
      const birthYear = birthDate.getFullYear();
      
      // Current date for comparison
      const today = new Date();
      const currentWeek = getWeekNumber(today);
      
      // Calculate total weeks lived
      const totalWeeksLived = (currentYear - birthYear) * 52 + (currentWeek - birthWeek + 1);
      
      // Calculate weeks from birth to the start of this cluster
      const weeksFromBirthToClusterStart = (year - birthYear) * 52;
      
      for (let i = 0; i < 52; i++) {
        // Calculate how many weeks from birth this cell represents
        const weeksFromBirth = weeksFromBirthToClusterStart + i;
        
        // A week is in the past if the user has lived it
        const isPast = weeksFromBirth >= 0 && weeksFromBirth < totalWeeksLived;
        
        // This is the current week if it's the last filled week
        const isCurrent = weeksFromBirth === totalWeeksLived - 1;
        
        // Calculate the actual week number for content lookup
        const actualWeek = (birthWeek + i) % 52;
        const yearOffset = Math.floor((birthWeek + i) / 52);
        const actualYear = year + yearOffset;
        
        // Check if this week has content
        const hasContentForWeek = hasContent(actualYear, undefined, actualWeek);
        const content = hasContentForWeek ? getCellContent(actualYear, undefined, actualWeek) : [];
        
        weeksData.push({
          index: i,
          weekNumber: i + 1,
          isCurrent,
          isPast,
          hasContent: hasContentForWeek,
          content,
          actualYear, // Store the actual year for reference
          actualWeek // Store the actual week for reference
        });
      }
    }
    
    return weeksData;
  }, [year, isCurrentWeek, isWeekInPast, hasContent, getCellContent, getBirthDate, getWeekNumber]);

  // Calculate optimal cell size to fit all cells in the container
  // Use 13 rows and 4 columns format (52 weeks)
  const cellsPerRow = 4;
  const rowCount = 13;
  const cellMargin = 2;
  const containerPadding = 14;
  const headerHeight = 80;
  const footerSpace = 110;
  const additionalPadding = 15;
  
  // Calculate available space
  const availableWidth = width - (containerPadding * 2) - additionalPadding;
  const availableHeight = height - headerHeight - footerSpace - (containerPadding * 2) - additionalPadding;
  
  // Calculate cell size based on available space
  const cellWidthFromWidth = (availableWidth / cellsPerRow) - (cellMargin * 2);
  const cellHeightFromHeight = (availableHeight / rowCount) - (cellMargin * 2);
  
  // Use the smaller dimension to ensure cells are square and fit within both width and height constraints
  // Adjusted size factor from 0.9 to 0.85 to make cells slightly smaller
  const cellSize = Math.min(cellWidthFromWidth, cellHeightFromHeight) * 0.85;

  const handleBackPress = () => {
    onClose();
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBuffer} />
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.yearTitle}>{dateRange}</Text>
              <Text style={styles.ageTitle}>
                {age !== null ? (
                  isPastYear ? `Age ${age}` : 
                  isFutureYear ? `In ${Math.abs(currentYear - year)} years` : 
                  'Current Year'
                ) : 'Before Birth'}
              </Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.gridContainer}>
              <View style={[
                styles.weeksGrid,
                { width: (cellSize + cellMargin * 2) * cellsPerRow, maxHeight: (cellSize + cellMargin * 2) * rowCount }
              ]}>
                {weeks.map((week) => {
                  // Determine cell style based on week state, not year state
                  let cellStyle;
                  
                  if (week.isPast) {
                    // Past weeks - white fill
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
                        <View style={styles.contentDot} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topBuffer: {
    height: 30,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(60, 60, 67, 0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  yearTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ageTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#AEAEB2',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 8,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 6,
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
  // Current cells: enhanced styling for better visibility
  currentCell: {
    backgroundColor: '#007AFF', // Bright blue fill instead of transparent
    borderWidth: 2,
    borderColor: '#4FC3F7', // Light blue border for glow effect
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  // Future cells: transparent with white border
  futureCell: {
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
  },
  contentDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF9500', // Orange dot
    opacity: 0.9,
  },
}); 