import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { ViewMode, ViewState, SelectedCell } from '../types';

/**
 * Custom hook for handling grid navigation and selection
 */
export function useGridNavigation() {
  const { state, dispatch } = useAppContext();
  
  // Handle year selection
  const handleYearSelect = useCallback((year: number) => {
    dispatch({ type: 'SELECT_YEAR', payload: year });
    dispatch({ type: 'SET_VIEW_STATE', payload: 'cluster' });
  }, [dispatch]);
  
  // Handle cluster close
  const handleClusterClose = useCallback(() => {
    dispatch({ type: 'SET_VIEW_STATE', payload: 'grid' });
    dispatch({ type: 'SELECT_YEAR', payload: null });
    dispatch({ type: 'SELECT_MONTH', payload: null });
    dispatch({ type: 'SELECT_WEEK', payload: null });
  }, [dispatch]);
  
  // Handle cell press
  const handleCellPress = useCallback((year: number, month?: number, week?: number) => {
    // Handle cell press in all view modes
    dispatch({ 
      type: 'SELECT_CELL', 
      payload: { year, month, week } 
    });
  }, [dispatch]);
  
  // Handle view mode change
  const setViewMode = useCallback((mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, [dispatch]);
  
  return {
    viewMode: state.viewMode,
    viewState: state.viewState,
    selectedYear: state.selectedYear,
    selectedMonth: state.selectedMonth,
    selectedWeek: state.selectedWeek,
    selectedCell: state.selectedCell,
    handleYearSelect,
    handleClusterClose,
    handleCellPress,
    setViewMode,
  };
} 