import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BirthDateModal, LifeExpectancyModal } from '../components/profile';
import NotificationSettingsModal from '../components/profile/NotificationSettingsModal';
import NotificationBadge from '../components/shared/NotificationBadge';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { UserSettings } from '../types';
import { useDateCalculations } from '../hooks/useDateCalculations';

export default function ProfileScreen() {
  const { state, dispatch } = useAppContext();
  const { userSettings } = state;
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { getLifeProgress } = useDateCalculations();

  // State for settings toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    userSettings?.notificationsEnabled ?? true
  );
  const [showCompletedGoals, setShowCompletedGoals] = useState(
    userSettings?.showCompletedGoals ?? true
  );
  
  // State for modals
  const [birthDateModalVisible, setBirthDateModalVisible] = useState(false);
  const [lifeExpectancyModalVisible, setLifeExpectancyModalVisible] = useState(false);
  const [notificationSettingsModalVisible, setNotificationSettingsModalVisible] = useState(false);
  
  // Local state for user data
  const [name, setName] = useState('Jamie Smith');
  const [email, setEmail] = useState('jamie@example.com');
  
  // Get birth date from app context
  const birthDate = state.userBirthDate ? new Date(state.userBirthDate) : new Date(1990, 0, 1);
  
  // Format birth date for display
  const formattedBirthDate = birthDate.toISOString().split('T')[0];
  
  // Get life expectancy from user settings
  const lifeExpectancy = userSettings?.lifeExpectancy || 83;
  
  // Calculate age
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Handle toggle changes
  const handleToggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    dispatch({
      type: 'UPDATE_USER_SETTINGS',
      payload: { ...userSettings, notificationsEnabled: value }
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleToggleCompletedGoals = (value: boolean) => {
    setShowCompletedGoals(value);
    dispatch({
      type: 'UPDATE_USER_SETTINGS',
      payload: { ...userSettings, showCompletedGoals: value }
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Calculate life progress using the same method as the today page
  const lifeProgressPercentage = getLifeProgress(lifeExpectancy);

  // Navigate to debug screen
  const navigateToDebug = () => {
    router.push('/debug');
  };
  
  // Handle birth date change
  const handleBirthDateChange = (date: Date) => {
    dispatch({ 
      type: 'SET_USER_BIRTH_DATE', 
      payload: date.toISOString().split('T')[0] 
    });
  };
  
  // Handle life expectancy change
  const handleLifeExpectancyChange = (years: number) => {
    dispatch({
      type: 'UPDATE_USER_SETTINGS',
      payload: { ...userSettings, lifeExpectancy: years }
    });
  };
  
  // Handle notification settings update
  const handleUpdateNotificationSettings = (settings: Partial<UserSettings>) => {
    dispatch({
      type: 'UPDATE_USER_SETTINGS',
      payload: settings
    });
    
    // Update local state if master toggle changed
    if (settings.notificationsEnabled !== undefined) {
      setNotificationsEnabled(settings.notificationsEnabled);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with user info */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.userName, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{calculateAge(birthDate)}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Age</Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{Math.round(lifeProgressPercentage)}%</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Life Journey</Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{state.contentItems.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Items</Text>
            </View>
          </View>
        </View>
        
        {/* Settings sections */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal</Text>
          
          <Pressable 
            style={styles.settingItem}
            onPress={() => {
              setBirthDateModalVisible(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Ionicons name="calendar" size={24} color={colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Birthdate</Text>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{formattedBirthDate}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
          
          <Pressable 
            style={styles.settingItem}
            onPress={() => {
              setLifeExpectancyModalVisible(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Ionicons name="hourglass" size={24} color="#FF9500" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Life Expectancy</Text>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{lifeExpectancy} years</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          
          <Pressable 
            style={styles.settingItem}
            onPress={() => setNotificationSettingsModalVisible(true)}
          >
            <Ionicons name="notifications" size={24} color="#5856D6" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
              <View style={styles.notificationBadges}>
                <NotificationBadge 
                  enabled={notificationsEnabled && userSettings.notifications.goalDeadlines} 
                  type="goal"
                  size="small"
                />
                <NotificationBadge 
                  enabled={notificationsEnabled && userSettings.notifications.priorityReminders} 
                  type="lesson"
                  size="small"
                />
                <NotificationBadge 
                  enabled={notificationsEnabled && userSettings.notifications.memoryCapture} 
                  type="reflection"
                  size="small"
                />
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
          
          <View style={styles.settingItem}>
            <Ionicons name="checkbox" size={24} color="#0A84FF" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Show Completed Goals</Text>
            </View>
            <Switch
              value={showCompletedGoals}
              onValueChange={handleToggleCompletedGoals}
              trackColor={{ false: '#3A3A3C', true: '#0A84FF' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App</Text>
          
          <Pressable style={styles.settingItem}>
            <Ionicons name="share-social" size={24} color="#64D2FF" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Share App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
          
          <Pressable style={styles.settingItem}>
            <Ionicons name="star" size={24} color="#FF9500" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Rate App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
          
          <Pressable style={styles.settingItem}>
            <Ionicons name="information-circle" size={24} color="#0A84FF" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>About</Text>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>Version 1.0.0</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        
        <View style={[styles.section, { marginTop: 30, borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Developer Options</Text>
          
          <Pressable 
            style={styles.debugButton}
            onPress={navigateToDebug}
          >
            <Ionicons name="bug-outline" size={24} color={colors.text} />
            <Text style={[styles.debugButtonText, { color: colors.text }]}>Debug Menu</Text>
            <View style={styles.debugButtonIconContainer}>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </Pressable>
        </View>
        
        <Pressable style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </Pressable>
      </ScrollView>
      
      {/* Modals */}
      <BirthDateModal
        visible={birthDateModalVisible}
        onClose={() => setBirthDateModalVisible(false)}
        currentDate={birthDate}
        onSave={handleBirthDateChange}
      />
      
      <LifeExpectancyModal
        visible={lifeExpectancyModalVisible}
        onClose={() => setLifeExpectancyModalVisible(false)}
        currentLifeExpectancy={lifeExpectancy}
        onSave={handleLifeExpectancyChange}
      />
      
      {/* Notification Settings Modal */}
      <NotificationSettingsModal
        visible={notificationSettingsModalVisible}
        onClose={() => setNotificationSettingsModalVisible(false)}
        userSettings={userSettings}
        onUpdateSettings={handleUpdateNotificationSettings}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 32,
    borderBottomWidth: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#FF453A',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 12,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  debugButtonIconContainer: {
    marginLeft: 'auto',
  },
  notificationBadges: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
  },
}); 