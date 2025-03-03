import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Define a type for the lesson object
export interface Lesson {
  id: string;
  title: string;
  date: string;
  importance: number;
  source?: string;
}

interface LessonItemProps {
  lesson: Lesson;
  isDarkMode: boolean;
}

export const LessonItem: React.FC<LessonItemProps> = ({ lesson, isDarkMode }) => (
  <View style={[styles.contentCard, isDarkMode && styles.darkCard]}>
    <View style={styles.lessonHeader}>
      <View style={styles.lessonMeta}>
        <Text style={[styles.lessonDate, isDarkMode && styles.darkTertiaryText]}>{lesson.date}</Text>
        <View style={styles.importanceIndicator}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.importanceDot, 
                { backgroundColor: isDarkMode ? '#BF5AF2' : '#AF52DE', opacity: i < lesson.importance ? 1 : 0.3 }
              ]} 
            />
          ))}
        </View>
      </View>
      <Text style={[styles.lessonTitle, isDarkMode && styles.darkText]}>{lesson.title}</Text>
      {lesson.source && (
        <Text style={[styles.lessonSource, isDarkMode && styles.darkTertiaryText]}>From: {lesson.source}</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  darkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lessonHeader: {
    gap: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  importanceIndicator: {
    flexDirection: 'row',
    gap: 4,
  },
  importanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  lessonSource: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSecondaryText: {
    color: '#EBEBF5',
  },
  darkTertiaryText: {
    color: '#8E8E93',
  },
});

export default LessonItem; 