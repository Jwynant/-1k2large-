import { useCallback, useMemo, useRef } from 'react';
// Remove nanoid import
// import { nanoid } from 'nanoid';
import { useAppContext } from '../context/AppContext';
import { FocusArea, PriorityLevel } from '../types';
import { useContentManagement } from './useContentManagement';

/**
 * Generate a unique ID for new focus areas
 */
function generateUniqueId(): string {
  return 'id_' + 
    Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15) + 
    '_' + Date.now().toString(36);
}

// Preset colors for focus areas - moved outside the hook to avoid recreation
const PRESET_COLORS = [
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#34C759', // Green
  '#5AC8FA', // Light Blue
  '#007AFF', // Blue
  '#5856D6', // Purple
  '#AF52DE', // Magenta
  '#FF2D55', // Pink
  '#A2845E', // Brown
];

// Priority level limits - moved outside the hook to avoid recreation
const PRIORITY_LIMITS = {
  essential: 3, // Max 3 essential focus areas
  important: 5, // Max 5 important focus areas
  supplemental: 7, // Max 7 supplemental focus areas
  // Legacy priority levels for backward compatibility
  primary: 3,
  secondary: 5,
  tertiary: 7,
};

/**
 * Custom hook for managing focus areas
 */
export function useFocusAreas() {
  const { state, dispatch } = useAppContext();
  const { getGoals } = useContentManagement();
  
  // Get all focus areas
  const focusAreas = state.focusAreas;
  
  // Get focus areas ordered by priority level and then by rank within each level
  const orderedFocusAreas = useMemo(() => {
    // Group by priority level
    const grouped = {
      essential: focusAreas.filter(area => area.priorityLevel === 'essential'),
      important: focusAreas.filter(area => area.priorityLevel === 'important'),
      supplemental: focusAreas.filter(area => area.priorityLevel === 'supplemental')
    };
    
    // Sort each group by rank
    const sortedEssential = [...grouped.essential].sort((a, b) => a.rank - b.rank);
    const sortedImportant = [...grouped.important].sort((a, b) => a.rank - b.rank);
    const sortedSupplemental = [...grouped.supplemental].sort((a, b) => a.rank - b.rank);
    
    // Return all sorted focus areas in order of priority
    return [...sortedEssential, ...sortedImportant, ...sortedSupplemental];
  }, [focusAreas]);
  
  // Group focus areas by priority level
  const focusByLevel = useMemo(() => {
    return {
      essential: focusAreas.filter(area => area.priorityLevel === 'essential')
        .sort((a, b) => a.rank - b.rank),
      important: focusAreas.filter(area => area.priorityLevel === 'important')
        .sort((a, b) => a.rank - b.rank),
      supplemental: focusAreas.filter(area => area.priorityLevel === 'supplemental')
        .sort((a, b) => a.rank - b.rank),
      // Legacy priority levels for backward compatibility
      primary: focusAreas.filter(area => area.priorityLevel === 'primary')
        .sort((a, b) => a.rank - b.rank),
      secondary: focusAreas.filter(area => area.priorityLevel === 'secondary')
        .sort((a, b) => a.rank - b.rank),
      tertiary: focusAreas.filter(area => area.priorityLevel === 'tertiary')
        .sort((a, b) => a.rank - b.rank)
    };
  }, [focusAreas]);
  
  // Get the next available rank for a priority level
  const getNextRank = useCallback((priorityLevel: PriorityLevel) => {
    const areasInLevel = focusByLevel[priorityLevel];
    if (areasInLevel.length === 0) return 1;
    
    const maxRank = Math.max(...areasInLevel.map(area => area.rank));
    return maxRank + 1;
  }, [focusByLevel]);
  
  // Update focus area status based on goals
  const updateFocusAreaStatus = useCallback(() => {
    const goals = getGoals();
    let hasChanges = false;
    
    const updatedFocusAreas = focusAreas.map(area => {
      const areaGoals = goals.filter(goal => goal.focusAreaId === area.id);
      const activeGoals = areaGoals.filter(goal => !goal.isCompleted);
      const status = activeGoals.length > 0 ? 'active' as const : 'dormant' as const;
      
      if (area.status !== status) {
        hasChanges = true;
        return { ...area, status };
      }
      return area;
    });
    
    // Only dispatch if there are changes
    if (hasChanges) {
      dispatch({ 
        type: 'LOAD_DATA', 
        payload: { 
          contentItems: state.contentItems,
          seasons: state.seasons,
          focusAreas: updatedFocusAreas,
          userSettings: state.userSettings,
          categories: state.categories
        } 
      });
    }
  }, [focusAreas, getGoals, dispatch, state.contentItems, state.seasons, state.userSettings, state.categories]);
  
  // Add a new focus area
  const addFocusArea = useCallback((focusArea: Omit<FocusArea, 'id'>) => {
    // Generate a unique ID
    const id = generateUniqueId();
    
    // Set default rank if not provided
    const rank = focusArea.rank || getNextRank(focusArea.priorityLevel);
    
    // Create the new focus area
    const newFocusArea: FocusArea = {
      ...focusArea,
      id,
      rank,
      status: 'dormant',
      lastUpdated: new Date().toISOString()
    };
    
    // Add to state
    dispatch({ type: 'ADD_FOCUS_AREA', payload: newFocusArea });
    
    return newFocusArea;
  }, [dispatch, getNextRank]);
  
  // Update an existing focus area
  const updateFocusArea = useCallback((focusArea: FocusArea) => {
    // Update the last updated timestamp
    const updatedFocusArea = {
      ...focusArea,
      lastUpdated: new Date().toISOString()
    };
    
    dispatch({ type: 'UPDATE_FOCUS_AREA', payload: updatedFocusArea });
    return updatedFocusArea;
  }, [dispatch]);
  
  // Delete a focus area
  const deleteFocusArea = useCallback((id: string) => {
    dispatch({ type: 'DELETE_FOCUS_AREA', payload: id });
  }, [dispatch]);
  
  // Change the priority level of a focus area
  const changePriorityLevel = useCallback((id: string, newLevel: PriorityLevel) => {
    const focusArea = focusAreas.find(area => area.id === id);
    if (!focusArea) return;
    
    // Get the next rank in the new priority level
    const newRank = getNextRank(newLevel);
    
    // Update the focus area
    const updatedFocusArea = {
      ...focusArea,
      priorityLevel: newLevel,
      rank: newRank,
      lastUpdated: new Date().toISOString()
    };
    
    dispatch({ type: 'UPDATE_FOCUS_AREA', payload: updatedFocusArea });
    return updatedFocusArea;
  }, [focusAreas, dispatch, getNextRank]);
  
  // Check if a priority level has reached its maximum allowed items
  const isPriorityLevelFull = useCallback((priorityLevel: PriorityLevel) => {
    const areasInLevel = focusByLevel[priorityLevel];
    return areasInLevel.length >= PRIORITY_LIMITS[priorityLevel];
  }, [focusByLevel]);
  
  // Get a preset color for a new focus area
  const getPresetColor = useCallback(() => {
    // Try to find a color that's not already in use
    const usedColors = focusAreas.map(area => area.color);
    const availableColors = PRESET_COLORS.filter(color => !usedColors.includes(color));
    
    // If there are available colors, return a random one
    if (availableColors.length > 0) {
      return availableColors[Math.floor(Math.random() * availableColors.length)];
    }
    
    // Otherwise, return a random color from the preset list
    return PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
  }, [focusAreas]);
  
  return {
    focusAreas,
    orderedFocusAreas,
    focusByLevel,
    addFocusArea,
    updateFocusArea,
    deleteFocusArea,
    changePriorityLevel,
    getPresetColor,
    updateFocusAreaStatus,
    isPriorityLevelFull
  };
}

// Default export for Expo Router compatibility
export default useFocusAreas; 