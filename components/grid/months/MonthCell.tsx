import { View, StyleSheet, Pressable } from 'react-native';

type MonthCellProps = {
  filled: boolean;
  expanded?: boolean;
  onPress?: () => void;
};

export default function MonthCell({ filled, expanded, onPress }: MonthCellProps) {
  return (
    <Pressable onPress={onPress}>
      <View 
        style={[
          styles.cell,
          expanded && styles.cellExpanded,
          filled ? styles.filled : styles.empty
        ]} 
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 16,
    height: 16,
    borderRadius: 3,
    margin: 0,
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
  },
});