import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import MonthCell from './MonthCell';

type MonthClusterProps = {
  year: number;
  isCurrent: boolean;
  expanded?: boolean;
  onPress?: () => void;
};

export default function MonthCluster({ year, isCurrent, expanded, onPress }: MonthClusterProps) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i,
    filled: year < 23 || (year === 23 && i <= 4),
  }));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Pressable 
      style={[styles.container]}
      onPress={onPress}
    >
      <MotiView
        style={styles.cluster}
        animate={{
          scale: expanded ? 1.02 : 1,
        }}
        transition={{
          type: 'timing',
          duration: 200,
        }}>
        {expanded && (
          <View style={styles.monthLabels}>
            {months.slice(0, 3).map((_, i) => (
              <Text key={i} style={styles.monthLabel}>{monthNames[i]}</Text>
            ))}
          </View>
        )}
        <View style={[styles.row, expanded && styles.rowExpanded]}>
          {months.slice(0, 3).map((month) => (
            <MonthCell 
              key={month.month} 
              filled={month.filled}
              expanded={expanded}
            />
          ))}
        </View>
        {expanded && (
          <View style={styles.monthLabels}>
            {months.slice(3, 6).map((_, i) => (
              <Text key={i} style={styles.monthLabel}>{monthNames[i + 3]}</Text>
            ))}
          </View>
        )}
        <View style={[styles.row, expanded && styles.rowExpanded]}>
          {months.slice(3, 6).map((month) => (
            <MonthCell 
              key={month.month} 
              filled={month.filled}
              expanded={expanded}
            />
          ))}
        </View>
        {expanded && (
          <View style={styles.monthLabels}>
            {months.slice(6, 9).map((_, i) => (
              <Text key={i} style={styles.monthLabel}>{monthNames[i + 6]}</Text>
            ))}
          </View>
        )}
        <View style={[styles.row, expanded && styles.rowExpanded]}>
          {months.slice(6, 9).map((month) => (
            <MonthCell 
              key={month.month} 
              filled={month.filled}
              expanded={expanded}
            />
          ))}
        </View>
        {expanded && (
          <View style={styles.monthLabels}>
            {months.slice(9, 12).map((_, i) => (
              <Text key={i} style={styles.monthLabel}>{monthNames[i + 9]}</Text>
            ))}
          </View>
        )}
        <View style={[styles.row, expanded && styles.rowExpanded]}>
          {months.slice(9, 12).map((month) => (
            <MonthCell 
              key={month.month} 
              filled={month.filled}
              expanded={expanded}
            />
          ))}
        </View>
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '20%',
    cursor: 'pointer',
  },
  containerExpanded: {
    width: '100%',
    maxWidth: 600,
  },
  cluster: {
    borderRadius: 6,
    padding: 0.25,
  },
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  monthLabel: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 1.5,
    marginBottom: 1,
    marginHorizontal: 0,
  },
  rowExpanded: {
    marginHorizontal: 20,
  },
});