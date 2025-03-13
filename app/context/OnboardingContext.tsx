import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from './AppContext';

// Define the onboarding state type
interface OnboardingState {
  currentStep: number;
  userName: string;
  birthDate: Date;
  lifeExpectancy: number;
  isCompleted: boolean;
}

// Define the context type
interface OnboardingContextType {
  state: OnboardingState;
  setCurrentStep: (step: number) => void;
  setUserName: (name: string) => void;
  setBirthDate: (date: Date) => void;
  setLifeExpectancy: (years: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

// Create the context with default values
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Storage key
const ONBOARDING_STORAGE_KEY = 'onboarding_state';

// Provider component
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { dispatch } = useAppContext();
  
  // Initialize state
  const [state, setState] = useState<OnboardingState>({
    currentStep: 0,
    userName: '',
    birthDate: new Date(1990, 0, 1),
    lifeExpectancy: 83, // Default to 83 years (approximately 1000 months)
    isCompleted: false,
  });

  // Load saved state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // Convert string date back to Date object
          parsedState.birthDate = new Date(parsedState.birthDate);
          setState(parsedState);
        }
      } catch (error) {
        console.error('Failed to load onboarding state:', error);
      }
    };

    loadState();
  }, []);

  // Save state when it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save onboarding state:', error);
      }
    };

    saveState();
  }, [state]);

  // Update functions
  const setCurrentStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const setUserName = (name: string) => {
    setState(prev => ({ ...prev, userName: name }));
  };

  const setBirthDate = (date: Date) => {
    setState(prev => ({ ...prev, birthDate: date }));
  };

  const setLifeExpectancy = (years: number) => {
    setState(prev => ({ ...prev, lifeExpectancy: years }));
  };

  const completeOnboarding = () => {
    // Update app context with user data
    dispatch({ 
      type: 'SET_USER_BIRTH_DATE', 
      payload: state.birthDate.toISOString().split('T')[0] 
    });
    
    // Update user settings with life expectancy
    dispatch({
      type: 'UPDATE_USER_SETTINGS',
      payload: { lifeExpectancy: state.lifeExpectancy }
    });
    
    // Mark onboarding as completed
    setState(prev => ({ ...prev, isCompleted: true }));
  };

  const resetOnboarding = () => {
    setState({
      currentStep: 0,
      userName: '',
      birthDate: new Date(1990, 0, 1),
      lifeExpectancy: 83,
      isCompleted: false,
    });
  };

  // Context value
  const value: OnboardingContextType = {
    state,
    setCurrentStep,
    setUserName,
    setBirthDate,
    setLifeExpectancy,
    completeOnboarding,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Custom hook to use the context
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

export default OnboardingProvider; 