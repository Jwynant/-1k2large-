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
}

export default function QuickActionButtons(props: QuickActionButtonsProps) {
  const { onAddMemory, onAddGoal } = props || {};
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const windowWidth = Dimensions.get('window').width;
  const buttonWidth = (windowWidth - 48) / 2; // 48 = padding (16*2) + gap (16)
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
  
  return (
    <View 
      style={styles.container}
      accessibilityRole="menubar"
      accessibilityLabel="Quick actions"
    >
      <TouchableOpacity 
        style={[styles.actionButton, { width: buttonWidth }]}
        onPress={() => handleButtonPress(navigateToMemoryForm)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Add Memory"
        accessibilityHint="Opens the form to add a new memory"
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
            <Ionicons name="image" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.actionButtonText}>Add Memory</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.7)" style={styles.arrowIcon} />
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, { width: buttonWidth }]}
        onPress={() => handleButtonPress(navigateToGoalForm)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Add Goal"
        accessibilityHint="Opens the form to add a new goal"
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
            <Ionicons name="flag" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.actionButtonText}>Add Goal</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.7)" style={styles.arrowIcon} />
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
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 4,
  }
}); 