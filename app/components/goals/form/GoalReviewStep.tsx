import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInDays } from 'date-fns';
import { FocusArea } from '../../../types';

type Milestone = {
  id: string;
  title: string;
  isCompleted: boolean;
};

type FormState = {
  title: string;
  notes: string;
  focusAreaId: string;
  deadline: Date | null;
  progress: number;
  isCompleted: boolean;
  milestones: Milestone[];
};

interface GoalReviewStepProps {
  formState: FormState;
  focusAreas: FocusArea[];
}

export default function GoalReviewStep({ 
  formState,
  focusAreas
}: GoalReviewStepProps) {
  const focusArea = formState.focusAreaId ? focusAreas.find(area => area.id === formState.focusAreaId) : null;
  
  // Calculate time until deadline
  const getTimeUntilDeadline = () => {
    if (!formState.deadline) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysUntil = differenceInDays(formState.deadline, today);
    
    if (daysUntil < 0) {
      return { text: 'Past deadline', color: '#FF453A' };
    } else if (daysUntil === 0) {
      return { text: 'Today', color: '#FF9F0A' };
    } else if (daysUntil <= 7) {
      return { text: `${daysUntil} day${daysUntil === 1 ? '' : 's'} from now`, color: '#FF9F0A' };
    } else if (daysUntil <= 30) {
      return { text: `${Math.floor(daysUntil / 7)} week${Math.floor(daysUntil / 7) === 1 ? '' : 's'} from now`, color: '#30D158' };
    } else {
      return { text: `${Math.floor(daysUntil / 30)} month${Math.floor(daysUntil / 30) === 1 ? '' : 's'} from now`, color: '#30D158' };
    }
  };
  
  const timeUntilDeadline = formState.deadline ? getTimeUntilDeadline() : null;
  
  // Get motivational message based on milestones
  const getMotivationalMessage = () => {
    if (formState.milestones.length === 0) {
      return "You're ready to start your journey!";
    } else if (formState.milestones.length <= 2) {
      return "Great start! Breaking down your goal will help you succeed.";
    } else if (formState.milestones.length <= 5) {
      return "Excellent planning! You've created a clear path to success.";
    } else {
      return "Impressive preparation! Your detailed plan shows commitment.";
    }
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Review your goal</Text>
      
      <View style={styles.goalCard}>
        <View style={[
          styles.goalHeader, 
          focusArea ? { borderLeftColor: focusArea.color } : { borderLeftColor: '#8E8E93' }
        ]}>
          <Text style={styles.goalTitle}>{formState.title}</Text>
          {focusArea ? (
            <View style={styles.focusAreaTag}>
              <View style={[styles.focusAreaDot, { backgroundColor: focusArea.color }]} />
              <Text style={styles.focusAreaName}>{focusArea.name}</Text>
            </View>
          ) : (
            <Text style={styles.noFocusArea}>No focus area selected</Text>
          )}
        </View>
        
        <View style={styles.goalBody}>
          {/* Deadline Section */}
          {formState.deadline && (
            <View style={styles.goalSection}>
              <View style={styles.goalSectionHeader}>
                <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
                <Text style={styles.goalSectionTitle}>Deadline</Text>
              </View>
              <View style={styles.deadlineContainer}>
                <Text style={styles.deadlineDate}>
                  {format(formState.deadline, 'EEEE, MMMM d, yyyy')}
                </Text>
                {timeUntilDeadline && (
                  <View style={[styles.deadlineTag, { backgroundColor: `${timeUntilDeadline.color}20` }]}>
                    <Text style={[styles.deadlineTagText, { color: timeUntilDeadline.color }]}>
                      {timeUntilDeadline.text}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
          
          {/* Notes Section */}
          {formState.notes ? (
            <View style={styles.goalSection}>
              <View style={styles.goalSectionHeader}>
                <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
                <Text style={styles.goalSectionTitle}>Notes</Text>
              </View>
              <Text style={styles.goalNotes}>
                {formState.notes}
              </Text>
            </View>
          ) : null}
          
          {/* Milestones Section */}
          {formState.milestones.length > 0 ? (
            <View style={styles.goalSection}>
              <View style={styles.goalSectionHeader}>
                <Ionicons name="list-outline" size={20} color="#FFFFFF" />
                <Text style={styles.goalSectionTitle}>Milestones</Text>
              </View>
              <View style={styles.milestonesList}>
                {formState.milestones.map((milestone, index) => (
                  <View key={milestone.id} style={styles.milestoneItem}>
                    <View style={styles.milestoneNumberContainer}>
                      <Text style={styles.milestoneNumber}>{index + 1}</Text>
                    </View>
                    <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </View>
      
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Goal Summary</Text>
        </View>
        
        <View style={styles.summaryBody}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="flag-outline" size={20} color="#0A84FF" style={styles.summaryIcon} />
              <Text style={styles.summaryLabel}>Focus Area</Text>
              <Text style={styles.summaryValue}>{focusArea?.name || 'None'}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Ionicons name="calendar-outline" size={20} color="#FF9F0A" style={styles.summaryIcon} />
              <Text style={styles.summaryLabel}>Deadline</Text>
              <Text style={styles.summaryValue}>
                {formState.deadline 
                  ? format(formState.deadline, 'MMM d, yyyy')
                  : 'None'}
              </Text>
            </View>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="list-outline" size={20} color="#30D158" style={styles.summaryIcon} />
              <Text style={styles.summaryLabel}>Milestones</Text>
              <Text style={styles.summaryValue}>{formState.milestones.length}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Ionicons name="time-outline" size={20} color="#FF2D55" style={styles.summaryIcon} />
              <Text style={styles.summaryLabel}>Created</Text>
              <Text style={styles.summaryValue}>{format(new Date(), 'MMM d, yyyy')}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.motivationalContainer}>
        <View style={styles.motivationalContent}>
          <Ionicons name="rocket-outline" size={32} color="#FFFFFF" style={styles.motivationalIcon} />
          <Text style={styles.motivationalText}>
            {getMotivationalMessage()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  goalHeader: {
    padding: 16,
    borderLeftWidth: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
    backgroundColor: '#3A3A3C',
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: '600',
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
  noFocusArea: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  goalBody: {
    padding: 16,
  },
  goalSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
    paddingBottom: 16,
  },
  goalSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deadlineDate: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  deadlineTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deadlineTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  goalNotes: {
    fontSize: 15,
    color: '#AEAEB2',
    lineHeight: 22,
  },
  milestonesList: {
    marginTop: 8,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  milestoneNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  milestoneTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  summaryHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
    backgroundColor: '#3A3A3C',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  summaryBody: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIcon: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  motivationalContainer: {
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  motivationalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  motivationalIcon: {
    marginRight: 16,
  },
  motivationalText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
}); 