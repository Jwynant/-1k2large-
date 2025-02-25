import { View, Text, StyleSheet } from 'react-native';
import MonthGridCluster from './MonthGridCluster';

type MonthGridViewProps = {
  clusters: Array<{
    year: number;
    isCurrent: boolean;
  }>;
  onSelectYear: (year: number) => void;
};

export default function MonthGridView({ clusters, onSelectYear }: MonthGridViewProps) {
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
              <MonthGridCluster
                key={cluster.year}
                year={cluster.year}
                isCurrent={cluster.isCurrent}
                onPress={() => onSelectYear(cluster.year)}
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
  },
  ageLabels: {
    paddingLeft: 5,
    paddingRight: 2,
  },
  ageLabel: {
    fontSize: 10,
    color: '#666',
    height: 80,
    lineHeight: 70,
    textAlign: 'right',
  },
  gridContent: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});