import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Pressable,
  Alert,
  ScrollView,
  TextInput,
  useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusAreas } from '../../hooks/useFocusAreas';
import { FocusArea, PriorityLevel } from '../../types';
import * as Haptics from 'expo-haptics';

// Priority level colors
const PRIORITY_COLORS = {
  essential: '#ffd700', // Gold/Amber
  important: '#47a9ff', // Royal Blue
  supplemental: '#cd602a', // Bronze/Copper
};

// Priority level descriptions
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
  
  // Get color scheme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // States for adding a new focus area
  const [isAddingFocus, setIsAddingFocus] = useState(false);
  const [newFocusTitle, setNewFocusTitle] = useState('');
  const [newFocusPriority, setNewFocusPriority] = useState<PriorityLevel>('important');
  
  // Handle adding a new focus area
  const handleAddFocus = () => {
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
    addFocusArea({
      name: newFocusTitle.trim(),
      color: getPresetColor(),
      priorityLevel: newFocusPriority,
      rank: focusByLevel[newFocusPriority].length + 1
    });
    
    // Clear the form
    setNewFocusTitle('');
    setNewFocusPriority('important');
    setIsAddingFocus(false);
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  // Handle deleting a focus area
  const handleDeleteFocus = (area: FocusArea) => {
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
  };

  // Render focus areas grouped by priority
  const renderFocusAreasByPriority = () => {
    return Object.entries(focusByLevel).map(([priority, areas]) => (
      <View key={priority} style={styles.prioritySection}>
        <View style={styles.prioritySectionHeader}>
          <View style={[
            styles.priorityBadge, 
            { backgroundColor: PRIORITY_COLORS[priority as PriorityLevel] + '40' }
          ]}>
            <Text style={[
              styles.priorityBadgeText, 
              { color: PRIORITY_COLORS[priority as PriorityLevel] }
            ]}>
              {priority.toUpperCase()}
            </Text>
          </View>
          
          {areas.length >= PRIORITY_LIMITS[priority as PriorityLevel] && (
            <Text style={styles.limitText}>
              Limit: {areas.length}/{PRIORITY_LIMITS[priority as PriorityLevel]}
            </Text>
          )}
        </View>
        
        <Text style={styles.priorityDescription}>
          {PRIORITY_DESCRIPTIONS[priority as PriorityLevel]}
        </Text>
        
        {areas.map((area) => (
          <View key={area.id} style={[
            styles.focusItem,
            isDarkMode ? styles.darkFocusItem : styles.lightFocusItem,
            { borderColor: area.color }
          ]}>
            <View style={styles.focusItemHeader}>
              <View style={[styles.focusColor, { backgroundColor: area.color }]} />
              <Text style={[
                styles.focusName,
                isDarkMode ? styles.lightText : styles.darkText
              ]}>
                {area.name}
              </Text>
              <TouchableOpacity
                onPress={() => handleDeleteFocus(area)}
                style={styles.deleteButton}
              >
                <Ionicons 
                  name="trash-outline" 
                  size={20} 
                  color={isDarkMode ? "#FF453A" : "#FF3B30"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {/* Add button for this priority level */}
        {areas.length < PRIORITY_LIMITS[priority as PriorityLevel] && (
          <TouchableOpacity 
            style={[
              styles.addPriorityButton, 
              { borderColor: PRIORITY_COLORS[priority as PriorityLevel] }
            ]}
            onPress={() => {
              setNewFocusPriority(priority as PriorityLevel);
              setIsAddingFocus(true);
            }}
          >
            <Ionicons 
              name="add-circle-outline" 
              size={20} 
              color={PRIORITY_COLORS[priority as PriorityLevel]} 
            />
            <Text style={[
              styles.addPriorityButtonText, 
              { color: PRIORITY_COLORS[priority as PriorityLevel] }
            ]}>
              Add {priority.charAt(0).toUpperCase() + priority.slice(1)} Focus Area
            </Text>
          </TouchableOpacity>
        )}
      </View>
    ));
  };

  return (
    <View style={[
      styles.container,
      isDarkMode ? styles.darkContainer : styles.lightContainer
    ]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {renderFocusAreasByPriority()}
      </ScrollView>
      
      {/* Add Focus Area Modal */}
      {isAddingFocus && (
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            isDarkMode ? styles.darkModalContent : styles.lightModalContent
          ]}>
            <Text style={[
              styles.modalTitle,
              isDarkMode ? styles.lightText : styles.darkText
            ]}>
              New Focus Area
            </Text>
            
            <TextInput
              style={[
                styles.input,
                isDarkMode ? styles.darkInput : styles.lightInput
              ]}
              placeholder="Focus Area Name"
              placeholderTextColor={isDarkMode ? "#8E8E93" : "#8E8E93"}
              value={newFocusTitle}
              onChangeText={setNewFocusTitle}
            />
            
            <View style={styles.priorityButtons}>
              {Object.keys(PRIORITY_COLORS).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    newFocusPriority === priority && styles.priorityButtonActive,
                    { borderColor: PRIORITY_COLORS[priority as PriorityLevel] }
                  ]}
                  onPress={() => setNewFocusPriority(priority as PriorityLevel)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    newFocusPriority === priority && styles.priorityButtonTextActive,
                    newFocusPriority === priority && { color: PRIORITY_COLORS[priority as PriorityLevel] }
                  ]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsAddingFocus(false);
                  setNewFocusTitle('');
                  setNewFocusPriority('important');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddFocus}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
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
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  prioritySection: {
    marginBottom: 24,
  },
  prioritySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  limitText: {
    fontSize: 12,
    color: '#FF453A',
    fontWeight: '500',
  },
  priorityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  priorityDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  focusItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkFocusItem: {
    backgroundColor: '#2C2C2E',
  },
  lightFocusItem: {
    backgroundColor: '#FFFFFF',
  },
  focusItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  focusContent: {
    flex: 1,
  },
  focusName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  lightText: {
    color: '#FFFFFF',
  },
  darkText: {
    color: '#000000',
  },
  deleteButton: {
    padding: 4,
  },
  addPriorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  addPriorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  darkModalContent: {
    backgroundColor: '#2C2C2E',
  },
  lightModalContent: {
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  darkInput: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
  },
  lightInput: {
    backgroundColor: '#F2F2F7',
    color: '#000000',
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  priorityButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  priorityButtonText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  priorityButtonTextActive: {
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#3A3A3C',
  },
  cancelButtonText: {
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#0A84FF',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 