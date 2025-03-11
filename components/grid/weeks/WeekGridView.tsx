import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, useWindowDimensions } from 'react-native';
import { memo, useMemo } from 'react';
import { FlashList } from '@shopify/flash-list';
import WeekCluster from './WeekCluster';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import { useAppContext } from '../../../app/context/AppContext';
import WeekExpandedView from './WeekExpandedView';
import { useResponsiveLayout } from '../../../app/hooks/useResponsiveLayout';

// Define a cluster type for better type safety
type Cluster = { year: number; isCurrent: boolean } | null;

// Define a row item type for FlashList
type RowItem = {
  id: string;
  clusters: Cluster[];
  rowIndex: number;
  ageLabel: string;
};

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
  const { horizontalPadding } = useResponsiveLayout();
  const { height: windowHeight } = useWindowDimensions();
  const [expandedCluster, setExpandedCluster] = useState<number | null>(null);
  
  // Create a ref for the FlashList
  const flashListRef = useRef<FlashList<RowItem>>(null);
  
  // Track if initial scroll has been performed
  const hasScrolledRef = useRef(false);
  
  // Always use exactly 5 clusters per row
  const CLUSTERS_PER_ROW = 5;
  
  // Define the estimated row height for calculations
  const estimatedItemSize = 188; // Height of a row
  
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

  // Create a flat data structure for FlashList
  const rowData = useMemo(() => {
    return clusterRows.map((row, index) => ({
      id: `row-${index}`,
      clusters: row,
      rowIndex: index,
      ageLabel: ageLabels[index] || ""
    }));
  }, [clusterRows, ageLabels]);

  // Find the index of the row containing the current year
  const currentRowIndex = useMemo(() => {
    return findCurrentYearIndex(rowData);
  }, [rowData]);

  // Calculate the offset to center the current row
  const calculateCenteredOffset = useCallback(() => {
    // Get the header height (approximate)
    const headerHeight = 150; // Adjust based on your actual header height
    
    // Calculate the available viewport height
    const viewportHeight = windowHeight - headerHeight;
    
    // Calculate how many rows can fit in half the viewport
    const halfViewportRows = Math.floor(viewportHeight / (estimatedItemSize * 2));
    
    // Calculate the offset to center the current row
    // If currentRowIndex is less than halfViewportRows, we don't need to scroll
    if (currentRowIndex < halfViewportRows) {
      return 0;
    }
    
    // Calculate the offset to center the current row
    const offset = (currentRowIndex - halfViewportRows) * estimatedItemSize;
    
    return offset;
  }, [currentRowIndex, windowHeight, estimatedItemSize]);

  // Scroll to center the current row after initial render
  useEffect(() => {
    if (flashListRef.current && rowData.length > 0 && !hasScrolledRef.current && !expandedCluster) {
      // Use a small timeout to ensure the list is fully rendered before scrolling
      const timer = setTimeout(() => {
        const offset = calculateCenteredOffset();
        flashListRef.current?.scrollToOffset({ offset, animated: false });
        hasScrolledRef.current = true;
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [rowData, calculateCenteredOffset, expandedCluster]);

  // Reset scroll flag when data changes significantly
  useEffect(() => {
    hasScrolledRef.current = false;
  }, [clusters.length]);

  const handleClusterPress = useCallback((year: number, position: { x: number, y: number, width: number, height: number }) => {
    onClusterPress(year, position);
    setExpandedCluster(year);
  }, [onClusterPress]);
  
  const handleCloseExpanded = useCallback(() => {
    setExpandedCluster(null);
    // Reset scroll flag to allow re-centering when returning from expanded view
    hasScrolledRef.current = false;
  }, []);
  
  const handleWeekPress = useCallback((week: number) => {
    if (expandedCluster !== null) {
      onCellPress(expandedCluster, undefined, week);
      setExpandedCluster(null);
    }
  }, [expandedCluster, onCellPress]);

  // Render a row item for FlashList
  const renderRow = useCallback(({ item }: { item: RowItem }) => {
    return (
      <View style={styles.rowContainer}>
        {/* Age label */}
        <Text style={styles.ageLabel}>
          {item.ageLabel}
        </Text>
        
        {/* Clusters in this row */}
        <View style={[
          styles.row,
          // Reduce bottom margin for the last row
          item.rowIndex === clusterRows.length - 1 && styles.lastRow
        ]}>
          {item.clusters.map((cluster: Cluster, colIndex: number) => {
            if (cluster === null) {
              // Render an empty placeholder to maintain grid structure
              return <View key={`empty-${item.rowIndex}-${colIndex}`} style={styles.emptyCluster} />;
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
      </View>
    );
  }, [clusterRows.length, handleClusterPress, onCellPress, onLongPress, hasContent, getBirthDate]);

  // Key extractor for FlashList
  const keyExtractor = useCallback((item: RowItem) => item.id, []);

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
  if (rowData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.grid}>
          <Text style={styles.emptyText}>No weeks available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        ref={flashListRef}
        data={rowData}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
        estimatedItemSize={estimatedItemSize}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContentContainer}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        overrideItemLayout={(layout, item) => {
          layout.size = estimatedItemSize;
        }}
      />
    </View>
  );
}

// Helper function to find the index of the row containing the current year
function findCurrentYearIndex(rowData: RowItem[]): number {
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < rowData.length; i++) {
    const currentRow = rowData[i].clusters;
    for (const cluster of currentRow) {
      if (cluster && cluster.isCurrent) {
        return i;
      }
    }
  }
  
  // Default to the middle if current year not found
  return Math.floor(rowData.length / 2);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode
  },
  scrollContentContainer: {
    paddingBottom: 5, // Minimal bottom padding
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageLabel: {
    fontSize: 14,
    color: '#aaa', // Light gray for dark mode
    fontWeight: '500',
    width: 30,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  lastRow: {
    marginBottom: 5, // Minimal margin for the last row
  },
  emptyCluster: {
    width: 59, // Match the width of WeekCluster
    height: 166, // Match the height of WeekCluster
    margin: 1,
  },
  grid: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 10,
  },
  emptyText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  }
});

export default memo(WeekGridView);