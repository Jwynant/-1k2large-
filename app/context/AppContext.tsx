import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { 
  AppState, 
  AppAction, 
  ContentItem, 
  Season, 
  ViewMode, 
  ViewState, 
  SelectedCell,
  FocusArea,
  UserSettings
} from '../types';

// Create the context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: {
    isLoading: true,
    userBirthDate: null,
    accentColor: '#007AFF',
    viewMode: 'months',
    viewState: 'grid',
    selectedYear: null,
    selectedMonth: null,
    selectedWeek: null,
    selectedCell: null,
    contentItems: [],
    seasons: [],
    focusAreas: [],
    userSettings: {
      lifeExpectancy: 83, // Default 83 years (approximately 1000 months)
      notifications: {
        goalDeadlines: true,
        priorityReminders: true,
        reflectionPrompts: true,
        memoryCapture: true
      },
      notificationsEnabled: true,
      showCompletedGoals: true,
      weekStartsOnMonday: false
    },
    theme: 'dark',
  },
  dispatch: () => null,
});

// Initial state
const initialState: AppState = {
  isLoading: true,
  userBirthDate: null,
  accentColor: '#007AFF',
  viewMode: 'months',
  viewState: 'grid',
  selectedYear: null,
  selectedMonth: null,
  selectedWeek: null,
  selectedCell: null,
  contentItems: [],
  seasons: [],
  focusAreas: [],
  userSettings: {
    lifeExpectancy: 83, // Default 83 years (approximately 1000 months)
    notifications: {
      goalDeadlines: true,
      priorityReminders: true,
      reflectionPrompts: true,
      memoryCapture: true
    },
    notificationsEnabled: true,
    showCompletedGoals: true,
    weekStartsOnMonday: false
  },
  theme: 'dark',
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER_BIRTH_DATE':
      return { ...state, userBirthDate: action.payload };
    case 'SET_ACCENT_COLOR':
      return { ...state, accentColor: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_VIEW_STATE':
      return { ...state, viewState: action.payload };
    case 'SELECT_YEAR':
      return { ...state, selectedYear: action.payload };
    case 'SELECT_MONTH':
      return { ...state, selectedMonth: action.payload };
    case 'SELECT_WEEK':
      return { ...state, selectedWeek: action.payload };
    case 'SELECT_CELL':
      return { ...state, selectedCell: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_CONTENT_ITEM':
      return { 
        ...state, 
        contentItems: [...state.contentItems, action.payload] 
      };
    case 'UPDATE_CONTENT_ITEM':
      return { 
        ...state, 
        contentItems: state.contentItems.map(item => 
          item.id === action.payload.id ? action.payload : item
        ) 
      };
    case 'DELETE_CONTENT_ITEM':
      return { 
        ...state, 
        contentItems: state.contentItems.filter(item => item.id !== action.payload) 
      };
    case 'ADD_SEASON':
      return { 
        ...state, 
        seasons: [...state.seasons, action.payload] 
      };
    case 'UPDATE_SEASON':
      return { 
        ...state, 
        seasons: state.seasons.map(season => 
          season.id === action.payload.id ? action.payload : season
        ) 
      };
    case 'DELETE_SEASON':
      return { 
        ...state, 
        seasons: state.seasons.filter(season => season.id !== action.payload) 
      };
    case 'ADD_FOCUS_AREA':
      return {
        ...state,
        focusAreas: [...state.focusAreas, action.payload]
      };
    case 'UPDATE_FOCUS_AREA':
      return {
        ...state,
        focusAreas: state.focusAreas.map(area =>
          area.id === action.payload.id ? action.payload : area
        )
      };
    case 'DELETE_FOCUS_AREA':
      return {
        ...state,
        focusAreas: state.focusAreas.filter(area => area.id !== action.payload)
      };
    case 'REORDER_FOCUS_AREAS':
      // Reorder based on the array of IDs representing the new order
      return {
        ...state,
        focusAreas: action.payload.map(id => 
          // Find the focus area with matching ID
          state.focusAreas.find(area => area.id === id)!
        ).filter(Boolean) // Filter out any undefined values
      };
    case 'UPDATE_USER_SETTINGS':
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          ...action.payload
        }
      };
    case 'LOAD_DATA':
      return { 
        ...state, 
        contentItems: action.payload.contentItems || [],
        seasons: action.payload.seasons || [],
        focusAreas: action.payload.focusAreas || [],
        userSettings: action.payload.userSettings || initialState.userSettings,
        isLoading: false
      };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Load data from storage on initial render
  useEffect(() => {
    async function loadData() {
      try {
        const userData = await StorageService.getUserData();
        if (userData) {
          dispatch({ 
            type: 'LOAD_DATA', 
            payload: { 
              contentItems: userData.contentItems || [], 
              seasons: userData.seasons || [],
              focusAreas: userData.focusAreas || [],
              userSettings: userData.userSettings || initialState.userSettings
            } 
          });
          
          if (userData.userBirthDate) {
            dispatch({ type: 'SET_USER_BIRTH_DATE', payload: userData.userBirthDate });
          }
          
          if (userData.accentColor) {
            dispatch({ type: 'SET_ACCENT_COLOR', payload: userData.accentColor });
          }
          
          if (userData.theme) {
            dispatch({ type: 'SET_THEME', payload: userData.theme });
          }
        }
        
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('Error loading data:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    
    loadData();
  }, []);
  
  // Save data to storage when state changes
  useEffect(() => {
    if (!state.isLoading) {
      StorageService.saveUserData({
        userBirthDate: state.userBirthDate,
        accentColor: state.accentColor,
        contentItems: state.contentItems,
        seasons: state.seasons,
        focusAreas: state.focusAreas,
        userSettings: state.userSettings,
        theme: state.theme,
      });
    }
  }, [
    state.userBirthDate, 
    state.accentColor, 
    state.contentItems, 
    state.seasons, 
    state.focusAreas, 
    state.userSettings, 
    state.theme, 
    state.isLoading
  ]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Export the provider as default to satisfy Expo Router
export default AppProvider; 