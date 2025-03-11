import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { FlashList } from '@shopify/flash-list';
import YearCell from './YearCell';
import { useAppContext } from '../../../app/context/AppContext';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';
import { useResponsiveLayout } from '../../../app/hooks/useResponsiveLayout';

// Define a row item type for FlashList
type RowItem = {
  id: string;
  years: number[];
  rowIndex: number;
};

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
  const { width, height: windowHeight } = useWindowDimensions();
  const { state } = useAppContext();
  const { getAgeForYear, isUserBirthYear } = useDateCalculations();
  const { horizontalPadding } = useResponsiveLayout();
  
  // Create a ref for the FlashList
  const flashListRef = useRef<FlashList<RowItem>>(null);
  
  // Track if initial scroll has been performed
  const hasScrolledRef = useRef(false);
  
  // Define the estimated row height for calculations
  const estimatedItemSize = 36; // Height of a row
  
  // Get the current year to determine which cells should be filled
  const currentYear = new Date().getFullYear();

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

  // Create a flat data structure for FlashList
  const rowData = useMemo(() => {
    return yearRows.map((years, index) => ({
      id: `row-${index}`,
      years,
      rowIndex: index
    }));
  }, [yearRows]);

  // Find the index of the row containing the current year
  const currentRowIndex = useMemo(() => {
    return findCurrentYearIndex(rowData, currentYear);
  }, [rowData, currentYear]);

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
    if (flashListRef.current && rowData.length > 0 && !hasScrolledRef.current) {
      // Use a small timeout to ensure the list is fully rendered before scrolling
      const timer = setTimeout(() => {
        const offset = calculateCenteredOffset();
        flashListRef.current?.scrollToOffset({ offset, animated: false });
        hasScrolledRef.current = true;
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [rowData, calculateCenteredOffset]);

  // Reset scroll flag when data changes significantly
  useEffect(() => {
    hasScrolledRef.current = false;
  }, [clusters.length]);

  // Render a row item for FlashList
  const renderRow = useCallback(({ item }: { item: RowItem }) => {
    return (
      <View style={styles.yearRow}>
        {item.years.map((year: number) => {
          const isPast = year < currentYear;
          const isCurrent = year === currentYear;
          const hasContentForYear = hasContent(year);
          const age = getAgeForYear(year);
          const isBirthYear = isUserBirthYear(year);
          
          return (
            <YearCell 
              key={year} 
              year={year}
              age={age}
              isPast={isPast}
              isCurrent={isCurrent}
              isBirthYear={isBirthYear}
              hasContent={hasContentForYear}
              onPress={() => onCellPress(year)}
              onLongPress={(position) => 
                onLongPress(year, undefined, undefined, position)
              }
            />
          );
        })}
      </View>
    );
  }, [currentYear, hasContent, getAgeForYear, isUserBirthYear, onCellPress, onLongPress]);

  // Key extractor for FlashList
  const keyExtractor = useCallback((item: RowItem) => item.id, []);

  // Fallback if no years
  if (rowData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.gridLayout}>
          <View style={styles.yearsContainer}>
            <Text style={styles.emptyText}>No years available</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.gridLayout}>
        <View style={styles.yearsContainer}>
          <FlashList
            ref={flashListRef}
            data={rowData}
            renderItem={renderRow}
            keyExtractor={keyExtractor}
            estimatedItemSize={estimatedItemSize}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.contentContainer}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
            overrideItemLayout={(layout, item) => {
              layout.size = estimatedItemSize;
            }}
          />
        </View>
      </View>
    </View>
  );
}

// Helper function to find the index of the row containing the current year
function findCurrentYearIndex(rowData: RowItem[], currentYear: number): number {
  for (let i = 0; i < rowData.length; i++) {
    if (rowData[i].years.includes(currentYear)) {
      return i;
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
  contentContainer: {
    paddingTop: 15,
    paddingBottom: 5, // Reduced bottom padding
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