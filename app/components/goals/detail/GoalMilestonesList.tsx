import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubGoal } from '../../../types';

interface GoalMilestonesListProps {
  milestones: SubGoal[];
  onToggle: (id: string) => void;
  accentColor: string;
}

export default function GoalMilestonesList({ 
  milestones, 
  onToggle, 
  accentColor 
}: GoalMilestonesListProps) {
  // Calculate progress
  const completedCount = milestones.filter(m => m.isCompleted).length;
  const progressText = `${completedCount} of ${milestones.length} completed`;
  const progressPercentage = milestones.length > 0 
    ? Math.round((completedCount / milestones.length) * 100) 
    : 0;
  
  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${progressPercentage}%`,
                backgroundColor: accentColor 
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{progressText}</Text>
      </View>
      
      {/* Milestones List */}
      <View style={styles.milestonesList}>
        {milestones.map((milestone, index) => (
          <TouchableOpacity
            key={milestone.id}
            style={[
              styles.milestoneItem,
              index < milestones.length - 1 && styles.milestoneItemWithBorder
            ]}
            onPress={() => onToggle(milestone.id)}
            activeOpacity={0.7}
          >
            <View style={styles.milestoneContent}>
              <View style={styles.checkboxContainer}>
                <View style={[
                  styles.checkbox,
                  milestone.isCompleted && { borderColor: accentColor, backgroundColor: accentColor }
                ]}>
                  {milestone.isCompleted && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>
              </View>
              
              <Text style={[
                styles.milestoneTitle,
                milestone.isCompleted && styles.milestoneTitleCompleted
              ]}>
                {milestone.title}
              </Text>
            </View>
            
            {milestone.deadline && (
              <View style={styles.deadlineContainer}>
                <Ionicons name="calendar-outline" size={12} color="#8E8E93" />
                <Text style={styles.deadlineText}>
                  {new Date(milestone.deadline).toLocaleDateString()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#3A3A3C',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
  },
  milestonesList: {
    paddingVertical: 8,
  },
  milestoneItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  milestoneItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  milestoneContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#8E8E93',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  milestoneTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 34,
  },
  deadlineText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
}); 