import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { ContentItem } from '../types';
import { StorageService } from './StorageService';

// Configure default notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Notification types
export type NotificationType = 
  | 'goalDeadline'
  | 'lessonReminder'
  | 'dailyReflection'
  | 'weeklyReflection';

// Notification data structure
export interface NotificationData {
  type: NotificationType;
  contentId?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Notification service class
export class NotificationService {
  // Check if device can receive notifications
  static async areNotificationsAvailable(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Notifications are not available in the simulator/emulator');
      return false;
    }
    return true;
  }

  // Request notification permissions
  static async requestPermissions(): Promise<boolean> {
    if (!await this.areNotificationsAvailable()) {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get notification permissions');
      return false;
    }

    return true;
  }

  // Schedule a notification
  static async scheduleNotification(
    notification: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> {
    if (!await this.requestPermissions()) {
      console.log('Notification permissions not granted');
      return '';
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: {
            type: notification.type,
            contentId: notification.contentId,
            ...notification.data,
          },
        },
        trigger,
      });

      console.log(`Scheduled notification with ID: ${id}`);
      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return '';
    }
  }

  // Schedule a goal deadline notification
  static async scheduleGoalDeadlineNotification(goal: ContentItem): Promise<string> {
    if (!goal.deadline) {
      return '';
    }

    const deadlineDate = new Date(goal.deadline);
    // Schedule 1 day before deadline
    const notificationDate = new Date(deadlineDate);
    notificationDate.setDate(notificationDate.getDate() - 1);
    
    // Don't schedule if the date is in the past
    if (notificationDate < new Date()) {
      return '';
    }

    return this.scheduleNotification(
      {
        type: 'goalDeadline',
        contentId: goal.id,
        title: 'Goal Deadline Approaching',
        body: `Your goal "${goal.title}" is due tomorrow.`,
      },
      { date: notificationDate }
    );
  }

  // Schedule a lesson reminder notification
  static async scheduleLessonReminder(lesson: ContentItem): Promise<string> {
    if (!lesson.reminder?.nextReminder) {
      return '';
    }

    const reminderDate = new Date(lesson.reminder.nextReminder);
    
    // Don't schedule if the date is in the past
    if (reminderDate < new Date()) {
      return '';
    }

    return this.scheduleNotification(
      {
        type: 'lessonReminder',
        contentId: lesson.id,
        title: 'Lesson Reminder',
        body: `Remember your lesson: "${lesson.title}"`,
      },
      { date: reminderDate }
    );
  }

  // Schedule a daily reflection notification
  static async scheduleDailyReflection(time: { hour: number, minute: number }): Promise<string> {
    return this.scheduleNotification(
      {
        type: 'dailyReflection',
        title: 'Daily Reflection',
        body: 'Take a moment to reflect on your day and capture a memory.',
      },
      {
        hour: time.hour,
        minute: time.minute,
        repeats: true,
      }
    );
  }

  // Cancel a specific notification
  static async cancelNotification(id: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      console.log(`Cancelled notification with ID: ${id}`);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  // Cancel all notifications
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cancelled all notifications');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  // Get all scheduled notifications
  static async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Set up notification listeners
  static setNotificationListeners(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationResponse: (response: Notifications.NotificationResponse) => void
  ): () => void {
    const receivedSubscription = Notifications.addNotificationReceivedListener(onNotificationReceived);
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);

    // Return cleanup function
    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }

  // Reschedule notifications for all content items
  static async rescheduleAllNotifications(): Promise<void> {
    // Cancel all existing notifications
    await this.cancelAllNotifications();

    // Only proceed if notifications are enabled
    const userData = await StorageService.getUserData();
    if (!userData?.userSettings?.notificationsEnabled) {
      return;
    }

    // Get all content items
    const contentItems = await StorageService.getContentItems();

    // Schedule goal deadline notifications
    const goals = contentItems.filter(item => 
      item.type === 'goal' && !item.isCompleted && item.deadline
    );
    
    for (const goal of goals) {
      await this.scheduleGoalDeadlineNotification(goal);
    }

    // Schedule lesson reminder notifications
    const lessons = contentItems.filter(item => 
      item.type === 'lesson' && item.reminder?.nextReminder
    );
    
    for (const lesson of lessons) {
      await this.scheduleLessonReminder(lesson);
    }

    // Schedule daily reflection if enabled
    if (userData?.userSettings?.notifications?.memoryCapture) {
      await this.scheduleDailyReflection({ hour: 20, minute: 0 }); // 8:00 PM
    }
  }
} 