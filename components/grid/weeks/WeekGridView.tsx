import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { memo, useMemo } from 'react';
import WeekCluster from './WeekCluster';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import { useAppContext } from '../../../app/context/AppContext';
import WeekExpandedView from './WeekExpandedView';

export type WeekGridViewProps = {
  clusters: { year: number; isCurrent: boolean }[];
  onCellPress: (year: number, month?: number, week?: number) => void;
  onLongPress: (year: number, month?: number, week?: number, position?: { x: number, y: number }) => void;
  onClusterPress: (year: number, position: { x: number, y: number, width: number, height: number }) => void;
  hasContent: (year: number, month?: number, week?: number) => boolean;
};

function WeekGridView({ 
  clusters, 
  onCellPress, 
  onLongPress,
  onClusterPress,
  hasContent
}: WeekGridViewProps) {
  const { userAge } = useDateCalculations();
  const { state } = useAppContext();
  const [expandedCluster, setExpandedCluster] = useState<number | null>(null);
  
  // Group clusters into rows for easier rendering
  const clusterRows = useMemo(() => {
    const rows = [];
    
    // Group by 5-year periods based on absolute years, not user age
    // This ensures consistent grid structure regardless of birth date
    let currentRow = [];
    let rowStartYear = Math.floor(clusters[0]?.year / 5) * 5;
    
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      const yearGroup = Math.floor(cluster.year / 5) * 5;
      
      // Start a new row when we reach a new 5-year block
      if (yearGroup !== rowStartYear && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
        rowStartYear = yearGroup;
      }
      
      currentRow.push(cluster);
      
      // Push the last row if we're at the end
      if (i === clusters.length - 1 && currentRow.length > 0) {
        rows.push(currentRow);
      }
    }
    
    return rows;
  }, [clusters]);
  
  // Generate age labels for each row
  const ageLabels = useMemo(() => {
    const birthYear = state.userBirthDate 
      ? new Date(state.userBirthDate).getFullYear() 
      : new Date().getFullYear() - 30;
    
    return clusterRows.map((row) => {
      if (row.length === 0) return "";
      
      const firstYearInRow = row[0]?.year || 0;
      const age = firstYearInRow - birthYear;
      
      // Only show age label if it's a positive number
      return age >= 0 ? `${age}` : "";
    });
  }, [clusterRows, state.userBirthDate]);

  const handleClusterPress = (year: number, position: { x: number, y: number, width: number, height: number }) => {
    onClusterPress(year, position);
    setExpandedCluster(year);
  };
  
  const handleCloseExpanded = () => {
    setExpandedCluster(null);
  };
  
  const handleWeekPress = (week: number) => {
    if (expandedCluster !== null) {
      onCellPress(expandedCluster, undefined, week);
      setExpandedCluster(null);
    }
  };

  if (expandedCluster !== null) {
    return (
      <WeekExpandedView 
        year={expandedCluster}
        onClose={handleCloseExpanded}
        onWeekPress={handleWeekPress}
      />
    );
  }

  if (clusterRows.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.grid}>
          <View style={styles.row}>
            {clusters.map((cluster) => (
              <WeekCluster 
                key={cluster.year} 
                year={cluster.year} 
                isCurrent={cluster.isCurrent}
                onPress={(position) => handleClusterPress(cluster.year, position)}
                onCellPress={(week: number) => onCellPress(cluster.year, undefined, week)}
                onLongPress={(week: number, position: { x: number, y: number }) => 
                  onLongPress(cluster.year, undefined, week, position)
                }
                hasContent={hasContent}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}
    >
      <View style={styles.contentContainer}>
        {/* Age labels column */}
        <View style={styles.ageLabelsContainer}>
          {ageLabels.map((label, index) => (
            <Text key={index} style={styles.ageLabel}>
              {label}
            </Text>
          ))}
        </View>
        
        {/* Grid content */}
        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {clusterRows.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={[
                styles.row,
                // Reduce bottom margin for the last row
                rowIndex === clusterRows.length - 1 && styles.lastRow
              ]}>
                {row.map((cluster) => (
                  <WeekCluster 
                    key={cluster.year} 
                    year={cluster.year} 
                    isCurrent={cluster.isCurrent}
                    onPress={(position) => handleClusterPress(cluster.year, position)}
                    onCellPress={(week: number) => onCellPress(cluster.year, undefined, week)}
                    onLongPress={(week: number, position: { x: number, y: number }) => 
                      onLongPress(cluster.year, undefined, week, position)
                    }
                    hasContent={hasContent}
                  />
                ))}
              </View>
            ))}
          </View>
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
  scrollContentContainer: {
    paddingBottom: 5, // Minimal bottom padding
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  ageLabelsContainer: {
    width: 30,
    paddingTop: 10, // Match the grid padding
    alignItems: 'center',
  },
  ageLabel: {
    fontSize: 14,
    color: '#aaa', // Light gray for dark mode
    fontWeight: '500',
    height: 135, // Updated to match the new cluster height + marginBottom
    textAlignVertical: 'center',
    lineHeight: 85, // Match the height of the cluster
  },
  gridContainer: {
    flex: 1,
  },
  grid: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 50, // Keep the larger spacing between 5-year groupings
  },
  lastRow: {
    marginBottom: 5, // Minimal margin for the last row
  },
});

export default memo(WeekGridView);