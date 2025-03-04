import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from '../../../hooks';
import { useTheme } from '../../../theme';

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
}

export const LessonItem: React.FC<LessonItemProps> = ({ lesson }) => {
  const theme = useTheme();
  const styles = useStyles(theme => ({
    contentCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borders.radius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
      borderWidth: theme.isDark ? 1 : 0,
      borderColor: theme.colors.border.light,
    },
    lessonHeader: {
      gap: theme.spacing.xs,
    },
    lessonMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    lessonDate: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.text.tertiary,
    },
    importanceIndicator: {
      flexDirection: 'row',
      gap: theme.spacing.xs / 2,
    },
    importanceDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    lessonTitle: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
      marginTop: theme.spacing.xs,
    },
    lessonSource: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.xs / 2,
    },
  }));

  return (
    <View style={styles.contentCard}>
      <View style={styles.lessonHeader}>
        <View style={styles.lessonMeta}>
          <Text style={styles.lessonDate}>{lesson.date}</Text>
          <View style={styles.importanceIndicator}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.importanceDot, 
                  { backgroundColor: theme.colors.info, opacity: i < lesson.importance ? 1 : 0.3 }
                ]} 
              />
            ))}
          </View>
        </View>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        {lesson.source && (
          <Text style={styles.lessonSource}>From: {lesson.source}</Text>
        )}
      </View>
    </View>
  );
};

export default LessonItem; 