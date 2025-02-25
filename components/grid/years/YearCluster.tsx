import { View, StyleSheet } from 'react-native';
import YearCell from './YearCell';

type YearClusterProps = {
  startYear: number;
  currentAge: number;
  count?: number;
};

export default function YearCluster({ startYear, currentAge, count = 10 }: YearClusterProps) {
  return (
    <View style={styles.cluster}>
      {Array.from({ length: count }, (_, i) => {
        const year = startYear + i;
        return (
          <YearCell
            key={year}
            filled={year < currentAge}
            isCurrent={year === currentAge}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
});