import React from 'react';
import { View, Text } from 'react-native';
import { HomeSection } from './HomeSection';
import { FocusAreas } from './FocusAreas';
import { 
  GoalItem, 
  MemoryItem, 
  LessonItem,
  Goal,
  Memory,
  Lesson,
  Priority
} from './content-items';
import {
  EmptyGoals,
  EmptyMemories,
  EmptyLessons
} from './empty-states';
import { useTheme } from '../../theme';
import { useStyles } from '../../hooks';
import { Button } from '../ui/Button';

// Section types that can be prioritized
export type SectionType = 'priorities' | 'goals' | 'memories' | 'lessons' | 'reflection';

interface SectionConfig {
  type: SectionType;
  title: string;
  condition: boolean;
}

interface TimePrioritizedSectionsProps {
  goals: Goal[];
  memories: Memory[];
  lessons: Lesson[];
  priorities: Priority[];
  onManagePriorities: () => void;
  onSeeAllGoals: () => void;
  onSeeAllMemories: () => void;
  onSeeAllLessons: () => void;
  onStartReflection: () => void;
}

// Function to get time-prioritized section order
export const getTimePrioritizedSections = (): SectionType[] => {
  const hour = new Date().getHours();
  
  // Morning (before 12pm)
  if (hour < 12) {
    return ['priorities', 'goals', 'lessons', 'memories', 'reflection'];
  }
  // Afternoon (12pm to 6pm)
  else if (hour < 18) {
    return ['priorities', 'lessons', 'goals', 'memories', 'reflection'];
  }
  // Evening (after 6pm)
  else {
    return ['reflection', 'memories', 'priorities', 'goals', 'lessons'];
  }
};

export const TimePrioritizedSections: React.FC<TimePrioritizedSectionsProps> = ({
  goals,
  memories,
  lessons,
  priorities,
  onManagePriorities,
  onSeeAllGoals,
  onSeeAllMemories,
  onSeeAllLessons,
  onStartReflection
}) => {
  const theme = useTheme();
  const styles = useStyles(theme => ({
    container: {
      flex: 1,
    },
    reflectionContainer: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borders.radius.md,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.screenPadding,
      marginBottom: theme.spacing.lg,
    },
    reflectionContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    reflectionTextContainer: {
      flex: 1,
      paddingRight: theme.spacing.md,
    },
    reflectionTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    reflectionText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
    },
  }));
  
  // Get time-based section order
  const sectionOrder = getTimePrioritizedSections();
  
  // Get current time period for section highlight
  const getCurrentTimePeriod = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };
  
  const timePeriod = getCurrentTimePeriod();
  
  // This determines if a section should be prioritized (highlighted)
  const isSectionPrioritized = (sectionType: SectionType): boolean => {
    if (timePeriod === 'morning' && (sectionType === 'priorities' || sectionType === 'goals')) {
      return true;
    }
    if (timePeriod === 'afternoon' && (sectionType === 'priorities' || sectionType === 'lessons')) {
      return true;
    }
    if (timePeriod === 'evening' && (sectionType === 'reflection' || sectionType === 'memories')) {
      return true;
    }
    return false;
  };
  
  // Create section configs
  const sectionConfigs: SectionConfig[] = [
    {
      type: 'priorities',
      title: 'Focus Areas',
      condition: true,
    },
    {
      type: 'goals',
      title: 'Current Goals',
      condition: true,
    },
    {
      type: 'memories',
      title: 'Recent Memories',
      condition: true,
    },
    {
      type: 'lessons',
      title: 'Life Lessons',
      condition: true,
    },
    {
      type: 'reflection',
      title: 'Daily Reflection',
      condition: true,
    },
  ];
  
  // Render the right content for each section type
  const renderSectionContent = (type: SectionType) => {
    switch (type) {
      case 'priorities':
        return (
          <FocusAreas 
            priorities={priorities} 
            onManagePress={onManagePriorities} 
          />
        );
        
      case 'goals':
        if (goals.length === 0) {
          return <EmptyGoals />;
        }
        return (
          <View>
            {goals.map(goal => (
              <GoalItem 
                key={goal.id} 
                goal={goal} 
              />
            ))}
          </View>
        );
        
      case 'memories':
        if (memories.length === 0) {
          return <EmptyMemories />;
        }
        return (
          <View>
            {memories.map(memory => (
              <MemoryItem 
                key={memory.id} 
                memory={memory} 
              />
            ))}
          </View>
        );
        
      case 'lessons':
        if (lessons.length === 0) {
          return <EmptyLessons />;
        }
        return (
          <View>
            {lessons.map(lesson => (
              <LessonItem 
                key={lesson.id} 
                lesson={lesson} 
              />
            ))}
          </View>
        );
        
      case 'reflection':
        return (
          <View style={styles.reflectionContainer}>
            <View style={styles.reflectionContent}>
              <View style={styles.reflectionTextContainer}>
                <Text style={styles.reflectionTitle}>Daily Reflection</Text>
                <Text style={styles.reflectionText}>
                  Take a moment to reflect on today's events, decisions, and emotions.
                </Text>
              </View>
              <Button
                label="Start"
                onPress={onStartReflection}
                variant="primary"
                size="small"
              />
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  // Render sections in time-prioritized order
  return (
    <View style={styles.container}>
      {sectionOrder.map(sectionType => {
        const config = sectionConfigs.find(s => s.type === sectionType);
        
        if (!config || !config.condition) {
          return null;
        }
        
        if (sectionType === 'reflection') {
          return (
            <React.Fragment key="reflection">
              {renderSectionContent('reflection')}
            </React.Fragment>
          );
        }
        
        if (sectionType === 'priorities') {
          return (
            <React.Fragment key="priorities">
              {renderSectionContent('priorities')}
            </React.Fragment>
          );
        }
        
        return (
          <HomeSection 
            key={sectionType}
            title={config.title}
            showSeeAll={true}
            onSeeAllPress={
              sectionType === 'goals' 
                ? onSeeAllGoals 
                : sectionType === 'memories' 
                  ? onSeeAllMemories 
                  : onSeeAllLessons
            }
            isHighlighted={isSectionPrioritized(sectionType)}
          >
            {renderSectionContent(sectionType)}
          </HomeSection>
        );
      })}
    </View>
  );
};

export default TimePrioritizedSections; 