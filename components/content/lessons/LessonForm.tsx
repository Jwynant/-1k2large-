import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ContentItem } from '../../../app/types';
import { useContentManagement } from '../../../app/hooks/useContentManagement';
import { useDateCalculations } from '../../../app/hooks/useDateCalculations';

type LessonFormProps = {
  selectedCell?: { year: number; month?: number; week?: number };
  existingLesson?: ContentItem;
  onSuccess?: () => void;
};

export default function LessonForm({ selectedCell, existingLesson, onSuccess }: LessonFormProps) {
  const router = useRouter();
  const { addContentItem, updateContentItem } = useContentManagement();
  const { formatDate } = useDateCalculations();
  const isEditing = !!existingLesson;
  
  // Form state
  const [title, setTitle] = useState(existingLesson?.title || '');
  const [notes, setNotes] = useState(existingLesson?.notes || '');
  const [date, setDate] = useState(existingLesson ? new Date(existingLesson.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isTimeless, setIsTimeless] = useState(existingLesson?.isTimeless || false);
  const [isFavorite, setIsFavorite] = useState(existingLesson?.isFavorite || false);
  
  // Reminder state
  const [hasReminder, setHasReminder] = useState(!!existingLesson?.reminder);
  const [reminderDate, setReminderDate] = useState(
    existingLesson?.reminder ? new Date(existingLesson.reminder.nextReminder) : new Date()
  );
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [recurringReminder, setRecurringReminder] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>(
    existingLesson?.reminder?.recurring || 'none'
  );
  
  // Get timeframe string for display
  const getTimeframeString = () => {
    if (isTimeless) {
      return 'Timeless Lesson';
    }
    
    if (!selectedCell && !existingLesson) {
      return 'Today';
    }
    
    const cell = selectedCell || {
      year: new Date(existingLesson!.date).getFullYear(),
      month: existingLesson?.isTimeless ? undefined : new Date(existingLesson!.date).getMonth(),
      week: undefined
    };
    
    if (cell.month !== undefined) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
      return `${monthNames[cell.month]} ${cell.year}`;
    } else if (cell.week !== undefined) {
      return `Week ${cell.week + 1}, ${cell.year}`;
    } else {
      return `Year ${cell.year}`;
    }
  };
  
  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  
  // Handle reminder date change
  const handleReminderDateChange = (event: any, selectedDate?: Date) => {
    setShowReminderDatePicker(false);
    if (selectedDate) {
      setReminderDate(selectedDate);
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a title');
      return;
    }
    
    // Format date for storage
    const formattedDate = date.toISOString().split('T')[0];
    
    // Create lesson object with all possible properties
    const lessonItem: {
      title: string;
      type: 'lesson';
      date: string;
      notes?: string;
      isTimeless?: boolean;
      isFavorite?: boolean;
      reminder?: {
        nextReminder: string;
        recurring: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
      };
    } = {
      title: title.trim(),
      type: 'lesson',
      date: formattedDate,
      notes: notes.trim() || undefined,
      isTimeless,
      isFavorite,
    };
    
    // Add reminder if enabled
    if (hasReminder) {
      lessonItem.reminder = {
        nextReminder: reminderDate.toISOString(),
        recurring: recurringReminder,
      };
    }
    
    if (isEditing && existingLesson) {
      // Update existing lesson
      updateContentItem({
        ...existingLesson,
        ...lessonItem,
      });
      
      Alert.alert(
        'Success',
        'Lesson updated successfully',
        [
          { 
            text: 'OK', 
            onPress: () => {
              if (onSuccess) onSuccess();
              router.back();
            } 
          }
        ]
      );
    } else {
      // Add new lesson
      const newLesson = addContentItem(lessonItem);
      
      if (newLesson) {
        Alert.alert(
          'Success',
          `Added a new lesson${isTimeless ? '' : ` for ${getTimeframeString()}`}`,
          [
            { 
              text: 'OK', 
              onPress: () => {
                if (onSuccess) onSuccess();
                router.back();
              } 
            }
          ]
        );
      }
    }
  };
  
  // Render recurring reminder options
  const renderRecurringOptions = () => {
    if (!hasReminder) return null;
    
    const options: { label: string; value: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' }[] = [
      { label: 'No Recurrence', value: 'none' },
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Monthly', value: 'monthly' },
      { label: 'Yearly', value: 'yearly' },
    ];
    
    return (
      <View style={styles.recurringOptions}>
        <Text style={styles.label}>Recurring Reminder</Text>
        <View style={styles.optionsContainer}>
          {options.map(option => (
            <Pressable
              key={option.value}
              style={[
                styles.optionButton,
                recurringReminder === option.value && styles.optionButtonSelected
              ]}
              onPress={() => setRecurringReminder(option.value)}
            >
              <Text style={[
                styles.optionText,
                recurringReminder === option.value && styles.optionTextSelected
              ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Lesson' : 'Add Lesson'}</Text>
          <Pressable style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.timeframeContainer}>
            <Ionicons name="school-outline" size={20} color="#50C878" />
            <Text style={styles.timeframeText}>{getTimeframeString()}</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="What did you learn?"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.formGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Timeless Lesson</Text>
              <Switch
                value={isTimeless}
                onValueChange={setIsTimeless}
                trackColor={{ false: '#767577', true: '#50C878' }}
                thumbColor="#fff"
              />
            </View>
            <Text style={styles.helperText}>
              Timeless lessons aren't tied to a specific date and won't appear on the grid
            </Text>
          </View>
          
          {!isTimeless && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <Pressable 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formatDate(date)}
                </Text>
                <Ionicons name="calendar" size={20} color="#007AFF" />
              </Pressable>
            </View>
          )}
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="Describe what you learned and why it's important..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.formGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Favorite</Text>
              <Switch
                value={isFavorite}
                onValueChange={setIsFavorite}
                trackColor={{ false: '#767577', true: '#FF9500' }}
                thumbColor="#fff"
              />
            </View>
            <Text style={styles.helperText}>
              Favorite lessons will be featured prominently in your lessons library
            </Text>
          </View>
          
          <View style={styles.formGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Set Reminder</Text>
              <Switch
                value={hasReminder}
                onValueChange={setHasReminder}
                trackColor={{ false: '#767577', true: '#007AFF' }}
                thumbColor="#fff"
              />
            </View>
            <Text style={styles.helperText}>
              Get reminded to apply this lesson in the future
            </Text>
          </View>
          
          {hasReminder && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Reminder Date</Text>
              <Pressable 
                style={styles.dateInput}
                onPress={() => setShowReminderDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formatDate(reminderDate)}
                </Text>
                <Ionicons name="calendar" size={20} color="#007AFF" />
              </Pressable>
              
              <View style={styles.quickDateButtons}>
                <Pressable 
                  style={styles.quickDateButton}
                  onPress={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setReminderDate(tomorrow);
                  }}
                >
                  <Text style={styles.quickDateButtonText}>Tomorrow</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.quickDateButton}
                  onPress={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    setReminderDate(nextWeek);
                  }}
                >
                  <Text style={styles.quickDateButtonText}>Next Week</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.quickDateButton}
                  onPress={() => {
                    const nextMonth = new Date();
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setReminderDate(nextMonth);
                  }}
                >
                  <Text style={styles.quickDateButtonText}>Next Month</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.quickDateButton}
                  onPress={() => {
                    const nextYear = new Date();
                    nextYear.setFullYear(nextYear.getFullYear() + 1);
                    setReminderDate(nextYear);
                  }}
                >
                  <Text style={styles.quickDateButtonText}>Next Year</Text>
                </Pressable>
              </View>
            </View>
          )}
          
          {renderRecurringOptions()}
        </View>
      </ScrollView>
      
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      {showReminderDatePicker && (
        <DateTimePicker
          value={reminderDate}
          mode="date"
          display="default"
          onChange={handleReminderDateChange}
          minimumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode background
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1C1C1E', // Dark mode card background
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A84FF', // iOS blue for dark mode
  },
  formContainer: {
    padding: 16,
  },
  timeframeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#1C1C1E',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  timeframeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    color: '#FFFFFF',
  },
  dateInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  textArea: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    minHeight: 120,
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickDateButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  quickDateButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  quickDateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  recurringOptions: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#0A84FF',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
}); 