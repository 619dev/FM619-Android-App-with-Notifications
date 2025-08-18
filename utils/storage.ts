import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  static async getObject<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting object ${key}:`, error);
      return null;
    }
  }

  static async setObject(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting object ${key}:`, error);
    }
  }
}

// Storage keys
export const STORAGE_KEYS = {
  NOTIFICATION_SETTINGS: 'notificationSettings',
  NOTIFICATIONS_HISTORY: 'notificationsHistory',
  USER_PREFERENCES: 'userPreferences',
  PUSH_TOKEN: 'pushToken',
} as const;