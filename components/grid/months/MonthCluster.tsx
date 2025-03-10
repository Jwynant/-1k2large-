import React, { memo, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import MonthCell from './MonthCell';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';

type MonthClusterProps = {
  year: number;
  isCurrent: boolean;
  onPress: (position: { x: number, y: number, width: number, height: number }) => void;
  onCellPress: (month: number) => void;
  onLongPress: (month: number, position: { x: number, y: number }) => void;
  hasContent: (year: number, month?: number, week?: number) => boolean;
};

function MonthCluster({ 
  year, 
  isCurrent, 
  onPress,
  onCellPress, 
  onLongPress,
  hasContent
}: MonthClusterProps) {
  const { isCurrentMonth, isMonthInPast, getStartMonth, getBirthDate } = useDateCalculations();
  const clusterRef = useRef<View>(null);

  const handleMonthPress = useCallback((month: number) => {
    if (onCellPress) {
      onCellPress(month);
    }
  }, [onCellPress]);

  const handlePress = useCallback(() => {
    if (onPress && clusterRef.current) {
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
    if (onLongPress) {
      const position = {
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY
      };
      // Use January as default when long-pressing the cluster
      onLongPress(0, position);
    }
  }, [onLongPress]);

  // Render simplified grid view for better performance
  const simplifiedGridLayout = useMemo(() => {
    // Create a simplified visual representation of the months in a 3x4 grid
    const rows = [];
    const birthDate = getBirthDate();
    
    // Track if this cluster contains the current month
    let clusterContainsCurrentMonth = false;
    
    if (!birthDate) {
      // Fallback rendering if no birth date
      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        const rowMonths = [];
        for (let colIndex = 0; colIndex < 3; colIndex++) {
          rowMonths.push(
            <View 
              key={rowIndex * 3 + colIndex} 
              style={[styles.simplifiedCell, styles.simplifiedCellEmpty]} 
            />
          );
        }
        rows.push(<View key={rowIndex} style={styles.simplifiedRow}>{rowMonths}</View>);
      }
    } else {
      // Get birth month (0-11)
      const birthMonth = birthDate.getMonth();
      const birthYear = birthDate.getFullYear();
      
      // Current date for comparison
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      
      // Calculate total months lived
      const totalMonthsLived = (currentYear - birthYear) * 12 + (currentMonth - birthMonth + 1);
      
      // Calculate months from birth to the start of this cluster
      const monthsFromBirthToClusterStart = (year - birthYear) * 12;
      
      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        const rowMonths = [];
        for (let colIndex = 0; colIndex < 3; colIndex++) {
          // Position in this cluster (0-11)
          const positionInCluster = rowIndex * 3 + colIndex;
          
          // Calculate how many months from birth this cell represents
          const monthsFromBirth = monthsFromBirthToClusterStart + positionInCluster;
          
          // A month is in the past if the user has lived it
          const isPast = monthsFromBirth >= 0 && monthsFromBirth < totalMonthsLived;
          
          // This is the current month if it's the last filled month
          const isCurrent = monthsFromBirth === totalMonthsLived - 1;
          
          // Track if this cluster contains the current month
          if (isCurrent) {
            clusterContainsCurrentMonth = true;
          }
          
          // Check if this month has content
          const actualMonth = (birthMonth + positionInCluster) % 12;
          const actualYear = year + Math.floor((birthMonth + positionInCluster) / 12);
          const hasContentForMonth = hasContent(actualYear, actualMonth);
          
          rowMonths.push(
            <View 
              key={positionInCluster} 
              style={[
                styles.simplifiedCell,
                isPast ? styles.simplifiedCellFilled : styles.simplifiedCellEmpty,
                isCurrent && styles.simplifiedCellCurrent,
                hasContentForMonth && styles.simplifiedCellWithContent
              ]} 
            />
          );
        }
        rows.push(
          <View key={rowIndex} style={styles.simplifiedRow}>
            {rowMonths}
          </View>
        );
      }
    }
    
    // Store whether this cluster contains the current month
    // We'll use this to determine if we should show the blue border
    (MonthCluster as any).clusterContainsCurrentMonth = clusterContainsCurrentMonth;
    
    return (
      <View style={styles.simplifiedGrid}>
        <View style={styles.monthGrid}>
          {rows}
        </View>
      </View>
    );
  }, [year, hasContent, getBirthDate]);

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
          // Show the blue border if this cluster contains the current month
          // This ensures the blue border is around the actual present cluster
          (MonthCluster as any).clusterContainsCurrentMonth && styles.currentCluster
        ]}
        animate={{
          scale: 1,
        }}
        transition={{
          type: 'timing',
          duration: 200,
        } as any}
      >
        {simplifiedGridLayout}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 65,
    margin: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cluster: {
    padding: 3,
    width: '100%',
  },
  currentCluster: {
    borderColor: '#0366d6', // Accent color
    borderWidth: 1,
    borderRadius: 8,
  },
  // Simplified grid styles for better performance
  simplifiedGrid: {
    padding: 2,
    width: '100%',
  },
  monthGrid: {
    width: '100%',
  },
  simplifiedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  simplifiedCell: {
    width: 16,
    height: 16,
    borderRadius: 2,
    margin: 1,
  },
  simplifiedCellEmpty: {
    borderWidth: 1,
    borderColor: '#fee', // Dark mode border
    backgroundColor: 'transparent',
  },
  simplifiedCellFilled: {
    backgroundColor: '#fee', // Dark mode filled cell
  },
  simplifiedCellCurrent: {
    backgroundColor: '#007AFF',
  },
  simplifiedCellWithContent: {
    borderWidth: 2,
    borderColor: '#0366d6', // Accent color
  },
});

export default memo(MonthCluster);