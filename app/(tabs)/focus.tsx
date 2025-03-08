import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Pressable,
  TextInput, 
  Modal, 
  Dimensions,
  useColorScheme,
  Platform,
  Alert,
  SafeAreaView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusAreas } from '../hooks/useFocusAreas';
import { FocusArea, PriorityLevel } from '../types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import FocusAreaCard from '../components/focus/FocusAreaCard';
import { useContentManagement } from '../hooks/useContentManagement';
import FocusAreaDetailView from '../components/focus/FocusAreaDetailView';
import { CategorySelector } from '../components/shared/CategorySelector';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Priority level colors - work well in both dark and light modes
const PRIORITY_COLORS = {
  essential: '#ffd700', // Gold/Amber
  important: '#47a9ff', // Royal Blue
  supplemental: '#cd602a', // Bronze/Copper
};

// Priority level descriptions for user understanding
const PRIORITY_DESCRIPTIONS = {
  essential: 'Must-have focus areas that are critical to your success',
  important: 'Key areas that matter but with some flexibility',
  supplemental: 'Nice-to-have areas to develop when time allows'
};

// Priority level limits
const PRIORITY_LIMITS = {
  essential: 3,
  important: 5, 
  supplemental: 7
};

export default function FocusScreen() {
  const { 
    orderedFocusAreas, 
    focusByLevel,
    addFocusArea, 
    updateFocusArea, 
    deleteFocusArea,
    changePriorityLevel,
    getPresetColor,
    updateFocusAreaStatus,
    isPriorityLevelFull
  } = useFocusAreas();
  
  const { getGoals } = useContentManagement();
  
  // States for adding a new focus area
  const [isAddingFocus, setIsAddingFocus] = useState(false);
  const [newFocusTitle, setNewFocusTitle] = useState('');
  const [newFocusNotes, setNewFocusNotes] = useState('');
  const [newFocusPriority, setNewFocusPriority] = useState<PriorityLevel>('important');
  const [newFocusCategoryIds, setNewFocusCategoryIds] = useState<string[]>([]);
  
  // States for editing existing focus area
  const [editingFocus, setEditingFocus] = useState<FocusArea | null>(null);
  const [editingFocusPriority, setEditingFocusPriority] = useState<PriorityLevel>('important');
  const [editingFocusNotes, setEditingFocusNotes] = useState('');
  const [editingFocusCategoryIds, setEditingFocusCategoryIds] = useState<string[]>([]);
  
  // State for the detail view
  const [selectedFocusArea, setSelectedFocusArea] = useState<FocusArea | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  
  // Track recently changed focus area for animations
  const [recentlyChangedArea, setRecentlyChangedArea] = useState<string | null>(null);
  
  // Color scheme for dark/light mode
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Styles based on color scheme
  const styles = getStyles(isDarkMode);
  
  // Update focus area status based on goals whenever the screen is viewed
  useEffect(() => {
    updateFocusAreaStatus();
  }, [updateFocusAreaStatus]);
  
  // Log focus areas by level when they change
  useEffect(() => {
    console.log('Focus areas by level:', {
      essential: focusByLevel.essential.length,
      important: focusByLevel.important.length,
      supplemental: focusByLevel.supplemental.length
    });
  }, [focusByLevel]);
  
  // Count active goals for a focus area
  const getActiveGoalCount = (focusAreaId: string) => {
    return getGoals().filter(goal => 
      goal.focusAreaId === focusAreaId && 
      !goal.isCompleted
    ).length;
  };
  
  // Handle adding a new focus area
  const handleAddFocus = () => {
    // Validate input
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
    
    // Add the new focus area
    const newFocusArea = addFocusArea({
      name: newFocusTitle.trim(),
      color: getPresetColor(),
      priorityLevel: newFocusPriority,
      description: newFocusNotes.trim() || undefined,
      categoryIds: newFocusCategoryIds.length > 0 ? newFocusCategoryIds : undefined,
      rank: focusByLevel[newFocusPriority].length + 1 // Set rank based on existing focus areas in this level
    });
    
    // Show animation for the new area
    setRecentlyChangedArea(newFocusArea.id);
    setTimeout(() => setRecentlyChangedArea(null), 2000);
    
    // Clear the form
    setNewFocusTitle('');
    setNewFocusNotes('');
    setNewFocusPriority('important');
    setNewFocusCategoryIds([]);
    setIsAddingFocus(false);
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  // Handle editing an existing focus area
  const handleEditFocus = (area: FocusArea) => {
    setEditingFocus(area);
    setEditingFocusPriority(area.priorityLevel);
    setEditingFocusNotes(area.description || '');
    setEditingFocusCategoryIds(area.categoryIds || []);
  };
  
  // Save edited focus area
  const handleSaveEdit = () => {
    if (!editingFocus) return;
    
    // Check if the priority level has changed and if the new level is full
    if (editingFocus.priorityLevel !== editingFocusPriority && 
        isPriorityLevelFull(editingFocusPriority)) {
      Alert.alert(
        'Priority Level Full',
        `You can have at most ${PRIORITY_LIMITS[editingFocusPriority]} ${editingFocusPriority} focus areas. Consider removing one or choosing a different priority level.`
      );
      return;
    }
    
    // Update the focus area
    const updatedArea: FocusArea = {
      ...editingFocus,
      priorityLevel: editingFocusPriority,
      categoryIds: editingFocusCategoryIds.length > 0 ? editingFocusCategoryIds : undefined,
      description: editingFocusNotes.trim() || undefined
    };
    
    updateFocusArea(updatedArea);
    
    // Show animation for the updated area
    setRecentlyChangedArea(updatedArea.id);
    setTimeout(() => setRecentlyChangedArea(null), 2000);
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Reset the form
    setEditingFocus(null);
    setEditingFocusPriority('important');
    setEditingFocusNotes('');
    setEditingFocusCategoryIds([]);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingFocus(null);
    setEditingFocusPriority('important');
    setEditingFocusNotes('');
    setEditingFocusCategoryIds([]);
  };
  
  // Handle deleting a focus area
  const handleDeleteFocus = (area: FocusArea) => {
    // Ask for confirmation
    Alert.alert(
      'Delete Focus Area',
      `Are you sure you want to delete "${area.name}"? This will not delete associated goals.`,
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
            
            // If we're editing this area, cancel edit
            if (editingFocus && editingFocus.id === area.id) {
              handleCancelEdit();
            }
            
            // If we're viewing this area, close detail view
            if (selectedFocusArea && selectedFocusArea.id === area.id) {
              closeDetailView();
            }
            
            // Provide haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  };
  
  // Function to handle opening the detail view
  const openDetailView = (focusArea: FocusArea) => {
    setSelectedFocusArea(focusArea);
    setIsDetailViewOpen(true);
  };
  
  // Function to handle closing the detail view
  const closeDetailView = () => {
    setIsDetailViewOpen(false);
    // Refresh the focus areas and goals after closing
    updateFocusAreaStatus();
  };
  
  // Update the onEdit function to handle editing
  const handleEditFocusFromDetail = (focusArea: FocusArea) => {
    setIsDetailViewOpen(false);
    handleEditFocus(focusArea);
  };
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode ? styles.lightText : styles.darkText]}>Focus Areas</Text>
        </View>
        
        {/* Main Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.stackContainer}>
            {/* Essential Focus Areas */}
            <View style={styles.prioritySection}>
              <View style={styles.prioritySectionHeader}>
                <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS.essential + '40' }]}>
                  <Text style={[styles.priorityBadgeText, { color: PRIORITY_COLORS.essential }]}>
                    ESSENTIAL
                  </Text>
                </View>
                {focusByLevel.essential.length >= PRIORITY_LIMITS.essential && (
                  <Text style={styles.limitText}>Limit: {focusByLevel.essential.length}/{PRIORITY_LIMITS.essential}</Text>
                )}
              </View>
              
              {focusByLevel.essential.map((area) => (
                <TouchableOpacity key={area.id} onPress={() => openDetailView(area)}>
                  <FocusAreaCard
                    focusArea={area}
                    priorityLevel={area.priorityLevel}
                    onPress={() => openDetailView(area)}
                    isRecent={area.id === recentlyChangedArea}
                  />
                </TouchableOpacity>
              ))}
              
              {/* Add button for this priority level */}
              {focusByLevel.essential.length < PRIORITY_LIMITS.essential && (
                <TouchableOpacity 
                  style={[styles.addButton, { borderColor: PRIORITY_COLORS.essential }]}
                  onPress={() => {
                    setNewFocusPriority('essential');
                    setIsAddingFocus(true);
                  }}
                >
                  <Ionicons name="add-circle-outline" size={20} color={PRIORITY_COLORS.essential} />
                  <Text style={[styles.addButtonText, { color: PRIORITY_COLORS.essential }]}>
                    Add Essential Focus Area
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Important Focus Areas */}
            <View style={styles.prioritySection}>
              <View style={styles.prioritySectionHeader}>
                <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS.important + '40' }]}>
                  <Text style={[styles.priorityBadgeText, { color: PRIORITY_COLORS.important }]}>
                    IMPORTANT
                  </Text>
                </View>
                {focusByLevel.important.length >= PRIORITY_LIMITS.important && (
                  <Text style={styles.limitText}>Limit: {focusByLevel.important.length}/{PRIORITY_LIMITS.important}</Text>
                )}
              </View>
              
              {focusByLevel.important.map((area) => (
                <TouchableOpacity key={area.id} onPress={() => openDetailView(area)}>
                  <FocusAreaCard
                    focusArea={area}
                    priorityLevel={area.priorityLevel}
                    onPress={() => openDetailView(area)}
                    isRecent={area.id === recentlyChangedArea}
                  />
                </TouchableOpacity>
              ))}
              
              {/* Add button for this priority level */}
              {focusByLevel.important.length < PRIORITY_LIMITS.important && (
                <TouchableOpacity 
                  style={[styles.addButton, { borderColor: PRIORITY_COLORS.important }]}
                  onPress={() => {
                    setNewFocusPriority('important');
                    setIsAddingFocus(true);
                  }}
                >
                  <Ionicons name="add-circle-outline" size={20} color={PRIORITY_COLORS.important} />
                  <Text style={[styles.addButtonText, { color: PRIORITY_COLORS.important }]}>
                    Add Important Focus Area
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Supplemental Focus Areas */}
            <View style={styles.prioritySection}>
              <View style={styles.prioritySectionHeader}>
                <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS.supplemental + '40' }]}>
                  <Text style={[styles.priorityBadgeText, { color: PRIORITY_COLORS.supplemental }]}>
                    SUPPLEMENTAL
                  </Text>
                </View>
                {focusByLevel.supplemental.length >= PRIORITY_LIMITS.supplemental && (
                  <Text style={styles.limitText}>Limit: {focusByLevel.supplemental.length}/{PRIORITY_LIMITS.supplemental}</Text>
                )}
              </View>
              
              {focusByLevel.supplemental.map((area) => (
                <TouchableOpacity key={area.id} onPress={() => openDetailView(area)}>
                  <FocusAreaCard
                    focusArea={area}
                    priorityLevel={area.priorityLevel}
                    onPress={() => openDetailView(area)}
                    isRecent={area.id === recentlyChangedArea}
                  />
                </TouchableOpacity>
              ))}
              
              {/* Add button for this priority level */}
              {focusByLevel.supplemental.length < PRIORITY_LIMITS.supplemental && (
                <TouchableOpacity 
                  style={[styles.addButton, { borderColor: PRIORITY_COLORS.supplemental }]}
                  onPress={() => {
                    setNewFocusPriority('supplemental');
                    setIsAddingFocus(true);
                  }}
                >
                  <Ionicons name="add-circle-outline" size={20} color={PRIORITY_COLORS.supplemental} />
                  <Text style={[styles.addButtonText, { color: PRIORITY_COLORS.supplemental }]}>
                    Add Supplemental Focus Area
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
        
        {/* Add Focus Area Modal */}
        <Modal
          visible={isAddingFocus}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setIsAddingFocus(false);
            setNewFocusTitle('');
            setNewFocusNotes('');
            setNewFocusPriority('important');
            setNewFocusCategoryIds([]);
          }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContainer, isDarkMode ? styles.darkModalContainer : styles.lightModalContainer]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, isDarkMode ? styles.lightText : styles.darkText]}>
                    Add Focus Area
                  </Text>
                  <TouchableOpacity onPress={() => setIsAddingFocus(false)}>
                    <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#000"} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalContent}>
                  {/* Title input */}
                  <Text style={[styles.inputLabel, isDarkMode ? styles.lightText : styles.darkText]}>Title</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      isDarkMode ? styles.darkTextInput : styles.lightTextInput
                    ]}
                    value={newFocusTitle}
                    onChangeText={setNewFocusTitle}
                    placeholder="What do you want to focus on?"
                    placeholderTextColor={isDarkMode ? "#777" : "#999"}
                  />
                  
                  {/* Priority level selection */}
                  <Text style={[styles.inputLabel, isDarkMode ? styles.lightText : styles.darkText]}>Priority Level</Text>
                  <View style={styles.priorityOptions}>
                    <Pressable
                      style={[
                        styles.priorityOption,
                        newFocusPriority === 'essential' && styles.priorityOptionSelected,
                        newFocusPriority === 'essential' && { borderColor: PRIORITY_COLORS.essential }
                      ]}
                      onPress={() => setNewFocusPriority('essential')}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        newFocusPriority === 'essential' && { color: PRIORITY_COLORS.essential, fontWeight: '600' }
                      ]}>Essential</Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.priorityOption,
                        newFocusPriority === 'important' && styles.priorityOptionSelected,
                        newFocusPriority === 'important' && { borderColor: PRIORITY_COLORS.important }
                      ]}
                      onPress={() => setNewFocusPriority('important')}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        newFocusPriority === 'important' && { color: PRIORITY_COLORS.important, fontWeight: '600' }
                      ]}>Important</Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.priorityOption,
                        newFocusPriority === 'supplemental' && styles.priorityOptionSelected,
                        newFocusPriority === 'supplemental' && { borderColor: PRIORITY_COLORS.supplemental }
                      ]}
                      onPress={() => setNewFocusPriority('supplemental')}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        newFocusPriority === 'supplemental' && { color: PRIORITY_COLORS.supplemental, fontWeight: '600' }
                      ]}>Supplemental</Text>
                    </Pressable>
                  </View>
                  
                  {/* Priority description */}
                  <Text style={[styles.priorityDescription, isDarkMode ? styles.lightText : styles.darkText]}>
                    {PRIORITY_DESCRIPTIONS[newFocusPriority]}
                  </Text>
                  
                  {/* Notes input */}
                  <Text style={[styles.inputLabel, isDarkMode ? styles.lightText : styles.darkText]}>Notes (Optional)</Text>
                  <TextInput
                    style={[
                      styles.textAreaInput,
                      isDarkMode ? styles.darkTextInput : styles.lightTextInput
                    ]}
                    value={newFocusNotes}
                    onChangeText={setNewFocusNotes}
                    placeholder="Add any additional notes or context..."
                    placeholderTextColor={isDarkMode ? "#777" : "#999"}
                    multiline={true}
                    numberOfLines={4}
                  />
                  
                  {/* Categories selector */}
                  <Text style={[styles.inputLabel, isDarkMode ? styles.lightText : styles.darkText]}>Categories (Optional)</Text>
                  <CategorySelector 
                    selectedIds={newFocusCategoryIds}
                    onChange={setNewFocusCategoryIds}
                  />
                  
                  {/* Action buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => {
                        setIsAddingFocus(false);
                        setNewFocusTitle('');
                        setNewFocusNotes('');
                        setNewFocusPriority('important');
                        setNewFocusCategoryIds([]);
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.saveButton,
                        !newFocusTitle.trim() && styles.saveButtonDisabled
                      ]}
                      onPress={handleAddFocus}
                      disabled={!newFocusTitle.trim()}
                    >
                      <Text style={styles.saveButtonText}>Add Focus Area</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        
        {/* Edit Focus Area Modal */}
        <Modal
          visible={!!editingFocus}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCancelEdit}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContainer, isDarkMode ? styles.darkModalContainer : styles.lightModalContainer]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, isDarkMode ? styles.lightText : styles.darkText]}>
                    Edit Focus Area
                  </Text>
                  <TouchableOpacity onPress={handleCancelEdit}>
                    <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#000"} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalContent}>
                  {/* Title display (non-editable) */}
                  <Text style={[styles.inputLabel, isDarkMode ? styles.lightText : styles.darkText]}>Title</Text>
                  <View style={[
                    styles.nonEditableField,
                    isDarkMode ? styles.darkNonEditableField : styles.lightNonEditableField
                  ]}>
                    <Text style={[styles.nonEditableText, isDarkMode ? styles.lightText : styles.darkText]}>
                      {editingFocus?.name}
                    </Text>
                  </View>
                  
                  {/* Priority level selection */}
                  <Text style={[styles.inputLabel, isDarkMode ? styles.lightText : styles.darkText]}>Priority Level</Text>
                  <View style={styles.priorityOptions}>
                    <Pressable
                      style={[
                        styles.priorityOption,
                        editingFocusPriority === 'essential' && styles.priorityOptionSelected,
                        editingFocusPriority === 'essential' && { borderColor: PRIORITY_COLORS.essential }
                      ]}
                      onPress={() => setEditingFocusPriority('essential')}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        editingFocusPriority === 'essential' && { color: PRIORITY_COLORS.essential, fontWeight: '600' }
                      ]}>Essential</Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.priorityOption,
                        editingFocusPriority === 'important' && styles.priorityOptionSelected,
                        editingFocusPriority === 'important' && { borderColor: PRIORITY_COLORS.important }
                      ]}
                      onPress={() => setEditingFocusPriority('important')}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        editingFocusPriority === 'important' && { color: PRIORITY_COLORS.important, fontWeight: '600' }
                      ]}>Important</Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.priorityOption,
                        editingFocusPriority === 'supplemental' && styles.priorityOptionSelected,
                        editingFocusPriority === 'supplemental' && { borderColor: PRIORITY_COLORS.supplemental }
                      ]}
                      onPress={() => setEditingFocusPriority('supplemental')}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        editingFocusPriority === 'supplemental' && { color: PRIORITY_COLORS.supplemental, fontWeight: '600' }
                      ]}>Supplemental</Text>
                    </Pressable>
                  </View>
                  
                  {/* Priority description */}
                  <Text style={[styles.priorityDescription, isDarkMode ? styles.lightText : styles.darkText]}>
                    {PRIORITY_DESCRIPTIONS[editingFocusPriority]}
                  </Text>
                  
                  {/* Notes input */}
                  <Text style={[styles.inputLabel, isDarkMode ? styles.lightText : styles.darkText]}>Notes (Optional)</Text>
                  <TextInput
                    style={[
                      styles.textAreaInput,
                      isDarkMode ? styles.darkTextInput : styles.lightTextInput
                    ]}
                    value={editingFocusNotes}
                    onChangeText={setEditingFocusNotes}
                    placeholder="Add any additional notes or context..."
                    placeholderTextColor={isDarkMode ? "#777" : "#999"}
                    multiline={true}
                    numberOfLines={4}
                  />
                  
                  {/* Categories selector */}
                  <Text style={[styles.inputLabel, isDarkMode ? styles.lightText : styles.darkText]}>Categories (Optional)</Text>
                  <CategorySelector 
                    selectedIds={editingFocusCategoryIds}
                    onChange={setEditingFocusCategoryIds}
                  />
                  
                  {/* Action buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => editingFocus && handleDeleteFocus(editingFocus)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={handleCancelEdit}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleSaveEdit}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Focus Area Detail View */}
        {isDetailViewOpen && selectedFocusArea && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isDetailViewOpen}
            onRequestClose={closeDetailView}
          >
            <View style={styles.detailViewModalContainer}>
              <FocusAreaDetailView 
                focusArea={selectedFocusArea} 
                onEdit={() => handleEditFocusFromDetail(selectedFocusArea)} 
                onClose={closeDetailView} 
              />
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// Extract styles to a separate function to avoid hooks inside the render function
function getStyles(isDarkMode: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    darkContainer: {
      backgroundColor: '#000000',
    },
    lightContainer: {
      backgroundColor: '#F2F2F7',
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333333' : '#DDDDDD',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: 80,
    },
    stackContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    prioritySection: {
      marginBottom: 24,
    },
    prioritySectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    priorityBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    priorityBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    limitText: {
      fontSize: 12,
      color: isDarkMode ? '#999' : '#666',
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderRadius: 16,
      paddingVertical: 12,
      marginTop: 8,
    },
    addButtonText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '500',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '90%',
      maxHeight: '80%',
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    darkModalContainer: {
      backgroundColor: '#1C1C1E',
    },
    lightModalContainer: {
      backgroundColor: '#FFFFFF',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#E5E5EA',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    modalContent: {
      padding: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
      fontSize: 16,
    },
    textAreaInput: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
      fontSize: 16,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    darkTextInput: {
      backgroundColor: '#2C2C2E',
      borderColor: '#3A3A3C',
      color: '#FFFFFF',
    },
    lightTextInput: {
      backgroundColor: '#FFFFFF',
      borderColor: '#DDDDDD',
      color: '#000000',
    },
    nonEditableField: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
    },
    darkNonEditableField: {
      backgroundColor: '#2C2C2E',
      borderColor: '#3A3A3C',
    },
    lightNonEditableField: {
      backgroundColor: '#F2F2F7',
      borderColor: '#DDDDDD',
    },
    nonEditableText: {
      fontSize: 16,
    },
    priorityOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    priorityOption: {
      flex: 1,
      padding: 12,
      borderWidth: 1,
      borderColor: '#8E8E93',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    },
    priorityOptionSelected: {
      borderWidth: 2,
    },
    priorityOptionText: {
      fontSize: 14,
      color: '#8E8E93',
    },
    priorityDescription: {
      fontSize: 12,
      opacity: 0.7,
      marginBottom: 16,
      fontStyle: 'italic',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      marginBottom: 32,
    },
    saveButton: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    saveButtonDisabled: {
      backgroundColor: '#007AFF80',
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: 'rgba(142, 142, 147, 0.12)',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
      flex: 1,
    },
    cancelButtonText: {
      color: '#8E8E93',
      fontSize: 16,
      fontWeight: '500',
    },
    deleteButton: {
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    deleteButtonText: {
      color: '#FF3B30',
      fontSize: 16,
      fontWeight: '500',
    },
    detailViewModalContainer: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    lightText: {
      color: '#FFFFFF',
    },
    darkText: {
      color: '#000000',
    },
  });
} 