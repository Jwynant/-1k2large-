import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import GoalForm from '../components/goals/form/GoalForm';
import { useAppContext } from '../context/AppContext';

export default function GoalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    year?: string; 
    month?: string; 
    week?: string;
    id?: string;
    edit?: string;
  }>();
  
  // Get app context to access content items
  const { state } = useAppContext();
  
  // State to control form visibility
  const [isFormVisible, setIsFormVisible] = useState(true);
  
  // Check if we're editing an existing goal
  const isEditing = params.edit === 'true' && params.id;
  
  // Parse URL parameters
  const year = params.year ? parseInt(params.year, 10) : undefined;
  const month = params.month ? parseInt(params.month, 10) : undefined;
  const week = params.week ? parseInt(params.week, 10) : undefined;
  
  // Get the existing goal if we're editing
  const existingGoal = isEditing && params.id 
    ? state.contentItems.find(item => item.id === params.id)
    : undefined;
  
  // Prepare initial data for the form
  const initialData = existingGoal ? {
    id: existingGoal.id,
    title: existingGoal.title || '',
    notes: existingGoal.notes || '',
    focusAreaId: existingGoal.focusAreaId || '',
    deadline: existingGoal.deadline ? new Date(existingGoal.deadline) : null,
    progress: existingGoal.progress || 0,
    isCompleted: existingGoal.isCompleted || false,
    milestones: existingGoal.milestones || []
  } : {
    // Default values for a new goal
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
  };
  
  // Handle form close
  const handleFormClose = () => {
    setIsFormVisible(false);
    // Navigate back after a short delay to allow the modal animation to complete
    setTimeout(() => {
      router.back();
    }, 100);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <GoalForm
        isVisible={isFormVisible}
        onClose={handleFormClose}
        initialData={initialData}
        isEditing={!!isEditing}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
}); 