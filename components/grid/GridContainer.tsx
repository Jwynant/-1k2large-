import { View, Text, StyleSheet, Pressable, Dimensions, Alert } from 'react-native';
import { useState, useCallback, useRef, useEffect } from 'react';
import { MotiView } from 'moti';
import { Animated, PanResponder } from 'react-native';
import YearGridView from './years/YearGridView';
import MonthGridView from './months/MonthGridView';
import WeekGridView from './weeks/WeekGridView';
import ExpandedClusterView from './ExpandedClusterView';
import { ScrollView } from 'react-native';
import BottomSheet from '../ui/BottomSheet';
import { useGridNavigation } from '../../app/hooks/useGridNavigation';
import { useContentManagement } from '../../app/hooks/useContentManagement';
import { useDateCalculations } from '../../app/hooks/useDateCalculations';
import QuickAddMenu from '../ui/QuickAddMenu';

type ViewMode = 'weeks' | 'months' | 'years';
type ViewState = 'grid' | 'cluster';

// Mock data for content
type ContentItem = {
  id: string;
  title: string;
  date: string;
  type: 'memory' | 'lesson' | 'goal' | 'reflection';
  notes?: string;
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
    setViewMode
  } = useGridNavigation();
  
  const { getCellContent, hasContent } = useContentManagement();
  const { userAge } = useDateCalculations();
  
  // Local UI state
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isQuickAddVisible, setIsQuickAddVisible] = useState(false);
  const [quickAddPosition, setQuickAddPosition] = useState({ x: 0, y: 0 });
  
  // Animation values for swipe gesture
  const expandedViewY = useRef(new Animated.Value(0)).current;
  const expandedViewOpacity = useRef(new Animated.Value(1)).current;
  const gridOpacity = useRef(new Animated.Value(1)).current;
  const gridScale = useRef(new Animated.Value(1)).current;
  
  const totalYears = 80;

  // Generate clusters data
  const clusters = Array.from({ length: totalYears }, (_, i) => ({
    year: i,
    isCurrent: i === userAge,
  }));

  // Mock content data
  const mockContent: Record<string, ContentItem[]> = {
    '23-4': [
      { id: '1', title: 'Started new job', date: '2023-05-15', type: 'memory', notes: 'First day at the new company' },
      { id: '2', title: 'Learned about system design', date: '2023-05-20', type: 'lesson', notes: 'Studied scalability patterns' }
    ],
    '36-2': [
      { id: '3', title: 'Run 5k', date: '2024-03-10', type: 'goal' }
    ],
    '23': [
      { id: '4', title: 'Graduated college', date: '2023-06-15', type: 'memory', notes: 'Received my degree in Computer Science' },
      { id: '5', title: 'Moved to a new city', date: '2023-07-01', type: 'memory' }
    ],
    '36': [
      { id: '6', title: 'Career milestone', date: '2024-01-15', type: 'memory', notes: 'Promoted to senior position' },
      { id: '7', title: 'Learn to delegate', date: '2024-02-10', type: 'lesson', notes: 'Important leadership skill' }
    ]
  };

  // Create pan responder for swipe down gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => viewState === 'cluster',
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical gestures when in cluster view
        return viewState === 'cluster' && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward movement
        if (gestureState.dy > 0) {
          expandedViewY.setValue(gestureState.dy);
          // Decrease opacity as user swipes down
          expandedViewOpacity.setValue(1 - (gestureState.dy / 300));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // If swiped down far enough, close the expanded view
          console.log('Swipe down detected, closing cluster view');
          Animated.timing(expandedViewOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            handleClusterClose();
          });
        } else {
          // Otherwise, reset position
          Animated.spring(expandedViewY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          Animated.spring(expandedViewOpacity, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Handle cell press to show bottom sheet
  const handleCellPressWithContent = (year: number, month?: number, week?: number) => {
    handleCellPress(year, month, week);
    setIsBottomSheetVisible(true);
  };

  // Handle long press on a cell to show quick-add menu
  const handleCellLongPress = (year: number, month?: number, week?: number, position?: { x: number, y: number }) => {
    if (position) {
      setQuickAddPosition(position);
    }
    handleCellPress(year, month, week);
    setIsQuickAddVisible(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  const handleCloseQuickAdd = () => {
    setIsQuickAddVisible(false);
  };

  // Animate between grid and cluster views
  useEffect(() => {
    if (viewState === 'cluster') {
      // Animate to cluster view
      expandedViewY.setValue(0);
      expandedViewOpacity.setValue(1);
      
      Animated.parallel([
        Animated.timing(gridOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(gridScale, {
          toValue: 0.95,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Animate to grid view
      Animated.parallel([
        Animated.timing(gridOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(gridScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [viewState]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <Text style={styles.date}>May 8th 2025</Text>
        <Text style={styles.timeLeft}>23 years, 6 months, 3 weeks, 1 day</Text>
        <View style={styles.progress}>
          <View style={[styles.progressBar, { width: `${(userAge / totalYears) * 100}%` }]} />
        </View>
        <View style={styles.viewModes}>
          <Pressable
            style={[styles.viewModeButton, viewMode === 'weeks' && styles.viewModeActive]}
            onPress={() => setViewMode('weeks')}>
            <Text style={[styles.viewModeText, viewMode === 'weeks' && styles.viewModeTextActive, styles.activeText]}>
              Weeks
            </Text>
          </Pressable>
          <Pressable
            style={[styles.viewModeButton, viewMode === 'months' && styles.viewModeActive]}
            onPress={() => setViewMode('months')}>
            <Text style={[styles.viewModeText, viewMode === 'months' && styles.viewModeTextActive]}>
              Months
            </Text>
          </Pressable>
          <Pressable
            style={[styles.viewModeButton, viewMode === 'years' && styles.viewModeActive]}
            onPress={() => setViewMode('years')}>
            <Text style={[styles.viewModeText, viewMode === 'years' && styles.viewModeTextActive, styles.activeText]}>
              Years
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.gridScroll} scrollEnabled={viewState === 'grid'}>
        <Animated.View
          style={[
            styles.grid, 
            {
              opacity: gridOpacity,
              transform: [{ scale: gridScale }]
            }
          ]}
        > 
          {viewMode === 'years' && (
            <YearGridView 
              clusters={clusters} 
              onSelectYear={handleYearSelect}
              onLongPress={handleCellLongPress}
            />
          )}
          {viewMode === 'months' && (
            <MonthGridView 
              clusters={clusters} 
              onSelectYear={handleYearSelect}
              onLongPress={handleCellLongPress}
            />
          )}
          {viewMode === 'weeks' && (
            <WeekGridView 
              clusters={clusters} 
              onSelectYear={handleYearSelect}
              onCellPress={handleCellPressWithContent}
              onLongPress={handleCellLongPress}
            />
          )}
        </Animated.View>
      </ScrollView>
      
      {/* Expanded Cluster View with Animated container for swipe gestures */}
      {viewState === 'cluster' && selectedYear !== null && (
        <Animated.View 
          style={[
            styles.expandedContainer,
            {
              transform: [{ translateY: expandedViewY }],
              opacity: expandedViewOpacity
            }
          ]}
        >
          <ExpandedClusterView
            year={selectedYear}
            isCurrent={selectedYear === userAge}
            onClose={handleClusterClose}
            onCellPress={handleCellPressWithContent}
            onLongPress={(month, position) => handleCellLongPress(selectedYear, month, undefined, position)}
          />
          
          {/* Swipe indicator */}
          <View style={styles.swipeIndicatorContainer}>
            <View style={styles.swipeIndicator} />
            <Text style={styles.swipeText}>Swipe down to return to grid</Text>
          </View>
        </Animated.View>
      )}

      {/* Bottom Sheet for Cell Content */}
      {isBottomSheetVisible && selectedCell && (
        <BottomSheet 
          visible={isBottomSheetVisible} 
          onClose={handleCloseBottomSheet}
          content={getCellContent(selectedCell.year, selectedCell.month, selectedCell.week)}
          selectedCell={selectedCell}
        />
      )}

      {/* Quick Add Menu */}
      {isQuickAddVisible && selectedCell && (
        <QuickAddMenu
          visible={isQuickAddVisible}
          position={quickAddPosition}
          onClose={handleCloseQuickAdd}
          selectedCell={selectedCell}
        />
      )}
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
  activeText: {
    color: '#000',
  },
  gridScroll: {
    flex: 1,
  },
  gridScrollContent: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingRight: 15, // Match left padding (10 + 5 from ageLabels)
  },
  ageLabels: {
    paddingLeft: 5,
    paddingRight: 2,
    paddingTop: 0, // Add padding to match first row spacing
  },
  ageLabel: {
    fontSize: 10,
    color: '#666',
    height: 80, // Height of cluster (4 rows * 16px)
    lineHeight: 70, // Center text vertically within the height
    textAlign: 'right',
  },
  gridContent: {
    flex: 1,
  },
  gridHidden: {
    position: 'absolute',
    width: '100%',
    pointerEvents: 'none',
  },
  expandedContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  swipeIndicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    zIndex: 20,
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
  },
  swipeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  expandedHidden: {
    pointerEvents: 'none',
    display: 'none',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bottomSheetContent: {
    padding: 20,
  },
  contentItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  contentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  memoryBadge: {
    backgroundColor: '#007AFF15',
  },
  lessonBadge: {
    backgroundColor: '#FF950015',
  },
  goalBadge: {
    backgroundColor: '#34C75915',
  },
  reflectionBadge: {
    backgroundColor: '#FF2D5515',
  },
  contentBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contentDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  contentNotes: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addContentButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
  },
  addContentButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  quickAddOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
  },
  quickAddBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  quickAddMenu: {
    position: 'absolute',
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  quickAddButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  quickAddButtonText: {
    fontWeight: '600',
    color: '#fff',
  },
  memoryButton: {
    backgroundColor: '#007AFF',
  },
  lessonButton: {
    backgroundColor: '#FF9500',
  },
  goalButton: {
    backgroundColor: '#34C759',
  },
  reflectionButton: {
    backgroundColor: '#FF2D55',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
  },
  floatingButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
});