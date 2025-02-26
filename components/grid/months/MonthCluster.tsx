import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import MonthCell from './MonthCell';
import { useGridNavigation } from '../../../app/hooks/useGridNavigation';

type MonthClusterProps = {
  year: number;
  isCurrent: boolean;
  expanded?: boolean;
  onPress?: () => void;
  onLongPress?: (position: { x: number, y: number }) => void;
};

export default function MonthCluster({ year, isCurrent, expanded, onPress, onLongPress }: MonthClusterProps) {
  const { handleCellPress } = useGridNavigation();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleLongPress = (event: any) => {
    if (onLongPress) {
      // Get the position of the press for the quick add menu
      const position = {
        x: event.nativeEvent.pageX - 100,
        y: event.nativeEvent.pageY - 50
      };
      onLongPress(position);
    }
  };

  const handleCellClick = (month: number) => {
    if (expanded) {
      handleCellPress(year, month);
    }
  };

  const handleCellLongPress = (month: number, position: { x: number, y: number }) => {
    if (expanded && onLongPress) {
      onLongPress(position);
      handleCellPress(year, month);
    }
  };

  return (
    <Pressable 
      style={[styles.container]}
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <MotiView
        style={styles.cluster}
        animate={{
          scale: expanded ? 1.02 : 1,
        }}
        transition={{
          duration: 200,
        }}>
        {expanded && (
          <View style={styles.monthLabels}>
            {monthNames.slice(0, 3).map((name, i) => (
              <Text key={i} style={styles.monthLabel}>{name}</Text>
            ))}
          </View>
        )}
        <View style={[styles.row, expanded && styles.rowExpanded]}>
          {Array.from({ length: 3 }, (_, i) => (
            <MonthCell 
              key={i} 
              year={year}
              month={i}
              expanded={expanded}
              onPress={() => handleCellClick(i)}
              onLongPress={(position) => handleCellLongPress(i, position)}
            />
          ))}
        </View>
        {expanded && (
          <View style={styles.monthLabels}>
            {monthNames.slice(3, 6).map((name, i) => (
              <Text key={i} style={styles.monthLabel}>{name}</Text>
            ))}
          </View>
        )}
        <View style={[styles.row, expanded && styles.rowExpanded]}>
          {Array.from({ length: 3 }, (_, i) => (
            <MonthCell 
              key={i} 
              year={year}
              month={i + 3}
              expanded={expanded}
              onPress={() => handleCellClick(i + 3)}
              onLongPress={(position) => handleCellLongPress(i + 3, position)}
            />
          ))}
        </View>
        {expanded && (
          <View style={styles.monthLabels}>
            {monthNames.slice(6, 9).map((name, i) => (
              <Text key={i} style={styles.monthLabel}>{name}</Text>
            ))}
          </View>
        )}
        <View style={[styles.row, expanded && styles.rowExpanded]}>
          {Array.from({ length: 3 }, (_, i) => (
            <MonthCell 
              key={i} 
              year={year}
              month={i + 6}
              expanded={expanded}
              onPress={() => handleCellClick(i + 6)}
              onLongPress={(position) => handleCellLongPress(i + 6, position)}
            />
          ))}
        </View>
        {expanded && (
          <View style={styles.monthLabels}>
            {monthNames.slice(9, 12).map((name, i) => (
              <Text key={i} style={styles.monthLabel}>{name}</Text>
            ))}
          </View>
        )}
        <View style={[styles.row, expanded && styles.rowExpanded]}>
          {Array.from({ length: 3 }, (_, i) => (
            <MonthCell 
              key={i} 
              year={year}
              month={i + 9}
              expanded={expanded}
              onPress={() => handleCellClick(i + 9)}
              onLongPress={(position) => handleCellLongPress(i + 9, position)}
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