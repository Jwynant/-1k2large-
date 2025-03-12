import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContentItem } from '../../../app/types';
import { format, isToday, isTomorrow } from 'date-fns';

type LessonCardProps = {
  lesson: ContentItem;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function LessonCard({ 
  lesson, 
  onPress, 
  onEdit, 
  onDelete 
}: LessonCardProps) {
  // Get reminder text
  const getReminderText = () => {
    if (!lesson.reminder) return null;
    
    const reminderDate = new Date(lesson.reminder.nextReminder);
    
    if (isToday(reminderDate)) {
      return 'Today';
    } else if (isTomorrow(reminderDate)) {
      return 'Tomorrow';
    } else {
      return format(reminderDate, 'MMM d, yyyy');
    }
  };
  
  // Get recurring text
  const getRecurringText = () => {
    if (!lesson.reminder || !lesson.reminder.recurring || lesson.reminder.recurring === 'none') return null;
    
    switch (lesson.reminder.recurring) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      default:
        return null;
    }
  };
  
  const reminderText = getReminderText();
  const recurringText = getRecurringText();
  
  return (
    <Pressable 
      style={styles.container}
      onPress={onPress}
    >
      {/* Header - Title only now */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={3}>
          {lesson.title}
        </Text>
      </View>
      
      {/* Notes */}
      {lesson.notes && lesson.notes.trim() !== '' && (
        <Text style={styles.notes} numberOfLines={3}>
          {lesson.notes}
        </Text>
      )}
      
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#8E8E93" />
            <Text style={styles.dateText}>
              {format(new Date(lesson.date), 'MMM d, yyyy')}
            </Text>
          </View>
          
          {reminderText && (
            <View style={styles.reminderContainer}>
              <Ionicons name="notifications-outline" size={14} color="#8E8E93" />
              <Text style={styles.reminderText}>
                {reminderText}
                {recurringText && ` (${recurringText})`}
              </Text>
            </View>
          )}
        </View>
        
        {/* Action buttons now in the footer */}
        <View style={styles.actions}>
          {onEdit && (
            <Pressable 
              style={styles.actionButton}
              onPress={onEdit}
              hitSlop={8}
            >
              <Ionicons name="pencil" size={16} color="#FFCC00" />
            </Pressable>
          )}
          
          {onDelete && (
            <Pressable 
              style={styles.actionButton}
              onPress={onDelete}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={16} color="#FF453A" />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(44, 44, 46, 0.3)',
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#FFCC00',
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  notes: {
    fontSize: 14,
    color: '#EBEBF5',
    opacity: 0.8,
    marginBottom: 10,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  footerInfo: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(44, 44, 46, 0.6)',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
}); 