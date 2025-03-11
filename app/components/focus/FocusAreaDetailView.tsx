import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Modal,
  Alert,
  useColorScheme,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { FocusArea, PriorityLevel, ContentType, ContentItem } from '../../types';
import { useContentManagement } from '../../hooks/useContentManagement';

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

interface FocusAreaDetailViewProps {
  focusArea: FocusArea;
  onEdit: () => void;
  onClose: () => void;
}

export default function FocusAreaDetailView({ focusArea, onEdit, onClose }: FocusAreaDetailViewProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { getGoals, addContentItem } = useContentManagement();
  
  // State for goal creation
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState<Date | null>(null);
  
  // State for date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Get goals for this focus area
  const goals = getGoals().filter(goal => goal.focusAreaId === focusArea.id);
  const activeGoals = goals.filter(goal => !goal.isCompleted);
  const completedGoals = goals.filter(goal => goal.isCompleted);

  // Calculate progress
  const totalGoals = goals.length;
  const completionPercentage = totalGoals > 0 
    ? Math.round((completedGoals.length / totalGoals) * 100)
    : 0;
    
  // Handle adding a new goal
  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }
    
    // Create a new goal connected to this focus area
    const newGoal: Omit<ContentItem, 'id'> = {
      title: newGoalTitle.trim(),
      type: 'goal' as ContentType,
      date: new Date().toISOString().split('T')[0],
      focusAreaId: focusArea.id,
      progress: 0,
      isCompleted: false,
      deadline: newGoalDeadline ? newGoalDeadline.toISOString().split('T')[0] : undefined
    };
    
    // Add the goal
    addContentItem(newGoal);
    
    // Reset form and close modal
    setNewGoalTitle('');
    setNewGoalDeadline(null);
    setIsAddingGoal(false);
    
    // Show confirmation
    Alert.alert('Success', 'Goal added successfully');
  };
  
  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Handle date change from picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep visible on iOS
    if (selectedDate) {
      setNewGoalDeadline(selectedDate);
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
        {/* Header with back button, title, and edit button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, isDarkMode ? styles.lightText : styles.darkText]}>
            {focusArea.name}
          </Text>
          
          <TouchableOpacity onPress={onEdit} style={styles.headerButton}>
            <Ionicons name="pencil" size={22} color={isDarkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Focus area overview card */}
          <View style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <View style={styles.focusHeader}>
              <View style={[styles.colorIndicator, { backgroundColor: focusArea.color }]} />
              <View style={styles.focusInfo}>
                <Text style={[styles.focusName, isDarkMode ? styles.lightText : styles.darkText]}>
                  {focusArea.name}
                </Text>
                <View style={styles.priorityBadge}>
                  <Text style={[styles.priorityText, { color: PRIORITY_COLORS[focusArea.priorityLevel] }]}>
                    {focusArea.priorityLevel.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.priorityIndicator}>
                <Ionicons 
                  name={focusArea.status === 'active' ? 'star' : 'star-outline'} 
                  size={22} 
                  color={PRIORITY_COLORS[focusArea.priorityLevel]} 
                />
                <Text style={[styles.statusLabel, isDarkMode ? styles.lightText : styles.darkText]}>
                  {focusArea.status === 'active' ? 'Active' : 'Dormant'}
                </Text>
              </View>
            </View>
            
            {/* Progress bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, isDarkMode ? styles.lightText : styles.darkText]}>
                  Goal Progress
                </Text>
                <Text style={[styles.progressPercentage, isDarkMode ? styles.lightText : styles.darkText]}>
                  {completionPercentage}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${completionPercentage}%`, backgroundColor: focusArea.color }
                  ]} 
                />
              </View>
              <View style={styles.progressStats}>
                <Text style={[styles.statsText, isDarkMode ? styles.lightText : styles.darkText]}>
                  {completedGoals.length} completed
                </Text>
                <Text style={[styles.statsText, isDarkMode ? styles.lightText : styles.darkText]}>
                  {activeGoals.length} in progress
                </Text>
                <Text style={[styles.statsText, isDarkMode ? styles.lightText : styles.darkText]}>
                  {totalGoals} total
                </Text>
              </View>
            </View>
            
            {/* Description */}
            {focusArea.description && (
              <View style={styles.descriptionSection}>
                <Text style={[styles.descriptionText, isDarkMode ? styles.lightText : styles.darkText]}>
                  {focusArea.description}
                </Text>
              </View>
            )}
          </View>
          
          {/* Goals section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDarkMode ? styles.lightText : styles.darkText]}>
                Goals
              </Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setIsAddingGoal(true)}
              >
                <Ionicons name="add-circle" size={20} color="#007AFF" />
                <Text style={styles.addButtonText}>Add Goal</Text>
              </TouchableOpacity>
            </View>
            
            {activeGoals.length > 0 ? (
              <View style={styles.goalsList}>
                {activeGoals.map(goal => (
                  <View 
                    key={goal.id} 
                    style={[styles.goalCard, isDarkMode ? styles.darkCard : styles.lightCard]}
                  >
                    <View style={styles.goalHeader}>
                      <Text style={[styles.goalTitle, isDarkMode ? styles.lightText : styles.darkText]}>
                        {goal.title}
                      </Text>
                      {goal.deadline && (
                        <View style={styles.deadline}>
                          <Ionicons name="calendar-outline" size={14} color={isDarkMode ? "#ccc" : "#666"} />
                          <Text style={[styles.deadlineText, isDarkMode ? styles.lightText : styles.darkText]}>
                            {new Date(goal.deadline).toLocaleDateString()}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.goalProgress}>
                      <View style={styles.goalProgressBar}>
                        <View 
                          style={[
                            styles.goalProgressFill,
                            { width: `${goal.progress || 0}%`, backgroundColor: focusArea.color }
                          ]}
                        />
                      </View>
                      <Text style={[styles.goalProgressText, isDarkMode ? styles.lightText : styles.darkText]}>
                        {goal.progress || 0}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={[styles.emptyState, isDarkMode ? styles.darkCard : styles.lightCard]}>
                <Ionicons name="flag-outline" size={32} color={isDarkMode ? "#666" : "#999"} />
                <Text style={[styles.emptyStateText, isDarkMode ? styles.lightText : styles.darkText]}>
                  No goals yet for this focus area
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => setIsAddingGoal(true)}
                >
                  <Text style={styles.emptyStateButtonText}>Create your first goal</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {completedGoals.length > 0 && (
              <View style={styles.completedSection}>
                <View style={styles.completedHeader}>
                  <Text style={[styles.completedTitle, isDarkMode ? styles.lightText : styles.darkText]}>
                    Completed Goals
                  </Text>
                  <Text style={[styles.completedCount, isDarkMode ? styles.lightText : styles.darkText]}>
                    {completedGoals.length}
                  </Text>
                </View>
                
                <View style={styles.goalsList}>
                  {completedGoals.slice(0, 3).map(goal => (
                    <View 
                      key={goal.id} 
                      style={[styles.goalCard, isDarkMode ? styles.darkCard : styles.lightCard, styles.completedGoal]}
                    >
                      <View style={styles.goalHeader}>
                        <Text style={[styles.goalTitle, styles.completedGoalText, isDarkMode ? styles.lightText : styles.darkText]}>
                          {goal.title}
                        </Text>
                        <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                      </View>
                    </View>
                  ))}
                  
                  {completedGoals.length > 3 && (
                    <TouchableOpacity style={styles.viewMoreButton}>
                      <Text style={styles.viewMoreText}>
                        View {completedGoals.length - 3} more completed goals
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
          
          {/* Add some space at the bottom for better scrolling */}
          <View style={{ height: 40 }} />
        </ScrollView>
        
        {/* Add Goal Modal */}
        <Modal
          visible={isAddingGoal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsAddingGoal(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, isDarkMode ? styles.darkCard : styles.lightCard]}>
                <Text style={[styles.modalTitle, isDarkMode ? styles.lightText : styles.darkText]}>
                  Add New Goal
                </Text>
                
                <Text style={[styles.formLabel, isDarkMode ? styles.lightText : styles.darkText]}>
                  Goal Title
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    isDarkMode ? styles.darkInput : styles.lightInput
                  ]}
                  value={newGoalTitle}
                  onChangeText={setNewGoalTitle}
                  placeholder="What do you want to achieve?"
                  placeholderTextColor={isDarkMode ? "#666" : "#999"}
                />
                
                <Text style={[styles.formLabel, isDarkMode ? styles.lightText : styles.darkText]}>
                  Deadline (Optional)
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.datePickerButton,
                    isDarkMode ? styles.darkInput : styles.lightInput
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={[
                    newGoalDeadline ? styles.dateText : styles.placeholderText, 
                    isDarkMode ? styles.lightText : styles.darkText
                  ]}>
                    {newGoalDeadline ? formatDate(newGoalDeadline) : "Select a deadline"}
                  </Text>
                  <Ionicons 
                    name="calendar-outline" 
                    size={20} 
                    color={isDarkMode ? "#ccc" : "#777"} 
                  />
                </TouchableOpacity>
                
                {showDatePicker && (
                  <DateTimePicker
                    value={newGoalDeadline || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    style={styles.datePicker}
                    textColor={isDarkMode ? "#fff" : undefined}
                    accentColor={PRIORITY_COLORS[focusArea.priorityLevel]}
                  />
                )}
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => {
                      setIsAddingGoal(false);
                      setNewGoalTitle('');
                      setNewGoalDeadline(null);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.addGoalButton,
                      !newGoalTitle.trim() && styles.addGoalButtonDisabled
                    ]}
                    onPress={handleAddGoal}
                    disabled={!newGoalTitle.trim()}
                  >
                    <Text style={styles.addGoalButtonText}>Add Goal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50, // Add space for status bar
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  focusInfo: {
    flex: 1,
  },
  focusName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityIndicator: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 12,
    opacity: 0.7,
  },
  descriptionSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  addButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  goalsList: {
    marginBottom: 16,
  },
  goalCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  deadlineText: {
    fontSize: 12,
    marginLeft: 4,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  goalProgressText: {
    fontSize: 12,
    width: 30,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  completedSection: {
    marginTop: 24,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  completedCount: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  completedGoal: {
    opacity: 0.8,
  },
  completedGoalText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewMoreText: {
    color: '#007AFF',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  darkInput: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
    color: '#FFFFFF',
  },
  lightInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5EA',
    color: '#000000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  cancelButtonText: {
    color: '#8E8E93',
    fontWeight: '500',
  },
  addGoalButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  addGoalButtonDisabled: {
    backgroundColor: 'rgba(0, 122, 255, 0.5)',
  },
  addGoalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  lightText: {
    color: '#FFFFFF',
  },
  darkText: {
    color: '#000000',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 16,
    opacity: 0.5,
  },
  datePicker: {
    marginBottom: 16,
    width: '100%',
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'white',
  },
}); 