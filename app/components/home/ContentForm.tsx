import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

export type ContentType = 'goal' | 'memory' | 'lesson' | 'reflection' | 'planning' | 'season' | null;

export interface FormData {
  title?: string;
  description?: string;
  category?: string;
  intent?: string;
  deadline?: string;
  progress?: number;
  tags?: string | string[];
  source?: string;
  importance?: number;
  mood?: string;
  highlights?: string;
  challenges?: string;
  gratitude?: string;
  priorities?: string[];
  potentialChallenges?: string;
  seasonTheme?: string;
  startDate?: string;
  endDate?: string;
  // New goal specific fields
  priorityLevel?: 'low' | 'medium' | 'high';
  focusArea?: string;
  trackingMethod?: 'percentage' | 'binary' | 'milestone';
  milestones?: string[];
}

interface ContentFormProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (data: FormData, type: ContentType) => void;
}

export const ContentForm: React.FC<ContentFormProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedContentType, setSelectedContentType] = useState<ContentType>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [moodSelection, setMoodSelection] = useState<number>(2); // Default to neutral mood
  const [importanceRating, setImportanceRating] = useState<number>(3); // Default to medium importance
  // Step for goal creation (1 = essential info, 2 = details and tracking)
  const [goalStep, setGoalStep] = useState<number>(1);
  // Track if a field is required and was touched
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  // State for priority level and tracking method selection
  const [priorityLevel, setPriorityLevel] = useState<number>(1); // Default to medium (index 1)
  const [trackingMethod, setTrackingMethod] = useState<number>(0); // Default to percentage (index 0)
  const theme = useTheme();
  const isDark = theme.isDark;

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!visible) {
      // Small delay to reset after animation completes
      const timer = setTimeout(() => {
        setSelectedContentType(null);
        setFormData({});
        setMoodSelection(2);
        setImportanceRating(3);
        setGoalStep(1);
        setTouchedFields({});
        setPriorityLevel(1);
        setTrackingMethod(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Function to select content type
  const selectContentType = (type: ContentType) => {
    setSelectedContentType(type);
    // Reset form data when changing type
    setFormData({});
    setGoalStep(1); // Reset to step 1 when switching content types
    setTouchedFields({});
  };

  // Update form field
  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  // Function to handle saving the form
  const handleSave = () => {
    if (!selectedContentType) {
      return;
    }

    // Validate required fields
    if (!validateForm()) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields.",
        [{ text: "OK" }]
      );
      return;
    }

    // Call onSave with form data and content type
    if (onSave) {
      // Add processed fields based on content type
      const processedData = { ...formData };
      
      // Process specific fields
      if (selectedContentType === 'memory' && formData.tags) {
        if (typeof formData.tags === 'string') {
          processedData.tags = formData.tags.split(',').map((tag: string) => tag.trim());
        }
      }
      
      if (selectedContentType === 'lesson') {
        processedData.importance = importanceRating;
      }
      
      if (selectedContentType === 'reflection') {
        const moods = ['😔', '😐', '🙂', '😊', '😄'];
        processedData.mood = moods[moodSelection];
      }
      
      onSave(processedData, selectedContentType);
    }
    
    onClose();
  };

  // Function to go to next step of goal creation
  const goToNextStep = () => {
    // Validate current step before proceeding
    if (selectedContentType === 'goal' && goalStep === 1) {
      if (!formData.title) {
        setTouchedFields(prev => ({ ...prev, title: true }));
        Alert.alert("Title Required", "Please provide a title for your goal.");
        return;
      }
      setGoalStep(2);
    }
  };

  // Function to go back to previous step of goal creation
  const goToPreviousStep = () => {
    if (selectedContentType === 'goal' && goalStep === 2) {
      setGoalStep(1);
    }
  };

  // Validate form based on content type and step
  const validateForm = (): boolean => {
    switch (selectedContentType) {
      case 'goal':
        // For goals, we require title at minimum
        return !!formData.title;
      case 'memory':
        return !!formData.title;
      case 'lesson':
        return !!formData.title;
      case 'reflection':
        return !!formData.highlights || !!formData.challenges || !!formData.gratitude;
      case 'planning':
        return !!formData.priorities && formData.priorities.length > 0;
      case 'season':
        return !!formData.title && !!formData.seasonTheme;
      default:
        return false;
    }
  };

  // Icon and color for each content type
  const contentTypeConfig = {
    goal: { icon: 'flag' as keyof typeof Ionicons.glyphMap, color: '#007AFF', darkColor: '#0A84FF' },
    memory: { icon: 'images' as keyof typeof Ionicons.glyphMap, color: '#34C759', darkColor: '#30D158' },
    lesson: { icon: 'sparkles' as keyof typeof Ionicons.glyphMap, color: '#AF52DE', darkColor: '#BF5AF2' },
    reflection: { icon: 'journal' as keyof typeof Ionicons.glyphMap, color: '#FF9500', darkColor: '#FF9F0A' },
    planning: { icon: 'calendar' as keyof typeof Ionicons.glyphMap, color: '#5856D6', darkColor: '#5E5CE6' },
    season: { icon: 'leaf' as keyof typeof Ionicons.glyphMap, color: '#FF2D55', darkColor: '#FF375F' },
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={[
          styles.modalContainer, 
          { paddingBottom: insets.bottom + 20 }
        ]}>
          <View style={styles.modalHandle} />
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedContentType ? `New ${selectedContentType.charAt(0).toUpperCase() + selectedContentType.slice(1)}` : 'Create New Content'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
              <Ionicons 
                name="close" 
                size={24} 
              />
            </TouchableOpacity>
          </View>
          
          {!selectedContentType ? (
            // Step 1: Content Type Selection
            <View style={styles.contentTypeSelector}>
              <Text style={styles.formLabel}>
                What would you like to create?
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.contentTypeGrid}>
                  {Object.entries(contentTypeConfig).map(([type, config]) => (
                    <TouchableOpacity 
                      key={type}
                      style={[
                        styles.contentTypeButton,
                      ]}
                      onPress={() => selectContentType(type as ContentType)}
                    >
                      <View style={[
                        styles.contentTypeIcon, 
                        { backgroundColor: config.color }
                      ]}>
                        <Ionicons 
                          name={config.icon} 
                          size={24} 
                          color="#FFFFFF" 
                        />
                      </View>
                      <Text style={styles.contentTypeText}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : (
            // Step 2: Form Fields based on selected type
            <ScrollView 
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScrollContent}
            >
              {/* Goal Form Fields */}
              {selectedContentType === 'goal' && (
                <>
                  {goalStep === 1 && (
                    <View style={styles.formFields}>
                      <View style={styles.stepIndicator}>
                        <View style={styles.stepNumberActive}>
                          <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <View style={styles.stepLine} />
                        <View style={styles.stepNumberInactive}>
                          <Text style={styles.stepNumberText}>2</Text>
                        </View>
                      </View>
                      <Text style={styles.stepTitle}>Essential Information</Text>
                      
                      <View style={styles.formField}>
                        <Text style={styles.formLabel}>
                          Title *
                        </Text>
                        <TextInput
                          style={[
                            styles.textInput, 
                            touchedFields.title && !formData.title && styles.inputError,
                          ]}
                          placeholder="What do you want to achieve?"
                          placeholderTextColor="#C7C7CC"
                          value={formData.title}
                          onChangeText={(text) => updateField('title', text)}
                        />
                        {touchedFields.title && !formData.title && (
                          <Text style={styles.errorText}>Title is required</Text>
                        )}
                      </View>
                      
                      <View style={styles.formField}>
                        <Text style={styles.formLabel}>Category</Text>
                        <TextInput
                          style={[styles.textInput]}
                          placeholder="e.g., Career, Health, Personal Growth"
                          placeholderTextColor="#C7C7CC"
                          value={formData.category}
                          onChangeText={(text) => updateField('category', text)}
                        />
                      </View>
                      
                      <View style={styles.formField}>
                        <Text style={styles.formLabel}>Intent</Text>
                        <TextInput
                          style={[styles.textArea]}
                          placeholder="Why is this important to you?"
                          placeholderTextColor="#C7C7CC"
                          multiline
                          value={formData.intent}
                          onChangeText={(text) => updateField('intent', text)}
                        />
                      </View>
                      
                      <TouchableOpacity 
                        style={[
                          styles.navigationButton, 
                          { 
                            backgroundColor: contentTypeConfig.goal.color 
                          }
                        ]}
                        onPress={goToNextStep}
                      >
                        <Text style={styles.navigationButtonText}>Next</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  {goalStep === 2 && (
                    <View style={styles.formFields}>
                      <View style={styles.stepIndicator}>
                        <View style={styles.stepNumberCompleted}>
                          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        </View>
                        <View style={styles.stepLineActive} />
                        <View style={styles.stepNumberActive}>
                          <Text style={styles.stepNumberText}>2</Text>
                        </View>
                      </View>
                      <Text style={styles.stepTitle}>Details & Tracking</Text>
                   
                     <View style={styles.formField}>
                       <Text style={styles.formLabel}>Deadline</Text>
                       <TextInput
                         style={[styles.textInput]}
                         placeholder="When do you want to achieve this?"
                         placeholderTextColor="#C7C7CC"
                         value={formData.deadline}
                         onChangeText={(text) => updateField('deadline', text)}
                       />
                     </View>
                   
                     <View style={styles.formField}>
                       <Text style={styles.formLabel}>Priority Level</Text>
                       <View style={styles.prioritySelector}>
                         {['Low', 'Medium', 'High'].map((level, index) => (
                           <TouchableOpacity 
                             key={index} 
                             style={[
                               styles.priorityOption,
                               priorityLevel === index ? styles.selectedPriorityOption : null,
                             ]}
                             onPress={() => {
                               setPriorityLevel(index);
                               updateField('priorityLevel', level.toLowerCase());
                             }}
                           >
                             <Text style={styles.priorityText}>{level}</Text>
                           </TouchableOpacity>
                         ))}
                       </View>
                     </View>
                     
                     <View style={styles.formField}>
                       <Text style={styles.formLabel}>Focus Area</Text>
                       <TextInput
                         style={[styles.textInput]}
                         placeholder="e.g., Career, Health, Personal Growth"
                         placeholderTextColor="#C7C7CC"
                         value={formData.focusArea}
                         onChangeText={(text) => updateField('focusArea', text)}
                       />
                     </View>
                     
                     <View style={styles.formField}>
                       <Text style={styles.formLabel}>Tracking Method</Text>
                       <View style={styles.trackingSelector}>
                         {['Percentage', 'Binary', 'Milestone'].map((method, index) => (
                           <TouchableOpacity 
                             key={index} 
                             style={[
                               styles.trackingOption,
                               trackingMethod === index ? styles.selectedTrackingOption : null,
                             ]}
                             onPress={() => {
                               setTrackingMethod(index);
                               updateField('trackingMethod', method.toLowerCase());
                             }}
                           >
                             <Text style={styles.trackingText}>{method}</Text>
                           </TouchableOpacity>
                         ))}
                       </View>
                     </View>
                     
                     <View style={styles.formField}>
                       <Text style={styles.formLabel}>Initial Progress</Text>
                       <TextInput
                         style={[styles.textInput]}
                         placeholder="Initial progress (e.g., 0%, 10%)"
                         placeholderTextColor="#C7C7CC"
                         value={formData.progress?.toString() || '0'}
                         onChangeText={(text) => {
                           const progress = parseInt(text, 10);
                           if (!isNaN(progress)) {
                             updateField('progress', progress);
                           } else if (text === '') {
                             updateField('progress', 0);
                           }
                         }}
                       />
                     </View>
                     
                     <View style={styles.navigationButtons}>
                       <TouchableOpacity 
                         style={styles.backButton}
                         onPress={goToPreviousStep}
                       >
                         <Ionicons name="arrow-back" size={20} color="#000000" />
                         <Text style={styles.backButtonText}>Back</Text>
                       </TouchableOpacity>
                       
                       <TouchableOpacity 
                         style={[
                           styles.saveButton, 
                           { 
                             backgroundColor: contentTypeConfig.goal.color 
                           }
                         ]}
                         onPress={handleSave}
                       >
                         <Text style={styles.saveButtonText}>Save Goal</Text>
                       </TouchableOpacity>
                     </View>
                   </View>
                 )}
               </>
              )}
              
              {/* Memory Form Fields */}
              {selectedContentType === 'memory' && (
                <View style={styles.formFields}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Title *</Text>
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="Name this memory"
                      placeholderTextColor="#C7C7CC"
                      value={formData.title}
                      onChangeText={(text) => updateField('title', text)}
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Description</Text>
                    <TextInput
                      style={[styles.textArea]}
                      placeholder="Describe what happened..."
                      placeholderTextColor="#C7C7CC"
                      multiline
                      value={formData.description}
                      onChangeText={(text) => updateField('description', text)}
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Tags</Text>
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="Add comma-separated tags"
                      placeholderTextColor="#C7C7CC"
                      value={formData.tags as string}
                      onChangeText={(text) => updateField('tags', text)}
                    />
                  </View>
                </View>
              )}
              
              {/* Lesson Form Fields */}
              {selectedContentType === 'lesson' && (
                <View style={styles.formFields}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Lesson Title *</Text>
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="What did you learn?"
                      placeholderTextColor="#C7C7CC"
                      value={formData.title}
                      onChangeText={(text) => updateField('title', text)}
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Source</Text>
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="Where/how did you learn this?"
                      placeholderTextColor="#C7C7CC"
                      value={formData.source}
                      onChangeText={(text) => updateField('source', text)}
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Importance</Text>
                    <View style={styles.importanceSelector}>
                      {[1, 2, 3, 4, 5].map(value => (
                        <TouchableOpacity 
                          key={value} 
                          style={[
                            styles.importanceDot, 
                            { 
                              backgroundColor: value <= importanceRating ? '#AF52DE' : '#F2F2F7', 
                              opacity: value <= importanceRating ? 1 : 0.3 
                            }
                          ]}
                          onPress={() => setImportanceRating(value)}
                        />
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Description</Text>
                    <TextInput
                      style={[styles.textArea]}
                      placeholder="Describe this lesson in more detail..."
                      placeholderTextColor="#C7C7CC"
                      multiline
                      value={formData.description}
                      onChangeText={(text) => updateField('description', text)}
                    />
                  </View>
                </View>
              )}
              
              {/* Reflection Form Fields */}
              {selectedContentType === 'reflection' && (
                <View style={styles.formFields}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>How are you feeling?</Text>
                    <View style={styles.moodSelector}>
                      {['😔', '😐', '🙂', '😊', '😄'].map((emoji, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={[
                            styles.moodOption,
                            index === moodSelection && styles.selectedMoodOption,
                            index === moodSelection && { borderColor: '#007AFF' }
                          ]}
                          onPress={() => setMoodSelection(index)}
                        >
                          <Text style={styles.moodEmoji}>{emoji}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Today's Highlights</Text>
                    <TextInput
                      style={[styles.textArea]}
                      placeholder="What went well today?"
                      placeholderTextColor="#C7C7CC"
                      multiline
                      value={formData.highlights}
                      onChangeText={(text) => updateField('highlights', text)}
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Challenges</Text>
                    <TextInput
                      style={[styles.textArea]}
                      placeholder="What could have gone better?"
                      placeholderTextColor="#C7C7CC"
                      multiline
                      value={formData.challenges}
                      onChangeText={(text) => updateField('challenges', text)}
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Gratitude</Text>
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="What are you grateful for today?"
                      placeholderTextColor="#C7C7CC"
                      value={formData.gratitude}
                      onChangeText={(text) => updateField('gratitude', text)}
                    />
                  </View>
                </View>
              )}
              
              {/* Planning Form Fields */}
              {selectedContentType === 'planning' && (
                <View style={styles.formFields}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Date</Text>
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="MM/DD/YYYY"
                      placeholderTextColor="#C7C7CC"
                      value={formData.deadline}
                      onChangeText={(text) => updateField('deadline', text)}
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Top 3 Priorities *</Text>
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="Priority #1"
                      placeholderTextColor="#C7C7CC"
                      value={formData.priorities?.[0]}
                      onChangeText={(text) => {
                        const priorities = [...(formData.priorities || [])];
                        priorities[0] = text;
                        updateField('priorities', priorities);
                      }}
                    />
                    <View style={{ height: 8 }} />
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="Priority #2"
                      placeholderTextColor="#C7C7CC"
                      value={formData.priorities?.[1]}
                      onChangeText={(text) => {
                        const priorities = [...(formData.priorities || [])];
                        priorities[1] = text;
                        updateField('priorities', priorities);
                      }}
                    />
                    <View style={{ height: 8 }} />
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="Priority #3"
                      placeholderTextColor="#C7C7CC"
                      value={formData.priorities?.[2]}
                      onChangeText={(text) => {
                        const priorities = [...(formData.priorities || [])];
                        priorities[2] = text;
                        updateField('priorities', priorities);
                      }}
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Potential Challenges</Text>
                    <TextInput
                      style={[styles.textArea]}
                      placeholder="What challenges might you face?"
                      placeholderTextColor="#C7C7CC"
                      multiline
                      value={formData.potentialChallenges}
                      onChangeText={(text) => updateField('potentialChallenges', text)}
                    />
                  </View>
                </View>
              )}
              
              {/* Season Form Fields */}
              {selectedContentType === 'season' && (
                <View style={styles.formFields}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Season Name *</Text>
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="Give this season of life a name"
                      placeholderTextColor="#C7C7CC"
                      value={formData.title}
                      onChangeText={(text) => updateField('title', text)}
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Timeframe</Text>
                    <View style={styles.dateRangeContainer}>
                      <TextInput
                        style={[styles.dateInput]}
                        placeholder="Start date"
                        placeholderTextColor="#C7C7CC"
                        value={formData.startDate}
                        onChangeText={(text) => updateField('startDate', text)}
                      />
                      <Text style={styles.dateRangeSeparator}>to</Text>
                      <TextInput
                        style={[styles.dateInput]}
                        placeholder="End date"
                        placeholderTextColor="#C7C7CC"
                        value={formData.endDate}
                        onChangeText={(text) => updateField('endDate', text)}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Season Theme *</Text>
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="What defines this season? (e.g., Growth)"
                      placeholderTextColor="#C7C7CC"
                      value={formData.seasonTheme}
                      onChangeText={(text) => updateField('seasonTheme', text)}
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Description</Text>
                    <TextInput
                      style={[styles.textArea]}
                      placeholder="Describe this season of life..."
                      placeholderTextColor="#C7C7CC"
                      multiline
                      value={formData.description}
                      onChangeText={(text) => updateField('description', text)}
                    />
                  </View>
                </View>
              )}
            </ScrollView>
          )}
          
          {selectedContentType && (
            <>
              {/* For goals, show save button only in Step 2 */}
              {!(selectedContentType === 'goal') && (
                <TouchableOpacity 
                  style={[
                    styles.saveButton, 
                    { 
                      backgroundColor: contentTypeConfig[selectedContentType].color 
                    }
                  ]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardAvoid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '90%',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 20,
    maxHeight: '100%',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  
  // Step indicator styles
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumberActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberCompleted: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#C7C7CC',
    marginHorizontal: 8,
  },
  stepLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: '#34C759',
    marginHorizontal: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  requiredStar: {
    color: '#FF453A',
    fontWeight: '600',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF453A',
  },
  errorText: {
    color: '#FF453A',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  
  // Navigation
  navigationButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginLeft: 8,
  },
  
  // Content Type Selector
  contentTypeSelector: {
    flex: 1,
    marginBottom: 20,
  },
  contentTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  contentTypeButton: {
    width: '48%',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  contentTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginTop: 4,
  },
  
  // Form Container
  formContainer: {
    flex: 1,
    marginBottom: 16,
  },
  formScrollContent: {
    paddingBottom: 20,
  },
  formFields: {
    marginBottom: 8,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000',
    height: 100,
    textAlignVertical: 'top',
  },
  
  // Importance Selector
  importanceSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  importanceDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  
  // Priority selector styles
  prioritySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priorityOption: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },
  selectedPriorityOption: {
    borderColor: '#007AFF',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  
  // Tracking selector styles
  trackingSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  trackingOption: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },
  selectedTrackingOption: {
    borderColor: '#007AFF',
  },
  trackingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  
  // Mood selector styles
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  moodOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMoodOption: {
    borderColor: '#007AFF',
  },
  moodEmoji: {
    fontSize: 24,
  },
  
  // Date range picker styles
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  dateRangeSeparator: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#8E8E93',
  },
  
  // Save Button
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContentForm; 