import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useColorScheme,
  Dimensions,
  Animated,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FocusArea, PriorityLevel } from '../../types';
import { useContentManagement } from '../../hooks/useContentManagement';
import * as Haptics from 'expo-haptics';

// Get screen dimensions for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Priority level colors - same as in focus.tsx
const PRIORITY_COLORS = {
  essential: '#ffd700', // Gold/Amber
  important: '#47a9ff', // Royal Blue
  supplemental: '#cd602a', // Bronze/Copper
};

interface FocusAreaCardProps {
  focusArea: FocusArea;
  priorityLevel: PriorityLevel;
  onPress: () => void;
  isRecent?: boolean; // Added to indicate recently changed status
}

export default function FocusAreaCard({ 
  focusArea, 
  priorityLevel, 
  onPress,
  isRecent = false
}: FocusAreaCardProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { getGoals } = useContentManagement();
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(isRecent ? 0 : 1)).current;
  
  // Get goals for this focus area
  const goals = getGoals().filter(goal => goal.focusAreaId === focusArea.id);
  const activeGoals = goals.filter(goal => !goal.isCompleted);
  const completedGoals = goals.filter(goal => goal.isCompleted);
  
  // Calculate progress
  const totalGoals = goals.length;
  const completionPercentage = totalGoals > 0 
    ? Math.round((completedGoals.length / totalGoals) * 100)
    : 0;
  
  // Determine if focus area is active or dormant
  const isActive = activeGoals.length > 0;
  const status = isActive ? 'active' : 'dormant';
  
  // Get next deadline if any
  const nextDeadline = activeGoals
    .filter(goal => goal.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())[0]?.deadline;
  
  // Format deadline for display
  const formattedDeadline = nextDeadline 
    ? new Date(nextDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null;
  
  // Get progress status
  const getProgressStatus = () => {
    if (totalGoals === 0) return 'No goals yet';
    if (completedGoals.length === totalGoals) return 'Completed';
    return `${completedGoals.length}/${totalGoals} completed`;
  };
  
  // Get card size based on priority level
  function getCardSize() {
    switch (priorityLevel) {
      case 'essential':
        return { width: SCREEN_WIDTH * 0.9, minHeight: 120 };
      case 'important':
        return { width: SCREEN_WIDTH * 0.85, minHeight: 110 };
      case 'supplemental':
        return { width: SCREEN_WIDTH * 0.8, minHeight: 100 };
      default:
        return { width: SCREEN_WIDTH * 0.85, minHeight: 110 };
    }
  }
  
  // Handle animations
  useEffect(() => {
    if (isRecent) {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isRecent, opacityAnim, scaleAnim]);
  
  // Handle press animations
  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePress = () => {
    onPress();
  };
  
  // Get card style based on priority level
  const cardSize = getCardSize();
  const priorityColor = PRIORITY_COLORS[priorityLevel];
  
  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
          ...cardSize
        }
      ]}
    >
      <Pressable
        style={[
          styles.card,
          isDarkMode ? styles.darkCard : styles.lightCard,
          { borderColor: priorityColor }
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        {/* Focus area color indicator and name */}
        <View style={styles.header}>
          <View style={[styles.colorDot, { backgroundColor: focusArea.color }]} />
          <Text style={[styles.title, isDarkMode ? styles.lightText : styles.darkText]}>
            {focusArea.name}
          </Text>
        </View>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${completionPercentage}%`, backgroundColor: focusArea.color }
              ]} 
            />
          </View>
        </View>
        
        {/* Goal information */}
        <View style={styles.footer}>
          <View style={styles.goalInfo}>
            <Ionicons 
              name={totalGoals > 0 ? "flag" : "flag-outline"} 
              size={16} 
              color={isDarkMode ? "#999" : "#666"} 
            />
            <Text style={[styles.goalText, isDarkMode ? styles.lightText : styles.darkText]}>
              {totalGoals === 0 ? "No goals" : `${activeGoals.length} active`}
            </Text>
          </View>
          
          {formattedDeadline ? (
            <View style={styles.deadlineContainer}>
              <Ionicons name="calendar-outline" size={14} color={priorityColor} />
              <Text style={[styles.deadlineText, { color: priorityColor }]}>
                {formattedDeadline}
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.addGoalButton} onPress={handlePress}>
              <Text style={[styles.addGoalText, { color: priorityColor }]}>
                {totalGoals === 0 ? "No goals yet" : "Add goal"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1E1E1E',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 14,
    marginLeft: 6,
    opacity: 0.8,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  addGoalButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addGoalText: {
    fontSize: 14,
    fontWeight: '500',
  },
  lightText: {
    color: '#FFFFFF',
  },
  darkText: {
    color: '#000000',
  },
}); 