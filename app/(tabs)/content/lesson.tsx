import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import LessonForm from '../../../components/content/lessons/LessonForm';
import { useTheme } from '../../../app/context/ThemeContext';

export default function LessonScreen() {
  const params = useLocalSearchParams<{ year?: string; month?: string; week?: string }>();
  const { colors } = useTheme();
  
  // Parse URL parameters
  const year = params.year ? parseInt(params.year, 10) : undefined;
  const month = params.month ? parseInt(params.month, 10) : undefined;
  const week = params.week ? parseInt(params.week, 10) : undefined;
  
  // Create selectedCell object if we have year parameter
  const selectedCell = year ? {
    year,
    month,
    week
  } : undefined;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <LessonForm selectedCell={selectedCell} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
}); 