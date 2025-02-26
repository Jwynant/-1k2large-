import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { ContentItem, ContentType } from '../context/AppContext';

/**
 * Custom hook for managing content (memories, lessons, goals, reflections)
 */
export function useContentManagement() {
  const { state, dispatch } = useAppContext();
  
  // Get content for a specific cell
  const getCellContent = useCallback((year: number, month?: number, week?: number) => {
    let cellKey: string;
    
    if (month !== undefined) {
      cellKey = `${year}-${month}`;
    } else if (week !== undefined) {
      cellKey = `${year}-w${week}`;
    } else {
      cellKey = `${year}`;
    }
    
    return state.content[cellKey] || [];
  }, [state.content]);
  
  // Add new content
  const addContent = useCallback((
    type: ContentType,
    title: string,
    date: string,
    notes?: string,
    emoji?: string,
    media?: string[]
  ) => {
    if (!state.selectedCell) return;
    
    const { year, month, week } = state.selectedCell;
    let cellKey: string;
    
    if (month !== undefined) {
      cellKey = `${year}-${month}`;
    } else if (week !== undefined) {
      cellKey = `${year}-w${week}`;
    } else {
      cellKey = `${year}`;
    }
    
    const newItem: ContentItem = {
      id: Date.now().toString(), // Simple ID generation
      title,
      date,
      type,
      notes,
      emoji,
      media
    };
    
    dispatch({
      type: 'ADD_CONTENT',
      payload: { key: cellKey, item: newItem }
    });
    
    return newItem;
  }, [state.selectedCell, dispatch]);
  
  // Check if a cell has content
  const hasContent = useCallback((year: number, month?: number, week?: number) => {
    const content = getCellContent(year, month, week);
    return content.length > 0;
  }, [getCellContent]);
  
  // Get all content of a specific type
  const getContentByType = useCallback((type: ContentType) => {
    const result: ContentItem[] = [];
    
    Object.values(state.content).forEach(items => {
      items.forEach(item => {
        if (item.type === type) {
          result.push(item);
        }
      });
    });
    
    return result;
  }, [state.content]);
  
  return {
    getCellContent,
    addContent,
    hasContent,
    getContentByType,
    allContent: state.content
  };
} 