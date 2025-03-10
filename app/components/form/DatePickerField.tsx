import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useColorScheme,
  Platform,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  required?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

export default function DatePickerField({ 
  label, 
  value, 
  onChange,
  error,
  required = false,
  minimumDate,
  maximumDate
}: DatePickerFieldProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const [showPicker, setShowPicker] = useState(false);
  
  // Format date for display
  const formattedDate = format(value, 'MMMM d, yyyy');
  
  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      onChange(selectedDate);
    }
  };
  
  // Toggle date picker
  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[
          styles.label,
          isDarkMode ? styles.lightText : styles.darkText
        ]}>
          {label}
          {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.dateButton,
          isDarkMode ? styles.darkDateButton : styles.lightDateButton,
          error && styles.dateButtonError
        ]}
        onPress={toggleDatePicker}
      >
        <Text style={[
          styles.dateText,
          isDarkMode ? styles.lightText : styles.darkText
        ]}>
          {formattedDate}
        </Text>
        <Ionicons 
          name="calendar-outline" 
          size={20} 
          color={isDarkMode ? '#FFFFFF' : '#000000'} 
        />
      </TouchableOpacity>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {/* Date Picker */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={[
              styles.pickerContainer,
              isDarkMode ? styles.darkPickerContainer : styles.lightPickerContainer
            ]}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={toggleDatePicker}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleDatePicker}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={styles.datePicker}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={value}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  lightText: {
    color: '#FFFFFF',
  },
  darkText: {
    color: '#000000',
  },
  requiredStar: {
    color: '#FF453A',
    marginLeft: 4,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
  },
  darkDateButton: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  lightDateButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D1D6',
  },
  dateButtonError: {
    borderWidth: 1,
    borderColor: '#FF453A',
  },
  dateText: {
    fontSize: 16,
  },
  errorText: {
    color: '#FF453A',
    fontSize: 14,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  darkPickerContainer: {
    backgroundColor: '#2C2C2E',
  },
  lightPickerContainer: {
    backgroundColor: '#FFFFFF',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  cancelText: {
    color: '#FF453A',
    fontSize: 16,
  },
  doneText: {
    color: '#0A84FF',
    fontSize: 16,
    fontWeight: '600',
  },
  datePicker: {
    height: 200,
  },
}); 