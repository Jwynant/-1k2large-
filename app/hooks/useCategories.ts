import { useAppContext } from '../context/AppContext';
import { Category } from '../types';

// Utility function to generate a unique ID
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Default categories with icons and colors
export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Work', color: '#FF9500', icon: 'briefcase-outline' },
  { name: 'Health', color: '#34C759', icon: 'fitness-outline' },
  { name: 'Family', color: '#FF2D55', icon: 'people-outline' },
  { name: 'Personal Growth', color: '#5856D6', icon: 'leaf-outline' },
  { name: 'Finances', color: '#007AFF', icon: 'cash-outline' },
  { name: 'Spirituality', color: '#AF52DE', icon: 'meditate-outline' },
  { name: 'Education', color: '#FF3B30', icon: 'book-outline' },
  { name: 'Social', color: '#5AC8FA', icon: 'people-circle-outline' },
  { name: 'Recreation', color: '#FFCC00', icon: 'bicycle-outline' },
  { name: 'Community', color: '#4CD964', icon: 'globe-outline' }
];

/**
 * Hook for managing categories
 */
export function useCategories() {
  const { state, dispatch } = useAppContext();
  
  // Access categories from state
  const categories = state.categories || [];
  
  /**
   * Initialize default categories if none exist
   */
  const initializeDefaultCategories = () => {
    if (categories.length === 0) {
      const initialCategories = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        id: generateUniqueId()
      }));
      dispatch({ type: 'LOAD_CATEGORIES', payload: initialCategories });
      return initialCategories;
    }
    return categories;
  };
  
  /**
   * Add a new category
   */
  const addCategory = (category: Omit<Category, 'id'>) => {
    const id = generateUniqueId();
    const newCategory = { ...category, id };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    return id;
  };
  
  /**
   * Update an existing category
   */
  const updateCategory = (category: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category });
  };
  
  /**
   * Delete a category
   */
  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };
  
  /**
   * Get a category by ID
   */
  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };
  
  /**
   * Get multiple categories by IDs
   */
  const getCategoriesByIds = (ids: string[] = []) => {
    return categories.filter(cat => ids.includes(cat.id));
  };
  
  /**
   * Generate a random color for new categories
   */
  const getRandomColor = () => {
    const colors = [
      '#FF9500', '#FF2D55', '#5856D6', '#007AFF', 
      '#34C759', '#AF52DE', '#FF3B30', '#5AC8FA',
      '#FFCC00', '#4CD964', '#9C27B0', '#FF4081'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return {
    categories,
    initializeDefaultCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoriesByIds,
    getRandomColor
  };
} 