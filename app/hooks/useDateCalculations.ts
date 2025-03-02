import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { SelectedCell } from '../types';

/**
 * Custom hook for date and time calculations
 */
export function useDateCalculations() {
  const { state } = useAppContext();
  
  // Get the user's birth date or null if not set
  const getBirthDate = useCallback((): Date | null => {
    if (!state.userBirthDate) return null;
    return new Date(state.userBirthDate);
  }, [state.userBirthDate]);
  
  // Calculate user's current age in years (integer)
  const getUserAge = useCallback((): number | null => {
    const birthDate = getBirthDate();
    if (!birthDate) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Adjust if birthday hasn't occurred yet this year
    const hasBirthdayOccurredThisYear = 
      today.getMonth() > birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
      
    if (!hasBirthdayOccurredThisYear) {
      age--;
    }
    
    return age;
  }, [getBirthDate]);
  
  // Calculate user's age for a given year (0-based)
  const getAgeForYear = useCallback((year: number): number | null => {
    const birthDate = getBirthDate();
    if (!birthDate) return null;
    
    const birthYear = birthDate.getFullYear();
    const age = year - birthYear;
    
    // Return null for pre-birth years
    return age >= 0 ? age : null;
  }, [getBirthDate]);
  
  // Get appropriate label for year grid
  const getYearLabel = useCallback((year: number): string => {
    const age = getAgeForYear(year);
    return age !== null ? `${age}` : "";
  }, [getAgeForYear]);
  
  // Calculate precise age with years, months, weeks, days
  const getPreciseAge = useCallback((): string => {
    const birthDate = getBirthDate();
    if (!birthDate) return "Age not set";
    
    const now = new Date();
    
    // Calculate years
    let years = now.getFullYear() - birthDate.getFullYear();
    
    // Calculate months (adjust if birthday hasn't occurred yet this year)
    let months = now.getMonth() - birthDate.getMonth();
    if (now.getDate() < birthDate.getDate()) {
      months--;
    }
    // Adjust for negative months (birthday hasn't occurred yet this year)
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Calculate days remaining after accounting for years and months
    const tempDate = new Date(birthDate);
    tempDate.setFullYear(tempDate.getFullYear() + years);
    tempDate.setMonth(tempDate.getMonth() + months);
    
    // Get days difference
    let days = now.getDate() - tempDate.getDate();
    if (days < 0) {
      // Get days in previous month
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    // Calculate weeks and remaining days
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    
    // Build the age string
    let ageString = `${years} ${years === 1 ? 'Year' : 'Years'}`;
    ageString += `, ${months} ${months === 1 ? 'Month' : 'Months'}`;
    ageString += `, ${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`;
    ageString += `, ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}`;
    
    return ageString;
  }, [getBirthDate]);
  
  // Calculate life progress percentage
  const getLifeProgress = useCallback((lifeExpectancy: number = 80): number => {
    const birthDate = getBirthDate();
    if (!birthDate) return 0;
    
    const now = new Date();
    
    // Calculate total milliseconds in the expected lifespan
    const lifespanMs = lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000;
    
    // Calculate how much time has been lived so far
    const livedMs = now.getTime() - birthDate.getTime();
    
    // Calculate the percentage (capped at 100%)
    const percentage = (livedMs / lifespanMs) * 100;
    return Math.min(100, Math.max(0, percentage));
  }, [getBirthDate]);
  
  // Check if a year is the user's birth year
  const isUserBirthYear = useCallback((year: number): boolean => {
    const birthDate = getBirthDate();
    if (!birthDate) return false;
    
    return birthDate.getFullYear() === year;
  }, [getBirthDate]);
  
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
    formatDateFromCell,
    // New age calculation methods
    getBirthDate,
    getUserAge,
    getAgeForYear,
    getYearLabel,
    getPreciseAge,
    getLifeProgress,
    isUserBirthYear,
    // Legacy method for backward compatibility
    userAge: getAgeForYear,
  };
} 