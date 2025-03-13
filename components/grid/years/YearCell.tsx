import { StyleSheet, Pressable, View, Text } from 'react-native';
import { useState } from 'react';
import { MotiView } from 'moti';
import { useContentManagement } from '../../../app/hooks/useContentManagement';

type YearCellProps = {
  year: number;
  age?: number | null;
  isPast: boolean;
  isCurrent: boolean;
  isBirthYear?: boolean;
  hasContent: boolean;
  onPress?: () => void;
  onLongPress?: (position: { x: number, y: number }) => void;
};

export default function YearCell({ 
  year, 
  age,
  isPast, 
  isCurrent,
  isBirthYear = false,
  hasContent, 
  onPress, 
  onLongPress 
}: YearCellProps) {
  const [isPressed, setIsPressed] = useState(false);
  
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

  // Display the age if available, otherwise show the year
  const displayText = age !== null ? age : year;

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
          isBirthYear && styles.birthYearCell,
          isPressed && styles.pressedCell
        ]}
        animate={{
          scale: isPressed ? 0.95 : 1,
        }}
        transition={{
          duration: 150
        }}
      >
        {hasContent && (
          <View style={styles.contentDot} />
        )}
        
        <Text style={[
          styles.yearText,
          isPast ? styles.pastYearText : styles.futureYearText,
          isBirthYear && styles.birthYearText
        ]}>
          {displayText}
        </Text>
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
    borderColor: '#FFD700', // Gold color to match our theme
    backgroundColor: 'transparent',
  },
  birthYearCell: {
    borderWidth: 2,
    borderColor: '#00c853', // Green for birth year
    backgroundColor: 'rgba(0, 200, 83, 0.1)', // Light green background
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
  birthYearText: {
    color: '#00c853', // Green text for birth year
    fontWeight: '700',
  },
  contentDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#000000', // Black dot
    opacity: 1.0,
  }
});