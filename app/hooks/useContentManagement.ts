import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ContentItem, ContentType, SelectedCell } from '../types';

/**
 * Custom hook for managing content (memories, goals, and lessons)
 */
export function useContentManagement() {
  const { state, dispatch } = useAppContext();
  
  // Memoize content by type for better performance
  const memories = useMemo(() => {
    return state.contentItems.filter(item => item.type === 'memory');
  }, [state.contentItems]);
  
  const goals = useMemo(() => {
    return state.contentItems.filter(item => item.type === 'goal');
  }, [state.contentItems]);
  
  const lessons = useMemo(() => {
    return state.contentItems.filter(item => item.type === 'lesson');
  }, [state.contentItems]);
  
  // Get content for a specific cell
  const getCellContent = useCallback((year: number, month?: number, week?: number) => {
    // Filter content items based on date
    return state.contentItems.filter(item => {
      // Skip timeless lessons when filtering by date
      if (item.type === 'lesson' && item.isTimeless) {
        return false;
      }
      
      const itemDate = new Date(item.date);
      const itemYear = itemDate.getFullYear();
      
      // If we're looking for a specific year
      if (year !== itemYear) {
        return false;
      }
      
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
    switch (type) {
      case 'memory':
        return memories;
      case 'goal':
        return goals;
      case 'lesson':
        return lessons;
      default:
        return [];
    }
  }, [memories, goals, lessons]);
  
  // Get all memories
  const getMemories = useCallback(() => {
    return memories;
  }, [memories]);
  
  // Get all goals
  const getGoals = useCallback(() => {
    return goals;
  }, [goals]);
  
  // Get all lessons
  const getLessons = useCallback(() => {
    return lessons;
  }, [lessons]);
  
  // Get favorite lessons
  const getFavoriteLessons = useCallback(() => {
    return lessons.filter(lesson => lesson.isFavorite);
  }, [lessons]);
  
  // Get timeless lessons (not attributed to a specific date)
  const getTimelessLessons = useCallback(() => {
    return lessons.filter(lesson => lesson.isTimeless);
  }, [lessons]);
  
  // Get lessons with upcoming reminders
  const getLessonsWithReminders = useCallback(() => {
    return lessons.filter(lesson => lesson.reminder && new Date(lesson.reminder.nextReminder) > new Date());
  }, [lessons]);
  
  // Check if a cell has any content
  const hasContent = useCallback((year: number, month?: number, week?: number) => {
    const content = getCellContent(year, month, week);
    return content.length > 0;
  }, [getCellContent]);
  
  return {
    getCellContent,
    getContentForCell,
    addContentItem,
    updateContentItem,
    deleteContentItem,
    getContentByType,
    getMemories,
    getGoals,
    getLessons,
    getFavoriteLessons,
    getTimelessLessons,
    getLessonsWithReminders,
    hasContent,
  };
}

// Default export for Expo Router compatibility
export default useContentManagement; 