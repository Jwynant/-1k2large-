import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

export default function ProfileScreen() {
  const { state, dispatch } = useAppContext();
  const { userSettings } = state;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // State for settings toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    userSettings?.notificationsEnabled ?? true
  );
  const [showCompletedGoals, setShowCompletedGoals] = useState(
    userSettings?.showCompletedGoals ?? true
  );
  const [weekStartsOnMonday, setWeekStartsOnMonday] = useState(
    userSettings?.weekStartsOnMonday ?? false
  );
  
  // Local state for demo purposes - would be in userSettings in a real app
  const [name, setName] = useState('Jamie Smith');
  const [email, setEmail] = useState('jamie@example.com');
  const [birthdate, setBirthdate] = useState('1985-07-15');
  
  // Calculate age
  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
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
  };
  
  const handleToggleCompletedGoals = (value: boolean) => {
    setShowCompletedGoals(value);
    dispatch({
      type: 'UPDATE_USER_SETTINGS',
      payload: { ...userSettings, showCompletedGoals: value }
    });
  };
  
  const handleToggleWeekStart = (value: boolean) => {
    setWeekStartsOnMonday(value);
    dispatch({
      type: 'UPDATE_USER_SETTINGS',
      payload: { ...userSettings, weekStartsOnMonday: value }
    });
  };
  
  // Calculate life progress
  const calculateLifeProgress = () => {
    const age = calculateAge(birthdate);
    // Assuming average lifespan of 90 years
    return Math.min(Math.round((age / 90) * 100), 100);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with user info */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={60} color="#FFFFFF" />
            </View>
            <View style={styles.editProfileButton}>
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </View>
          </View>
          
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{calculateAge(birthdate)}</Text>
              <Text style={styles.statLabel}>Age</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{calculateLifeProgress()}%</Text>
              <Text style={styles.statLabel}>Life Journey</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{state.contentItems.length}</Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
          </View>
        </View>
        
        {/* Settings sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal</Text>
          
          <Pressable style={styles.settingItem}>
            <Ionicons name="calendar" size={24} color="#0A84FF" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Birthdate</Text>
              <Text style={styles.settingValue}>{birthdate}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </Pressable>
          
          <Pressable style={styles.settingItem}>
            <Ionicons name="hourglass" size={24} color="#FF9500" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Life Expectancy</Text>
              <Text style={styles.settingValue}>90 years</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </Pressable>
          
          <Pressable style={styles.settingItem}>
            <Ionicons name="color-palette" size={24} color="#4CD964" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingValue}>{isDark ? 'Dark' : 'Light'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <Ionicons name="notifications" size={24} color="#5856D6" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#3A3A3C', true: '#5856D6' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <Ionicons name="checkbox" size={24} color="#0A84FF" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Show Completed Goals</Text>
            </View>
            <Switch
              value={showCompletedGoals}
              onValueChange={handleToggleCompletedGoals}
              trackColor={{ false: '#3A3A3C', true: '#0A84FF' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <Ionicons name="calendar" size={24} color="#FF9500" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Week Starts on Monday</Text>
            </View>
            <Switch
              value={weekStartsOnMonday}
              onValueChange={handleToggleWeekStart}
              trackColor={{ false: '#3A3A3C', true: '#FF9500' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          
          <Pressable style={styles.settingItem}>
            <Ionicons name="share-social" size={24} color="#64D2FF" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Share App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </Pressable>
          
          <Pressable style={styles.settingItem}>
            <Ionicons name="star" size={24} color="#FF9500" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Rate App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </Pressable>
          
          <Pressable style={styles.settingItem}>
            <Ionicons name="information-circle" size={24} color="#0A84FF" style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>About</Text>
              <Text style={styles.settingValue}>Version 1.0.0</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </Pressable>
        </View>
        
        <Pressable style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode background
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#0A84FF',
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0A84FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#121212',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
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
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2C2C2E',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
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
    color: '#FFFFFF',
  },
  settingValue: {
    fontSize: 14,
    color: '#8E8E93',
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
}); 