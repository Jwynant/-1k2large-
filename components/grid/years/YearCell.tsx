import { StyleSheet, Pressable, View, Text } from 'react-native';
import { useState } from 'react';
import { MotiView } from 'moti';
import { useContentManagement } from '../../../app/hooks/useContentManagement';
import CellContentIndicator from '../CellContentIndicator';

type YearCellProps = {
  year: number;
  age?: number;
  isPast: boolean;
  isCurrent: boolean;
  hasContent: boolean;
  onPress?: () => void;
  onLongPress?: (position: { x: number, y: number }) => void;
};

export default function YearCell({ 
  year, 
  age,
  isPast, 
  isCurrent, 
  hasContent, 
  onPress, 
  onLongPress 
}: YearCellProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { getCellContent } = useContentManagement();
  
  const cellContent = hasContent ? getCellContent(year) : [];

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
      style={styles.container}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <MotiView
        style={[
          styles.cell,
          isPast ? styles.filledCell : styles.emptyCell,
          isCurrent && styles.currentCell,
          isPressed && styles.pressedCell
        ]}
        animate={{
          scale: isPressed ? 0.95 : 1,
        }}
        transition={{
          duration: 150
        }}
      >
        <Text style={[
          styles.yearText,
          isPast ? styles.pastYearText : styles.futureYearText
        ]}>
          {age !== undefined ? age : year}
        </Text>
        
        {hasContent && (
          <View style={styles.indicatorContainer}>
            <CellContentIndicator 
              content={cellContent} 
              size="small" 
            />
          </View>
        )}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    width: '10%', // Set to exactly 10% of parent width
  },
  cell: {
    width: 30,
    height: 30,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filledCell: {
    backgroundColor: '#fee', // Light pink for filled cells
  },
  emptyCell: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fee', // Light pink border
  },
  currentCell: {
    borderWidth: 2,
    borderColor: '#0366d6', // Accent color
    backgroundColor: 'transparent',
  },
  pressedCell: {
    opacity: 0.7,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pastYearText: {
    color: '#000', // Black text for past cells
  },
  futureYearText: {
    color: '#fff', // White text for current and future cells
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 1,
    right: 1,
  }
});