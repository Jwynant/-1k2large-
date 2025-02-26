import { View, Text, StyleSheet } from 'react-native';
import YearCell from './YearCell';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';

type YearGridViewProps = {
  clusters: Array<{
    year: number;
    isCurrent: boolean;
  }>;
  onSelectYear: (year: number) => void;
  onLongPress?: (year: number, month?: number, week?: number, position?: { x: number, y: number }) => void;
};

export default function YearGridView({ clusters, onSelectYear, onLongPress }: YearGridViewProps) {
  const { userAge } = useDateCalculations();
  
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
              <YearCell
                key={cluster.year}
                year={cluster.year}
                onPress={() => onSelectYear(cluster.year)}
                onLongPress={(position) => onLongPress && onLongPress(cluster.year, undefined, undefined, position)}
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