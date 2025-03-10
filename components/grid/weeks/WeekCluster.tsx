import React, { memo, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { MotiView } from 'moti';
import WeekCell from './WeekCell';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';

export type WeekClusterProps = {
  year: number;
  isCurrent: boolean;
  onPress: (position: { x: number, y: number, width: number, height: number }) => void;
  onCellPress: (week: number) => void;
  onLongPress: (week: number, position: { x: number, y: number }) => void;
  hasContent: (year: number, month?: number, week?: number) => boolean;
  getBirthDate: () => Date | null;
};

function WeekCluster({ 
  year, 
  isCurrent, 
  onPress,
  onCellPress, 
  onLongPress,
  hasContent,
  getBirthDate
}: WeekClusterProps) {
  const { isWeekInPast, getWeekNumber } = useDateCalculations();
  const clusterRef = useRef<View>(null);

  const handleWeekPress = useCallback((week: number) => {
    onCellPress(week);
  }, [onCellPress]);

  const handlePress = useCallback(() => {
    if (clusterRef.current) {
      clusterRef.current.measure((x, y, width, height, pageX, pageY) => {
        onPress({
          x: pageX,
          y: pageY,
          width,
          height
        });
      });
    }
  }, [onPress]);

  const handleLongPress = useCallback((event: any) => {
    const position = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    };
    // Use first week as default when long-pressing the cluster
    onLongPress(0, position);
  }, [onLongPress]);

  // Render simplified grid view
  const simplifiedGridLayout = useMemo(() => {
    // Create a simplified visual representation of the weeks
    const rows = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentWeek = getWeekNumber(today);
    
    // Get birth date for alignment
    const birthDate = getBirthDate();
    
    // Track if this cluster contains the current week
    let clusterContainsCurrentWeek = false;
    
    if (!birthDate) {
      // Fallback if no birth date is set
      for (let rowIndex = 0; rowIndex < 13; rowIndex++) {
        const rowWeeks = [];
        for (let colIndex = 0; colIndex < 4; colIndex++) {
          const week = rowIndex * 4 + colIndex + 1; // Start from week 1 instead of 0
          // Skip if week is greater than 52
          if (week > 52) continue;
          
          const isPast = isWeekInPast(year, week);
          const hasContentForWeek = hasContent(year, undefined, week);
          const isCurrent = year === currentYear && week === currentWeek;
          
          // Track if this cluster contains the current week
          if (isCurrent) {
            clusterContainsCurrentWeek = true;
          }
          
          rowWeeks.push(
            <View 
              key={week} 
              style={[
                styles.simplifiedCell,
                isPast ? styles.simplifiedCellFilled : styles.simplifiedCellEmpty,
                hasContentForWeek && styles.simplifiedCellWithContent,
                isCurrent && styles.simplifiedCellCurrent
              ]} 
            />
          );
        }
        rows.push(
          <View key={rowIndex} style={styles.simplifiedRow}>
            {rowWeeks}
          </View>
        );
      }
    } else {
      // Use birth date alignment
      const birthWeek = getWeekNumber(birthDate);
      const birthYear = birthDate.getFullYear();
      
      // Calculate total weeks lived
      const totalWeeksLived = (currentYear - birthYear) * 52 + (currentWeek - birthWeek + 1);
      
      // Calculate weeks from birth to the start of this cluster
      const weeksFromBirthToClusterStart = (year - birthYear) * 52;
      
      for (let rowIndex = 0; rowIndex < 13; rowIndex++) {
        const rowWeeks = [];
        for (let colIndex = 0; colIndex < 4; colIndex++) {
          const positionInCluster = rowIndex * 4 + colIndex;
          // Skip if position is greater than 51 (weeks are 0-51)
          if (positionInCluster > 51) continue;
          
          // Calculate how many weeks from birth this cell represents
          const weeksFromBirth = weeksFromBirthToClusterStart + positionInCluster;
          
          // A week is in the past if the user has lived it
          const isPast = weeksFromBirth >= 0 && weeksFromBirth < totalWeeksLived;
          
          // This is the current week if it's the last filled week
          const isCurrent = weeksFromBirth === totalWeeksLived - 1;
          
          // Track if this cluster contains the current week
          if (isCurrent) {
            clusterContainsCurrentWeek = true;
          }
          
          // Calculate the actual week number for content lookup
          // This is complex because we need to map from birth-aligned weeks to calendar weeks
          const actualWeek = (birthWeek + positionInCluster) % 52;
          const yearOffset = Math.floor((birthWeek + positionInCluster) / 52);
          const actualYear = year + yearOffset;
          
          // Check if this week has content
          const hasContentForWeek = hasContent(actualYear, undefined, actualWeek);
          
          rowWeeks.push(
            <View 
              key={positionInCluster} 
              style={[
                styles.simplifiedCell,
                isPast ? styles.simplifiedCellFilled : styles.simplifiedCellEmpty,
                hasContentForWeek && styles.simplifiedCellWithContent,
                isCurrent && styles.simplifiedCellCurrent
              ]} 
            />
          );
        }
        rows.push(
          <View key={rowIndex} style={styles.simplifiedRow}>
            {rowWeeks}
          </View>
        );
      }
    }
    
    // Store whether this cluster contains the current week
    // We'll use this to determine if we should show the blue border
    (WeekCluster as any).clusterContainsCurrentWeek = clusterContainsCurrentWeek;
    
    return (
      <View style={styles.simplifiedGrid}>
        {rows}
      </View>
    );
  }, [year, isWeekInPast, hasContent, getWeekNumber, getBirthDate]);

  return (
    <Pressable 
      style={styles.container}
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <MotiView 
        ref={clusterRef}
        style={[
          styles.cluster,
          // Show the blue border if this cluster contains the current week
          // This ensures the blue border is around the actual present cluster
          (WeekCluster as any).clusterContainsCurrentWeek && styles.currentCluster
        ]}
      >
        {simplifiedGridLayout}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 59,
    height: 166, // Increased height to fit all cells properly
    margin: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cluster: {
    padding: 4,
    backgroundColor: 'transparent', // Removed background color to make container invisible
    borderRadius: 4,
    width: '100%',
    height: '100%',
  },
  currentCluster: {
    borderColor: '#007AFF',
    borderWidth: 2,
    borderRadius: 8, // More rounded corners for the current cluster
  },
  // Simplified grid styles
  simplifiedGrid: {
    padding: 0, // Removed padding to better utilize space
    height: '100%',
  },
  simplifiedRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 1, 
    gap: 1,
  },
  simplifiedCell: {
    width: 10, // Slightly wider cells to match the image
    height: 10, // Slightly taller cells to match the image
    borderRadius: 2,
    margin: 0.5,
  },
  simplifiedCellEmpty: {
    borderWidth: 0.5,
    borderColor: '#fee', // More subtle border for empty cells
    backgroundColor: '#222', // Darker background for empty cells
  },
  simplifiedCellFilled: {
    backgroundColor: '#fff', // Pure white for filled cells as shown in the image
  },
  simplifiedCellCurrent: {
    backgroundColor: '#007AFF', // Blue for current cell
  },
  simplifiedCellWithContent: {
    borderWidth: 2,
    borderColor: '#0366d6', // Blue border for cells with content
  },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(WeekCluster);