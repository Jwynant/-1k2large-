import React from 'react';
import { View, Text, Image } from 'react-native';
import { useStyles } from '../../../hooks';
import { useTheme } from '../../../theme';

// Define a type for the memory object
export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  tags?: string[];
}

interface MemoryItemProps {
  memory: Memory;
}

export const MemoryItem: React.FC<MemoryItemProps> = ({ memory }) => {
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
    memoryImageContainer: {
      height: 150,
      borderRadius: theme.borders.radius.md,
      marginBottom: theme.spacing.sm,
      overflow: 'hidden',
    },
    memoryImage: {
      width: '100%',
      height: '100%',
    },
    memoryContent: {
      flex: 1,
    },
    memoryDate: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing.xs,
    },
    memoryTitle: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    memoryDescription: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.sm,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.xs,
    },
    tag: {
      backgroundColor: theme.colors.background.tertiary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borders.radius.round,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    tagText: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.text.secondary,
    },
  }));

  return (
    <View style={styles.contentCard}>
      {memory.imageUrl && (
        <View style={styles.memoryImageContainer}>
          <Image source={{ uri: memory.imageUrl }} style={styles.memoryImage} />
        </View>
      )}
      <View style={styles.memoryContent}>
        <Text style={styles.memoryDate}>{memory.date}</Text>
        <Text style={styles.memoryTitle}>{memory.title}</Text>
        <Text style={styles.memoryDescription} numberOfLines={3}>
          {memory.description}
        </Text>
        {memory.tags && memory.tags.length > 0 && (
          <View style={styles.tagContainer}>
            {memory.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default MemoryItem; 