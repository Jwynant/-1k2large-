import React, { useState, useRef, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  useWindowDimensions,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../app/context/AppContext';
import { useDateCalculations } from '../../app/hooks/useDateCalculations';
import { useContentManagement } from '../../app/hooks/useContentManagement';
import { format, differenceInYears, differenceInMonths, parseISO } from 'date-fns';
import { Season, ContentItem, TimelineColumn } from '../../app/types';
import SeasonBlock from './SeasonBlock';
import TimelineEvent from './TimelineEvent';
import TimelineColumnSelector from './TimelineColumnSelector';
import SeasonCreator from './SeasonCreator';
import { v4 as uuidv4 } from 'uuid';

// Constants for timeline layout
const YEAR_HEIGHT = 120; // Height in pixels for one year
const TIMELINE_PADDING = 20;
const TIMELINE_WIDTH = 30; // Width of the actual timeline line
const COLUMN_WIDTH = 150; // Width of each column

export default function TimelineView() {
  // Get app context and hooks
  const { state, dispatch } = useAppContext();
  const { getPreciseAge, getLifeProgress } = useDateCalculations();
  const { getCellContent } = useContentManagement();
  
  // Local state
  const [expandedSeasonId, setExpandedSeasonId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showSeasonCreator, setShowSeasonCreator] = useState(false);
  
  // Get window dimensions
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  
  // Scroll position tracking
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Calculate timeline dimensions
  const birthDate = state.userBirthDate ? new Date(state.userBirthDate) : new Date();
  const currentDate = new Date();
  const lifeExpectancy = state.userSettings.lifeExpectancy;
  const endDate = new Date(birthDate);
  endDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
  
  const totalYears = lifeExpectancy;
  const timelineHeight = totalYears * YEAR_HEIGHT;
  
  // Calculate current position in the timeline
  const yearsLived = differenceInYears(currentDate, birthDate);
  const currentPosition = yearsLived * YEAR_HEIGHT;
  
  // Get all content items sorted by date
  const sortedContentItems = useMemo(() => {
    return [...state.contentItems].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [state.contentItems]);
  
  // Get all seasons sorted by start date
  const sortedSeasons = useMemo(() => {
    return [...state.seasons].sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }, [state.seasons]);
  
  // Default columns if none exist
  const defaultColumns: TimelineColumn[] = [
    { id: 'personal', title: 'Personal', color: '#FF9500', order: 0, visible: true },
    { id: 'career', title: 'Career', color: '#007AFF', order: 1, visible: true },
    { id: 'health', title: 'Health', color: '#4CD964', order: 2, visible: true }
  ];
  
  // Use existing columns or default ones
  const columns = state.timelineColumns.length > 0 ? state.timelineColumns : defaultColumns;
  const visibleColumns = columns.filter(col => col.visible).sort((a, b) => a.order - b.order);
  
  // Calculate position for a date in the timeline
  const getPositionForDate = (date: Date) => {
    const years = differenceInYears(date, birthDate);
    const months = differenceInMonths(date, birthDate) % 12;
    return years * YEAR_HEIGHT + (months / 12) * YEAR_HEIGHT;
  };
  
  // Handle season press
  const handleSeasonPress = (seasonId: string) => {
    setExpandedSeasonId(expandedSeasonId === seasonId ? null : seasonId);
  };
  
  // Handle event press
  const handleEventPress = (eventId: string) => {
    setSelectedEventId(eventId);
    // TODO: Open event detail view
  };
  
  // Handle column toggle
  const handleToggleColumn = (columnId: string) => {
    const updatedColumn = columns.find(col => col.id === columnId);
    if (updatedColumn) {
      dispatch({ 
        type: 'UPDATE_TIMELINE_COLUMN', 
        payload: { ...updatedColumn, visible: !updatedColumn.visible }
      });
    }
  };
  
  // Handle season creation
  const handleCreateSeason = (season: Omit<Season, 'id'>) => {
    dispatch({
      type: 'ADD_SEASON',
      payload: {
        ...season,
        id: uuidv4()
      }
    });
  };
  
  // Render year markers
  const renderYearMarkers = () => {
    const markers = [];
    for (let i = 0; i <= totalYears; i++) {
      const year = birthDate.getFullYear() + i;
      const isCurrent = year === currentDate.getFullYear();
      
      markers.push(
        <View 
          key={`year-${year}`} 
          style={[
            styles.yearMarker, 
            { top: i * YEAR_HEIGHT },
            isCurrent && styles.currentYearMarker
          ]}
        >
          <Text style={[styles.yearText, isCurrent && styles.currentYearText]}>
            {year}
          </Text>
        </View>
      );
    }
    return markers;
  };
  
  // Render seasons
  const renderSeasons = () => {
    return sortedSeasons.map((season) => {
      const startDate = parseISO(season.startDate);
      const endDate = parseISO(season.endDate);
      const startPosition = getPositionForDate(startDate);
      const endPosition = getPositionForDate(endDate);
      const height = endPosition - startPosition;
      const isExpanded = expandedSeasonId === season.id;
      
      return (
        <SeasonBlock
          key={`season-${season.id}`}
          season={season}
          startPosition={startPosition}
          height={height}
          color="#FF9500" // TODO: Use focus area color or category color
          onPress={() => handleSeasonPress(season.id)}
          isExpanded={isExpanded}
        />
      );
    });
  };
  
  // Render content items
  const renderContentItems = () => {
    return sortedContentItems.map((item) => {
      const date = new Date(item.date);
      const position = getPositionForDate(date);
      
      // Determine which column to place the item in
      // For now, just distribute randomly among visible columns
      const columnIndex = item.id.charCodeAt(0) % visibleColumns.length;
      const column = visibleColumns[columnIndex];
      
      // Calculate left position based on column
      const leftPosition = TIMELINE_WIDTH + TIMELINE_PADDING * 2 + 
        (column ? column.order * (COLUMN_WIDTH + 10) : 0);
      
      return (
        <TimelineEvent
          key={`item-${item.id}`}
          item={item}
          position={position}
          leftPosition={leftPosition}
          onPress={() => handleEventPress(item.id)}
        />
      );
    });
  };
  
  // Scroll to current position when component mounts
  React.useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: currentPosition - windowHeight / 2,
        animated: true
      });
    }, 500);
  }, []);
  
  return (
    <View style={styles.container}>
      {/* Column headers */}
      <View style={styles.columnHeaders}>
        <View style={{ width: TIMELINE_WIDTH + TIMELINE_PADDING * 2 }} />
        {visibleColumns.map((column) => (
          <View 
            key={`header-${column.id}`} 
            style={[styles.columnHeader, { width: COLUMN_WIDTH }]}
          >
            <Text style={styles.columnTitle}>{column.title}</Text>
          </View>
        ))}
        
        {/* Column selector toggle button */}
        <TouchableOpacity
          style={styles.columnSelectorButton}
          onPress={() => setShowColumnSelector(!showColumnSelector)}
        >
          <Ionicons 
            name={showColumnSelector ? 'chevron-up-circle' : 'chevron-down-circle'} 
            size={24} 
            color="#8E8E93" 
          />
        </TouchableOpacity>
      </View>
      
      {/* Column selector */}
      {showColumnSelector && (
        <TimelineColumnSelector 
          columns={columns}
          onToggleColumn={handleToggleColumn}
        />
      )}
      
      {/* Main timeline scroll view */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { height: timelineHeight + windowHeight / 2 } // Add extra space at bottom
        ]}
        showsVerticalScrollIndicator={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Timeline line */}
        <View style={[styles.timelineLine, { height: timelineHeight }]} />
        
        {/* Current position indicator */}
        <View 
          style={[
            styles.currentPositionIndicator, 
            { top: currentPosition }
          ]}
        >
          <View style={styles.currentPositionDot} />
          <Text style={styles.currentPositionText}>NOW</Text>
        </View>
        
        {/* Year markers */}
        {renderYearMarkers()}
        
        {/* Seasons */}
        {renderSeasons()}
        
        {/* Content items */}
        {renderContentItems()}
      </ScrollView>
      
      {/* Add Season Button */}
      <TouchableOpacity
        style={styles.addSeasonButton}
        onPress={() => setShowSeasonCreator(true)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addSeasonButtonText}>Add Season</Text>
      </TouchableOpacity>
      
      {/* Season Creator Modal */}
      <SeasonCreator
        visible={showSeasonCreator}
        onClose={() => setShowSeasonCreator(false)}
        onSave={handleCreateSeason}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  columnHeaders: {
    flexDirection: 'row',
    paddingHorizontal: TIMELINE_PADDING,
    paddingVertical: 10,
    backgroundColor: '#2C2C2E',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
    position: 'relative',
  },
  columnHeader: {
    marginRight: 10,
    alignItems: 'center',
  },
  columnTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: TIMELINE_PADDING,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: TIMELINE_PADDING,
    width: 2,
    backgroundColor: '#48484A',
  },
  yearMarker: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentYearMarker: {
    zIndex: 10,
  },
  yearText: {
    color: '#8E8E93',
    fontSize: 12,
    marginLeft: 8,
  },
  currentYearText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  currentPositionIndicator: {
    position: 'absolute',
    left: TIMELINE_PADDING - 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  currentPositionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
  },
  currentPositionText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  columnSelectorButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  addSeasonButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0A84FF',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addSeasonButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
}); 