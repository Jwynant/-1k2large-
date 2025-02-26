import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { MotiView } from 'moti';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import { useContentManagement } from '../../../app/hooks/useContentManagement';

type YearCellProps = {
  year: number;
  onPress?: () => void;
  onLongPress?: (position: { x: number, y: number }) => void;
};

export default function YearCell({ year, onPress, onLongPress }: YearCellProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { userAge } = useDateCalculations();
  const { hasContent } = useContentManagement();
  
  const isCurrent = year === userAge;
  const contentExists = hasContent(year);

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
          isCurrent && styles.currentCell
        ]}
        animate={{
          scale: isPressed ? 0.95 : 1,
          backgroundColor: isPressed ? '#f0f0f0' : '#fff',
        }}
        transition={{
          duration: 150
        }}
      >
        <Text style={styles.yearText}>{year}</Text>
        {contentExists && (
          <View style={styles.contentIndicatorContainer}>
            <View style={styles.contentIndicator}>
              <Text style={styles.contentIndicatorText}>•</Text>
            </View>
          </View>
        )}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '18%',
    aspectRatio: 1,
    padding: 2,
  },
  cell: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currentCell: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  yearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contentIndicatorContainer: {
    position: 'absolute',
    bottom: 6,
    width: '100%',
    alignItems: 'center',
  },
  contentIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentIndicatorText: {
    fontSize: 8,
    color: '#fff',
    textAlign: 'center',
  },
});