import { View, StyleSheet } from 'react-native';
import WeekCell from './WeekCell';
import { useGridNavigation } from '../../../app/hooks/useGridNavigation';

type WeekClusterProps = {
  year: number;
  isCurrent: boolean;
  onCellPress?: (week: number) => void;
  onLongPress?: (week: number, position: { x: number, y: number }) => void;
};

export default function WeekCluster({ year, isCurrent, onCellPress, onLongPress }: WeekClusterProps) {
  const { handleCellPress } = useGridNavigation();

  const handleWeekPress = (week: number) => {
    handleCellPress(year, undefined, week);
    if (onCellPress) {
      onCellPress(week);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {Array.from({ length: 13 }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {Array.from({ length: 4 }, (_, colIndex) => {
              const week = rowIndex * 4 + colIndex;
              return (
                <WeekCell
                  key={week}
                  year={year}
                  week={week}
                  onPress={() => handleWeekPress(week)}
                  onLongPress={(position) => onLongPress && onLongPress(week, position)}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '20%',
  },
  grid: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
});