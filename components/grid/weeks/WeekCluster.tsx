import { View, StyleSheet } from 'react-native';
import WeekCell from './WeekCell';

type WeekClusterProps = {
  year: number;
  currentWeek: number;
};

const WEEKS_PER_YEAR = 52;
const ROWS_PER_CLUSTER = 13;
const CELLS_PER_ROW = 4;

export default function WeekCluster({ year, currentWeek }: WeekClusterProps) {
  return (
    <View style={styles.cluster}>
      {Array.from({ length: ROWS_PER_CLUSTER }, (_, clusterRow) => (
        <View key={clusterRow} style={styles.clusterRow}>
          {Array.from({ length: CELLS_PER_ROW }, (_, cellIndex) => {
            const weekNumber = year * WEEKS_PER_YEAR + clusterRow * CELLS_PER_ROW + cellIndex;
            return (
              <WeekCell
                key={cellIndex}
                filled={weekNumber < currentWeek}
                isCurrent={weekNumber === currentWeek}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {
    width: '19%',
    gap: 1,
  },
  clusterRow: {
    flexDirection: 'row',
    gap: 1,
    marginBottom: 1,
  },
});