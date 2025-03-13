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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ContentType } from '../../app/types';
import { useContentManagement } from '../../app/hooks/useContentManagement';
import { useDateCalculations } from '../../app/hooks/useDateCalculations';
import { CategorySelector } from '../../app/components/shared/CategorySelector';

type ContentFormProps = {
  contentType: ContentType;
  selectedCell: { year: number; month?: number; week?: number };
  onSuccess?: () => void;
};

export default function ContentForm({ contentType, selectedCell, onSuccess }: ContentFormProps) {
  const router = useRouter();
  const { addContentItem } = useContentManagement();
  const { formatDate } = useDateCalculations();
  
  // Form state
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  
  // Get timeframe string for display
  const getTimeframeString = () => {
    if (selectedCell.month !== undefined) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
      return `${monthNames[selectedCell.month]} ${selectedCell.year}`;
    } else if (selectedCell.week !== undefined) {
      return `Week ${selectedCell.week + 1}, ${selectedCell.year}`;
    } else {
      return `Year ${selectedCell.year}`;
    }
  };
  
  // Get content type details
  const getContentTypeDetails = () => {
    switch (contentType) {
      case 'memory':
        return {
          title: 'Add Memory',
          icon: 'camera',
          color: '#4A90E2',
          placeholder: 'What happened that was memorable?'
        };
      case 'lesson':
        return {
          title: 'Add Lesson',
          icon: 'school',
          color: '#50C878',
          placeholder: 'What did you learn?'
        };
      case 'goal':
        return {
          title: 'Add Goal',
          icon: 'flag',
          color: '#FF9500',
          placeholder: 'What do you want to achieve?'
        };
      case 'reflection':
        return {
          title: 'Add Reflection',
          icon: 'sparkles',
          color: '#9B59B6',
          placeholder: 'What are your thoughts about this period?'
        };
    }
  };
  
  const contentDetails = getContentTypeDetails();
  
  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
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
    
    // Create content item object
    const contentItem = {
      title: title.trim(),
      type: contentType,
      date: formattedDate,
      notes: notes.trim() || undefined,
      emoji: emoji || undefined,
      categoryIds: categoryIds.length > 0 ? categoryIds : undefined
    };
    
    // Add content using addContentItem
    const newContent = addContentItem(contentItem);
    
    if (newContent) {
      // Show success message
      Alert.alert(
        'Success',
        `Added a new ${contentType} for ${getTimeframeString()}`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Clear form
              setTitle('');
              setNotes('');
              setEmoji('');
              setCategoryIds([]);
              
              // Call onSuccess callback if provided
              if (onSuccess) {
                onSuccess();
              }
              
              // Navigate back
              router.back();
            } 
          }
        ]
      );
    }
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
          <Text style={styles.headerTitle}>{contentDetails.title}</Text>
          <Pressable style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.timeframeContainer}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.timeframeText}>{getTimeframeString()}</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a title"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date</Text>
            <Pressable 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formatDate(date.toISOString())}
              </Text>
              <Ionicons name="calendar" size={20} color="#007AFF" />
            </Pressable>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Emoji (Optional)</Text>
            <TextInput
              style={styles.emojiInput}
              value={emoji}
              onChangeText={setEmoji}
              placeholder="🌟"
              placeholderTextColor="#999"
              maxLength={2}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder={contentDetails.placeholder}
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
          
          <Text style={styles.label}>Categories</Text>
          <CategorySelector
            selectedIds={categoryIds}
            onChange={setCategoryIds}
            multiSelect={true}
            showCreate={true}
            contextText={`${title} ${notes}`}
          />
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  formContainer: {
    padding: 16,
  },
  timeframeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeframeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  emojiInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 60,
    textAlign: 'center',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 120,
  },
}); 