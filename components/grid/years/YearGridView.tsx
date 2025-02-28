import { View, StyleSheet, ScrollView, Text, useWindowDimensions } from 'react-native';
import { memo, useMemo } from 'react';
import YearCell from './YearCell';
import { useAppContext } from '../../../app/context/AppContext';

export type YearGridViewProps = {
  clusters: { year: number; isCurrent: boolean }[];
  onCellPress: (year: number, month?: number, week?: number) => void;
  onLongPress: (year: number, month?: number, week?: number, position?: { x: number, y: number }) => void;
  onClusterPress: (year: number, position: { x: number, y: number, width: number, height: number }) => void;
  hasContent: (year: number, month?: number, week?: number) => boolean;
};

function YearGridView({ 
  clusters, 
  onCellPress,
  onLongPress,
  onClusterPress,
  hasContent
}: YearGridViewProps) {
  const { width } = useWindowDimensions();
  const { state } = useAppContext();
  
  // Get the current year to determine which cells should be filled
  const currentYear = new Date().getFullYear();
  
  // Get birth year for age calculation
  const birthYear = state.userBirthDate 
    ? new Date(state.userBirthDate).getFullYear() 
    : new Date().getFullYear() - 30;

  // Process all years into rows of exactly 10
  const yearRows = useMemo(() => {
    const rows: number[][] = [];
    let currentRow: number[] = [];
    
    // Get all years from clusters
    const allYears = clusters.map(cluster => cluster.year).sort((a, b) => a - b);
    
    // Create rows with exactly 10 years each (except possibly the last row)
    allYears.forEach((year: number, index) => {
      currentRow.push(year);
      
      // When we have 10 years or it's the last year, add the row
      if (currentRow.length === 10 || index === allYears.length - 1) {
        rows.push([...currentRow]);
        currentRow = [];
      }
    });
    
    return rows;
  }, [clusters]);

  // Fallback if no years
  if (yearRows.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.gridLayout}>
          <View style={styles.yearsContainer}>
            <Text style={styles.emptyText}>No years available</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.gridLayout}>
        <View style={styles.yearsContainer}>
          {yearRows.map((yearsInRow, rowIndex) => (
            <View key={rowIndex} style={styles.yearRow}>
              {yearsInRow.map((year: number) => {
                const isPast = year < currentYear;
                const isCurrent = year === currentYear;
                const hasContentForYear = hasContent(year);
                const age = year - birthYear;
                
                return (
                  <YearCell 
                    key={year} 
                    year={year}
                    age={age}
                    isPast={isPast}
                    isCurrent={isCurrent}
                    hasContent={hasContentForYear}
                    onPress={() => onCellPress(year)}
                    onLongPress={(position) => 
                      onLongPress(year, undefined, undefined, position)
                    }
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  gridLayout: {
    flexDirection: 'row',
    flex: 1,
  },
  yearsContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  yearRow: {
    flexDirection: 'row',
    marginBottom: 4,
    height: 36,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  emptyText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  }
});

export default memo(YearGridView);