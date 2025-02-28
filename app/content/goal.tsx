import React from 'react';
import { Alert, View, StyleSheet, Switch, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import ContentFormLayout from '../../components/content/ContentFormLayout';
import { 
  TextInputField, 
  DatePickerField, 
  EmojiPickerField,
  ImportanceRatingField
} from '../../components/content/FormComponents';
import { useContentForm } from '../hooks/useContentForm';

export default function GoalScreen() {
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
    type: 'goal',
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
      Alert.alert('Error', 'Failed to save goal. Please try again.');
    }
  };
  
  // Calculate the default target date (30 days from now)
  const defaultTargetDate = new Date();
  defaultTargetDate.setDate(defaultTargetDate.getDate() + 30);
  
  return (
    <ContentFormLayout
      title="New Goal"
      onSubmit={handleSubmit}
      isSubmitting={false}
      isValid={isValid()}
      submitLabel="Save Goal"
    >
      <TextInputField
        label="Goal Title"
        value={formState.title}
        onChangeText={(text) => handleChange('title', text)}
        placeholder="What do you want to achieve?"
        required
        error={errors.title}
      />
      
      <DatePickerField
        label="Target Date"
        value={formState.date}
        onChange={(date) => handleChange('date', date)}
        minimumDate={new Date()} // Can't set a goal in the past
      />
      
      <TextInputField
        label="Description"
        value={formState.notes}
        onChangeText={(text) => handleChange('notes', text)}
        placeholder="Describe your goal and why it's important to you..."
        multiline
        numberOfLines={4}
      />
      
      <EmojiPickerField
        label="Emoji"
        value={formState.emoji}
        onSelect={(emoji) => handleChange('emoji', emoji)}
      />
      
      <ImportanceRatingField
        label="Priority"
        value={formState.importance}
        onChange={(rating) => handleChange('importance', rating)}
      />
    </ContentFormLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
}); 