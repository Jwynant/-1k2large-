import React, { useState, useCallback, memo, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Pressable,
  Alert,
  ScrollView,
  TextInput,
  useColorScheme,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusAreas } from '../../hooks/useFocusAreas';
import { FocusArea, PriorityLevel } from '../../types';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

// Get screen dimensions for responsive sizing
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Priority level colors
const PRIORITY_COLORS = {
  essential: '#ffd700', // Gold/Amber
  important: '#47a9ff', // Royal Blue
  supplemental: '#cd602a', // Bronze/Copper
  // Legacy priority levels for backward compatibility
  primary: '#ffd700',    // Same as essential
  secondary: '#47a9ff',  // Same as important
  tertiary: '#cd602a',   // Same as supplemental
};

// Priority level labels
const PRIORITY_LABELS = {
  essential: 'Essential',
  important: 'Important',
  supplemental: 'Supplemental',
  // Legacy priority levels for backward compatibility
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
};

// Priority level limits
const PRIORITY_LIMITS = {
  essential: 3,
  important: 5,
  supplemental: 7,
  // Legacy priority levels for backward compatibility
  primary: 3,
  secondary: 5,
  tertiary: 7,
};

// Priority level descriptions
const PRIORITY_DESCRIPTIONS = {
  essential: 'Core areas that define your identity and purpose',
  important: 'Significant areas that enhance your life quality',
  supplemental: 'Additional areas that add richness to your life',
  // Legacy priority levels for backward compatibility
  primary: 'Core areas that define your identity and purpose',
  secondary: 'Significant areas that enhance your life quality',
  tertiary: 'Additional areas that add richness to your life',
};

// Priority level styles - for enhanced visual hierarchy
const PRIORITY_STYLES = {
  essential: {
    backgroundColor: '#1A1700', // Darker gold background
    borderColor: PRIORITY_COLORS.essential,
    borderWidth: 2,
    shadowColor: PRIORITY_COLORS.essential,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  important: {
    backgroundColor: '#001A33', // Darker blue background
    borderColor: PRIORITY_COLORS.important,
    borderWidth: 1.5,
    shadowColor: PRIORITY_COLORS.important,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  supplemental: {
    backgroundColor: '#1A0D00', // Darker bronze background
    borderColor: PRIORITY_COLORS.supplemental,
    borderWidth: 1,
    shadowColor: PRIORITY_COLORS.supplemental,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  // Legacy priority levels for backward compatibility
  primary: {
    backgroundColor: '#1A1700', // Same as essential
    borderColor: PRIORITY_COLORS.primary,
    borderWidth: 2,
    shadowColor: PRIORITY_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  secondary: {
    backgroundColor: '#001A33', // Same as important
    borderColor: PRIORITY_COLORS.secondary,
    borderWidth: 1.5,
    shadowColor: PRIORITY_COLORS.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  tertiary: {
    backgroundColor: '#1A0D00', // Same as supplemental
    borderColor: PRIORITY_COLORS.tertiary,
    borderWidth: 1,
    shadowColor: PRIORITY_COLORS.tertiary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
};

// Memoized FocusAreaCard component to prevent unnecessary re-renders
const FocusAreaCard = memo(({ area, onPress }: { area: FocusArea, onPress: () => void }) => {
  return (
    <TouchableOpacity 
      key={area.id} 
      style={[
        styles.focusAreaCard,
        PRIORITY_STYLES[area.priorityLevel],
        { borderColor: area.color }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.focusColorBar, { backgroundColor: area.color }]} />
      <Text style={styles.focusName}>
        {area.name}
      </Text>
      {area.description ? (
        <Text style={styles.focusDescription} numberOfLines={1}>
          {area.description}
        </Text>
      ) : null}
      <View style={styles.priorityIndicator}>
        <Text style={[styles.priorityIndicatorText, { color: PRIORITY_COLORS[area.priorityLevel] }]}>
          {PRIORITY_LABELS[area.priorityLevel]}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

// Memoized PrioritySection component to prevent unnecessary re-renders
const PrioritySection = memo(({ 
  priority, 
  areas, 
  onAreaPress 
}: { 
  priority: PriorityLevel, 
  areas: FocusArea[], 
  onAreaPress: () => void 
}) => {
  if (areas.length === 0) return null;
  
  return (
    <View style={styles.prioritySection}>
      <View style={styles.priorityHeader}>
        <View style={[
          styles.priorityBadge, 
          { backgroundColor: PRIORITY_COLORS[priority] + '30' }
        ]}>
          <Text style={[
            styles.priorityBadgeText, 
            { color: PRIORITY_COLORS[priority] }
          ]}>
            {PRIORITY_LABELS[priority]}
          </Text>
        </View>
        <Text style={styles.areaCount}>{areas.length} areas</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.areasScrollContent}
      >
        {areas.map((area) => (
          <FocusAreaCard 
            key={area.id} 
            area={area} 
            onPress={onAreaPress} 
          />
        ))}
      </ScrollView>
    </View>
  );
});

export default function SimplifiedFocusAreas() {
  const { 
    orderedFocusAreas, 
    focusByLevel,
    addFocusArea, 
    updateFocusArea, 
    deleteFocusArea,
    getPresetColor,
    isPriorityLevelFull
  } = useFocusAreas();
  
  const router = useRouter();
  
  // Get color scheme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // States for adding a new focus area
  const [isAddingFocus, setIsAddingFocus] = useState(false);
  const [newFocusTitle, setNewFocusTitle] = useState('');
  const [newFocusNotes, setNewFocusNotes] = useState('');
  const [newFocusPriority, setNewFocusPriority] = useState<PriorityLevel>('important');
  
  // Handle adding a new focus area
  const handleAddFocus = useCallback(() => {
    console.log('Starting to add focus area');
    
    // Dismiss keyboard
    Keyboard.dismiss();
    
    if (!newFocusTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your focus area');
      return;
    }
    
    // Check if the priority level has reached its limit
    if (isPriorityLevelFull(newFocusPriority)) {
      Alert.alert(
        'Priority Level Full',
        `You can have at most ${PRIORITY_LIMITS[newFocusPriority]} ${newFocusPriority} focus areas. Consider removing one or choosing a different priority level.`
      );
      return;
    }
    
    // Prepare the new focus area data
    const focusAreaData = {
      name: newFocusTitle.trim(),
      color: getPresetColor(),
      priorityLevel: newFocusPriority,
      rank: focusByLevel[newFocusPriority].length + 1,
      description: newFocusNotes.trim() // Add notes to the focus area
    };
    
    console.log('Adding focus area:', focusAreaData);
    
    // Add the new focus area
    addFocusArea(focusAreaData);
    
    // Batch state updates to reduce renders
    console.log('Resetting form state');
    setIsAddingFocus(false);
    setNewFocusTitle('');
    setNewFocusNotes('');
    setNewFocusPriority('important');
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    console.log('Focus area added successfully');
  }, [newFocusTitle, newFocusNotes, newFocusPriority, isPriorityLevelFull, focusByLevel, getPresetColor, addFocusArea]);
  
  // Handle deleting a focus area
  const handleDeleteFocus = useCallback((area: FocusArea) => {
    Alert.alert(
      'Delete Focus Area',
      `Are you sure you want to delete "${area.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteFocusArea(area.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  }, [deleteFocusArea]);

  // Navigate to focus areas page
  const navigateToFocusAreas = useCallback(() => {
    // This would navigate to a dedicated focus areas page
    // router.push('/focus');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);
  
  // Open the add focus area modal
  const openAddFocusModal = useCallback(() => {
    setIsAddingFocus(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // Render focus areas grouped by priority - memoized to prevent unnecessary recalculation
  const renderFocusAreasByPriority = useMemo(() => {
    console.log('Rendering focus areas by priority');
    
    return Object.entries(focusByLevel).map(([priority, areas]) => (
      <PrioritySection 
        key={priority}
        priority={priority as PriorityLevel}
        areas={areas}
        onAreaPress={navigateToFocusAreas}
      />
    )).filter(Boolean); // Filter out null values
  }, [focusByLevel, navigateToFocusAreas]);

  // Memoize the priority options to prevent unnecessary recreations
  const priorityOptions = useMemo(() => {
    return Object.entries(PRIORITY_LABELS).map(([key, label]) => (
      <TouchableOpacity
        key={key}
        style={[
          styles.priorityOption,
          newFocusPriority === key && {
            backgroundColor: PRIORITY_COLORS[key as PriorityLevel] + '30',
            borderColor: PRIORITY_COLORS[key as PriorityLevel]
          }
        ]}
        onPress={() => setNewFocusPriority(key as PriorityLevel)}
      >
        <Text
          style={[
            styles.priorityOptionText,
            newFocusPriority === key && {
              color: PRIORITY_COLORS[key as PriorityLevel],
              fontWeight: '600'
            }
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {label}
        </Text>
      </TouchableOpacity>
    ));
  }, [newFocusPriority]);

  // Function to handle background press (close modal when tapping outside)
  const handleBackgroundPress = useCallback(() => {
    Keyboard.dismiss();
    setIsAddingFocus(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name="compass" size={20} color="#4CD964" style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Focus Areas</Text>
        </View>
      </View>

      {orderedFocusAreas.length > 0 ? (
        <View style={styles.contentContainer}>
          {/* Focus Areas Display - Primary */}
          <View style={styles.focusAreasContainer}>
            {renderFocusAreasByPriority}
          </View>
          
          {/* Action Buttons - Secondary */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={openAddFocusModal}
            >
              <Ionicons name="add-circle-outline" size={18} color="#0A84FF" />
              <Text style={styles.secondaryButtonText}>Add Focus Area</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={navigateToFocusAreas}
            >
              <Text style={styles.secondaryButtonText}>View All</Text>
              <Ionicons name="chevron-forward" size={14} color="#0A84FF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="compass-outline" size={48} color="#8E8E93" style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Focus Areas</Text>
          <Text style={styles.emptyDescription}>
            Define what matters most to you by adding focus areas
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={openAddFocusModal}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Focus Area</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Modal for adding a new focus area */}
      <Modal
        visible={isAddingFocus}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsAddingFocus(false)}
      >
        <TouchableWithoutFeedback onPress={handleBackgroundPress}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Add Focus Area</Text>
                    <TouchableOpacity
                      onPress={() => setIsAddingFocus(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Focus Area Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={newFocusTitle}
                      onChangeText={setNewFocusTitle}
                      placeholder="Enter a name for your focus area"
                      placeholderTextColor="#8E8E93"
                      autoFocus
                    />
                    
                    <Text style={styles.inputLabel}>Notes (Optional)</Text>
                    <TextInput
                      style={[styles.textInput, styles.notesInput]}
                      value={newFocusNotes}
                      onChangeText={setNewFocusNotes}
                      placeholder="Add some notes about this focus area"
                      placeholderTextColor="#8E8E93"
                      multiline
                      numberOfLines={2}
                      textAlignVertical="top"
                    />
                    
                    <Text style={styles.inputLabel}>Priority Level</Text>
                    <View style={styles.priorityOptions}>
                      {priorityOptions}
                    </View>
                    
                    <Text style={styles.priorityDescription}>
                      {PRIORITY_DESCRIPTIONS[newFocusPriority]}
                    </Text>
                    
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleAddFocus}
                    >
                      <Text style={styles.saveButtonText}>Save Focus Area</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contentContainer: {
    width: '100%',
  },
  focusAreasContainer: {
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
  },
  secondaryButtonText: {
    color: '#0A84FF',
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 4,
  },
  prioritySection: {
    marginBottom: 16,
  },
  priorityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  areaCount: {
    fontSize: 12,
    color: '#8E8E93',
  },
  areasScrollContent: {
    paddingRight: 16,
  },
  focusAreaCard: {
    backgroundColor: '#3A3A3C',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 150,
    height: 100,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  focusColorBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  focusName: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  focusDescription: {
    color: '#AEAEB2',
    fontSize: 12,
    marginBottom: 8,
  },
  priorityIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  priorityIndicatorText: {
    fontSize: 10,
    fontWeight: '500',
  },
  buttonsContainer: {
    marginTop: 8,
    gap: 12,
  },
  addFocusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#0A84FF',
    borderRadius: 12,
  },
  addFocusButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    borderRadius: 12,
  },
  viewAllText: {
    color: '#0A84FF',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A84FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  keyboardAvoidingView: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  notesInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  priorityOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  priorityDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
}); 