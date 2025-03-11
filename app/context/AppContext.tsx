import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef, useMemo, useCallback } from 'react';
import { StorageService } from '../services/StorageService';
import { 
  AppState, 
  AppAction, 
  ContentItem, 
  Season, 
  ViewMode, 
  ViewState,
  DisplayMode,
  SelectedCell,
  FocusArea,
  UserSettings,
  Category,
} from '../types';
import { migrateFocusAreas, needsFocusAreaMigration } from '../utils/migrations';
import { DEFAULT_CATEGORIES } from '../hooks/useCategories';

// Split the context into smaller, more focused contexts
// 1. User data context (rarely changes)
const UserContext = createContext<{
  userBirthDate: string | null;
  userSettings: UserSettings;
  theme: string;
  accentColor: string;
  setUserBirthDate: (date: string | null) => void;
  setUserSettings: (settings: UserSettings) => void;
  setTheme: (theme: string) => void;
  setAccentColor: (color: string) => void;
}>({
  userBirthDate: null,
  userSettings: {
    lifeExpectancy: 83,
    notifications: {
      goalDeadlines: true,
      priorityReminders: true,
      memoryCapture: true
    },
    notificationsEnabled: true,
    showCompletedGoals: true,
    weekStartsOnMonday: false,
  },
  theme: 'dark',
  accentColor: '#007AFF',
  setUserBirthDate: () => null,
  setUserSettings: () => null,
  setTheme: () => null,
  setAccentColor: () => null,
});

// 2. View state context (changes frequently)
const ViewContext = createContext<{
  viewMode: ViewMode;
  viewState: ViewState;
  displayMode: DisplayMode;
  selectedYear: number | null;
  selectedMonth: number | null;
  selectedWeek: number | null;
  selectedCell: SelectedCell | null;
  setViewMode: (mode: ViewMode) => void;
  setViewState: (state: ViewState) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  selectYear: (year: number | null) => void;
  selectMonth: (month: number | null) => void;
  selectWeek: (week: number | null) => void;
  selectCell: (cell: SelectedCell | null) => void;
}>({
  viewMode: 'months',
  viewState: 'grid',
  displayMode: 'grid',
  selectedYear: null,
  selectedMonth: null,
  selectedWeek: null,
  selectedCell: null,
  setViewMode: () => null,
  setViewState: () => null,
  setDisplayMode: () => null,
  selectYear: () => null,
  selectMonth: () => null,
  selectWeek: () => null,
  selectCell: () => null,
});

// 3. Content context (changes when content is added/edited)
const ContentContext = createContext<{
  contentItems: ContentItem[];
  seasons: Season[];
  focusAreas: FocusArea[];
  categories: Category[];
  isLoading: boolean;
  addContentItem: (item: ContentItem) => void;
  updateContentItem: (id: string, item: ContentItem) => void;
  deleteContentItem: (id: string) => void;
  addSeason: (season: Season) => void;
  updateSeason: (id: string, season: Season) => void;
  deleteSeason: (id: string) => void;
  addFocusArea: (area: FocusArea) => void;
  updateFocusArea: (id: string, area: FocusArea) => void;
  deleteFocusArea: (id: string) => void;
  setCategories: (categories: Category[]) => void;
}>({
  contentItems: [],
  seasons: [],
  focusAreas: [],
  categories: [],
  isLoading: true,
  addContentItem: () => null,
  updateContentItem: () => null,
  deleteContentItem: () => null,
  addSeason: () => null,
  updateSeason: () => null,
  deleteSeason: () => null,
  addFocusArea: () => null,
  updateFocusArea: () => null,
  deleteFocusArea: () => null,
  setCategories: () => null,
});

// For backward compatibility, maintain the original AppContext
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
    displayMode: 'grid',
    selectedYear: null,
    selectedMonth: null,
    selectedWeek: null,
    selectedCell: null,
    contentItems: [],
    seasons: [],
    focusAreas: [],
    categories: [],
    timelineColumns: [],
    userSettings: {
      lifeExpectancy: 83,
      notifications: {
        goalDeadlines: true,
        priorityReminders: true,
        memoryCapture: true
      },
      notificationsEnabled: true,
      showCompletedGoals: true,
      weekStartsOnMonday: false,
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
  displayMode: 'grid',
  selectedYear: null,
  selectedMonth: null,
  selectedWeek: null,
  selectedCell: null,
  contentItems: [],
  seasons: [],
  focusAreas: [],
  categories: [],
  timelineColumns: [],
  userSettings: {
    lifeExpectancy: 83,
    notifications: {
      goalDeadlines: true,
      priorityReminders: true,
      memoryCapture: true
    },
    notificationsEnabled: true,
    showCompletedGoals: true,
    weekStartsOnMonday: false,
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
    case 'SET_DISPLAY_MODE':
      return { ...state, displayMode: action.payload };
    case 'SELECT_YEAR':
      return { ...state, selectedYear: action.payload };
    case 'SELECT_MONTH':
      return { ...state, selectedMonth: action.payload };
    case 'SELECT_WEEK':
      return { ...state, selectedWeek: action.payload };
    case 'SELECT_CELL':
      return { ...state, selectedCell: action.payload };
    case 'ADD_CONTENT_ITEM':
      console.log('AppContext - ADD_CONTENT_ITEM action received:', action.payload.id);
      console.log('AppContext - Current contentItems count:', state.contentItems.length);
      const newState = { 
        ...state, 
        contentItems: [...state.contentItems, action.payload] 
      };
      console.log('AppContext - New contentItems count:', newState.contentItems.length);
      return newState;
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
      const reorderedAreas = action.payload.map(id => 
        state.focusAreas.find(area => area.id === id)
      ).filter(area => area !== undefined) as FocusArea[];
      
      return {
        ...state,
        focusAreas: reorderedAreas
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        )
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      };
    case 'LOAD_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'UPDATE_USER_SETTINGS':
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          ...action.payload
        }
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    case 'UPDATE_TIMELINE_COLUMN':
      return {
        ...state,
        timelineColumns: state.timelineColumns.map(column => 
          column.id === action.payload.id ? action.payload : column
        )
      };
    case 'LOAD_DATA':
      return {
        ...state,
        contentItems: action.payload.contentItems,
        seasons: action.payload.seasons,
        focusAreas: action.payload.focusAreas,
        userSettings: action.payload.userSettings,
        categories: action.payload.categories || state.categories,
        timelineColumns: action.payload.timelineColumns || state.timelineColumns,
        isLoading: false
      };
    case 'INITIALIZE_APP':
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const storageService = useRef(new StorageService());
  
  // Load data from storage on mount
  useEffect(() => {
    async function loadData() {
      try {
        console.log('Loading app data...');
        
        // Load all data in parallel for better performance
        const [
          contentItems,
          seasons,
          focusAreas,
          userSettings,
          categories,
          userBirthDate,
          theme
        ] = await Promise.all([
          StorageService.getContentItems(),
          StorageService.getSeasons(),
          StorageService.getFocusAreas(),
          StorageService.getUserSettings(),
          StorageService.getCategories(),
          StorageService.getUserBirthDate(),
          StorageService.getTheme()
        ]);
        
        // Process focus areas if needed
        let processedFocusAreas = focusAreas;
        if (needsFocusAreaMigration(focusAreas)) {
          processedFocusAreas = migrateFocusAreas(focusAreas);
          await StorageService.saveFocusAreas(processedFocusAreas);
        }
        
        // Batch all state updates into a single dispatch
        dispatch({ 
          type: 'INITIALIZE_APP', 
          payload: { 
            contentItems: contentItems || [], 
            seasons: seasons || [], 
            focusAreas: processedFocusAreas || [],
            userSettings: userSettings || initialState.userSettings,
            categories: categories || DEFAULT_CATEGORIES,
            timelineColumns: [], // Initialize with empty array
            userBirthDate: userBirthDate || null,
            theme: theme || 'dark'
          } 
        });
        
        console.log('App data loaded successfully');
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
      // Use individual save methods instead of a non-existent saveData method
      const saveState = async () => {
        try {
          await StorageService.saveContentItems(state.contentItems);
          await StorageService.saveSeasons(state.seasons);
          await StorageService.saveFocusAreas(state.focusAreas);
          await StorageService.saveUserSettings(state.userSettings);
          await StorageService.saveCategories(state.categories);
          if (state.userBirthDate) {
            await StorageService.saveUserBirthDate(state.userBirthDate);
          }
          await StorageService.saveTheme(state.theme);
        } catch (error) {
          console.error('Error saving state:', error);
        }
      };
      
      saveState();
    }
  }, [state]);
  
  // Create memoized values and handlers for UserContext
  const userContextValue = useMemo(() => ({
    userBirthDate: state.userBirthDate,
    userSettings: state.userSettings,
    theme: state.theme,
    accentColor: state.accentColor,
    setUserBirthDate: (date: string | null) => 
      dispatch({ type: 'SET_USER_BIRTH_DATE', payload: date || '' }),
    setUserSettings: (settings: UserSettings) => 
      dispatch({ type: 'UPDATE_USER_SETTINGS', payload: settings }),
    setTheme: (theme: string) => 
      dispatch({ type: 'SET_THEME', payload: theme as 'dark' | 'light' | 'system' }),
    setAccentColor: (color: string) => 
      dispatch({ type: 'SET_ACCENT_COLOR', payload: color }),
  }), [
    state.userBirthDate, 
    state.userSettings, 
    state.theme, 
    state.accentColor
  ]);
  
  // Create memoized values and handlers for ViewContext
  const viewContextValue = useMemo(() => ({
    viewMode: state.viewMode,
    viewState: state.viewState,
    displayMode: state.displayMode,
    selectedYear: state.selectedYear,
    selectedMonth: state.selectedMonth,
    selectedWeek: state.selectedWeek,
    selectedCell: state.selectedCell,
    setViewMode: (mode: ViewMode) => 
      dispatch({ type: 'SET_VIEW_MODE', payload: mode }),
    setViewState: (viewState: ViewState) => 
      dispatch({ type: 'SET_VIEW_STATE', payload: viewState }),
    setDisplayMode: (mode: DisplayMode) => 
      dispatch({ type: 'SET_DISPLAY_MODE', payload: mode }),
    selectYear: (year: number | null) => 
      dispatch({ type: 'SELECT_YEAR', payload: year }),
    selectMonth: (month: number | null) => 
      dispatch({ type: 'SELECT_MONTH', payload: month }),
    selectWeek: (week: number | null) => 
      dispatch({ type: 'SELECT_WEEK', payload: week }),
    selectCell: (cell: SelectedCell | null) => 
      dispatch({ type: 'SELECT_CELL', payload: cell }),
  }), [
    state.viewMode,
    state.viewState,
    state.displayMode,
    state.selectedYear,
    state.selectedMonth,
    state.selectedWeek,
    state.selectedCell
  ]);
  
  // Create memoized values and handlers for ContentContext
  const contentContextValue = useMemo(() => ({
    contentItems: state.contentItems,
    seasons: state.seasons,
    focusAreas: state.focusAreas,
    categories: state.categories,
    isLoading: state.isLoading,
    addContentItem: (item: ContentItem) => 
      dispatch({ type: 'ADD_CONTENT_ITEM', payload: item }),
    updateContentItem: (id: string, item: ContentItem) => 
      dispatch({ type: 'UPDATE_CONTENT_ITEM', payload: { ...item, id } }),
    deleteContentItem: (id: string) => 
      dispatch({ type: 'DELETE_CONTENT_ITEM', payload: id }),
    addSeason: (season: Season) => 
      dispatch({ type: 'ADD_SEASON', payload: season }),
    updateSeason: (id: string, season: Season) => 
      dispatch({ type: 'UPDATE_SEASON', payload: { ...season, id } }),
    deleteSeason: (id: string) => 
      dispatch({ type: 'DELETE_SEASON', payload: id }),
    addFocusArea: (area: FocusArea) => 
      dispatch({ type: 'ADD_FOCUS_AREA', payload: area }),
    updateFocusArea: (id: string, area: FocusArea) => 
      dispatch({ type: 'UPDATE_FOCUS_AREA', payload: { ...area, id } }),
    deleteFocusArea: (id: string) => 
      dispatch({ type: 'DELETE_FOCUS_AREA', payload: id }),
    setCategories: (categories: Category[]) => 
      dispatch({ type: 'SET_CATEGORIES', payload: categories }),
  }), [
    state.contentItems,
    state.seasons,
    state.focusAreas,
    state.categories,
    state.isLoading
  ]);
  
  // Provide the contexts in a nested structure
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <UserContext.Provider value={userContextValue}>
        <ViewContext.Provider value={viewContextValue}>
          <ContentContext.Provider value={contentContextValue}>
            {children}
          </ContentContext.Provider>
        </ViewContext.Provider>
      </UserContext.Provider>
    </AppContext.Provider>
  );
}

// Custom hooks to use the contexts
export function useAppContext() {
  return useContext(AppContext);
}

export function useUserContext() {
  return useContext(UserContext);
}

export function useViewContext() {
  return useContext(ViewContext);
}

export function useContentContext() {
  return useContext(ContentContext);
}

// Export the provider as default to satisfy Expo Router
export default AppProvider; 