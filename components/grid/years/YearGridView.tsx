import { View, Text, StyleSheet } from 'react-native';
import YearCluster from './YearCluster';

type YearGridViewProps = {
  currentAge: number;
  totalYears: number;
};

export default function YearGridView({ currentAge, totalYears }: YearGridViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.ageLabels}>
        {Array.from({ length: Math.ceil(totalYears / 10) }, (_, i) => (
          <Text key={i} style={styles.ageLabel}>
            {i * 10}
          </Text>
        ))}
      </View>
      
      <View style={styles.gridContent}>
        {Array.from({ length: Math.ceil(totalYears / 10) }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            <YearCluster
              startYear={rowIndex * 10}
              currentAge={currentAge}
              count={Math.min(10, totalYears - rowIndex * 10)}
            />
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
    fontSize: 12,
    color: '#666',
    height: 40,
    textAlign: 'right',
    lineHeight: 40,
  },
  gridContent: {
    flex: 1,
    paddingRight: 20,
  },
  row: {
    marginBottom: 4,
    height: 40,
    alignItems: 'center',
  },
});