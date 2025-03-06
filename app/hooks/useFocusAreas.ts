import { useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { useAppContext } from '../context/AppContext';
import { FocusArea } from '../types';

/**
 * Custom hook for managing focus areas
 */
export function useFocusAreas() {
  const { state, dispatch } = useAppContext();
  
  // Get all focus areas
  const focusAreas = state.focusAreas;
  
  // Get focus areas ordered by rank
  const orderedFocusAreas = useMemo(() => {
    return [...focusAreas].sort((a, b) => a.rank - b.rank);
  }, [focusAreas]);

  // Add a new focus area
  const addFocusArea = useCallback((area: Omit<FocusArea, 'id'>) => {
    const newFocusArea: FocusArea = {
      id: nanoid(),
      ...area,
    };
    
    dispatch({ type: 'ADD_FOCUS_AREA', payload: newFocusArea });
    
    return newFocusArea;
  }, [dispatch]);
  
  // Update an existing focus area
  const updateFocusArea = useCallback((area: FocusArea) => {
    dispatch({ type: 'UPDATE_FOCUS_AREA', payload: area });
  }, [dispatch]);
  
  // Delete a focus area
  const deleteFocusArea = useCallback((id: string) => {
    dispatch({ type: 'DELETE_FOCUS_AREA', payload: id });
  }, [dispatch]);
  
  // Get a focus area by ID
  const getFocusAreaById = useCallback((id: string) => {
    return focusAreas.find(area => area.id === id) || null;
  }, [focusAreas]);
  
  // Reorder focus areas by priority
  const reorderFocusAreas = useCallback((orderedIds: string[]) => {
    // Create a new array of focus areas with updated ranks
    const updatedFocusAreas = orderedIds.map((id, index) => {
      const area = getFocusAreaById(id);
      if (area) {
        return {
          ...area,
          rank: index + 1, // Rank starts at 1
        };
      }
      return null;
    }).filter(Boolean) as FocusArea[];
    
    // Update all focus areas with their new ranks
    updatedFocusAreas.forEach(area => {
      updateFocusArea(area);
    });
    
    // Also dispatch the reorder action to update the state order
    dispatch({ type: 'REORDER_FOCUS_AREAS', payload: orderedIds });
  }, [dispatch, getFocusAreaById, updateFocusArea]);
  
  // Calculate total allocation percentage
  const totalAllocation = useMemo(() => {
    return focusAreas.reduce((total, area) => total + area.allocation, 0);
  }, [focusAreas]);
  
  // Check if allocations are valid (sum to 100%)
  const isAllocationValid = useMemo(() => {
    return Math.abs(totalAllocation - 100) < 0.01; // Allow for floating point errors
  }, [totalAllocation]);
  
  // Normalize allocations to sum to 100%
  const normalizeAllocations = useCallback(() => {
    if (focusAreas.length === 0) return;
    
    // If there's only one focus area, set it to 100%
    if (focusAreas.length === 1) {
      const area = focusAreas[0];
      updateFocusArea({
        ...area,
        allocation: 100
      });
      return;
    }
    
    // Otherwise, distribute proportionally
    const normalizedAreas = focusAreas.map(area => {
      return {
        ...area,
        allocation: Math.round((area.allocation / totalAllocation) * 100)
      };
    });
    
    // Ensure the total is exactly 100% by adjusting the first area if needed
    const adjustedTotal = normalizedAreas.reduce((total, area) => total + area.allocation, 0);
    if (adjustedTotal !== 100 && normalizedAreas.length > 0) {
      const diff = 100 - adjustedTotal;
      normalizedAreas[0].allocation += diff;
    }
    
    // Update each area with the normalized allocation
    normalizedAreas.forEach(area => {
      updateFocusArea(area);
    });
  }, [focusAreas, totalAllocation, updateFocusArea]);
  
  // Get a preset color based on index
  const getPresetColor = useCallback((index: number) => {
    const colors = [
      '#4CAF50', // Green
      '#2196F3', // Blue
      '#E91E63', // Pink
      '#FF9800', // Orange
      '#9C27B0', // Purple
      '#00BCD4', // Cyan
      '#FFEB3B', // Yellow
      '#795548', // Brown
      '#607D8B', // Blue Grey
    ];
    
    return colors[index % colors.length];
  }, []);
  
  return {
    focusAreas,
    orderedFocusAreas,
    addFocusArea,
    updateFocusArea,
    deleteFocusArea,
    getFocusAreaById,
    reorderFocusAreas,
    totalAllocation,
    isAllocationValid,
    normalizeAllocations,
    getPresetColor,
  };
}

// Default export for Expo Router compatibility
export default useFocusAreas; 