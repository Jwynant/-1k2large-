import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

import ContentFormLayout from '../../components/content/ContentFormLayout';
import { 
  TextInputField, 
  DatePickerField, 
  EmojiPickerField,
  MediaUploadField,
  ImportanceRatingField
} from '../../components/content/FormComponents';
import { useContentForm } from '../hooks/useContentForm';

export default function MemoryScreen() {
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
    addMedia,
    removeMedia,
    isValid
  } = useContentForm({
    type: 'memory',
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
      Alert.alert('Error', 'Failed to save memory. Please try again.');
    }
  };
  
  // Handle media upload
  const handleAddMedia = async () => {
    try {
      // Request permission to access the photo library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to add photos.');
        return;
      }
      
      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Add the selected image to the form state
        addMedia(result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to add photo. Please try again.');
    }
  };
  
  return (
    <ContentFormLayout
      title="New Memory"
      onSubmit={handleSubmit}
      isSubmitting={false}
      isValid={isValid()}
      submitLabel="Save Memory"
    >
      <TextInputField
        label="Title"
        value={formState.title}
        onChangeText={(text) => handleChange('title', text)}
        placeholder="What happened?"
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
        label="Notes"
        value={formState.notes}
        onChangeText={(text) => handleChange('notes', text)}
        placeholder="Describe this memory..."
        multiline
        numberOfLines={4}
      />
      
      <EmojiPickerField
        label="Emoji"
        value={formState.emoji}
        onSelect={(emoji) => handleChange('emoji', emoji)}
      />
      
      <ImportanceRatingField
        label="Importance"
        value={formState.importance}
        onChange={(rating) => handleChange('importance', rating)}
      />
      
      <MediaUploadField
        label="Photos"
        onAddMedia={handleAddMedia}
        mediaCount={formState.media.length}
      />
    </ContentFormLayout>
  );
} 