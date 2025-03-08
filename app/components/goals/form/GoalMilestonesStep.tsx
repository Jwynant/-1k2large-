import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Milestone = {
  id: string;
  title: string;
  isCompleted: boolean;
};

interface GoalMilestonesStepProps {
  milestones: Milestone[];
  errors: Record<string, string>;
  onUpdateForm: (updates: { milestones: Milestone[] }) => void;
}

export default function GoalMilestonesStep({ 
  milestones, 
  errors,
  onUpdateForm 
}: GoalMilestonesStepProps) {
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));
  
  const addMilestone = () => {
    if (!newMilestoneTitle.trim()) {
      return;
    }
    
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestoneTitle.trim(),
      isCompleted: false
    };
    
    // Animate the fade out/in effect
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
    
    onUpdateForm({
      milestones: [...milestones, newMilestone]
    });
    
    setNewMilestoneTitle('');
  };
  
  const removeMilestone = (id: string) => {
    Alert.alert(
      'Remove Milestone',
      'Are you sure you want to remove this milestone?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            onUpdateForm({
              milestones: milestones.filter(m => m.id !== id)
            });
          }
        }
      ]
    );
  };
  
  const updateMilestoneTitle = (id: string, title: string) => {
    onUpdateForm({
      milestones: milestones.map(m => 
        m.id === id ? { ...m, title } : m
      )
    });
  };
  
  const moveMilestoneUp = (index: number) => {
    if (index === 0) return;
    
    const newMilestones = [...milestones];
    const temp = newMilestones[index];
    newMilestones[index] = newMilestones[index - 1];
    newMilestones[index - 1] = temp;
    
    onUpdateForm({ milestones: newMilestones });
  };
  
  const moveMilestoneDown = (index: number) => {
    if (index === milestones.length - 1) return;
    
    const newMilestones = [...milestones];
    const temp = newMilestones[index];
    newMilestones[index] = newMilestones[index + 1];
    newMilestones[index + 1] = temp;
    
    onUpdateForm({ milestones: newMilestones });
  };
  
  // Suggested milestone templates
  const suggestedMilestones = [
    "Research and gather information",
    "Create a detailed plan",
    "Complete 25% of the work",
    "Reach halfway point",
    "Review progress and adjust",
    "Complete 75% of the work",
    "Final review and refinement"
  ];
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Break down your goal</Text>
      <Text style={styles.stepDescription}>
        Milestones help you track progress and make your goal more achievable.
      </Text>
      
      {/* Milestones List */}
      <Animated.View 
        style={[
          styles.milestonesContainer,
          { opacity: fadeAnim }
        ]}
      >
        {milestones.length > 0 ? (
          milestones.map((milestone, index) => (
            <View key={milestone.id} style={styles.milestoneItem}>
              <View style={styles.milestoneHeader}>
                <View style={styles.milestoneNumberContainer}>
                  <Text style={styles.milestoneNumber}>{index + 1}</Text>
                </View>
                <View style={styles.milestoneActions}>
                  <TouchableOpacity 
                    style={[
                      styles.milestoneAction,
                      index === 0 ? styles.milestoneActionDisabled : {}
                    ]}
                    onPress={() => moveMilestoneUp(index)}
                    disabled={index === 0}
                  >
                    <Ionicons 
                      name="chevron-up" 
                      size={16} 
                      color={index === 0 ? '#8E8E93' : '#FFFFFF'} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.milestoneAction,
                      index === milestones.length - 1 ? styles.milestoneActionDisabled : {}
                    ]}
                    onPress={() => moveMilestoneDown(index)}
                    disabled={index === milestones.length - 1}
                  >
                    <Ionicons 
                      name="chevron-down" 
                      size={16} 
                      color={index === milestones.length - 1 ? '#8E8E93' : '#FFFFFF'} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.milestoneAction}
                    onPress={() => removeMilestone(milestone.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#FF453A" />
                  </TouchableOpacity>
                </View>
              </View>
              <TextInput
                style={styles.milestoneInput}
                value={milestone.title}
                onChangeText={(text) => updateMilestoneTitle(milestone.id, text)}
                placeholder="Milestone description"
                placeholderTextColor="#8E8E93"
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyMilestones}>
            <Ionicons name="list-outline" size={40} color="#8E8E93" />
            <Text style={styles.emptyMilestonesText}>
              No milestones yet
            </Text>
            <Text style={styles.emptyMilestonesSubtext}>
              Breaking down your goal into steps makes it easier to achieve
            </Text>
          </View>
        )}
      </Animated.View>
      
      {/* Add New Milestone */}
      <View style={styles.addMilestoneContainer}>
        <TextInput
          style={styles.addMilestoneInput}
          value={newMilestoneTitle}
          onChangeText={setNewMilestoneTitle}
          placeholder="Add a new milestone..."
          placeholderTextColor="#8E8E93"
          onSubmitEditing={addMilestone}
          returnKeyType="done"
        />
        <TouchableOpacity 
          style={[
            styles.addMilestoneButton,
            !newMilestoneTitle.trim() ? styles.addMilestoneButtonDisabled : {}
          ]}
          onPress={addMilestone}
          disabled={!newMilestoneTitle.trim()}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Suggested Milestones */}
      {milestones.length === 0 && (
        <View style={styles.suggestedContainer}>
          <Text style={styles.suggestedTitle}>Suggested milestones</Text>
          <View style={styles.suggestedList}>
            {suggestedMilestones.map((suggestion, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.suggestedItem}
                onPress={() => {
                  setNewMilestoneTitle(suggestion);
                }}
              >
                <Ionicons name="add-circle-outline" size={16} color="#0A84FF" style={styles.suggestedIcon} />
                <Text style={styles.suggestedText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.tipContainer}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#34C759" style={styles.tipIcon} />
        <Text style={styles.tipText}>
          Breaking your goal into 3-5 milestones makes it more manageable and increases your chances of success.
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
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
    textAlign: 'center',
  },
  milestonesContainer: {
    marginBottom: 24,
  },
  milestoneItem: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0A84FF',
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  milestoneActions: {
    flexDirection: 'row',
  },
  milestoneAction: {
    padding: 8,
    marginLeft: 4,
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
  },
  milestoneActionDisabled: {
    backgroundColor: '#2C2C2E',
  },
  milestoneInput: {
    color: '#FFFFFF',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
    paddingBottom: 8,
  },
  emptyMilestones: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 24,
  },
  emptyMilestonesText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyMilestonesSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  addMilestoneContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  addMilestoneInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  addMilestoneButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMilestoneButtonDisabled: {
    backgroundColor: '#3A3A3C',
  },
  suggestedContainer: {
    marginBottom: 24,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  suggestedList: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 8,
  },
  suggestedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  suggestedIcon: {
    marginRight: 8,
  },
  suggestedText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
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
    color: '#34C759',
    flex: 1,
  },
}); 