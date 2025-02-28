import { View, StyleSheet, Pressable } from 'react-native';
import { memo, useCallback } from 'react';
import { MotiView } from 'moti';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import { useContentManagement } from '../../../app/hooks/useContentManagement';
import CellContentIndicator from '../CellContentIndicator';

type MonthCellProps = {
  year: number;
  month: number;
  expanded?: boolean;
  onPress?: () => void;
  onLongPress?: (position: { x: number, y: number }) => void;
};

function MonthCell({ year, month, expanded, onPress, onLongPress }: MonthCellProps) {
  const { isMonthInPast } = useDateCalculations();
  const { getCellContent, hasContent } = useContentManagement();
  
  const filled = isMonthInPast(year, month);
  const contentExists = hasContent(year, month);
  const cellContent = contentExists ? getCellContent(year, month) : [];
  
  const handleLongPress = useCallback((event: any) => {
    if (onLongPress) {
      // Get the position of the press for the quick add menu
      onLongPress({
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY
      });
    }
  }, [onLongPress]);

  return (
    <Pressable 
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <MotiView 
        style={[
          styles.cell,
          expanded && styles.cellExpanded,
          filled ? styles.filled : styles.empty,
        ]} 
      >
        {contentExists && (
          <CellContentIndicator 
            content={cellContent} 
            size={expanded ? 'medium' : 'small'} 
          />
        )}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 16,
    height: 16,
    borderRadius: 2,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellExpanded: {
    width: 32,
    height: 32,
    borderRadius: 4,
    margin: 2,
  },
  filled: {
    backgroundColor: '#e0e0e0',
  },
  empty: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contentIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A90E2',
  },
  contentIndicatorExpanded: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(MonthCell);