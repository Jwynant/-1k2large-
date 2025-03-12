import React, { useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useColorScheme,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

interface QuickActionButtonsProps {
  onAddMemory?: () => void;
  onAddGoal?: () => void;
  onAddLesson?: () => void;
}

export default function QuickActionButtons(props: QuickActionButtonsProps) {
  const { onAddMemory, onAddGoal, onAddLesson } = props || {};
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const windowWidth = Dimensions.get('window').width;
  const buttonWidth = (windowWidth - 64) / 3; // 64 = padding (16*2) + gaps (16*2)
  const router = useRouter();
  
  const handleButtonPress = useCallback((action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action();
  }, []);
  
  // Navigate to memory form
  const navigateToMemoryForm = useCallback(() => {
    if (onAddMemory) {
      onAddMemory();
    } else {
      router.push('/content/memory');
    }
  }, [onAddMemory, router]);
  
  // Navigate to goal form
  const navigateToGoalForm = useCallback(() => {
    if (onAddGoal) {
      onAddGoal();
    } else {
      router.push('/content/goal');
    }
  }, [onAddGoal, router]);
  
  // Navigate to lesson form
  const navigateToLessonForm = useCallback(() => {
    if (onAddLesson) {
      onAddLesson();
    } else {
      router.push('/content/lesson');
    }
  }, [onAddLesson, router]);
  
  return (
    <View 
      style={styles.container}
      accessibilityRole="menubar"
      accessibilityLabel="Quick actions"
      testID="quick-action-buttons"
    >
      {/* Memory Button */}
      <TouchableOpacity 
        style={[styles.actionButton, { width: buttonWidth }]}
        onPress={() => handleButtonPress(navigateToMemoryForm)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Add Memory"
        accessibilityHint="Opens the form to add a new memory"
        testID="add-memory-button"
      >
        <LinearGradient
          colors={['#4CD964', '#34A853']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <View 
            style={styles.iconContainer}
            accessibilityLabel="Memory icon"
          >
            <Ionicons name="image" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.actionButtonText} numberOfLines={1}>
            Memory
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Goal Button */}
      <TouchableOpacity 
        style={[styles.actionButton, { width: buttonWidth }]}
        onPress={() => handleButtonPress(navigateToGoalForm)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Add Goal"
        accessibilityHint="Opens the form to add a new goal"
        testID="add-goal-button"
      >
        <LinearGradient
          colors={['#0A84FF', '#0066CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <View 
            style={styles.iconContainer}
            accessibilityLabel="Goal icon"
          >
            <Ionicons name="flag" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.actionButtonText} numberOfLines={1}>
            Goal
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Lesson Button */}
      <TouchableOpacity 
        style={[styles.actionButton, { width: buttonWidth }]}
        onPress={() => handleButtonPress(navigateToLessonForm)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Add Lesson"
        accessibilityHint="Opens the form to add a new lesson"
        testID="add-lesson-button"
      >
        <LinearGradient
          colors={['#FFCC00', '#FF9500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <View 
            style={styles.iconContainer}
            accessibilityLabel="Lesson icon"
          >
            <Ionicons name="school" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.actionButtonText} numberOfLines={1}>
            Lesson
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  }
}); 