import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { SelectedCell } from '../types';
import { format, differenceInDays, differenceInMonths, differenceInYears, addYears, addMonths } from 'date-fns';

/**
 * Custom hook for date and time calculations
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
  
  // Calculate life progress percentage
  const getLifeProgress = useCallback((lifeExpectancy: number = 80): number => {
    if (!birthDate) return 0;
    
    // Calculate total milliseconds in the expected lifespan
    const lifespanMs = lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000;
    
    // Calculate how much time has been lived so far
    const livedMs = today.getTime() - birthDate.getTime();
    
    // Calculate the percentage (capped at 100%)
    const percentage = (livedMs / lifespanMs) * 100;
    return Math.min(100, Math.max(0, percentage));
  }, [birthDate, today]);
  
  // Check if a year is the user's birth year
  const isUserBirthYear = useCallback((year: number): boolean => {
    if (!birthDate) return false;
    
    return birthDate.getFullYear() === year;
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
  
  // Memoize current week for frequent comparisons
  const currentWeek = useMemo(() => getWeekNumber(today), [getWeekNumber, today]);
  
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
  
  // Calculate if a month is in the past (i.e., between birth date and current date)
  const isMonthInPast = useCallback((year: number, month: number) => {
    if (!birthDate) {
      return false;
    }
    
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    
    // Calculate total months lived by the user
    const totalMonthsLived = (currentYear - birthYear) * 12 + (currentMonth - birthMonth + 1);
    
    // Calculate how many months this cell is from the birth date
    let monthsFromBirth;
    
    // If this is the birth year (year 0 in the grid), months start from birth month
    if (year === birthYear) {
      // In birth year, only months >= birth month are valid
      monthsFromBirth = month - birthMonth;
    } else {
      // For subsequent years, calculate total months from birth
      const yearsFromBirth = year - birthYear;
      monthsFromBirth = yearsFromBirth * 12 + (month - birthMonth);
    }
    
    // A month is "in the past" if the user has lived it
    return monthsFromBirth >= 0 && monthsFromBirth < totalMonthsLived;
  }, [birthDate, currentYear, currentMonth]);
  
  // Calculate if a week is in the past (i.e., between birth date and current date)
  const isWeekInPast = useCallback((year: number, week: number) => {
    if (!birthDate) {
      // If no birth date is set, just compare with current date
      return year < currentYear || (year === currentYear && week < currentWeek);
    }
    
    const birthYear = birthDate.getFullYear();
    const birthWeek = getWeekNumber(birthDate);
    
    // A week is "in the past" if it's after or equal to birth week/year and before current week/year
    if (year < birthYear) {
      return false; // Before birth year
    } else if (year === birthYear) {
      return week >= birthWeek && (year < currentYear || (year === currentYear && week < currentWeek));
    } else {
      return year < currentYear || (year === currentYear && week < currentWeek);
    }
  }, [birthDate, currentYear, currentWeek, getWeekNumber]);
  
  // Calculate if a year is in the past (i.e., between birth year and current year)
  const isYearInPast = useCallback((year: number) => {
    if (!birthDate) {
      // If no birth date is set, just compare with current year
      return year < currentYear;
    }
    
    const birthYear = birthDate.getFullYear();
    
    // A year is "in the past" if it's after or equal to birth year and before current year
    return year >= birthYear && year < currentYear;
  }, [birthDate, currentYear]);
  
  // Calculate if a year is the current year
  const isCurrentYear = useCallback((year: number) => {
    return year === currentYear;
  }, [currentYear]);
  
  // Check if a month is the current month
  const isCurrentMonth = useCallback((year: number, month: number): boolean => {
    if (!birthDate) {
      return year === currentYear && month === currentMonth;
    }
    
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    
    // For birth alignment, we need to check if this is the current month relative to birth month
    // Calculate how many months from birth to current date
    const totalMonthsLived = (currentYear - birthYear) * 12 + (currentMonth - birthMonth);
    
    // Calculate how many months this cell is from the birth date
    let monthsFromBirth;
    
    if (year === birthYear) {
      // In birth year, only months >= birth month are valid
      monthsFromBirth = month - birthMonth;
    } else {
      // For subsequent years, calculate total months from birth
      const yearsFromBirth = year - birthYear;
      monthsFromBirth = yearsFromBirth * 12 + (month - birthMonth);
    }
    
    // This is the current month if months from birth equals total months lived
    return monthsFromBirth === totalMonthsLived;
  }, [birthDate, currentYear, currentMonth]);
  
  // Calculate if a week is the current week
  const isCurrentWeek = useCallback((year: number, week: number) => {
    return year === currentYear && week === currentWeek;
  }, [currentYear, currentWeek]);
  
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
    // New utility methods
    getStartMonth,
    getYearOffset,
    getAlignedDate,
  };
}

// Default export for Expo Router compatibility
export default useDateCalculations; 