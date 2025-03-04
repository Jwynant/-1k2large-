import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContentItem, Season } from '../types';

// Storage keys
const STORAGE_KEYS = {
  USER_DATA: '@1000Months:userData',
};

// User data interface
interface UserData {
  userBirthDate?: string | null;
  accentColor?: string;
  contentItems?: ContentItem[];
  seasons?: Season[];
  theme?: 'dark' | 'light' | 'system';
}

/**
 * Service for handling data persistence using AsyncStorage
 */
export class StorageService {
  /**
   * Save all user data to AsyncStorage
   */
  static async saveUserData(userData: UserData): Promise<void> {
    try {
      const jsonValue = JSON.stringify(userData);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, jsonValue);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  /**
   * Load all user data from AsyncStorage
   */
  static async getUserData(): Promise<UserData | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }

  /**
   * Clear all app data from AsyncStorage
   */
  static async clearAllData(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}

// Default export for Expo Router
export default StorageService; 