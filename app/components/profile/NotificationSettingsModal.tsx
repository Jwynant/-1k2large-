import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Switch,
  ScrollView,
  Platform,
  useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserSettings } from '../../types';

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  userSettings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

export default function NotificationSettingsModal({
  visible,
  onClose,
  userSettings,
  onUpdateSettings
}: NotificationSettingsModalProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Local state for notification settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    userSettings.notificationsEnabled
  );
  const [goalDeadlines, setGoalDeadlines] = useState(
    userSettings.notifications.goalDeadlines
  );
  const [priorityReminders, setPriorityReminders] = useState(
    userSettings.notifications.priorityReminders
  );
  const [memoryCapture, setMemoryCapture] = useState(
    userSettings.notifications.memoryCapture
  );
  
  // State for daily reflection time
  const [reflectionTime, setReflectionTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Initialize reflection time from user settings or default to 8:00 PM
  React.useEffect(() => {
    const time = new Date();
    const savedHour = userSettings.dailyReflectionTime?.hour ?? 20;
    const savedMinute = userSettings.dailyReflectionTime?.minute ?? 0;
    
    time.setHours(savedHour);
    time.setMinutes(savedMinute);
    setReflectionTime(time);
  }, [userSettings]);
  
  // Handle master toggle for all notifications
  const handleToggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Handle individual notification toggles
  const handleToggleGoalDeadlines = (value: boolean) => {
    setGoalDeadlines(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleTogglePriorityReminders = (value: boolean) => {
    setPriorityReminders(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleToggleMemoryCapture = (value: boolean) => {
    setMemoryCapture(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Handle time change for daily reflection
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setReflectionTime(selectedTime);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Save all notification settings
  const handleSave = () => {
    onUpdateSettings({
      notificationsEnabled,
      notifications: {
        goalDeadlines,
        priorityReminders,
        memoryCapture
      },
      dailyReflectionTime: {
        hour: reflectionTime.getHours(),
        minute: reflectionTime.getMinutes()
      }
    });
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };
  
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }
      ]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons 
              name="close" 
              size={28} 
              color={isDarkMode ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
          <Text style={[
            styles.title,
            { color: isDarkMode ? '#FFFFFF' : '#000000' }
          ]}>
            Notification Settings
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          {/* Master toggle for all notifications */}
          <View style={[
            styles.settingItem,
            { borderBottomColor: isDarkMode ? '#2C2C2E' : '#E5E5EA' }
          ]}>
            <View style={styles.settingContent}>
              <View style={styles.settingTitleRow}>
                <Ionicons 
                  name="notifications" 
                  size={24} 
                  color="#5856D6" 
                  style={styles.settingIcon} 
                />
                <Text style={[
                  styles.settingLabel,
                  { color: isDarkMode ? '#FFFFFF' : '#000000' }
                ]}>
                  Enable All Notifications
                </Text>
              </View>
              <Text style={styles.settingDescription}>
                Turn on to receive all notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#3A3A3C', true: '#5856D6' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          {/* Individual notification settings - only enabled if master toggle is on */}
          <View style={[
            styles.settingsGroup,
            { opacity: notificationsEnabled ? 1 : 0.5 }
          ]}>
            <Text style={[
              styles.groupTitle,
              { color: isDarkMode ? '#FFFFFF' : '#000000' }
            ]}>
              Notification Types
            </Text>
            
            {/* Goal deadlines */}
            <View style={[
              styles.settingItem,
              { borderBottomColor: isDarkMode ? '#2C2C2E' : '#E5E5EA' }
            ]}>
              <View style={styles.settingContent}>
                <View style={styles.settingTitleRow}>
                  <Ionicons 
                    name="flag" 
                    size={22} 
                    color="#FF9500" 
                    style={styles.settingIcon} 
                  />
                  <Text style={[
                    styles.settingLabel,
                    { color: isDarkMode ? '#FFFFFF' : '#000000' }
                  ]}>
                    Goal Deadlines
                  </Text>
                </View>
                <Text style={styles.settingDescription}>
                  Receive reminders when goals are approaching their deadlines
                </Text>
              </View>
              <Switch
                value={goalDeadlines}
                onValueChange={handleToggleGoalDeadlines}
                trackColor={{ false: '#3A3A3C', true: '#FF9500' }}
                thumbColor="#FFFFFF"
                disabled={!notificationsEnabled}
              />
            </View>
            
            {/* Priority reminders */}
            <View style={[
              styles.settingItem,
              { borderBottomColor: isDarkMode ? '#2C2C2E' : '#E5E5EA' }
            ]}>
              <View style={styles.settingContent}>
                <View style={styles.settingTitleRow}>
                  <Ionicons 
                    name="star" 
                    size={22} 
                    color="#FF2D55" 
                    style={styles.settingIcon} 
                  />
                  <Text style={[
                    styles.settingLabel,
                    { color: isDarkMode ? '#FFFFFF' : '#000000' }
                  ]}>
                    Priority Reminders
                  </Text>
                </View>
                <Text style={styles.settingDescription}>
                  Get weekly reminders about your priority focus areas
                </Text>
              </View>
              <Switch
                value={priorityReminders}
                onValueChange={handleTogglePriorityReminders}
                trackColor={{ false: '#3A3A3C', true: '#FF2D55' }}
                thumbColor="#FFFFFF"
                disabled={!notificationsEnabled}
              />
            </View>
            
            {/* Memory capture */}
            <View style={[
              styles.settingItem,
              { borderBottomColor: isDarkMode ? '#2C2C2E' : '#E5E5EA' }
            ]}>
              <View style={styles.settingContent}>
                <View style={styles.settingTitleRow}>
                  <Ionicons 
                    name="camera" 
                    size={22} 
                    color="#32D74B" 
                    style={styles.settingIcon} 
                  />
                  <Text style={[
                    styles.settingLabel,
                    { color: isDarkMode ? '#FFFFFF' : '#000000' }
                  ]}>
                    Daily Reflection
                  </Text>
                </View>
                <Text style={styles.settingDescription}>
                  Daily reminder to capture memories and reflect on your day
                </Text>
              </View>
              <Switch
                value={memoryCapture}
                onValueChange={handleToggleMemoryCapture}
                trackColor={{ false: '#3A3A3C', true: '#32D74B' }}
                thumbColor="#FFFFFF"
                disabled={!notificationsEnabled}
              />
            </View>
            
            {/* Reflection time picker - only visible if memory capture is enabled */}
            {memoryCapture && notificationsEnabled && (
              <View style={[
                styles.settingItem,
                { borderBottomColor: isDarkMode ? '#2C2C2E' : '#E5E5EA' }
              ]}>
                <View style={styles.settingContent}>
                  <View style={styles.settingTitleRow}>
                    <Ionicons 
                      name="time" 
                      size={22} 
                      color="#64D2FF" 
                      style={styles.settingIcon} 
                    />
                    <Text style={[
                      styles.settingLabel,
                      { color: isDarkMode ? '#FFFFFF' : '#000000' }
                    ]}>
                      Reflection Time
                    </Text>
                  </View>
                  <Text style={styles.settingDescription}>
                    Set the time for your daily reflection reminder
                  </Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => setShowTimePicker(true)}
                  style={styles.timeButton}
                >
                  <Text style={[
                    styles.timeButtonText,
                    { color: isDarkMode ? '#64D2FF' : '#0A84FF' }
                  ]}>
                    {formatTime(reflectionTime)}
                  </Text>
                </TouchableOpacity>
                
                {showTimePicker && (
                  <DateTimePicker
                    value={reflectionTime}
                    mode="time"
                    is24Hour={false}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleTimeChange}
                    style={styles.timePicker}
                  />
                )}
              </View>
            )}
          </View>
          
          {/* Information about notifications */}
          <View style={styles.infoSection}>
            <Ionicons 
              name="information-circle" 
              size={20} 
              color={isDarkMode ? '#64D2FF' : '#0A84FF'} 
              style={styles.infoIcon} 
            />
            <Text style={styles.infoText}>
              Notifications help you stay on track with your goals and capture important memories.
              You can change these settings at any time.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A84FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 36,
  },
  settingsGroup: {
    marginTop: 24,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timePicker: {
    width: 100,
  },
  infoSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
}); 