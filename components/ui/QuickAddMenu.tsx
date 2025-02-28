import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ContentType, SelectedCell } from '../../app/types';
import { Ionicons } from '@expo/vector-icons';

type QuickAddMenuProps = {
  visible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  selectedCell: { year: number; month?: number; week?: number };
};

export default function QuickAddMenu({ visible, position, onClose, selectedCell }: QuickAddMenuProps) {
  const router = useRouter();

  if (!visible) return null;

  // Handle adding new content
  const handleAddContent = (type: ContentType) => {
    if (!selectedCell) return;
    
    // Close the quick add menu
    onClose();
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('year', selectedCell.year.toString());
    
    if (selectedCell.month !== undefined) {
      params.append('month', selectedCell.month.toString());
    }
    
    if (selectedCell.week !== undefined) {
      params.append('week', selectedCell.week.toString());
    }
    
    // Navigate to the appropriate content creation screen
    router.push(`/content/${type}?${params.toString()}`);
  };

  // Get icon name for each content type
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'memory':
        return 'image-outline';
      case 'lesson':
        return 'book-outline';
      case 'goal':
        return 'flag-outline';
      case 'reflection':
        return 'document-text-outline';
      default:
        return 'add-circle-outline';
    }
  };

  return (
    <View style={styles.quickAddOverlay}>
      <Pressable style={styles.quickAddBackdrop} onPress={onClose} />
      <View 
        style={[
          styles.quickAddMenu,
          {
            top: position.y,
            left: position.x,
          }
        ]}
      >
        <Pressable 
          style={[styles.quickAddButton, styles.memoryButton]}
          onPress={() => handleAddContent('memory')}
        >
          <Ionicons name={getContentTypeIcon('memory')} size={16} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.quickAddButtonText}>Memory</Text>
        </Pressable>
        <Pressable 
          style={[styles.quickAddButton, styles.lessonButton]}
          onPress={() => handleAddContent('lesson')}
        >
          <Ionicons name={getContentTypeIcon('lesson')} size={16} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.quickAddButtonText}>Lesson</Text>
        </Pressable>
        <Pressable 
          style={[styles.quickAddButton, styles.goalButton]}
          onPress={() => handleAddContent('goal')}
        >
          <Ionicons name={getContentTypeIcon('goal')} size={16} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.quickAddButtonText}>Goal</Text>
        </Pressable>
        <Pressable 
          style={[styles.quickAddButton, styles.reflectionButton]}
          onPress={() => handleAddContent('reflection')}
        >
          <Ionicons name={getContentTypeIcon('reflection')} size={16} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.quickAddButtonText}>Reflection</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quickAddOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  quickAddBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  quickAddMenu: {
    position: 'absolute',
    backgroundColor: '#1C1C1E', // iOS dark gray
    borderRadius: 12,
    padding: 16,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2C2C2E', // iOS system gray 6
  },
  quickAddButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  quickAddButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  memoryButton: {
    backgroundColor: '#0A84FF', // iOS blue
  },
  lessonButton: {
    backgroundColor: '#30D158', // iOS green
  },
  goalButton: {
    backgroundColor: '#FF9F0A', // iOS orange
  },
  reflectionButton: {
    backgroundColor: '#BF5AF2', // iOS purple
  },
}); 