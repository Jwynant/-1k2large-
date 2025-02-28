import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { SelectedCell } from '../types';

/**
 * Custom hook for date and time calculations
 */
export function useDateCalculations() {
  const { state } = useAppContext();
  
  // Calculate user's age for a given year
  const userAge = useCallback((year: number) => {
    if (!state.userBirthDate) return null;
    
    const birthDate = new Date(state.userBirthDate);
    const birthYear = birthDate.getFullYear();
    return year - birthYear;
  }, [state.userBirthDate]);
  
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
    // Copy date to avoid modifying the original
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday (makes the week number consistent)
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate week number: Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return weekNum;
  }, []);
  
  // Calculate if a year is in the past
  const isYearInPast = useCallback((year: number) => {
    const currentYear = new Date().getFullYear();
    return year < currentYear;
  }, []);
  
  // Calculate if a year is the current year
  const isCurrentYear = useCallback((year: number) => {
    const currentYear = new Date().getFullYear();
    return year === currentYear;
  }, []);
  
  // Calculate if a month is the current month
  const isCurrentMonth = useCallback((year: number, month: number) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    return year === currentYear && month === currentMonth;
  }, []);
  
  // Calculate if a week is the current week
  const isCurrentWeek = useCallback((year: number, week: number) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentWeek = getWeekNumber(today);
    
    return year === currentYear && week === currentWeek;
  }, []);
  
  // Get the date range for a specific month
  const getMonthDateRange = useCallback((year: number, month: number) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return { startDate, endDate };
  }, []);
  
  // Get the date range for a specific week
  const getWeekDateRange = useCallback((year: number, week: number) => {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const startDate = new Date(simple);
    startDate.setDate(simple.getDate() - dow);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return { startDate, endDate };
  }, []);
  
  // Format a date as a string
  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);
  
  // Format a date from a selected cell
  const formatDateFromCell = useCallback((cell: SelectedCell) => {
    const { year, month, week } = cell;
    
    if (month !== undefined) {
      // Format as month and year
      const date = new Date(year, month, 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } else if (week !== undefined) {
      // Format as week and year
      const { startDate, endDate } = getWeekDateRange(year, week);
      return `Week ${week}, ${year} (${formatDate(startDate)} - ${formatDate(endDate)})`;
    } else {
      // Format as year only
      return `${year}`;
    }
  }, [formatDate, getWeekDateRange]);
  
  return {
    isMonthInPast,
    isWeekInPast,
    isYearInPast,
    isCurrentYear,
    isCurrentMonth,
    isCurrentWeek,
    getWeekNumber,
    getMonthDateRange,
    getWeekDateRange,
    formatDate,
    userAge,
    formatDateFromCell,
  };
} 