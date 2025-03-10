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
import MediaUploadField from '../components/form/MediaUploadField';

// Conditionally import components to avoid errors if they don't exist yet
let LocationPickerField: React.ComponentType<any> | null = null;
let PeopleTagField: React.ComponentType<any> | null = null;
let MoodPickerField: React.ComponentType<any> | null = null;

try {
  LocationPickerField = require('../components/form/LocationPickerField').default;
} catch (error) {
  console.log('LocationPickerField not available');
}

try {
  PeopleTagField = require('../components/form/PeopleTagField').default;
} catch (error) {
  console.log('PeopleTagField not available');
}

try {
  MoodPickerField = require('../components/form/MoodPickerField').default;
} catch (error) {
  console.log('MoodPickerField not available');
}

export default function MemoryScreen() {
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
    addMedia,
    removeMedia,
    validateForm
  } = useContentForm({
    type: 'memory',
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
  
  // Check if form is valid
  const isValid = () => {
    return formState.title && formState.date;
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
            title: 'New Memory',
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
            
            {MoodPickerField && (
              <MoodPickerField
                label="How did you feel?"
                value={formState.mood}
                onChange={(mood: string) => handleChange('mood', mood)}
              />
            )}
            
            <MediaUploadField
              label="Photos"
              onAddMedia={(uri) => addMedia(uri)}
              onRemoveMedia={(index: number) => removeMedia(index)}
              mediaItems={formState.media}
            />
            
            {LocationPickerField && (
              <LocationPickerField
                label="Location"
                value={formState.location}
                onChange={(location: string) => handleChange('location', location)}
              />
            )}
            
            {PeopleTagField && (
              <PeopleTagField
                label="People"
                value={formState.people || []}
                onChange={(people: string[]) => handleChange('people', people)}
              />
            )}
            
            <TextInputField
              label="Notes"
              value={formState.notes}
              onChangeText={(text) => handleChange('notes', text)}
              placeholder="Describe this memory in detail..."
              multiline
              numberOfLines={6}
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