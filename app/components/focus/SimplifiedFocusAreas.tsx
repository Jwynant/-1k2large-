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

// Define priority level colors outside the component to avoid recreation
const PRIORITY_COLORS = {
  essential: {
    main: '#34C759', // More vibrant green
    background: 'rgba(52, 199, 89, 0.1)',
    border: 'rgba(52, 199, 89, 0.3)',
  },
  important: {
    main: '#007AFF', // iOS blue
    background: 'rgba(0, 122, 255, 0.1)',
    border: 'rgba(0, 122, 255, 0.3)',
  },
  supplemental: {
    main: '#FF9500', // iOS orange
    background: 'rgba(255, 149, 0, 0.1)',
    border: 'rgba(255, 149, 0, 0.3)',
  },
};

// Priority level descriptions - moved outside component to avoid recreation
const PRIORITY_DESCRIPTIONS = {
  essential: 'Must-have focus areas that are critical to your success',
  important: 'Key areas that matter but with some flexibility',
  supplemental: 'Nice-to-have areas to develop when time allows'
};

// Priority level limits - moved outside component to avoid recreation
const PRIORITY_LIMITS = {
  essential: 3,
  important: 5, 
  supplemental: 7
};

// Priority level labels - moved outside component to avoid recreation
const PRIORITY_LABELS = {
  essential: 'Essential',
  important: 'Important',
  supplemental: 'Supplemental'
};

// Priority level styles - for enhanced visual hierarchy
const PRIORITY_STYLES = {
  essential: {
    backgroundColor: PRIORITY_COLORS.essential.background,
    borderLeftColor: PRIORITY_COLORS.essential.main,
    borderLeftWidth: 3,
  },
  important: {
    backgroundColor: PRIORITY_COLORS.important.background,
    borderLeftColor: PRIORITY_COLORS.important.main,
    borderLeftWidth: 3,
  },
  supplemental: {
    backgroundColor: PRIORITY_COLORS.supplemental.background,
    borderLeftColor: PRIORITY_COLORS.supplemental.main,
    borderLeftWidth: 3,
  }
};

// Memoized FocusAreaCard component to prevent unnecessary re-renders
const FocusAreaCard = memo(({ area, onPress }: { area: FocusArea, onPress: () => void }) => {
  return (
    <TouchableOpacity 
      key={area.id} 
      style={[
        styles.focusAreaCard,
        PRIORITY_STYLES[area.priorityLevel],
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.focusAreaContent}>
        <Text style={styles.focusName}>
          {area.name}
        </Text>
        {area.description ? (
          <Text style={styles.focusDescription} numberOfLines={1}>
            {area.description}
          </Text>
        ) : null}
      </View>
      <View style={styles.priorityIndicator}>
        <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[area.priorityLevel].main }]} />
        <Text style={styles.priorityIndicatorText}>
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
        <Text style={styles.priorityLabel}>
          {PRIORITY_LABELS[priority]}
        </Text>
        <Text style={styles.areaCount}>{areas.length} areas</Text>
      </View>
      
      <View style={styles.areasContainer}>
        {areas.map((area) => (
          <FocusAreaCard 
            key={area.id} 
            area={area} 
            onPress={onAreaPress} 
          />
        ))}
      </View>
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
            backgroundColor: PRIORITY_COLORS[key as PriorityLevel].background,
            borderColor: PRIORITY_COLORS[key as PriorityLevel].border
          }
        ]}
        onPress={() => setNewFocusPriority(key as PriorityLevel)}
      >
        <Text
          style={[
            styles.priorityOptionText,
            newFocusPriority === key && {
              color: PRIORITY_COLORS[key as PriorityLevel].main,
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
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="compass" size={22} color="#34C759" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Focus Areas</Text>
        </View>
      </View>

      {orderedFocusAreas.length > 0 ? (
        <View style={styles.contentContainer}>
          {/* Focus Areas Display */}
          <View style={styles.focusAreasContainer}>
            {renderFocusAreasByPriority}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.neutralButton]}
              onPress={openAddFocusModal}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Add Focus</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.neutralButton]}
              onPress={navigateToFocusAreas}
            >
              <Ionicons name="list" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="compass-outline" size={40} color="#8E8E93" style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Focus Areas</Text>
          <Text style={styles.emptyDescription}>
            Define what matters most to you by adding focus areas
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, styles.neutralButton, styles.emptyStateButton]}
            onPress={openAddFocusModal}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add Focus Area</Text>
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
                      style={[styles.saveButton, { backgroundColor: PRIORITY_COLORS[newFocusPriority].main }]}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
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
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    flex: 1,
    maxWidth: '48%',
  },
  neutralButton: {
    backgroundColor: '#3A3A3C', // Neutral dark gray
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginHorizontal: 6,
  },
  prioritySection: {
    marginBottom: 20,
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  areaCount: {
    fontSize: 12,
    color: '#8E8E93',
  },
  areasContainer: {
    width: '100%',
    gap: 10,
  },
  focusAreaCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 10,
    marginBottom: 0,
    alignItems: 'center',
  },
  focusAreaContent: {
    flex: 1,
  },
  focusName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  focusDescription: {
    fontSize: 13,
    color: '#8E8E93',
  },
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityIndicatorText: {
    fontSize: 12,
    color: '#FFFFFF',
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
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: '#3A3A3C', // Neutral dark gray instead of blue
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
    marginBottom: 20,
  },
  emptyStateButton: {
    maxWidth: '100%',
    marginTop: 10,
  },
}); 