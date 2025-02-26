import { View, Text, StyleSheet } from 'react-native';
import WeekCluster from './WeekCluster';

type WeekGridViewProps = {
  clusters: Array<{
    year: number;
    isCurrent: boolean;
  }>;
  onCellPress?: (year: number, month?: number, week?: number) => void;
  onLongPress?: (year: number, month?: number, week?: number, position?: { x: number, y: number }) => void;
};

export default function WeekGridView({ clusters, onCellPress, onLongPress }: WeekGridViewProps) {
  const currentWeek = 36 * 52 + 20; // Example: 36 years and 20 weeks

  return (
    <View style={styles.container}>
      <View style={styles.ageLabels}>
        {Array.from({ length: Math.ceil(clusters.length / 5) }, (_, i) => (
          <Text key={i} style={styles.ageLabel}>
            {i * 5}
          </Text>
        ))}
      </View>
      
      <View style={styles.gridContent}>
        {Array.from({ length: Math.ceil(clusters.length / 5) }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {clusters.slice(rowIndex * 5, (rowIndex + 1) * 5).map((cluster) => (
              <WeekCluster
                key={cluster.year}
                year={cluster.year}
                isCurrent={cluster.isCurrent}
                onCellPress={onCellPress ? (week) => onCellPress(cluster.year, undefined, week) : undefined}
                onLongPress={(week, position) => onLongPress && onLongPress(cluster.year, undefined, week, position)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 20,
  },
  ageLabels: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  ageLabel: {
    fontSize: 10,
    color: '#666',
    height: 220,
    lineHeight: 220,
    textAlign: 'right',
  },
  gridContent: {
    flex: 1,
    paddingRight: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});