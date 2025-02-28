import { View, StyleSheet, Pressable } from 'react-native';
import { useState, useCallback, memo } from 'react';
import { MotiView } from 'moti';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import { useContentManagement } from '../../../app/hooks/useContentManagement';
import CellContentIndicator from '../CellContentIndicator';

type WeekCellProps = {
  year: number;
  week: number;
  onPress?: () => void;
  onLongPress?: (position: { x: number, y: number }) => void;
};

function WeekCell({ year, week, onPress, onLongPress }: WeekCellProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { isWeekInPast, getWeekNumber } = useDateCalculations();
  const { getCellContent, hasContent } = useContentManagement();
  
  const isPast = isWeekInPast(year, week);
  const contentExists = hasContent(year, undefined, week);
  const cellContent = contentExists ? getCellContent(year, undefined, week) : [];
  
  // Check if this is the current week
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentWeek = getWeekNumber(today);
  const isCurrent = year === currentYear && week === currentWeek;

  const handleLongPress = useCallback((event: any) => {
    if (onLongPress) {
      // Get the position of the press for the quick add menu
      const position = {
        x: event.nativeEvent.pageX - 100,
        y: event.nativeEvent.pageY - 50
      };
      onLongPress(position);
    }
  }, [onLongPress]);

  const handlePressIn = useCallback(() => setIsPressed(true), []);
  const handlePressOut = useCallback(() => setIsPressed(false), []);

  return (
    <Pressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <MotiView 
        style={[
          styles.cell,
          isPast ? styles.filled : styles.empty,
          isCurrent && styles.current,
          isPressed && styles.pressed,
        ]} 
      >
        {contentExists && (
          <CellContentIndicator 
            content={cellContent} 
            size="small" 
          />
        )}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 12,
    height: 12,
    borderRadius: 2,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filled: {
    backgroundColor: '#888', // Light gray for dark mode
  },
  empty: {
    backgroundColor: '#2A2A2A', // Dark gray for dark mode
    borderWidth: 1,
    borderColor: '#444', // Darker border for dark mode
  },
  current: {
    borderColor: '#007AFF', // iOS blue
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  contentIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF', // iOS blue
  },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(WeekCell);