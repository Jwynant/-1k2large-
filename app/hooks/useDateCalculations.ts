import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { SelectedCell } from '../types';
import { format, differenceInDays, differenceInMonths, differenceInYears, addYears, addMonths, startOfWeek, getWeek, getMonth, getYear, isSameWeek, isSameMonth, isSameYear, isAfter, isBefore, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

/**
 * Custom hook for date and time calculations
 * Optimized with memoization for expensive calculations
 */
export function useDateCalculations() {
  const { state } = useAppContext();
  
  // Memoize the birth date to avoid recreating it in multiple functions
  const birthDate = useMemo((): Date | null => {
    if (!state.userBirthDate) return null;
    return new Date(state.userBirthDate);
  }, [state.userBirthDate]);
  
  // Get the user's birth date or null if not set
  const getBirthDate = useCallback((): Date | null => {
    return birthDate;
  }, [birthDate]);
  
  // Memoize current date to ensure consistency across calculations
  const today = useMemo(() => new Date(), []);
  
  // Memoize current year, month, and week for frequent comparisons
  const currentYear = useMemo(() => today.getFullYear(), [today]);
  const currentMonth = useMemo(() => today.getMonth(), [today]);
  const currentWeek = useMemo(() => getWeek(today), [today]);
  
  // Calculate user's current age in years (integer)
  const userAge = useMemo((): number | null => {
    if (!birthDate) return null;
    
    let age = differenceInYears(today, birthDate);
    
    // Adjust if birthday hasn't occurred yet this year
    const hasBirthdayOccurredThisYear = 
      today.getMonth() > birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
      
    if (!hasBirthdayOccurredThisYear) {
      age--;
    }
    
    return age;
  }, [birthDate, today]);
  
  // Get the user's age as a function (for backward compatibility)
  const getUserAge = useCallback((): number | null => {
    return userAge;
  }, [userAge]);
  
  // Calculate user's age for a given year (0-based)
  const getAgeForYear = useCallback((year: number): number | null => {
    if (!birthDate) return null;
    
    const birthYear = birthDate.getFullYear();
    const age = year - birthYear;
    
    // Return null for pre-birth years
    return age >= 0 ? age : null;
  }, [birthDate]);
  
  // Get appropriate label for year grid
  const getYearLabel = useCallback((year: number): string => {
    const age = getAgeForYear(year);
    return age !== null ? `${age}` : "";
  }, [getAgeForYear]);
  
  // Calculate precise age with years, months, weeks, days
  const preciseAge = useMemo((): string => {
    if (!birthDate) return "Age not set";
    
    // Calculate years and months
    const years = differenceInYears(today, birthDate);
    const afterYears = addYears(birthDate, years);
    const months = differenceInMonths(today, afterYears);
    const afterMonths = addMonths(afterYears, months);
    
    // Calculate days
    const days = differenceInDays(today, afterMonths);
    
    // Calculate weeks and remaining days
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    
    // Build the age string
    let ageString = `${years} ${years === 1 ? 'Year' : 'Years'}`;
    ageString += `, ${months} ${months === 1 ? 'Month' : 'Months'}`;
    ageString += `, ${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`;
    ageString += `, ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}`;
    
    return ageString;
  }, [birthDate, today]);
  
  // Get the precise age as a function (for backward compatibility)
  const getPreciseAge = useCallback((): string => {
    return preciseAge;
  }, [preciseAge]);
  
  // Memoize life progress calculation
  const getLifeProgress = useCallback((lifeExpectancy: number = 80): number => {
    if (!birthDate) return 0;
    
    // Calculate total days in expected lifespan
    const totalDays = lifeExpectancy * 365.25; // Account for leap years
    
    // Calculate days lived so far
    const daysLived = differenceInDays(today, birthDate);
    
    // Calculate progress percentage
    const progress = (daysLived / totalDays) * 100;
    
    // Ensure progress is between 0 and 100
    return Math.max(0, Math.min(100, progress));
  }, [birthDate, today]);
  
  // Optimize week-related calculations with memoization
  const isWeekInPast = useCallback((year: number, week: number): boolean => {
    if (!birthDate) return false;
    
    // Current date info
    const currentYear = today.getFullYear();
    const currentWeek = getWeek(today);
    
    // Simple year comparison first (most cases will be resolved here)
    if (year < currentYear) return true;
    if (year > currentYear) return false;
    
    // For current year, compare weeks
    return week < currentWeek;
  }, [birthDate, today]);
  
  const isCurrentWeek = useCallback((year: number, week: number): boolean => {
    return year === currentYear && week === currentWeek;
  }, [currentYear, currentWeek]);
  
  // Optimize month-related calculations with memoization
  const isMonthInPast = useCallback((year: number, month: number): boolean => {
    if (!birthDate) return false;
    
    // Simple year comparison first
    if (year < currentYear) return true;
    if (year > currentYear) return false;
    
    // For current year, compare months
    return month < currentMonth;
  }, [birthDate, currentYear, currentMonth]);
  
  const isCurrentMonth = useCallback((year: number, month: number): boolean => {
    return year === currentYear && month === currentMonth;
  }, [currentYear, currentMonth]);
  
  // Optimize year-related calculations
  const isYearInPast = useCallback((year: number): boolean => {
    return year < currentYear;
  }, [currentYear]);
  
  const isCurrentYear = useCallback((year: number): boolean => {
    return year === currentYear;
  }, [currentYear]);
  
  // Check if a year is the user's birth year
  const isUserBirthYear = useCallback((year: number): boolean => {
    if (!birthDate) return false;
    return year === birthDate.getFullYear();
  }, [birthDate]);
  
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
  
  // Get the start month based on birth date
  const getStartMonth = useCallback((): number => {
    // Always use birth date alignment
    return birthDate ? birthDate.getMonth() : 0;
  }, [birthDate]);
  
  // Get the year offset based on birth date alignment
  const getYearOffset = useCallback((month: number): number => {
    const startMonth = getStartMonth();
    
    // For birth alignment, if the month is before the start month, it belongs to the previous year
    return month < startMonth ? -1 : 0;
  }, [getStartMonth]);
  
  // Convert a calendar month/year to an aligned month/year based on birth date
  const getAlignedDate = useCallback((year: number, month: number): { year: number, month: number } => {
    const startMonth = getStartMonth();
    
    // Calculate the offset from the start month
    const monthOffset = month - startMonth;
    
    if (monthOffset >= 0) {
      // Month is in the same aligned year
      return { 
        year: year, 
        month: monthOffset 
      };
    } else {
      // Month is in the previous aligned year
      return { 
        year: year - 1, 
        month: monthOffset + 12 
      };
    }
  }, [getStartMonth]);
  
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
    return format(date, 'MMM d, yyyy');
  }, []);
  
  // Format a date from a selected cell
  const formatDateFromCell = useCallback((cell: SelectedCell) => {
    const { year, month, week } = cell;
    
    if (month !== undefined) {
      // Format as month and year
      const date = new Date(year, month, 1);
      return format(date, 'MMMM yyyy');
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
    getBirthDate,
    getUserAge,
    userAge,
    getAgeForYear,
    getYearLabel,
    getPreciseAge,
    getLifeProgress,
    isWeekInPast,
    isCurrentWeek,
    isMonthInPast,
    isCurrentMonth,
    isYearInPast,
    isCurrentYear,
    isUserBirthYear,
    getWeekNumber,
    getMonthDateRange,
    getWeekDateRange,
    formatDate,
    formatDateFromCell,
    getStartMonth,
    getYearOffset,
    getAlignedDate,
  };
}

// Default export for Expo Router compatibility
export default useDateCalculations; 