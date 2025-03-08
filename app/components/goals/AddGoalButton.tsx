import React, { useState, useCallback } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GoalForm from './form/GoalForm';

interface AddGoalButtonProps {
  compact?: boolean;
  label?: string;
  color?: string;
  icon?: string;
}

export default function AddGoalButton({ 
  compact = false,
  label = 'Add Goal',
  color = '#0A84FF',
  icon = 'add-circle-outline'
}: AddGoalButtonProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const openForm = useCallback(() => {
    setIsFormVisible(true);
  }, []);
  
  const closeForm = useCallback(() => {
    setIsFormVisible(false);
  }, []);
  
  if (compact) {
    return (
      <View>
        <TouchableOpacity
          style={[styles.compactButton, { backgroundColor: color }]}
          onPress={openForm}
          activeOpacity={0.7}
        >
          <Ionicons name={icon as any} size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <GoalForm
          isVisible={isFormVisible}
          onClose={closeForm}
        />
      </View>
    );
  }
  
  return (
    <View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color }]}
        onPress={openForm}
        activeOpacity={0.7}
      >
        <Ionicons name={icon as any} size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
      
      <GoalForm
        isVisible={isFormVisible}
        onClose={closeForm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  compactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 