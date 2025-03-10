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
  const { isCurrentMonth, isMonthInPast } = useDateCalculations();
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
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const rowMonths = [];
      for (let colIndex = 0; colIndex < 3; colIndex++) {
        const month = rowIndex * 3 + colIndex;
        const isPast = isMonthInPast(year, month);
        const hasContentForMonth = hasContent(year, month);
        const isCurrent = year === currentYear && month === currentMonth;
        
        rowMonths.push(
          <View 
            key={month} 
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
    
    return (
      <View style={styles.simplifiedGrid}>
        <View style={styles.monthGrid}>
          {rows}
        </View>
      </View>
    );
  }, [year, isMonthInPast, hasContent]);

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
});

export default memo(MonthCluster);