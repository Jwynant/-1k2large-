import React from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import ContentFormLayout from '../../components/content/ContentFormLayout';
import { 
  TextInputField, 
  DatePickerField, 
  EmojiPickerField
} from '../../components/content/FormComponents';
import { useContentForm } from '../hooks/useContentForm';

export default function ReflectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ year?: string; month?: string; week?: string }>();
  
  // Parse URL parameters
  const year = params.year ? parseInt(params.year, 10) : undefined;
  const month = params.month ? parseInt(params.month, 10) : undefined;
  const week = params.week ? parseInt(params.week, 10) : undefined;
  
  // Initialize form with the useContentForm hook
  const {
    formState,
    errors,
    handleChange,
    handleSubmit: submitForm,
    isValid
  } = useContentForm({
    type: 'reflection',
    initialYear: year,
    initialMonth: month,
    initialWeek: week
  });
  
  // Handle form submission
  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const result = submitForm();
    if (result) {
      // Navigate back to the previous screen
      router.back();
    } else {
      // Show error message
      Alert.alert('Error', 'Failed to save reflection. Please try again.');
    }
  };
  
  return (
    <ContentFormLayout
      title="New Reflection"
      onSubmit={handleSubmit}
      isSubmitting={false}
      isValid={isValid()}
      submitLabel="Save Reflection"
    >
      <TextInputField
        label="Title"
        value={formState.title}
        onChangeText={(text) => handleChange('title', text)}
        placeholder="What are you reflecting on?"
        required
        error={errors.title}
      />
      
      <DatePickerField
        label="Date"
        value={formState.date}
        onChange={(date) => handleChange('date', date)}
        maximumDate={new Date()}
      />
      
      <TextInputField
        label="Thoughts"
        value={formState.notes}
        onChangeText={(text) => handleChange('notes', text)}
        placeholder="Write your reflections here..."
        multiline
        numberOfLines={6}
      />
      
      <EmojiPickerField
        label="Emoji"
        value={formState.emoji}
        onSelect={(emoji) => handleChange('emoji', emoji)}
      />
    </ContentFormLayout>
  );
} 