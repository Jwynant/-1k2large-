import { View, Text, StyleSheet, Pressable, Dimensions, Alert, Modal as RNModal, TouchableWithoutFeedback, useWindowDimensions, ActivityIndicator, Animated } from 'react-native';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { MotiView } from 'moti';
import { ScrollView } from 'react-native';
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
import WeekExpandedView from './weeks/WeekExpandedView';
import BottomSheet from '../ui/BottomSheet';
import CellDetailView from './CellDetailView';
import ViewModeToggle from '../ui/ViewModeToggle';
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
  const [weekViewVisible, setWeekViewVisible] = useState(false);
  const [selectedYearForWeekView, setSelectedYearForWeekView] = useState<number | null>(null);
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
  
  // Animation values for week expanded view
  const weekExpandedViewOpacity = useSharedValue(0);
  const weekExpandedViewScale = useSharedValue(0.95);
  const weekExpandedViewTranslateY = useSharedValue(100);
  
  // Animation values for cell detail view
  const detailViewOpacity = useSharedValue(0);
  const detailViewScale = useSharedValue(0.95);
  
  // Simplify the animation approach to prevent crashes
  const gridOpacity = useSharedValue(1);
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>(viewMode);
  
  // Use Animated instead of Reanimated for simpler animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
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
  
  // Animated styles for week expanded view
  const weekExpandedViewAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: weekExpandedViewOpacity.value,
      transform: [
        { scale: weekExpandedViewScale.value },
        { translateY: weekExpandedViewTranslateY.value }
      ],
    };
  });
  
  // Get app context for user data
  const { state, dispatch } = useAppContext();
  
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
    const birthMonth = birthDate.getMonth();
    
    // Start from birth year
    let startYear = birthYear;
    let endYear = startYear + lifespan - 1;
    
    const clusterArray: Cluster[] = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Calculate the current age in years
    const ageInYears = currentYear - birthYear;
    
    // Adjust for birth month (if we haven't reached the birth month this year, subtract 1)
    const adjustedAge = currentMonth >= birthMonth ? ageInYears : ageInYears - 1;
    
    // The current year in the life grid is the birth year + adjusted age
    const currentGridYear = birthYear + adjustedAge;
    
    for (let year = startYear; year <= endYear; year++) {
      // Determine if this is the current year in the life grid
      // This is different from the calendar year - it's based on birth date
      const isCurrent = year === currentGridYear;
      
      // For the birth year and current year, we need special handling
      // For years in between, all months are in the past
      let isPast = false;
      
      if (year < currentGridYear) {
        // Years before the current grid year are fully in the past
        isPast = true;
      } else if (year === currentGridYear) {
        // Current grid year - some months are in the past
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
  const openMonthExpandedView = (year: number, position?: { x: number, y: number, width: number, height: number }) => {
    setSelectedYearForMonthView(year);
    
    // Reset animation values
    expandedViewOpacity.value = 0;
    expandedViewScale.value = 0.9;
    expandedViewTranslateY.value = 20;
    
    // Make the view visible immediately
    setMonthViewVisible(true);
    
    // Use requestAnimationFrame to ensure the view is mounted before starting animations
    requestAnimationFrame(() => {
      // Start animations
      expandedViewOpacity.value = withTiming(1, { duration: 300 });
      expandedViewScale.value = withTiming(1, { duration: 300 });
      expandedViewTranslateY.value = withTiming(0, { duration: 300 });
    });
  };

  // Close month expanded view with animation
  const closeMonthExpandedView = () => {
    // Start animations
    expandedViewOpacity.value = withTiming(0, { duration: 200 });
    expandedViewScale.value = withTiming(0.9, { duration: 200 });
    expandedViewTranslateY.value = withTiming(20, { duration: 200 });
    
    // Hide the view after animations complete
    setTimeout(() => {
      setMonthViewVisible(false);
    }, 200);
  };

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
  
  // Update active view mode when viewMode changes with animation
  useEffect(() => {
    if (activeViewMode !== viewMode) {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Update the active view mode after fade out
        setActiveViewMode(viewMode);
        
        // Fade in after a short delay
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 100);
      });
    }
  }, [viewMode, activeViewMode, fadeAnim]);
  
  // Open week expanded view with animation
  const openWeekExpandedView = (year: number, position?: { x: number, y: number, width: number, height: number }) => {
    setSelectedYearForWeekView(year);
    
    // Reset animation values
    weekExpandedViewOpacity.value = 0;
    weekExpandedViewScale.value = 0.9;
    weekExpandedViewTranslateY.value = 20;
    
    // Make the view visible immediately
    setWeekViewVisible(true);
    
    // Use requestAnimationFrame to ensure the view is mounted before starting animations
    requestAnimationFrame(() => {
      // Start animations
      weekExpandedViewOpacity.value = withTiming(1, { duration: 300 });
      weekExpandedViewScale.value = withTiming(1, { duration: 300 });
      weekExpandedViewTranslateY.value = withTiming(0, { duration: 300 });
    });
  };

  // Close week expanded view with animation
  const closeWeekExpandedView = () => {
    // Start animations
    weekExpandedViewOpacity.value = withTiming(0, { duration: 200 });
    weekExpandedViewScale.value = withTiming(0.9, { duration: 200 });
    weekExpandedViewTranslateY.value = withTiming(20, { duration: 200 });
    
    // Hide the view after animations complete
    setTimeout(() => {
      setWeekViewVisible(false);
    }, 200);
  };

  // Handle week press in the expanded view
  const handleWeekPress = useCallback((week: number) => {
    if (selectedYearForWeekView !== null) {
      handleCellPress(selectedYearForWeekView, undefined, week);
      closeWeekExpandedView();
    }
  }, [selectedYearForWeekView, handleCellPress]);
  
  // Render the grid view based on the current view mode
  const renderGridView = useCallback(() => {
    switch (activeViewMode) {
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
              console.log('Month cluster pressed:', year, position);
              // Open our custom MonthExpandedView with position
              openMonthExpandedView(year, position);
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
            onClusterPress={openWeekExpandedView}
            hasContent={hasContent}
          />
        );
      default:
        return null;
    }
  }, [activeViewMode, handleYearSelect, handleCellLongPress, handleCellPress, clusters, hasContent, openMonthExpandedView, openWeekExpandedView]);
  
  // Render the month expanded view
  const renderMonthExpandedView = () => {
    if (!monthViewVisible) return null;
    
    return (
      <Reanimated.View 
        style={[
          styles.expandedViewContainer,
          expandedViewAnimatedStyles
        ]}
      >
        <MonthExpandedView 
          year={selectedYearForMonthView || 0} 
          onMonthPress={(month) => handleMonthPress(selectedYearForMonthView || 0, month)}
          onClose={closeMonthExpandedView}
        />
      </Reanimated.View>
    );
  };
  
  // Render week expanded view
  const renderWeekExpandedView = () => {
    if (!weekViewVisible) return null;
    
    return (
      <Reanimated.View 
        style={[
          styles.expandedViewContainer,
          weekExpandedViewAnimatedStyles
        ]}
      >
        <WeekExpandedView 
          year={selectedYearForWeekView || 0} 
          onWeekPress={handleWeekPress}
          onClose={closeWeekExpandedView}
        />
      </Reanimated.View>
    );
  };
  
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
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
      
      {/* Grid view with fade animation */}
      <Animated.View style={[styles.gridContainer, { opacity: fadeAnim }]}>
        {renderGridView()}
      </Animated.View>
      
      {/* Month expanded view */}
      {renderMonthExpandedView()}
      
      {/* Week expanded view */}
      {renderWeekExpandedView()}
      
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
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 3,
    marginTop: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0A84FF',
    borderRadius: 3,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginHorizontal: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  progressLifespan: {
    fontSize: 12,
    color: '#8E8E93',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  displayModeToggleContainer: {
    alignItems: 'flex-end',
  },
  gridContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  detailViewOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 20,
  },
  expandedViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  monthViewOpacity: {
    opacity: 0,
  },
  monthViewScale: {
    scale: 0.9,
  },
  monthViewTranslateY: {
    translateY: 20,
  },
});