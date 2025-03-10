import React, { useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  useColorScheme, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContentForm } from '../hooks/useContentForm';
import TextInputField from '../components/form/TextInputField';
import DatePickerField from '../components/form/DatePickerField';
import EmojiPickerField from '../components/form/EmojiPickerField';
import FocusAreaPickerField from '../components/form/FocusAreaPickerField';

export default function GoalScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const initialized = useRef(false);
  
  // Initialize content form with a fixed type to prevent re-renders
  const {
    formState,
    errors,
    handleChange,
    handleSubmit,
    validateForm
  } = useContentForm({
    type: 'goal',
    initialData: {}
  });
  
  // Handle form submission
  const onSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Please fill in all required fields');
      return;
    }
    
    const result = handleSubmit();
    if (result) {
      router.back();
    }
  };
  
  // Check if form is valid - simplified to prevent potential infinite loops
  const isValid = () => {
    return formState.title && formState.date && formState.focusAreaId;
  };
  
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer
      ]}>
        <Stack.Screen 
          options={{
            title: 'New Goal',
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
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <TextInputField
              label="Title"
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
              minimumDate={new Date()}
              required
              error={errors.date}
            />
            
            <FocusAreaPickerField
              label="Focus Area"
              value={formState.focusAreaId}
              onChange={(focusAreaId) => handleChange('focusAreaId', focusAreaId)}
              error={errors.focusAreaId}
              required
            />
            
            <TextInputField
              label="Notes"
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
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  scrollViewContent: {
    padding: 16,
    paddingBottom: 40,
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