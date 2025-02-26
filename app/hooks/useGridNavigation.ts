import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';

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
    // Only handle cell press in expanded cluster view or week view
    if (state.viewState === 'cluster' || state.viewMode === 'weeks') {
      dispatch({ 
        type: 'SELECT_CELL', 
        payload: { year, month, week } 
      });
    }
  }, [state.viewState, state.viewMode, dispatch]);
  
  // Handle view mode change
  const setViewMode = useCallback((mode: 'weeks' | 'months' | 'years') => {
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