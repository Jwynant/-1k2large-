import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContentForm } from '../../hooks/useContentForm';
import { ContentType } from '../../types';
import TextInputField from '../../components/form/TextInputField';
import DatePickerField from '../../components/form/DatePickerField';
import EmojiPickerField from '../../components/form/EmojiPickerField';
import FocusAreaPickerField from '../../components/form/FocusAreaPickerField';
import MediaUploadField from '../../components/form/MediaUploadField';

export default function NewContentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Determine content type from params or default to memory
  const [contentType, setContentType] = useState<ContentType>((params.type as ContentType) || 'memory');
  
  // Initialize content form
  const {
    formState,
    errors,
    handleChange,
    handleSubmit,
    addMedia,
    validateForm
  } = useContentForm({
    type: contentType,
    initialData: {}
  });
  
  // Update content type when params change
  useEffect(() => {
    if (params.type) {
      setContentType(params.type as ContentType);
    }
  }, [params.type]);
  
  // Handle form submission
  const onSubmit = () => {
    const result = handleSubmit();
    if (result) {
      router.back();
    }
  };
  
  // Check if form is valid
  const isValid = () => {
    return validateForm();
  };
  
  // Get title based on content type
  const getTitle = () => {
    switch (contentType) {
      case 'goal':
        return 'New Goal';
      case 'memory':
        return 'New Memory';
      default:
        return 'New Content';
    }
  };
  
  return (
    <View style={[
      styles.container,
      isDarkMode ? styles.darkContainer : styles.lightContainer
    ]}>
      <Stack.Screen 
        options={{
          title: getTitle(),
          headerShown: true,
          headerBackTitle: 'Cancel',
          headerRight: () => (
            <TouchableOpacity 
              onPress={onSubmit}
              disabled={!isValid()}
              style={[
                styles.saveButton,
                !isValid() && styles.saveButtonDisabled
              ]}
            >
              <Text style={[
                styles.saveButtonText,
                !isValid() && styles.saveButtonTextDisabled
              ]}>
                Save
              </Text>
            </TouchableOpacity>
          )
        }} 
      />
      
      <View style={styles.formContainer}>
        <TextInputField
          label="Title"
          value={formState.title}
          onChangeText={(text) => handleChange('title', text)}
          placeholder={contentType === 'goal' ? "What do you want to achieve?" : "What happened?"}
          required
          error={errors.title}
        />
        
        <DatePickerField
          label={contentType === 'goal' ? "Target Date" : "Date"}
          value={formState.date}
          onChange={(date) => handleChange('date', date)}
          maximumDate={contentType === 'memory' ? new Date() : undefined}
          minimumDate={contentType === 'goal' ? new Date() : undefined}
        />
        
        <TextInputField
          label="Notes"
          value={formState.notes}
          onChangeText={(text) => handleChange('notes', text)}
          placeholder={contentType === 'goal' 
            ? "Describe your goal and why it's important to you..." 
            : "Describe this memory..."}
          multiline
          numberOfLines={4}
        />
        
        <EmojiPickerField
          label="Emoji"
          value={formState.emoji}
          onSelect={(emoji) => handleChange('emoji', emoji)}
        />
        
        {contentType === 'goal' && (
          <FocusAreaPickerField
            label="Focus Area"
            value={formState.focusAreaId}
            onChange={(focusAreaId) => handleChange('focusAreaId', focusAreaId)}
            error={errors.focusAreaId}
          />
        )}
        
        {contentType === 'memory' && (
          <MediaUploadField
            label="Photos"
            onAddMedia={(uri) => addMedia(uri)}
            mediaCount={formState.media.length}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#F2F2F7',
  },
  formContainer: {
    flex: 1,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0A84FF',
  },
  saveButtonDisabled: {
    backgroundColor: '#0A84FF50',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#FFFFFF80',
  },
}); 