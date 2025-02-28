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
};

function WeekCluster({ 
  year, 
  isCurrent, 
  onPress,
  onCellPress, 
  onLongPress,
  hasContent
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
    
    // 13 rows of 4 weeks = 52 weeks
    for (let rowIndex = 0; rowIndex < 13; rowIndex++) {
      const rowWeeks = [];
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        const week = rowIndex * 4 + colIndex + 1; // Start from week 1 instead of 0
        // Skip if week is greater than 52
        if (week > 52) continue;
        
        const isPast = isWeekInPast(year, week);
        const hasContentForWeek = hasContent(year, undefined, week);
        const isCurrent = year === currentYear && week === currentWeek;
        
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
    
    return (
      <View style={styles.simplifiedGrid}>
        {rows}
      </View>
    );
  }, [year, isWeekInPast, hasContent, getWeekNumber]);

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
          isCurrent && styles.currentCluster
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
});

// Memoize the component to prevent unnecessary re-renders
export default memo(WeekCluster);