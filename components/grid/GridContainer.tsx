import { View, Text, StyleSheet, Pressable, Dimensions, Alert, Modal, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { MotiView } from 'moti';
import { Animated, ScrollView } from 'react-native';
import Reanimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import YearGridView from './years/YearGridView';
import MonthGridView from './months/MonthGridView';
import WeekGridView from './weeks/WeekGridView';
import MonthExpandedView from './months/MonthExpandedView';
import BottomSheet from '../ui/BottomSheet';
import CellDetailView from './CellDetailView';
import ViewModeToggle from '../ui/ViewModeToggle';
import DisplayModeToggle from '../ui/DisplayModeToggle';
import TimelineView from '../timeline/TimelineView';
import { useGridNavigation } from '../../app/hooks/useGridNavigation';
import { useContentManagement } from '../../app/hooks/useContentManagement';
import { useDateCalculations } from '../../app/hooks/useDateCalculations';
import { useAppContext } from '../../app/context/AppContext';
import QuickAddMenu from '../ui/QuickAddMenu';
import { ViewMode, ViewState, ClusterPosition, SelectedCell, Cluster, DisplayMode } from '../../app/types';

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
  const { 
    isCurrentYear, 
    isCurrentMonth, 
    isCurrentWeek, 
    getPreciseAge,
    getLifeProgress,
    getStartMonth,
    getAlignedDate,
    getYearOffset
  } = useDateCalculations();
  
  // Local state
  const [detailSheetVisible, setDetailSheetVisible] = useState(false);
  const [quickAddVisible, setQuickAddVisible] = useState(false);
  const [quickAddPosition, setQuickAddPosition] = useState<Position>({ x: 0, y: 0 });
  const [monthViewVisible, setMonthViewVisible] = useState(false);
  const [selectedYearForMonthView, setSelectedYearForMonthView] = useState<number | null>(null);
  const [selectedClusterPosition, setSelectedClusterPosition] = useState({ x: 0, y: 0 });
  const [fromMonthView, setFromMonthView] = useState(false);
  
  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // Window dimensions
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  
  // Animation values for transitions
  const expandedViewOpacity = useSharedValue(0);
  const expandedViewScale = useSharedValue(0.95);
  const expandedViewTranslateY = useSharedValue(100);
  
  // Animation values for cell detail view
  const detailViewOpacity = useSharedValue(0);
  const detailViewScale = useSharedValue(0.95);
  
  // Animated styles - define these at the component level, not inside render functions
  const expandedViewAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: expandedViewOpacity.value,
      transform: [
        { scale: expandedViewScale.value },
        { translateY: expandedViewTranslateY.value }
      ],
    };
  });
  
  const expandedViewOverlayAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: expandedViewOpacity.value * 0.7, // Dim the background slightly less than full opacity
    };
  });
  
  const detailViewAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: detailViewOpacity.value,
      transform: [
        { scale: detailViewScale.value }
      ],
    };
  });
  
  const detailViewOverlayAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: detailViewOpacity.value * 0.7, // Dim the background
    };
  });
  
  // Get app context for user data and display mode
  const { state, dispatch } = useAppContext();
  const displayMode = state.displayMode || 'grid'; // Default to grid if not set
  
  // Calculate grid dimensions
  const gridWidth = windowWidth;
  const gridHeight = windowHeight - 100; // Further reduced to give more space to the grid
  
  // Generate clusters based on birth year and user lifespan
  const clusters = useMemo(() => {
    const lifespan = state.userSettings?.lifeExpectancy || 83;
    const birthDate = state.userBirthDate ? new Date(state.userBirthDate) : null;
    
    if (!birthDate) {
      const currentYear = new Date().getFullYear();
      return [{ year: currentYear, isCurrent: true, isPast: false }];
    }
    
    const birthYear = birthDate.getFullYear();
    
    // Start from birth year
    let startYear = birthYear;
    let endYear = startYear + lifespan - 1;
    
    const clusterArray: Cluster[] = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    for (let year = startYear; year <= endYear; year++) {
      // Determine if this is the current year
      const isCurrent = year === currentYear;
      
      // For the birth year and current year, we need special handling
      // For years in between, all months are in the past
      let isPast = false;
      
      if (year < currentYear && year > birthYear) {
        // Years between birth and current are fully in the past
        isPast = true;
      } else if (year === birthYear && year === currentYear) {
        // Both birth year and current year - check if any months have passed
        isPast = birthDate.getMonth() <= currentMonth;
      } else if (year === birthYear) {
        // Birth year - some months are in the past
        isPast = true;
      } else if (year === currentYear) {
        // Current year - some months are in the past
        isPast = true;
      }
      
      clusterArray.push({
        year,
        isCurrent,
        isPast
      });
    }
    
    return clusterArray;
  }, [state.userBirthDate, state.userSettings?.lifeExpectancy]);
  
  // Use the centralized age calculation
  const preciseAge = useMemo(() => {
    return getPreciseAge();
  }, [getPreciseAge]);
  
  // Format current date
  const formattedDate = useMemo(() => {
    return format(new Date(), 'MMMM d, yyyy');
  }, []);
  
  // Calculate life progress percentage using centralized method
  const lifeProgressPercentage = useMemo(() => {
    return getLifeProgress(80); // 80 years as default life expectancy
  }, [getLifeProgress]);
  
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
  
  // Open month expanded view with animation
  const openMonthExpandedView = useCallback((year: number, position?: Position) => {
    // Store the position of the cluster that was clicked for origin-based animation
    if (position) {
      setSelectedClusterPosition(position);
    }
    
    setSelectedYearForMonthView(year);
    
    // Start animations
    expandedViewOpacity.value = 0;
    expandedViewScale.value = 0.95;
    expandedViewTranslateY.value = 50;
    
    // Animate in the expanded view
    expandedViewOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
    expandedViewScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    expandedViewTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
    
    setMonthViewVisible(true);
  }, []);

  // Close month expanded view with animation
  const closeMonthExpandedView = useCallback(() => {
    // Animate out
    expandedViewOpacity.value = withTiming(0, { duration: 250, easing: Easing.in(Easing.ease) }, () => {
      // When animation is complete, hide the view
      runOnJS(setMonthViewVisible)(false);
      runOnJS(setSelectedYearForMonthView)(null);
    });
    expandedViewScale.value = withTiming(0.95, { duration: 250 });
    expandedViewTranslateY.value = withTiming(50, { duration: 250 });
  }, []);

  // Handle month press in the expanded view
  const handleMonthPress = useCallback((month: number) => {
    if (selectedYearForMonthView !== null) {
      setFromMonthView(true);
      handleCellPress(selectedYearForMonthView, month);
      closeMonthExpandedView();
    }
  }, [selectedYearForMonthView, handleCellPress, closeMonthExpandedView]);
  
  // Effect to handle cell detail view animations
  useEffect(() => {
    if (selectedCell) {
      // Animate in the detail view
      detailViewOpacity.value = withTiming(1, { duration: 300 });
      detailViewScale.value = withSpring(1, { damping: 15, stiffness: 100 });
      setDetailSheetVisible(true);
    }
  }, [selectedCell]);
  
  // Handle cell detail view close with animation
  const handleCellDetailClose = useCallback(() => {
    // Animate out
    detailViewOpacity.value = withTiming(0, { duration: 250 }, () => {
      // When animation is complete, hide the view
      runOnJS(setDetailSheetVisible)(false);
      runOnJS(setFromMonthView)(false);
    });
    detailViewScale.value = withTiming(0.95, { duration: 250 });
  }, []);
  
  // Handle back to month view
  const handleBackToMonthView = useCallback(() => {
    // Close the cell detail view
    handleCellDetailClose();
    
    // Reopen the month expanded view
    if (selectedCell?.year) {
      setTimeout(() => {
        openMonthExpandedView(selectedCell.year);
      }, 300); // Delay slightly to allow detail view to close
    }
  }, [handleCellDetailClose, selectedCell, openMonthExpandedView]);
  
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

  // Render month expanded view with enhanced animation
  const renderMonthExpandedView = useCallback(() => {
    if (!monthViewVisible) return null;
    
    return (
      <View style={styles.animatedModalContainer}>
        <Reanimated.View 
          style={[styles.modalOverlay, expandedViewOverlayAnimatedStyles]} 
          pointerEvents="auto"
        >
          <Pressable 
            style={{ flex: 1 }} 
            onPress={closeMonthExpandedView}
          />
        </Reanimated.View>
        
        <Reanimated.View style={[styles.expandedViewContainer, expandedViewAnimatedStyles]}>
          {selectedYearForMonthView !== null && (
            <MonthExpandedView
              year={selectedYearForMonthView}
              onClose={closeMonthExpandedView}
              onMonthPress={handleMonthPress}
            />
          )}
        </Reanimated.View>
      </View>
    );
  }, [monthViewVisible, selectedYearForMonthView, closeMonthExpandedView, handleMonthPress, expandedViewAnimatedStyles, expandedViewOverlayAnimatedStyles]);
  
  // Render the cell detail view if a cell is selected with enhanced animation
  const renderCellDetailView = useCallback(() => {
    if (!detailSheetVisible || !selectedCell) return null;
    
    return (
      <Reanimated.View
        style={[
          StyleSheet.absoluteFill,
          styles.detailViewOverlay,
          detailViewOverlayAnimatedStyles
        ]}
      >
        <CellDetailView
          selectedCell={selectedCell}
          onClose={handleCellDetailClose}
          onBack={handleBackToMonthView}
          showBackButton={fromMonthView}
        />
      </Reanimated.View>
    );
  }, [detailSheetVisible, selectedCell, handleCellDetailClose, detailViewOverlayAnimatedStyles, fromMonthView, handleBackToMonthView]);
  
  // Handle display mode toggle
  const handleDisplayModeChange = useCallback((mode: DisplayMode) => {
    dispatch({ type: 'SET_DISPLAY_MODE', payload: mode });
  }, [dispatch]);
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          
          {/* Display mode toggle (grid/timeline) */}
          <View style={styles.displayModeToggleContainer}>
            <DisplayModeToggle 
              currentMode={displayMode}
              onModeChange={handleDisplayModeChange}
            />
          </View>
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
        
        {/* View mode toggle - only show in grid mode */}
        {displayMode === 'grid' && (
          <View style={styles.toggleContainer}>
            <ViewModeToggle 
              currentMode={viewMode}
              onModeChange={setViewMode}
            />
          </View>
        )}
      </View>
      
      {/* Main content area */}
      <View style={styles.gridContainer}>
        {displayMode === 'grid' ? (
          renderGridView()
        ) : (
          <TimelineView />
        )}
      </View>
      
      {/* Month expanded view - only in grid mode */}
      {displayMode === 'grid' && renderMonthExpandedView()}
      
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
    padding: 8, // Further reduced padding
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E', // iOS system gray 6
  },
  headerTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4, // Further reduced margin
  },
  headerDateAgeContainer: {
    flex: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 14, 
    color: '#FFFFFF', // White text
    fontWeight: '500',
  },
  ageText: {
    fontSize: 12, 
    color: '#FFFFFF', // White text
    fontWeight: '500',
    opacity: 0.8,
    marginTop: 2,
  },
  progressContainer: {
    height: 12, // Further reduced height
    backgroundColor: '#2C2C2E', // iOS system gray 6
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 6,
    marginBottom: 0,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0A84FF', // iOS blue
    borderRadius: 6,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 6,
    right: 6,
    top: 0,
    bottom: 0,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 9, // Further reduced font size
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressLifespan: {
    fontSize: 9, // Further reduced font size
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.7,
  },
  toggleContainer: {
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  gridContainer: {
    flex: 1,
    padding: 4, // Reduced padding
  },
  // New styles for animated modals
  animatedModalContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  expandedViewContainer: {
    width: '90%',
    height: '85%',
    backgroundColor: '#121212',
    borderRadius: 16,
    overflow: 'hidden',
  },
  detailViewContainer: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: 16,
  },
  detailViewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayModeToggleContainer: {
    position: 'absolute',
    right: 16,
    top: 0,
    zIndex: 10,
  },
});