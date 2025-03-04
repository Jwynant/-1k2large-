import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useStyles } from '../hooks';
import { Button } from '../components/ui/Button';

type Season = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
  memories: number;
};

const seasons: Season[] = [
  {
    id: '1',
    title: 'Career Transition',
    startDate: '2023-01',
    endDate: '2023-06',
    description: 'Transitioning from corporate role to freelance work',
    memories: 12,
  },
  {
    id: '2',
    title: 'Health Focus',
    startDate: '2023-07',
    description: 'Prioritizing health and wellness routines',
    memories: 8,
  },
];

export default function TimelineScreen() {
  const theme = useTheme();
  
  const styles = useStyles(theme => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.md,
      paddingTop: 60, // For status bar
      borderBottomWidth: theme.borders.width.thin,
      borderBottomColor: theme.colors.border.light,
    },
    title: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.sm,
      color: theme.colors.text.primary,
    },
    subtitle: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text.secondary,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    timeline: {
      marginTop: theme.spacing.sm,
    },
    timelineItem: {
      flexDirection: 'row',
      marginBottom: theme.spacing.lg,
    },
    timelineMarkerContainer: {
      width: 20,
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    timelineLine: {
      position: 'absolute',
      width: 2,
      height: '100%',
      backgroundColor: theme.colors.border.medium,
      left: 9,
    },
    timelineMarker: {
      width: 20,
      height: 20,
      borderRadius: 10,
      zIndex: 1,
    },
    seasonCard: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borders.radius.lg,
      overflow: 'hidden',
      shadowColor: theme.isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: theme.isDark ? 1 : 0,
      borderColor: theme.colors.border.light,
    },
    seasonContent: {
      padding: theme.spacing.md,
    },
    seasonHeader: {
      marginBottom: theme.spacing.sm,
    },
    seasonTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      marginBottom: theme.spacing.xs,
      color: theme.colors.text.primary,
    },
    seasonDate: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text.tertiary,
    },
    seasonDescription: {
      fontSize: theme.typography.sizes.md,
      lineHeight: 22,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
    },
    seasonFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    memoryCount: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    memoryCountText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text.tertiary,
    },
    addButton: {
      position: 'absolute',
      bottom: theme.spacing.md,
      right: theme.spacing.md,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timeline</Text>
        <Text style={styles.subtitle}>View your life seasons</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.timeline}>
          {seasons.map((season, index) => (
            <View key={season.id} style={styles.timelineItem}>
              <View style={styles.timelineMarkerContainer}>
                <View style={styles.timelineLine} />
                <View 
                  style={[
                    styles.timelineMarker, 
                    { backgroundColor: index === 0 ? theme.colors.warning : theme.colors.accent }
                  ]} 
                />
              </View>
              
              <Pressable style={styles.seasonCard}>
                <View style={styles.seasonContent}>
                  <View style={styles.seasonHeader}>
                    <Text style={styles.seasonTitle}>{season.title}</Text>
                    <Text style={styles.seasonDate}>
                      {season.startDate} - {season.endDate || 'Present'}
                    </Text>
                  </View>
                  
                  <Text style={styles.seasonDescription}>
                    {season.description}
                  </Text>
                  
                  <View style={styles.seasonFooter}>
                    <View style={styles.memoryCount}>
                      <Ionicons name="images" size={16} color={theme.colors.accent} />
                      <Text style={styles.memoryCountText}>
                        {season.memories} memories
                      </Text>
                    </View>
                    
                    <Button
                      label="Add Memory"
                      onPress={() => {}}
                      variant="primary"
                      size="small"
                    />
                  </View>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <Pressable style={styles.addButton}>
        <Ionicons name="add" size={24} color="white" />
      </Pressable>
    </View>
  );
}