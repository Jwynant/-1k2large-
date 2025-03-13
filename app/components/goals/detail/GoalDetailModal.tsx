import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import { ContentItem, FocusArea, SubGoal } from '../../../types';
import { useContentManagement } from '../../../hooks/useContentManagement';
import { useFocusAreas } from '../../../hooks/useFocusAreas';
import GoalProgressCircle from './GoalProgressCircle';
import GoalMilestonesList from './GoalMilestonesList';
import GoalTimelineIndicator from './GoalTimelineIndicator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GoalDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  goal: ContentItem;
}

export default function GoalDetailModal({ 
  isVisible, 
  onClose, 
  goal 
}: GoalDetailModalProps) {
  const router = useRouter();
  const { updateContentItem, deleteContentItem } = useContentManagement();
  const { focusAreas } = useFocusAreas();
  
  // Get focus area if available
  const focusArea = goal.focusAreaId 
    ? focusAreas.find(area => area.id === goal.focusAreaId) 
    : undefined;
  
  // State for goal progress
  const [progress, setProgress] = useState(goal.progress || 0);
  
  // State for milestones
  const [milestones, setMilestones] = useState<SubGoal[]>(goal.milestones || []);
  
  // Calculate deadline status
  const getDeadlineStatus = useCallback(() => {
    if (!goal.deadline) return null;
    
    const deadlineDate = new Date(goal.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isBefore(deadlineDate, today)) {
      return { text: 'Overdue', color: '#FF453A' };
    }
    
    const daysUntil = differenceInDays(deadlineDate, today);
    
    if (daysUntil === 0) {
      return { text: 'Due today', color: '#FF9F0A' };
    } else if (daysUntil === 1) {
      return { text: 'Due tomorrow', color: '#FF9F0A' };
    } else if (daysUntil <= 7) {
      return { text: `Due in ${daysUntil} days`, color: '#FF9F0A' };
    } else if (daysUntil <= 30) {
      return { text: `Due in ${Math.floor(daysUntil / 7)} weeks`, color: '#30D158' };
    } else {
      return { text: `Due in ${Math.floor(daysUntil / 30)} months`, color: '#30D158' };
    }
  }, [goal.deadline]);
  
  const deadlineStatus = goal.deadline ? getDeadlineStatus() : null;
  
  // Handle milestone toggle
  const handleToggleMilestone = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const updatedMilestones = milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, isCompleted: !milestone.isCompleted } 
        : milestone
    );
    
    setMilestones(updatedMilestones);
    
    // Calculate new progress based on completed milestones
    const completedCount = updatedMilestones.filter(m => m.isCompleted).length;
    const newProgress = updatedMilestones.length > 0 
      ? Math.round((completedCount / updatedMilestones.length) * 100) 
      : progress;
    
    setProgress(newProgress);
    
    // Update the goal
    updateContentItem({
      ...goal,
      milestones: updatedMilestones,
      progress: newProgress
    });
  }, [milestones, progress, goal, updateContentItem]);
  
  // Handle complete goal
  const handleCompleteGoal = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Mark all milestones as completed
    const completedMilestones = milestones.map(milestone => ({
      ...milestone,
      isCompleted: true
    }));
    
    setMilestones(completedMilestones);
    setProgress(100);
    
    // Update the goal
    updateContentItem({
      ...goal,
      milestones: completedMilestones,
      progress: 100,
      isCompleted: true
    });
    
    // Show success message
    Alert.alert(
      'Goal Completed',
      'Congratulations on completing your goal!',
      [{ text: 'OK', onPress: onClose }]
    );
  }, [goal, milestones, updateContentItem, onClose]);
  
  // Handle edit goal
  const handleEditGoal = useCallback(() => {
    onClose();
    
    // Navigate to edit goal screen
    setTimeout(() => {
      router.push({
        pathname: '/content/goal',
        params: { id: goal.id, edit: 'true' }
      });
    }, 300);
  }, [goal.id, router, onClose]);
  
  // Handle delete goal
  const handleDeleteGoal = useCallback(() => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteContentItem(goal.id);
            onClose();
          }
        }
      ]
    );
  }, [goal.id, deleteContentItem, onClose]);
  
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Goal Details</Text>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={handleEditGoal}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="pencil" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Goal Title and Focus Area */}
            <View style={[
              styles.titleContainer,
              focusArea && { borderLeftColor: focusArea.color }
            ]}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              
              {focusArea && (
                <View style={styles.focusAreaTag}>
                  <View style={[styles.focusAreaDot, { backgroundColor: focusArea.color }]} />
                  <Text style={styles.focusAreaName}>{focusArea.name}</Text>
                </View>
              )}
            </View>
            
            {/* Progress and Deadline Section */}
            <View style={styles.progressSection}>
              <GoalProgressCircle 
                progress={progress} 
                size={100} 
                color={focusArea?.color || '#0A84FF'} 
              />
              
              <View style={styles.deadlineContainer}>
                {goal.deadline ? (
                  <>
                    <Text style={styles.deadlineLabel}>Deadline</Text>
                    <Text style={styles.deadlineDate}>
                      {format(new Date(goal.deadline), 'MMMM d, yyyy')}
                    </Text>
                    
                    {deadlineStatus && (
                      <View style={[
                        styles.deadlineStatus, 
                        { backgroundColor: `${deadlineStatus.color}20` }
                      ]}>
                        <Text style={[
                          styles.deadlineStatusText, 
                          { color: deadlineStatus.color }
                        ]}>
                          {deadlineStatus.text}
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <Text style={styles.noDeadline}>No deadline set</Text>
                )}
              </View>
            </View>
            
            {/* Timeline Indicator */}
            {goal.deadline && (
              <GoalTimelineIndicator 
                startDate={new Date(goal.date)} 
                endDate={new Date(goal.deadline)} 
                progress={progress} 
                color={focusArea?.color || '#0A84FF'} 
              />
            )}
            
            {/* Notes Section */}
            {goal.notes && goal.notes.trim() !== '' && (
              <View style={styles.notesContainer}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <View style={styles.notesContent}>
                  <Text style={styles.notesText}>{goal.notes}</Text>
                </View>
              </View>
            )}
            
            {/* Milestones Section */}
            <View style={styles.milestonesContainer}>
              <Text style={styles.sectionTitle}>Milestones</Text>
              
              {milestones.length > 0 ? (
                <GoalMilestonesList 
                  milestones={milestones} 
                  onToggle={handleToggleMilestone} 
                  accentColor={focusArea?.color || '#0A84FF'} 
                />
              ) : (
                <View style={styles.emptyMilestones}>
                  <Ionicons name="list-outline" size={24} color="#8E8E93" />
                  <Text style={styles.emptyMilestonesText}>
                    No milestones added
                  </Text>
                </View>
              )}
            </View>
            
            {/* Created Date */}
            <View style={styles.createdContainer}>
              <Text style={styles.createdText}>
                Created on {format(new Date(goal.date), 'MMMM d, yyyy')}
              </Text>
            </View>
          </ScrollView>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {!goal.isCompleted && (
              <TouchableOpacity 
                style={[
                  styles.completeButton,
                  { backgroundColor: focusArea?.color || '#0A84FF' }
                ]} 
                onPress={handleCompleteGoal}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.completeButtonText}>Complete Goal</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDeleteGoal}
            >
              <Ionicons name="trash-outline" size={20} color="#FF453A" />
              <Text style={styles.deleteButtonText}>Delete Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  editButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  titleContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8E8E93',
  },
  goalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  focusAreaTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusAreaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  focusAreaName: {
    fontSize: 14,
    color: '#AEAEB2',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  deadlineContainer: {
    flex: 1,
    marginLeft: 16,
  },
  deadlineLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  deadlineDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  deadlineStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deadlineStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noDeadline: {
    fontSize: 16,
    color: '#8E8E93',
  },
  notesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  notesContent: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
  },
  notesText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  milestonesContainer: {
    marginBottom: 16,
  },
  emptyMilestones: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMilestonesText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
  },
  createdContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  createdText: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  actionButtons: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF453A',
    marginLeft: 8,
  },
}); 