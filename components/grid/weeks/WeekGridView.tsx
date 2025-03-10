import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { memo, useMemo } from 'react';
import WeekCluster from './WeekCluster';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import { useAppContext } from '../../../app/context/AppContext';
import WeekExpandedView from './WeekExpandedView';

// Define a cluster type for better type safety
type Cluster = { year: number; isCurrent: boolean } | null;

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
  const { getAgeForYear, getBirthDate } = useDateCalculations();
  const { state } = useAppContext();
  const [expandedCluster, setExpandedCluster] = useState<number | null>(null);
  
  // Always use exactly 5 clusters per row
  const CLUSTERS_PER_ROW = 5;
  
  // Group clusters into rows with exactly 5 clusters in each row
  const clusterRows = useMemo(() => {
    if (clusters.length === 0) return [] as Cluster[][];
    
    // Sort clusters by year
    const sortedClusters = [...clusters].sort((a, b) => a.year - b.year);
    
    const rows: Cluster[][] = [];
    let currentRow: Cluster[] = [];
    
    // Distribute clusters into rows of exactly 5
    sortedClusters.forEach((cluster, index) => {
      currentRow.push(cluster);
      
      // When we have 5 clusters or it's the last cluster, add the row
      if (currentRow.length === CLUSTERS_PER_ROW || index === sortedClusters.length - 1) {
        // If it's the last row and not full, pad it with null values to maintain layout
        while (currentRow.length < CLUSTERS_PER_ROW) {
          currentRow.push(null);
        }
        
        rows.push([...currentRow]);
        currentRow = [];
      }
    });
    
    return rows;
  }, [clusters]);
  
  // Generate age labels by increments of 5
  const ageLabels = useMemo(() => {
    if (clusterRows.length === 0) return [] as string[];
    
    return clusterRows.map((row, index) => {
      // Find the first valid cluster in the row
      const firstValidCluster = row.find((c): c is { year: number; isCurrent: boolean } => c !== null);
      if (!firstValidCluster) return "";
      
      // Calculate the age for the first year in the row
      const age = getAgeForYear(firstValidCluster.year);
      if (age === null) return "";
      
      // For proper alignment, return the age that represents the start of this row
      // (which is always a multiple of 5)
      return `${Math.floor(age / 5) * 5}`;
    });
  }, [clusterRows, getAgeForYear]);

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

  // Fallback if no rows were calculated
  if (clusterRows.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.grid}>
          <Text style={styles.emptyText}>No weeks available</Text>
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
                {row.map((cluster: Cluster, colIndex: number) => {
                  if (cluster === null) {
                    // Render an empty placeholder to maintain grid structure
                    return <View key={`empty-${rowIndex}-${colIndex}`} style={styles.emptyCluster} />;
                  }
                  
                  return (
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
                      getBirthDate={getBirthDate}
                    />
                  );
                })}
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
    paddingTop: 60, // Match the grid padding
    alignItems: 'center',
  },
  ageLabel: {
    fontSize: 14,
    color: '#aaa', // Light gray for dark mode
    fontWeight: '500',
    height: 188, // Height to match a row of clusters
    textAlignVertical: 'center',
    lineHeight: 50, // Center text vertically
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
    marginBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  lastRow: {
    marginBottom: 5, // Minimal margin for the last row
  },
  emptyCluster: {
    width: 90, // Match the width of WeekCluster
    height: 90, // Match the height of WeekCluster
    margin: 5,
  },
  emptyText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  }
});

export default memo(WeekGridView);