import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, useColorScheme, ScrollView, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContentForm } from '../hooks/useContentForm';
import { useAppContext } from '../context/AppContext';
import TextInputField from '../components/form/TextInputField';
import DatePickerField from '../components/form/DatePickerField';
import EmojiPickerField from '../components/form/EmojiPickerField';
import MediaUploadField from '../components/form/MediaUploadField';
import MediaPreviewField from '../components/form/MediaPreviewField';
import * as Haptics from 'expo-haptics';

export default function NewMemoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { state } = useAppContext();
  
  // Initialize memory form
  const {
    formState,
    errors,
    handleChange,
    handleSubmit,
    addMedia,
    removeMedia,
    validateForm
  } = useContentForm({
    type: 'memory',
    initialData: {}
  });
  
  // Track form validity state to avoid re-renders
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Check form validity when relevant fields change
  React.useEffect(() => {
    const valid = validateForm();
    setIsFormValid(valid);
  }, [formState.title, formState.date, validateForm]);
  
  // Log content items when they change
  useEffect(() => {
    console.log('Current content items count:', state.contentItems.length);
  }, [state.contentItems]);
  
  // Handle form submission with haptic feedback
  const onSubmit = useCallback(() => {
    console.log('Submitting memory form', formState);
    
    if (isFormValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('Form is valid, calling handleSubmit');
      
      try {
        const result = handleSubmit();
        console.log('handleSubmit result:', result);
        
        if (result) {
          console.log('Memory saved successfully, navigating back');
          Alert.alert('Success', 'Memory saved successfully!', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        } else {
          console.error('Failed to save memory - handleSubmit returned falsy value');
          Alert.alert('Error', 'Failed to save memory. Please try again.');
        }
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        Alert.alert('Error', 'An error occurred while saving the memory.');
      }
    } else {
      console.log('Form is invalid', errors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Form', 'Please fill in all required fields.');
    }
  }, [isFormValid, handleSubmit, router, formState, errors]);
  
  return (
    <View style={[
      styles.container,
      isDarkMode ? styles.darkContainer : styles.lightContainer
    ]}>
      <Stack.Screen 
        options={{
          title: 'New Memory',
          headerShown: true,
          headerBackTitle: 'Cancel',
          headerRight: () => (
            <TouchableOpacity 
              onPress={onSubmit}
              disabled={!isFormValid}
              style={[
                styles.saveButton,
                !isFormValid && styles.saveButtonDisabled
              ]}
            >
              <Text style={[
                styles.saveButtonText,
                !isFormValid && styles.saveButtonTextDisabled
              ]}>
                Save
              </Text>
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="image" size={20} color="#4CD964" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Memory Details</Text>
            </View>
            
            <TextInputField
              label="Title"
              value={formState.title}
              onChangeText={(text) => handleChange('title', text)}
              placeholder="What's this memory about?"
              required
              error={errors.title}
            />
            
            <DatePickerField
              label="Date"
              value={formState.date}
              onChange={(date) => handleChange('date', date)}
              maximumDate={new Date()}
              required
              error={errors.date}
            />
            
            <EmojiPickerField
              label="Emoji"
              value={formState.emoji}
              onSelect={(emoji) => handleChange('emoji', emoji)}
            />
          </View>
          
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="text" size={20} color="#FF9500" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            
            <TextInputField
              label="Notes"
              value={formState.notes}
              onChangeText={(text) => handleChange('notes', text)}
              placeholder="Describe this memory... What made it special?"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="images" size={20} color="#5856D6" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Photos</Text>
            </View>
            
            <MediaUploadField
              label="Add Photos"
              onAddMedia={(uri) => addMedia(uri)}
              mediaCount={formState.media.length}
            />
            
            {formState.media.length > 0 && (
              <MediaPreviewField
                media={formState.media}
                onRemoveMedia={removeMedia}
              />
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.submitButton,
              !isFormValid && styles.submitButtonDisabled
            ]}
            onPress={onSubmit}
            disabled={!isFormValid}
          >
            <Text style={styles.submitButtonText}>Save Memory</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formContainer: {
    flex: 1,
    gap: 24,
  },
  formSection: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
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
  mediaCount: {
    fontSize: 14,
    color: '#AEAEB2',
    marginTop: 8,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4CD964',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#4CD96480',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
}); 