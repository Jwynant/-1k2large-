import { View, StyleSheet, Pressable } from 'react-native';

type YearCellProps = {
  filled: boolean;
  isCurrent: boolean;
  onPress?: () => void;
};

export default function YearCell({ filled, isCurrent, onPress }: YearCellProps) {
  return (
    <Pressable style={styles.yearCell} onPress={onPress}>
      <View
        style={[
          styles.cell,
          filled ? styles.filledCell : styles.emptyCell,
          isCurrent && styles.currentCell,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  yearCell: {
    flex: 1,
    aspectRatio: 1,
    padding: 2,
  },
  cell: {
    flex: 1,
    borderRadius: 6,
  },
  filledCell: {
    backgroundColor: '#000',
  },
  emptyCell: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  currentCell: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
});