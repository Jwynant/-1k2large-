import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, differenceInDays, isBefore, addDays } from 'date-fns';

interface GoalDetailsStepProps {
  notes: string;
  deadline: Date | null;
  errors: Record<string, string>;
  onUpdateForm: (updates: { notes?: string; deadline?: Date }) => void;
}

export default function GoalDetailsStep({ 
  notes, 
  deadline, 
  errors,
  onUpdateForm 
}: GoalDetailsStepProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  
  // Animate when deadline changes
  React.useEffect(() => {
    if (deadline) {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [deadline]);
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      onUpdateForm({ deadline: selectedDate });
    }
  };
  
  const formatDeadline = (date: Date | null) => {
    if (!date) return 'Select a deadline';
    return format(date, 'MMMM d, yyyy');
  };
  
  const getDeadlineStatus = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isBefore(date, today)) {
      return { text: 'This date is in the past', color: '#FF453A' };
    }
    
    const daysUntil = differenceInDays(date, today);
    
    if (daysUntil === 0) {
      return { text: 'Today', color: '#FF9F0A' };
    } else if (daysUntil <= 7) {
      return { text: `${daysUntil} day${daysUntil === 1 ? '' : 's'} from now`, color: '#FF9F0A' };
    } else if (daysUntil <= 30) {
      return { text: `${Math.floor(daysUntil / 7)} week${Math.floor(daysUntil / 7) === 1 ? '' : 's'} from now`, color: '#30D158' };
    } else {
      return { text: `${Math.floor(daysUntil / 30)} month${Math.floor(daysUntil / 30) === 1 ? '' : 's'} from now`, color: '#30D158' };
    }
  };
  
  // Quick date selection options
  const quickDateOptions = [
    { label: 'Today', date: new Date() },
    { label: 'Tomorrow', date: addDays(new Date(), 1) },
    { label: 'Next Week', date: addDays(new Date(), 7) },
    { label: 'Next Month', date: addDays(new Date(), 30) },
  ];
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>When do you want to achieve this?</Text>
      
      {/* Deadline Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Deadline</Text>
        
        {/* Quick Date Options */}
        <View style={styles.quickDateContainer}>
          {quickDateOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quickDateButton,
                deadline && format(deadline, 'yyyy-MM-dd') === format(option.date, 'yyyy-MM-dd') 
                  ? styles.quickDateButtonSelected 
                  : {}
              ]}
              onPress={() => onUpdateForm({ deadline: option.date })}
            >
              <Text 
                style={[
                  styles.quickDateText,
                  deadline && format(deadline, 'yyyy-MM-dd') === format(option.date, 'yyyy-MM-dd') 
                    ? styles.quickDateTextSelected 
                    : {}
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Custom Date Picker */}
        <TouchableOpacity
          style={[
            styles.deadlineButton,
            errors.deadline ? styles.inputError : {}
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#FFFFFF" style={styles.deadlineIcon} />
          <Text style={styles.deadlineText}>
            {formatDeadline(deadline)}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#8E8E93" />
        </TouchableOpacity>
        {errors.deadline ? (
          <Text style={styles.errorText}>{errors.deadline}</Text>
        ) : null}
        
        {showDatePicker && (
          <DateTimePicker
            value={deadline || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
            style={styles.datePicker}
          />
        )}
      </View>
      
      {/* Deadline Context */}
      {deadline && (
        <Animated.View 
          style={[
            styles.deadlineContext,
            { transform: [{ scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }] }
          ]}
        >
          <View style={styles.deadlineIndicator}>
            <View style={styles.timelineBar} />
            <View style={[
              styles.timelineDot, 
              { backgroundColor: getDeadlineStatus(deadline).color }
            ]} />
          </View>
          <View style={[
            styles.deadlineInfo,
            { borderLeftColor: getDeadlineStatus(deadline).color }
          ]}>
            <Text style={styles.deadlineInfoTitle}>Your deadline</Text>
            <Text style={styles.deadlineInfoText}>
              {format(deadline, 'EEEE, MMMM d, yyyy')}
            </Text>
            <Text style={[
              styles.deadlineInfoSubtext,
              { color: getDeadlineStatus(deadline).color }
            ]}>
              {getDeadlineStatus(deadline).text}
            </Text>
          </View>
        </Animated.View>
      )}
      
      {/* Notes Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={(text) => onUpdateForm({ notes: text })}
          placeholder="Why is this goal important to you? What will success look like?"
          placeholderTextColor="#8E8E93"
          multiline
          textAlignVertical="top"
        />
      </View>
      
      <View style={styles.tipContainer}>
        <Ionicons name="information-circle-outline" size={20} color="#0A84FF" style={styles.tipIcon} />
        <Text style={styles.tipText}>
          Setting a realistic deadline increases your chances of achieving your goal.
        </Text>
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
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  quickDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickDateButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  quickDateButtonSelected: {
    backgroundColor: 'rgba(10, 132, 255, 0.2)',
    borderColor: '#0A84FF',
  },
  quickDateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  quickDateTextSelected: {
    color: '#0A84FF',
  },
  notesInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    textAlignVertical: 'top',
  },
  deadlineButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  deadlineIcon: {
    marginRight: 8,
  },
  deadlineText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF453A',
  },
  errorText: {
    color: '#FF453A',
    fontSize: 14,
    marginTop: 4,
  },
  datePicker: {
    marginTop: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
  },
  deadlineContext: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  deadlineIndicator: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  timelineBar: {
    width: 2,
    flex: 1,
    backgroundColor: '#3A3A3C',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0A84FF',
    position: 'absolute',
    top: 0,
  },
  deadlineInfo: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
  },
  deadlineInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  deadlineInfoText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  deadlineInfoSubtext: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  tipIcon: {
    marginRight: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#0A84FF',
    flex: 1,
  },
}); 