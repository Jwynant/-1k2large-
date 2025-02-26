import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useAppContext } from '../../app/context/AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../../app/services/StorageService';

export default function UserSettings() {
  const { state, dispatch } = useAppContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempBirthDate, setTempBirthDate] = useState(
    state.userBirthDate ? new Date(state.userBirthDate) : new Date(1990, 0, 1)
  );

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
    setShowDatePicker(false);
    
    if (selectedDate) {
      setTempBirthDate(selectedDate);
      dispatch({ 
        type: 'SET_BIRTH_DATE', 
        payload: selectedDate.toISOString().split('T')[0] 
      });
    }
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

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Birth Date</Text>
          <Pressable 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {state.userBirthDate ? formatDate(new Date(state.userBirthDate)) : 'Set Birth Date'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
          </Pressable>
        </View>
        
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Current Age</Text>
          <Text style={styles.settingValue}>{state.userAge} years</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <Pressable 
          style={styles.dangerButton}
          onPress={handleClearData}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </Pressable>
      </View>
      
      {showDatePicker && (
        <DateTimePicker
          value={tempBirthDate}
          mode="date"
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
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
}); 