import React, { memo, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import YearCell from './YearCell';
import { useGridNavigation } from '../../../app/hooks/useGridNavigation';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import { useContentManagement } from '../../../app/hooks/useContentManagement';
import { MotiView } from 'moti';

type YearClusterProps = {
  decade: number;
  isCurrent: boolean;
  expanded?: boolean;
  onPress?: (position: { x: number, y: number, width: number, height: number }) => void;
  onCellPress?: (year: number) => void;
  onLongPress?: (year: number, position: { x: number, y: number }) => void;
};

function YearCluster({ 
  decade, 
  isCurrent, 
  expanded = false,
  onPress,
  onCellPress, 
  onLongPress 
}: YearClusterProps) {
  const { handleCellPress } = useGridNavigation();
  const { userAge } = useDateCalculations();
  const { hasContent } = useContentManagement();
  const clusterRef = useRef<View>(null);
  const currentYear = new Date().getFullYear();

  // Custom function to check if a year is in the past
  const isYearInPast = useCallback((year: number) => {
    return year < currentYear;
  }, []);

  const handleYearPress = useCallback((year: number) => {
    handleCellPress(year);
    if (onCellPress) {
      onCellPress(year);
    }
  }, [handleCellPress, onCellPress]);

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
      // Use first year in decade as default when long-pressing the cluster
      onLongPress(decade, position);
    }
  }, [onLongPress, decade]);

  // Pre-compute the detailed grid layout - only when expanded
  const detailedGridLayout = useMemo(() => {
    if (!expanded) return null;
    
    const years = [];
    for (let i = 0; i < 10; i++) {
      const year = decade + i;
      years.push(
        <YearCell
          key={year}
          year={year}
          isPast={year < currentYear}
          onPress={() => handleYearPress(year)}
          onLongPress={(position) => onLongPress && onLongPress(year, position)}
        />
      );
    }
    
    return (
      <View style={styles.detailedGrid}>
        <View style={styles.row}>
          {years.slice(0, 5)}
        </View>
        <View style={styles.row}>
          {years.slice(5, 10)}
        </View>
      </View>
    );
  }, [decade, expanded, handleYearPress, onLongPress]);

  // Render simplified grid view for better performance
  const simplifiedGridLayout = useMemo(() => {
    if (expanded) return null;
    
    const yearCells = [];
    
    for (let i = 0; i < 10; i++) {
      const year = decade + i;
      const isFilled = isYearInPast(year);
      const hasContentForYear = hasContent(year);
      const isCurrentYear = year === currentYear;
      
      yearCells.push(
        <View 
          key={year} 
          style={[
            styles.simplifiedCell,
            isFilled ? styles.simplifiedCellFilled : styles.simplifiedCellEmpty,
            hasContentForYear && styles.simplifiedCellWithContent,
            isCurrentYear && styles.simplifiedCellCurrent
          ]} 
        />
      );
    }
    
    return (
      <View style={styles.simplifiedGrid}>
        <Text style={styles.decadeLabel}>{decade}s</Text>
        <View style={styles.simplifiedRow}>
          {yearCells.slice(0, 5)}
        </View>
        <View style={styles.simplifiedRow}>
          {yearCells.slice(5, 10)}
        </View>
      </View>
    );
  }, [expanded, decade, isYearInPast, hasContent]);

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
          scale: expanded ? 1.05 : 1,
          shadowOpacity: expanded ? 0.2 : 0,
        }}
        transition={{
          type: 'timing',
          duration: 200,
        } as any}
      >
        {simplifiedGridLayout}
        {detailedGridLayout}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '30%',
    margin: 5,
  },
  cluster: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  currentCluster: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  detailedGrid: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  // Simplified grid styles for better performance
  simplifiedGrid: {
    padding: 2,
  },
  decadeLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '600',
    color: '#333',
  },
  simplifiedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  simplifiedCell: {
    width: 8,
    height: 8,
    borderRadius: 3,
    margin: 1,
  },
  simplifiedCellEmpty: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  simplifiedCellFilled: {
    backgroundColor: '#333',
  },
  simplifiedCellWithContent: {
    borderColor: '#007AFF',
    borderWidth: 1.5,
  },
  simplifiedCellCurrent: {
    backgroundColor: '#007AFF',
  },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(YearCluster);