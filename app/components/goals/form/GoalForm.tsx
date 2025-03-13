import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  SafeAreaView,
  Animated,
  Dimensions,
  Platform,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ContentItem, FocusArea, SubGoal } from '../../../types';
import { useContentManagement } from '../../../hooks/useContentManagement';
import { useFocusAreas } from '../../../hooks/useFocusAreas';
import GoalBasicsStep from './GoalBasicsStep';
import GoalDetailsStep from './GoalDetailsStep';
import GoalMilestonesStep from './GoalMilestonesStep';
import GoalReviewStep from './GoalReviewStep';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Initial form state
const initialFormState = {
  id: '',
  title: '',
  notes: '',
  focusAreaId: '',
  deadline: null as Date | null,
  progress: 0,
  isCompleted: false,
  milestones: [] as { id: string; title: string; isCompleted: boolean }[]
};

type FormState = typeof initialFormState;

interface GoalFormProps {
  isVisible: boolean;
  onClose: () => void;
  initialData?: Partial<FormState>;
  isEditing?: boolean;
}

export default function GoalForm({ 
  isVisible, 
  onClose, 
  initialData = {}, 
  isEditing = false 
}: GoalFormProps) {
  // Animation value for transitions
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  
  // Form state
  const [formState, setFormState] = useState<FormState>(() => ({
    ...initialFormState,
    ...initialData
  }));
  
  // Current step
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Hooks
  const router = useRouter();
  const { addContentItem, updateContentItem } = useContentManagement();
  const { focusAreas } = useFocusAreas();
  
  // Reset form when modal opens - use a stable reference to initialData
  const initialDataRef = React.useRef(initialData);
  
  useEffect(() => {
    // Only update the ref when initialData changes
    initialDataRef.current = initialData;
  }, [initialData]);
  
  // Reset form when visibility changes
  useEffect(() => {
    if (isVisible) {
      setFormState({
        ...initialFormState,
        ...initialDataRef.current
      });
      setCurrentStep(0);
      setErrors({});
      
      // Dismiss keyboard if it's open
      Keyboard.dismiss();
    }
  }, [isVisible]);
  
  // Animate between steps
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: currentStep,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentStep, slideAnim]);
  
  // Update form state
  const updateForm = useCallback((updates: Partial<FormState>) => {
    setFormState(prev => ({
      ...prev,
      ...updates
    }));
    
    // Clear errors for updated fields
    setErrors(prev => {
      const updatedErrors = { ...prev };
      Object.keys(updates).forEach(key => {
        if (updatedErrors[key]) {
          delete updatedErrors[key];
        }
      });
      return updatedErrors;
    });
  }, []);
  
  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 0: // Basics
        if (!formState.title.trim()) {
          newErrors.title = 'Title is required';
        }
        // Focus area is now optional
        break;
        
      case 1: // Details
        if (formState.deadline === null) {
          newErrors.deadline = 'Please set a deadline';
        }
        break;
        
      case 2: // Milestones
        // Milestones are optional, no validation needed
        break;
        
      case 3: // Review
        // All validation should be done in previous steps
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formState.title, formState.deadline]);
  
  // Navigate to next step
  const goToNextStep = useCallback(() => {
    // Dismiss keyboard when navigating
    Keyboard.dismiss();
    
    if (validateCurrentStep()) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  }, [currentStep, validateCurrentStep]);
  
  // Navigate to previous step
  const goToPreviousStep = useCallback(() => {
    // Dismiss keyboard when navigating
    Keyboard.dismiss();
    
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onClose();
    }
  }, [currentStep, onClose]);
  
  // Submit the form
  const handleSubmit = useCallback(() => {
    // Create a new goal content item
    const newGoal: Partial<ContentItem> = {
      title: formState.title,
      notes: formState.notes,
      type: 'goal',
      date: new Date().toISOString(),
      focusAreaId: formState.focusAreaId || undefined, // Make focus area optional
      deadline: formState.deadline ? formState.deadline.toISOString() : undefined,
      progress: formState.progress,
      isCompleted: formState.isCompleted,
      milestones: formState.milestones.map(m => ({
        id: m.id,
        title: m.title,
        isCompleted: m.isCompleted
      })) as SubGoal[]
    };
    
    if (isEditing && formState.id) {
      updateContentItem({
        ...newGoal,
        id: formState.id
      } as ContentItem);
    } else {
      addContentItem(newGoal as ContentItem);
    }
    
    onClose();
  }, [formState, isEditing, addContentItem, updateContentItem, onClose]);
  
  // Render step indicator
  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {['Basics', 'Details', 'Milestones', 'Review'].map((step, index) => (
          <View key={index} style={styles.stepIndicatorItem}>
            <View 
              style={[
                styles.stepDot, 
                currentStep >= index ? styles.stepDotActive : {}
              ]} 
            />
            <Text 
              style={[
                styles.stepText, 
                currentStep >= index ? styles.stepTextActive : {}
              ]}
            >
              {step}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  
  // Render current step content
  const renderStepContent = () => {
    const translateX = slideAnim.interpolate({
      inputRange: [0, 1, 2, 3],
      outputRange: [0, -SCREEN_WIDTH, -SCREEN_WIDTH * 2, -SCREEN_WIDTH * 3]
    });
    
    return (
      <Animated.View 
        style={[
          styles.stepsContainer,
          { transform: [{ translateX }] }
        ]}
      >
        <View style={styles.stepContent}>
          <GoalBasicsStep 
            title={formState.title}
            focusAreaId={formState.focusAreaId}
            focusAreas={focusAreas}
            errors={errors}
            onUpdateForm={updateForm}
          />
        </View>
        
        <View style={styles.stepContent}>
          <GoalDetailsStep 
            notes={formState.notes}
            deadline={formState.deadline}
            errors={errors}
            onUpdateForm={updateForm}
          />
        </View>
        
        <View style={styles.stepContent}>
          <GoalMilestonesStep 
            milestones={formState.milestones}
            errors={errors}
            onUpdateForm={updateForm}
          />
        </View>
        
        <View style={styles.stepContent}>
          <GoalReviewStep 
            formState={formState}
            focusAreas={focusAreas}
          />
        </View>
      </Animated.View>
    );
  };
  
  // Render navigation buttons
  const renderNavigation = () => {
    return (
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={goToPreviousStep}
        >
          <Ionicons 
            name={currentStep === 0 ? "close" : "arrow-back"} 
            size={24} 
            color="#FFFFFF" 
          />
          <Text style={styles.navButtonText}>
            {currentStep === 0 ? "Cancel" : "Back"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonPrimary]} 
          onPress={goToNextStep}
        >
          <Text style={styles.navButtonText}>
            {currentStep === 3 ? (isEditing ? "Update" : "Create") : "Next"}
          </Text>
          {currentStep < 3 && (
            <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? "Edit Goal" : "Create New Goal"}
            </Text>
            {renderStepIndicator()}
          </View>
          
          <View style={styles.bodyContainer}>
            {renderStepContent()}
          </View>
          
          <View style={styles.footer}>
            {renderNavigation()}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  content: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 50,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  bodyContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  stepIndicatorItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3A3A3C',
    marginBottom: 4,
  },
  stepDotActive: {
    backgroundColor: '#0A84FF',
  },
  stepText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  stepTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  stepsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 4,
  },
  stepContent: {
    width: SCREEN_WIDTH,
    padding: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  navButtonPrimary: {
    backgroundColor: '#0A84FF',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginHorizontal: 8,
  },
}); 