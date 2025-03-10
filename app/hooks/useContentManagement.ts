import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { ContentItem, ContentType, SelectedCell } from '../types';

/**
 * Custom hook for managing content (memories, lessons, goals, reflections)
 */
export function useContentManagement() {
  const { state, dispatch } = useAppContext();
  
  // Get content for a specific cell
  const getCellContent = useCallback((year: number, month?: number, week?: number) => {
    // Filter content items based on date
    return state.contentItems.filter(item => {
      const itemDate = new Date(item.date);
      const itemYear = itemDate.getFullYear();
      
      // If we're looking for a specific year
      if (year !== itemYear) return false;
      
      // If we're looking for a specific month
      if (month !== undefined) {
        const itemMonth = itemDate.getMonth();
        return month === itemMonth;
      }
      
      // If we're looking for a specific week
      if (week !== undefined) {
        // Calculate the week number of the item date
        const firstDayOfYear = new Date(itemYear, 0, 1);
        const pastDaysOfYear = (itemDate.getTime() - firstDayOfYear.getTime()) / 86400000;
        const itemWeek = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return week === itemWeek;
      }
      
      // If we're just looking for the year
      return true;
    });
  }, [state.contentItems]);
  
  // Get content for a selected cell object
  const getContentForCell = useCallback((selectedCell: SelectedCell) => {
    const { year, month, week } = selectedCell;
    return getCellContent(year, month, week);
  }, [getCellContent]);
  
  // Add a new content item
  const addContentItem = useCallback((item: Omit<ContentItem, 'id'> & { id?: string }) => {
    const newItem: ContentItem = {
      id: item.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...item,
    };
    
    dispatch({ type: 'ADD_CONTENT_ITEM', payload: newItem });
    
    return newItem;
  }, [dispatch]);
  
  // Update an existing content item
  const updateContentItem = useCallback((item: ContentItem) => {
    dispatch({ type: 'UPDATE_CONTENT_ITEM', payload: item });
  }, [dispatch]);
  
  // Delete a content item
  const deleteContentItem = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CONTENT_ITEM', payload: id });
  }, [dispatch]);
  
  // Get all content of a specific type
  const getContentByType = useCallback((type: ContentType) => {
    return state.contentItems.filter(item => item.type === type);
  }, [state.contentItems]);
  
  // Get all memories
  const getMemories = useCallback(() => {
    return getContentByType('memory');
  }, [getContentByType]);
  
  // Get all lessons
  const getLessons = useCallback(() => {
    return getContentByType('lesson');
  }, [getContentByType]);
  
  // Get all goals
  const getGoals = useCallback(() => {
    return getContentByType('goal');
  }, [getContentByType]);
  
  // Get all reflections
  const getReflections = useCallback(() => {
    return getContentByType('reflection');
  }, [getContentByType]);
  
  // Check if a cell has any content
  const hasContent = useCallback((year: number, month?: number, week?: number) => {
    return getCellContent(year, month, week).length > 0;
  }, [getCellContent]);
  
  return {
    getCellContent,
    getContentForCell,
    addContentItem,
    updateContentItem,
    deleteContentItem,
    getContentByType,
    getMemories,
    getLessons,
    getGoals,
    getReflections,
    hasContent,
  };
}

// Default export for Expo Router
export default useContentManagement; 