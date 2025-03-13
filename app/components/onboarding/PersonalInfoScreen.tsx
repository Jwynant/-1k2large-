import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  Animated, 
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '../../context/OnboardingContext';
import * as Haptics from 'expo-haptics';

export default function PersonalInfoScreen() {
  const insets = useSafeAreaInsets();
  const { state, setUserName, setBirthDate, setCurrentStep } = useOnboarding();
  
  const [name, setName] = useState(state.userName);
  const [date, setDate] = useState(state.birthDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nameError, setNameError] = useState('');
  const [isReady, setIsReady] = useState(false);
  
  const nameInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const datePickerFade = useRef(new Animated.Value(0)).current;
  
  // Prepare content before animation
  useEffect(() => {
    // Short delay to ensure everything is loaded
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animate in on mount, but only after content is ready
  useEffect(() => {
    if (!isReady) return;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Focus the name input after animation completes
      nameInputRef.current?.focus();
    });
  }, [isReady]);
  
  // Animate date picker
  useEffect(() => {
    if (showDatePicker) {
      Animated.timing(datePickerFade, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      datePickerFade.setValue(0);
    }
  }, [showDatePicker]);
  
  // Handle date change
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // On iOS, the picker stays open, on Android it closes automatically
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      setDate(selectedDate);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Handle continue button press
  const handleContinue = () => {
    // Validate name
    if (!name.trim()) {
      setNameError('Please enter your name');
      nameInputRef.current?.focus();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    // Save data to context
    setUserName(name.trim());
    setBirthDate(date);
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Move to next step
    setCurrentStep(2);
  };
  
  // Format date for display
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  if (!isReady) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} />
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Animated.View 
            style={[
              styles.content,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.title}>Let's personalize your experience</Text>
            <Text style={styles.subtitle}>We'll use this information to create your life grid</Text>
            
            <View style={styles.formContainer}>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>What should we call you?</Text>
                <TextInput
                  ref={nameInputRef}
                  style={styles.textInput}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (nameError) setNameError('');
                  }}
                  placeholder="Your name"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                    setShowDatePicker(true);
                  }}
                />
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              </View>
              
              {/* Birth Date Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>When were you born?</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowDatePicker(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={styles.dateButtonText}>{formattedDate}</Text>
                  <Ionicons name="calendar-outline" size={24} color="#fff" />
                </TouchableOpacity>
                
                {showDatePicker && (
                  <Animated.View style={{ opacity: datePickerFade }}>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                      minimumDate={new Date(1900, 0, 1)}
                      textColor="#FFFFFF" // For iOS
                      themeVariant="dark" // For iOS dark mode
                    />
                    
                    {/* Add a prominent continue button below the date picker */}
                    <TouchableOpacity
                      style={styles.datePickerContinueButton}
                      onPress={handleContinue}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.datePickerContinueText}>Continue</Text>
                      <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            </View>
          </Animated.View>
          
          <View style={styles.footer}>
            <Pressable 
              style={styles.backButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCurrentStep(0);
              }}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            
            <Pressable 
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 40,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dateButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  datePickerContinueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  datePickerContinueText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  errorText: {
    color: '#FF453A',
    marginTop: 8,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 