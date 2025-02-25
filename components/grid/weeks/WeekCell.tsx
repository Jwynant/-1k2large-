import { View, StyleSheet, Pressable } from 'react-native';

type WeekCellProps = {
  filled: boolean;
  isCurrent: boolean;
  onPress?: () => void;
};

export default function WeekCell({ filled, isCurrent, onPress }: WeekCellProps) {
  return (
    <Pressable onPress={onPress} style={styles.weekCell}>
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
  weekCell: {
    flex: 1,
    aspectRatio: 1,
  },
  cell: {
    flex: 1,
    borderRadius: 2,
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
    borderWidth: 1,
  },
});