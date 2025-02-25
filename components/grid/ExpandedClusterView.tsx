import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

type ExpandedClusterViewProps = {
  year: number;
  isCurrent: boolean;
  onClose: () => void;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ExpandedClusterView({ year, isCurrent, onClose }: ExpandedClusterViewProps) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i,
    filled: year < 23 || (year === 23 && i <= 4),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>May 8th 2025</Text>
        <Text style={styles.timeLeft}>23 years, 6 months, 3 weeks, 1 day</Text>
        <View style={styles.progress}>
          <View style={[styles.progressBar, { width: `${(year / 80) * 100}%` }]} />
        </View>
        <View style={styles.viewModes}>
          <Pressable style={styles.viewModeButton}>
            <Text style={styles.viewModeText}>Weeks</Text>
          </Pressable>
          <Pressable style={[styles.viewModeButton, styles.viewModeActive]}>
            <Text style={[styles.viewModeText, styles.viewModeTextActive]}>Months</Text>
          </Pressable>
          <Pressable style={styles.viewModeButton}>
            <Text style={styles.viewModeText}>Years</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.yearLabel}>{year}</Text>

      <View style={styles.content}>
        <View style={styles.grid}>
          {months.map((month, index) => (
            <Pressable key={month.month} style={styles.cellWrapper}>
              <Text style={styles.monthLabel}>{monthNames[index]}</Text>
              <View
                style={[
                  styles.cell,
                  month.filled ? styles.filledCell : styles.emptyCell,
                ]}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeLeft: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  progress: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 2,
  },
  viewModes: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    padding: 4,
    borderRadius: 100,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  viewModeActive: {
    backgroundColor: '#fff',
  },
  viewModeText: {
    textAlign: 'center',
    color: '#666',
  },
  viewModeTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  yearLabel: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 20,
    ...(Platform.OS === 'web' ? {
      display: 'grid',
    } : {
    flexDirection: 'row',
      flexWrap: 'wrap',
    }),
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  cellWrapper: {
    flex: 1,
    minWidth: '30%',
    aspectRatio: 1.1,
  },
  cell: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
  },
  filledCell: {
    backgroundColor: '#000',
  },
  emptyCell: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
});