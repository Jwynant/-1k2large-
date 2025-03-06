import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDateCalculations } from '../hooks/useDateCalculations';
import { useAppContext } from '../context/AppContext';
import { useFocusAreas } from '../hooks/useFocusAreas';
import { format } from 'date-fns';

export default function TodayScreen() {
  // Get current date info and app state
  const { getPreciseAge, getLifeProgress } = useDateCalculations();
  const { state } = useAppContext();
  const { orderedFocusAreas } = useFocusAreas();
  
  // Format current date
  const today = new Date();
  const formattedDate = format(today, 'MMMM d, yyyy');
  const dayOfWeek = format(today, 'EEEE');
  
  // Calculate life progress
  const lifeProgressPercentage = getLifeProgress(state.userSettings.lifeExpectancy);
  const preciseAge = getPreciseAge();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Life Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Life Progress</Text>
          <View style={styles.progressCard}>
            <Text style={styles.ageText}>{preciseAge}</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${lifeProgressPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {Math.round(lifeProgressPercentage)}% of life lived 
              ({Math.round(100 - lifeProgressPercentage)}% remaining)
            </Text>
          </View>
        </View>
        
        {/* Focus Areas Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Focus</Text>
          <View style={styles.focusCard}>
            {orderedFocusAreas.length > 0 ? (
              orderedFocusAreas.map((area, index) => (
                <View key={area.id} style={styles.focusItem}>
                  <View style={[styles.focusColor, { backgroundColor: area.color }]} />
                  <View style={styles.focusContent}>
                    <Text style={styles.focusName}>{area.name}</Text>
                    <Text style={styles.focusPriority}>
                      {index === 0 ? 'Primary' : 
                      index === 1 ? 'Secondary' : 
                      index === 2 ? 'Tertiary' : `Priority ${index + 1}`}
                    </Text>
                  </View>
                  <Text style={styles.focusAllocation}>{area.allocation}%</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyFocus}>
                <Text style={styles.emptyText}>No focus areas defined</Text>
                <Pressable style={styles.emptyButton}>
                  <Text style={styles.emptyButtonText}>Set Focus Areas</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
        
        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <Pressable style={styles.actionButton}>
              <Ionicons name="flag-outline" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Add Goal</Text>
            </Pressable>
            
            <Pressable style={styles.actionButton}>
              <Ionicons name="image-outline" size={24} color="#4CD964" />
              <Text style={styles.actionText}>Add Memory</Text>
            </Pressable>
            
            <Pressable style={styles.actionButton}>
              <Ionicons name="bulb-outline" size={24} color="#FF9500" />
              <Text style={styles.actionText}>Add Insight</Text>
            </Pressable>
          </View>
        </View>
        
        {/* Upcoming Goals Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Goals</Text>
          <View style={styles.upcomingCard}>
            {/* This will be populated dynamically */}
            <View style={styles.emptyUpcoming}>
              <Text style={styles.emptyText}>No upcoming goals</Text>
              <Pressable style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Create a Goal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode background
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  dayOfWeek: {
    fontSize: 18,
    color: '#AEAEB2',
    marginBottom: 4,
  },
  date: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
  },
  ageText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#3A3A3C',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0A84FF',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#AEAEB2',
  },
  focusCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  focusColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  focusContent: {
    flex: 1,
  },
  focusName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  focusPriority: {
    fontSize: 12,
    color: '#AEAEB2',
  },
  focusAllocation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  emptyFocus: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#AEAEB2',
    marginBottom: 12,
  },
  emptyButton: {
    backgroundColor: '#0A84FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  upcomingCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
  },
  emptyUpcoming: {
    alignItems: 'center',
    padding: 20,
  },
}); 