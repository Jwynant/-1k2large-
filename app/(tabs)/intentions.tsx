import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Priority = {
  id: string;
  title: string;
  isTopPriority: boolean;
  goals: string[];
};

type Goal = {
  id: string;
  title: string;
  deadline?: string;
  status: 'active' | 'completed' | 'abandoned';
};

const priorities: Priority[] = [
  {
    id: '1',
    title: 'Health & Fitness',
    isTopPriority: true,
    goals: ['1', '2'],
  },
  {
    id: '2',
    title: 'Career Growth',
    isTopPriority: true,
    goals: ['3'],
  },
];

const goals: Goal[] = [
  {
    id: '1',
    title: 'Run a marathon',
    deadline: '2024-12-31',
    status: 'active',
  },
  {
    id: '2',
    title: 'Maintain consistent sleep schedule',
    status: 'active',
  },
  {
    id: '3',
    title: 'Learn system design',
    deadline: '2024-06-30',
    status: 'active',
  },
];

export default function IntentionsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Intentions</Text>
        <Text style={styles.subtitle}>Track your goals and priorities</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Priorities</Text>
            <Pressable style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color="#007AFF" />
            </Pressable>
          </View>
          
          {priorities.map(priority => (
            <Pressable key={priority.id} style={styles.priorityCard}>
              <View style={styles.priorityHeader}>
                <Text style={styles.priorityTitle}>{priority.title}</Text>
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityBadgeText}>Top Priority</Text>
                </View>
              </View>
              
              <View style={styles.goalsList}>
                {priority.goals.map(goalId => {
                  const goal = goals.find(g => g.id === goalId);
                  if (!goal) return null;
                  
                  return (
                    <View key={goal.id} style={styles.goalItem}>
                      <Ionicons name="checkmark-circle-outline" size={20} color="#666" />
                      <Text style={styles.goalText}>{goal.title}</Text>
                      {goal.deadline && (
                        <Text style={styles.goalDeadline}>{goal.deadline}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </Pressable>
          ))}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Goals</Text>
            <Pressable style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color="#007AFF" />
            </Pressable>
          </View>
          
          {goals.map(goal => (
            <Pressable key={goal.id} style={styles.goalCard}>
              <View style={styles.goalCardHeader}>
                <Text style={styles.goalCardTitle}>{goal.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
              {goal.deadline && (
                <Text style={styles.goalCardDeadline}>Due {goal.deadline}</Text>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  addButton: {
    padding: 4,
  },
  priorityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priorityTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  priorityBadge: {
    backgroundColor: '#007AFF15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  priorityBadgeText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
  goalsList: {
    gap: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  goalDeadline: {
    fontSize: 13,
    color: '#666',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  goalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalCardTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  goalCardDeadline: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});