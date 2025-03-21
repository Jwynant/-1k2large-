import { View, StyleSheet, Pressable } from 'react-native';
import { memo, useCallback } from 'react';
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

function MonthCell({ year, month, expanded, onPress, onLongPress }: MonthCellProps) {
  const { getBirthDate } = useDateCalculations();
  const { getCellContent, hasContent } = useContentManagement();
  
  // Determine if this cell should be filled based on the user's age
  const birthDate = getBirthDate();
  
  let filled = false;
  let isCurrent = false;
  
  if (birthDate) {
    const birthMonth = birthDate.getMonth();
    const birthYear = birthDate.getFullYear();
    
    // Current date for comparison
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Calculate total months lived
    const totalMonthsLived = (currentYear - birthYear) * 12 + (currentMonth - birthMonth + 1);
    
    // Calculate how many months from birth this cell represents
    // First, normalize the month to be relative to birth month
    const normalizedMonth = (month < birthMonth) ? month + 12 : month;
    const monthsFromBirth = (year - birthYear) * 12 + (normalizedMonth - birthMonth);
    
    // A month is in the past if the user has lived it
    filled = monthsFromBirth >= 0 && monthsFromBirth < totalMonthsLived;
    
    // This is the current month if it's the last filled month
    isCurrent = monthsFromBirth === totalMonthsLived - 1;
  }
  
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
          isCurrent && styles.current
        ]} 
      >
        {contentExists && (
          <View style={styles.contentDot} />
        )}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 16,
    height: 16,
    margin: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellExpanded: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  filled: {
    backgroundColor: '#FFF5EA',
  },
  empty: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
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
  },
  current: {
    backgroundColor: '#121212',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(MonthCell);