import { View, Text, StyleSheet, Pressable, Dimensions, Alert, Modal, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { MotiView } from 'moti';
import { Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import YearGridView from './years/YearGridView';
import MonthGridView from './months/MonthGridView';
import WeekGridView from './weeks/WeekGridView';
import MonthExpandedView from './months/MonthExpandedView';
import BottomSheet from '../ui/BottomSheet';
import CellDetailView from './CellDetailView';
import ViewModeToggle from '../ui/ViewModeToggle';
import { useGridNavigation } from '../../app/hooks/useGridNavigation';
import { useContentManagement } from '../../app/hooks/useContentManagement';
import { useDateCalculations } from '../../app/hooks/useDateCalculations';
import { useAppContext } from '../../app/context/AppContext';
import QuickAddMenu from '../ui/QuickAddMenu';
import { ViewMode, ViewState, ClusterPosition, SelectedCell, Cluster } from '../../app/types';

type Position = {
  x: number;
  y: number;
};

export default function GridContainer() {
  // Use our custom hooks
  const {
    viewMode,
    viewState,
    selectedYear,
    selectedCell,
    handleYearSelect,
    handleClusterClose,
    handleCellPress,
    setViewMode,
  } = useGridNavigation();
  
  const { getCellContent, hasContent } = useContentManagement();
  const { isCurrentYear, isCurrentMonth, isCurrentWeek, userAge } = useDateCalculations();
  
  // Local state
  const [detailSheetVisible, setDetailSheetVisible] = useState(false);
  const [quickAddVisible, setQuickAddVisible] = useState(false);
  const [quickAddPosition, setQuickAddPosition] = useState<Position>({ x: 0, y: 0 });
  const [monthViewVisible, setMonthViewVisible] = useState(false);
  const [selectedYearForMonthView, setSelectedYearForMonthView] = useState<number | null>(null);
  
  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // Window dimensions
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  
  // Calculate grid dimensions
  const gridWidth = windowWidth;
  const gridHeight = windowHeight - 150; // Adjust for header/footer
  
  // Generate clusters based on current year and user lifespan
  const clusters = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const lifespan = 83; // Default lifespan, could be from settings
    
    // Use a fixed starting point for grid structure (age 0)
    // This ensures grid structure doesn't change when birth date changes
    const startYear = currentYear - 40; // Show some history
    const endYear = currentYear + 60; // Show future up to typical lifespan
    
    const clusterArray: Cluster[] = [];
    for (let year = startYear; year <= endYear; year++) {
      clusterArray.push({
        year,
        isCurrent: year === currentYear
      });
    }
    return clusterArray;
  }, []);
  
  // Handle view mode toggle
  const toggleViewMode = useCallback(() => {
    if (viewMode === 'years') {
      setViewMode('months');
    } else if (viewMode === 'months') {
      setViewMode('weeks');
    } else {
      setViewMode('years');
    }
  }, [viewMode, setViewMode]);
  
  // Handle cell long press for quick add menu
  const handleCellLongPress = useCallback((year: number, month?: number, week?: number, position?: Position) => {
    if (position) {
      setQuickAddPosition(position);
      setQuickAddVisible(true);
      
      // Set the selected cell for the quick add menu
      handleCellPress(year, month, week);
    }
  }, [handleCellPress]);
  
  // Handle quick add menu close
  const handleQuickAddClose = useCallback(() => {
    setQuickAddVisible(false);
  }, []);
  
  // Handle cell detail view open
  const handleCellDetailOpen = useCallback(() => {
    setDetailSheetVisible(true);
  }, []);
  
  // Handle cell detail view close
  const handleCellDetailClose = useCallback(() => {
    setDetailSheetVisible(false);
  }, []);

  // Open month expanded view
  const openMonthExpandedView = useCallback((year: number) => {
    setSelectedYearForMonthView(year);
    setMonthViewVisible(true);
  }, []);

  // Close month expanded view
  const closeMonthExpandedView = useCallback(() => {
    setMonthViewVisible(false);
    setSelectedYearForMonthView(null);
  }, []);

  // Handle month press in the expanded view
  const handleMonthPress = useCallback((month: number) => {
    if (selectedYearForMonthView !== null) {
      handleCellPress(selectedYearForMonthView, month);
      closeMonthExpandedView();
    }
  }, [selectedYearForMonthView, handleCellPress, closeMonthExpandedView]);
  
  // Effect to open detail sheet when a cell is selected
  useEffect(() => {
    if (selectedCell) {
      setDetailSheetVisible(true);
    }
  }, [selectedCell]);
  
  // Render the appropriate grid view based on view mode
  const renderGridView = useCallback(() => {
    switch (viewMode) {
      case 'years':
        return (
          <YearGridView
            clusters={clusters}
            onCellPress={handleCellPress}
            onLongPress={handleCellLongPress}
            onClusterPress={(year, position) => {
              handleYearSelect(year);
            }}
            hasContent={hasContent}
          />
        );
      case 'months':
        return (
          <MonthGridView
            clusters={clusters}
            onCellPress={handleCellPress}
            onLongPress={handleCellLongPress}
            onClusterPress={(year, position) => {
              // Open our custom MonthExpandedView
              openMonthExpandedView(year);
            }}
            hasContent={hasContent}
          />
        );
      case 'weeks':
        return (
          <WeekGridView
            clusters={clusters}
            onCellPress={handleCellPress}
            onLongPress={handleCellLongPress}
            onClusterPress={(year, position) => {
              // WeekGridView now handles expanded view internally
              // We still need to pass the handler for position tracking
            }}
            hasContent={hasContent}
          />
        );
      default:
        return null;
    }
  }, [viewMode, handleYearSelect, handleCellLongPress, handleCellPress, clusters, hasContent, openMonthExpandedView]);

  // Render month expanded view
  const renderMonthExpandedView = useCallback(() => {
    if (monthViewVisible && selectedYearForMonthView !== null) {
      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={monthViewVisible}
          onRequestClose={closeMonthExpandedView}
        >
          <MonthExpandedView
            year={selectedYearForMonthView}
            onClose={closeMonthExpandedView}
            onMonthPress={handleMonthPress}
          />
        </Modal>
      );
    }
    return null;
  }, [monthViewVisible, selectedYearForMonthView, closeMonthExpandedView, handleMonthPress]);
  
  // Render the cell detail view if a cell is selected
  const renderCellDetailView = useCallback(() => {
    if (detailSheetVisible && selectedCell) {
      return (
        <BottomSheet
          visible={detailSheetVisible}
          onClose={handleCellDetailClose}
          content={<CellDetailView selectedCell={selectedCell} onClose={handleCellDetailClose} />}
        />
      );
    }
    return null;
  }, [detailSheetVisible, selectedCell, handleCellDetailClose]);
  
  // Calculate current age with precision
  const { state } = useAppContext();
  
  const preciseAge = useMemo(() => {
    if (!state.userBirthDate) return "Age not set";
    
    const birthDate = new Date(state.userBirthDate);
    const now = new Date();
    
    // Get difference in milliseconds
    const diffMs = now.getTime() - birthDate.getTime();
    
    // Calculate years
    const years = now.getFullYear() - birthDate.getFullYear();
    
    // Calculate months (adjust if birthday hasn't occurred yet this year)
    let months = now.getMonth() - birthDate.getMonth();
    if (now.getDate() < birthDate.getDate()) {
      months--;
    }
    // Adjust for negative months (birthday hasn't occurred yet this year)
    months = (months < 0) ? months + 12 : months;
    
    // Calculate days remaining after accounting for years and months
    const tempDate = new Date(birthDate);
    tempDate.setFullYear(tempDate.getFullYear() + years);
    tempDate.setMonth(tempDate.getMonth() + months);
    
    // Get days difference
    let days = now.getDate() - tempDate.getDate();
    if (days < 0) {
      // Get days in previous month
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    // Calculate weeks and remaining days
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    
    // Build the age string
    let ageString = `${years} ${years === 1 ? 'Year' : 'Years'}`;
    ageString += `, ${months} ${months === 1 ? 'Month' : 'Months'}`;
    ageString += `, ${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`;
    ageString += `, ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}`;
    
    return ageString;
  }, [state.userBirthDate]);
  
  // Format current date
  const formattedDate = useMemo(() => {
    return format(new Date(), 'MMMM d, yyyy');
  }, []);
  
  // Calculate life progress percentage
  const lifeProgressPercentage = useMemo(() => {
    if (!state.userBirthDate) return 0;
    
    const birthDate = new Date(state.userBirthDate);
    const now = new Date();
    
    // Default lifespan in years
    const lifespanYears = 80;
    
    // Calculate total milliseconds in the expected lifespan
    const lifespanMs = lifespanYears * 365.25 * 24 * 60 * 60 * 1000;
    
    // Calculate how much time has been lived so far
    const livedMs = now.getTime() - birthDate.getTime();
    
    // Calculate the percentage (capped at 100%)
    const percentage = (livedMs / lifespanMs) * 100;
    return Math.min(100, Math.max(0, percentage));
  }, [state.userBirthDate]);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        
        {/* Age text */}
        <Text style={styles.ageText}>{preciseAge}</Text>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${lifeProgressPercentage}%` }]} />
          <View style={styles.progressBarLabels}>
            <Text style={styles.progressText}>{Math.round(lifeProgressPercentage)}% of life lived</Text>
            <Text style={styles.progressLifespan}>80 years</Text>
          </View>
        </View>
        
        {/* View mode toggle */}
        <View style={styles.toggleContainer}>
          <ViewModeToggle 
            currentMode={viewMode}
            onModeChange={setViewMode}
          />
        </View>
      </View>
      
      {/* Main grid view */}
      <View style={styles.gridContainer}>
        {renderGridView()}
      </View>
      
      {/* Month expanded view */}
      {renderMonthExpandedView()}
      
      {/* Cell detail view */}
      {renderCellDetailView()}
      
      {/* Quick add menu */}
      <QuickAddMenu
        visible={quickAddVisible}
        position={quickAddPosition}
        onClose={handleQuickAddClose}
        selectedCell={selectedCell || { year: new Date().getFullYear() }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode background
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E', // iOS system gray 6
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#FFFFFF', // White text
    fontWeight: '500',
  },
  ageText: {
    fontSize: 14,
    color: '#FFFFFF', // White text
    fontWeight: '500',
    marginBottom: 12,
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#2C2C2E', // iOS system gray 6
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0A84FF', // iOS blue
    borderRadius: 10,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 8,
    right: 8,
    top: 0,
    bottom: 0,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressLifespan: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.7,
  },
  toggleContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  gridContainer: {
    flex: 1,
    padding: 8,
  },
});