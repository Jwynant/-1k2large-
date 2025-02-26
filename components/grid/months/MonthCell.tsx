import { View, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import { useContentManagement } from '../../../app/hooks/useContentManagement';

type MonthCellProps = {
  year: number;
  month: number;
  expanded?: boolean;
  onPress?: () => void;
  onLongPress?: (position: { x: number, y: number }) => void;
};

export default function MonthCell({ year, month, expanded, onPress, onLongPress }: MonthCellProps) {
  const { isMonthInPast } = useDateCalculations();
  const { hasContent } = useContentManagement();
  
  const filled = isMonthInPast(year, month);
  const contentExists = hasContent(year, month);
  
  const handleLongPress = (event: any) => {
    if (onLongPress) {
      // Get the position of the press for the quick add menu
      onLongPress({
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY
      });
    }
  };

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
          <View style={[styles.contentIndicator, expanded && styles.contentIndicatorExpanded]} />
        )}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 16,
    height: 16,
    borderRadius: 3,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  cellExpanded: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  filled: {
    backgroundColor: '#000',
  },
  empty: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  contentIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
  },
  contentIndicatorExpanded: {
    width: 12,
    height: 12,
    borderRadius: 6,
    bottom: -4,
    right: -4,
  },
});