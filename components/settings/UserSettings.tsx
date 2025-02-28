import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Switch, Platform } from 'react-native';
import { useAppContext } from '../../app/context/AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../../app/services/StorageService';

export default function UserSettings() {
  const { state, dispatch } = useAppContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');
  const [tempBirthDate, setTempBirthDate] = useState(
    state.userBirthDate ? new Date(state.userBirthDate) : new Date(1990, 0, 1)
  );

  // Determine if we're in dark mode
  const isDarkMode = state.theme === 'light' ? false : true;

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle date change
  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setTempBirthDate(selectedDate);
      dispatch({ 
        type: 'SET_USER_BIRTH_DATE', 
        payload: selectedDate.toISOString().split('T')[0] 
      });
    }
  };

  // Show date picker
  const showDatePickerModal = () => {
    setDatePickerMode('date');
    setShowDatePicker(true);
  };

  // Handle theme change
  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: newTheme });
  };

  // Handle clearing all data
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all your data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAllData();
            // Reload the app
            Alert.alert('Data Cleared', 'All data has been cleared. Please restart the app.');
          }
        }
      ]
    );
  };

  // Check if a theme is selected
  const isThemeSelected = (theme: 'dark' | 'light' | 'system') => {
    return state.theme === theme;
  };

  // Calculate current age
  const calculateAge = () => {
    if (!state.userBirthDate) return '?';
    
    const today = new Date();
    const birthDate = new Date(state.userBirthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Calculate how many months a person is expected to live (based on 80 year lifespan)
  const calculateTotalMonths = () => {
    return 80 * 12; // 80 years * 12 months
  };

  // Calculate how many months have been lived
  const calculateMonthsLived = () => {
    if (!state.userBirthDate) return '?';
    
    const today = new Date();
    const birthDate = new Date(state.userBirthDate);
    
    // Calculate total months
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    
    return (years * 12) + months;
  };

  return (
    <View style={[
      styles.container, 
      isDarkMode && styles.containerDark
    ]}>
      {/* Birth Date Setting Section */}
      <View style={[
        styles.section,
        isDarkMode && styles.sectionDark
      ]}>
        <Text style={[
          styles.sectionTitle,
          isDarkMode && styles.textLight
        ]}>Birth Date</Text>
        
        <View style={[
          styles.setting,
          isDarkMode && styles.settingDark
        ]}>
          <Text style={[
            styles.settingLabel,
            isDarkMode && styles.textLight
          ]}>Your Birth Date</Text>
          <Pressable 
            style={styles.dateButton}
            onPress={showDatePickerModal}
          >
            <Text style={styles.dateButtonText}>
              {state.userBirthDate ? formatDate(new Date(state.userBirthDate)) : 'Set Birth Date'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={isDarkMode ? "#0A84FF" : "#007AFF"} />
          </Pressable>
        </View>
        
        <View style={[
          styles.infoCard,
          isDarkMode && styles.infoCardDark
        ]}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color={isDarkMode ? "#FFFFFF" : "#333333"} />
            <Text style={[
              styles.infoText,
              isDarkMode && styles.textLight
            ]}>Current Age: <Text style={styles.infoHighlight}>{calculateAge()} years</Text></Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="hourglass-outline" size={20} color={isDarkMode ? "#FFFFFF" : "#333333"} />
            <Text style={[
              styles.infoText,
              isDarkMode && styles.textLight
            ]}>Months Lived: <Text style={styles.infoHighlight}>{calculateMonthsLived()}</Text> of {calculateTotalMonths()}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color={isDarkMode ? "#FFFFFF" : "#333333"} />
            <Text style={[
              styles.infoNote,
              isDarkMode && styles.textLight
            ]}>Updating your birth date will affect your life grid calculations and visualizations.</Text>
          </View>
        </View>
      </View>
      
      {/* Theme Settings Section */}
      <View style={[
        styles.section,
        isDarkMode && styles.sectionDark
      ]}>
        <Text style={[
          styles.sectionTitle,
          isDarkMode && styles.textLight
        ]}>Appearance</Text>
        
        <View style={styles.settingRow}>
          <Pressable 
            style={[
              styles.themeOption, 
              isDarkMode && styles.themeOptionDark,
              isThemeSelected('dark') && styles.selectedTheme
            ]}
            onPress={() => handleThemeChange('dark')}
          >
            <View style={[styles.themeCircle, styles.darkTheme]}>
              <Ionicons 
                name="moon" 
                size={20} 
                color="#fff" 
              />
            </View>
            <Text style={[
              styles.themeLabel,
              isDarkMode && styles.textLight
            ]}>Dark</Text>
            {isThemeSelected('dark') && (
              <Ionicons name="checkmark-circle" size={20} color="#0A84FF" style={styles.checkmark} />
            )}
          </Pressable>
          
          <Pressable 
            style={[
              styles.themeOption, 
              isDarkMode && styles.themeOptionDark,
              isThemeSelected('light') && styles.selectedTheme
            ]}
            onPress={() => handleThemeChange('light')}
          >
            <View style={[styles.themeCircle, styles.lightTheme]}>
              <Ionicons 
                name="sunny" 
                size={20} 
                color="#000" 
              />
            </View>
            <Text style={[
              styles.themeLabel,
              isDarkMode && styles.textLight
            ]}>Light</Text>
            {isThemeSelected('light') && (
              <Ionicons name="checkmark-circle" size={20} color="#0A84FF" style={styles.checkmark} />
            )}
          </Pressable>
          
          <Pressable 
            style={[
              styles.themeOption, 
              isDarkMode && styles.themeOptionDark,
              isThemeSelected('system') && styles.selectedTheme
            ]}
            onPress={() => handleThemeChange('system')}
          >
            <View style={[styles.themeCircle, styles.systemTheme]}>
              <Ionicons 
                name="phone-portrait" 
                size={20} 
                color="#555" 
              />
            </View>
            <Text style={[
              styles.themeLabel,
              isDarkMode && styles.textLight
            ]}>System</Text>
            {isThemeSelected('system') && (
              <Ionicons name="checkmark-circle" size={20} color="#0A84FF" style={styles.checkmark} />
            )}
          </Pressable>
        </View>
      </View>
      
      {/* Data Management Section */}
      <View style={[
        styles.section,
        isDarkMode && styles.sectionDark
      ]}>
        <Text style={[
          styles.sectionTitle,
          isDarkMode && styles.textLight
        ]}>Data Management</Text>
        
        <Pressable 
          style={styles.dangerButton}
          onPress={handleClearData}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </Pressable>
      </View>
      
      {/* Date Picker for iOS */}
      {Platform.OS === 'ios' && showDatePicker && (
        <View style={styles.datePickerContainer}>
          <View style={[styles.datePickerHeader, isDarkMode && styles.datePickerHeaderDark]}>
            <Pressable onPress={() => setShowDatePicker(false)}>
              <Text style={styles.datePickerCancel}>Cancel</Text>
            </Pressable>
            <Pressable 
              onPress={() => {
                handleDateChange(null, tempBirthDate);
                setShowDatePicker(false);
              }}
            >
              <Text style={styles.datePickerDone}>Done</Text>
            </Pressable>
          </View>
          <DateTimePicker
            testID="dateTimePicker"
            value={tempBirthDate}
            mode={datePickerMode}
            display="spinner"
            onChange={(event, date) => {
              if (date) setTempBirthDate(date);
            }}
            maximumDate={new Date()}
            textColor={isDarkMode ? "white" : "black"}
          />
        </View>
      )}
      
      {/* Date Picker for Android */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={tempBirthDate}
          mode={datePickerMode}
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionDark: {
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingDark: {
    borderBottomColor: '#2C2C2E',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  textLight: {
    color: '#FFFFFF',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  infoCardDark: {
    backgroundColor: '#2C2C2E',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  infoHighlight: {
    fontWeight: '600',
    color: '#0A84FF',
  },
  infoNote: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    fontStyle: 'italic',
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  datePickerHeaderDark: {
    backgroundColor: '#2C2C2E',
    borderBottomColor: '#3C3C3E',
  },
  datePickerCancel: {
    color: '#FF3B30',
    fontSize: 16,
  },
  datePickerDone: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Theme selection styles
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  themeOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    width: '30%',
    position: 'relative',
  },
  themeOptionDark: {
    borderColor: '#2C2C2E',
  },
  selectedTheme: {
    borderColor: '#0A84FF',
    backgroundColor: 'rgba(10, 132, 255, 0.05)',
  },
  themeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  darkTheme: {
    backgroundColor: '#121212',
  },
  lightTheme: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  systemTheme: {
    backgroundColor: '#E5E5EA',
  },
  themeLabel: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
}); 