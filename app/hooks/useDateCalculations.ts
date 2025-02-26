import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * Custom hook for date and time calculations
 */
export function useDateCalculations() {
  const { state } = useAppContext();
  
  // Calculate if a month is in the past
  const isMonthInPast = useCallback((year: number, month: number) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    return year < currentYear || (year === currentYear && month < currentMonth);
  }, []);
  
  // Calculate if a week is in the past
  const isWeekInPast = useCallback((year: number, week: number) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentWeek = getWeekNumber(today);
    
    return year < currentYear || (year === currentYear && week < currentWeek);
  }, []);
  
  // Get the week number of a date
  const getWeekNumber = useCallback((date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }, []);
  
  // Calculate total months lived
  const getTotalMonthsLived = useCallback(() => {
    if (!state.userBirthDate) return 0;
    
    const birthDate = new Date(state.userBirthDate);
    const today = new Date();
    
    return (today.getFullYear() - birthDate.getFullYear()) * 12 + 
           (today.getMonth() - birthDate.getMonth());
  }, [state.userBirthDate]);
  
  // Calculate total weeks lived
  const getTotalWeeksLived = useCallback(() => {
    if (!state.userBirthDate) return 0;
    
    const birthDate = new Date(state.userBirthDate);
    const today = new Date();
    
    // Calculate difference in milliseconds
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    // Convert to weeks
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  }, [state.userBirthDate]);
  
  // Format a date for display
  const formatDate = useCallback((date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, []);
  
  return {
    isMonthInPast,
    isWeekInPast,
    getWeekNumber,
    getTotalMonthsLived,
    getTotalWeeksLived,
    formatDate,
    userAge: state.userAge
  };
} 