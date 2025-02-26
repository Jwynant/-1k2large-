import { View, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { MotiView } from 'moti';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import { useContentManagement } from '../../../app/hooks/useContentManagement';

type WeekCellProps = {
  year: number;
  week: number;
  onPress?: () => void;
  onLongPress?: (position: { x: number, y: number }) => void;
};

export default function WeekCell({ year, week, onPress, onLongPress }: WeekCellProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { isWeekInPast, getWeekNumber } = useDateCalculations();
  const { hasContent } = useContentManagement();
  
  const filled = isWeekInPast(year, week);
  const contentExists = hasContent(year, undefined, week);
  
  // Check if this is the current week
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentWeek = getWeekNumber(today);
  const isCurrent = year === currentYear && week === currentWeek;

  const handleLongPress = (event: any) => {
    if (onLongPress) {
      // Get the position of the press for the quick add menu
      const position = {
        x: event.nativeEvent.pageX - 100,
        y: event.nativeEvent.pageY - 50
      };
      onLongPress(position);
    }
  };

  return (
    <Pressable 
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <MotiView 
        style={[
          styles.cell,
          filled ? styles.filled : styles.empty,
          isCurrent && styles.current,
          isPressed && !filled && styles.pressed
        ]} 
        animate={{
          scale: isPressed ? 0.8 : 1,
        }}
        transition={{ duration: 50 }}
      >
        {contentExists && (
          <View style={styles.contentIndicator} />
        )}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 6,
    height: 6,
    borderRadius: 1,
    position: 'relative',
    margin: 1,
  },
  filled: {
    backgroundColor: '#000',
  },
  empty: {
    borderWidth: 0.5,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  current: {
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  pressed: {
    backgroundColor: '#f0f0f0',
  },
  contentIndicator: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#007AFF',
  },
});