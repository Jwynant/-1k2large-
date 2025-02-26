import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ContentType } from '../../app/context/AppContext';

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
          <Text style={styles.quickAddButtonText}>Memory</Text>
        </Pressable>
        <Pressable 
          style={[styles.quickAddButton, styles.lessonButton]}
          onPress={() => handleAddContent('lesson')}
        >
          <Text style={styles.quickAddButtonText}>Lesson</Text>
        </Pressable>
        <Pressable 
          style={[styles.quickAddButton, styles.goalButton]}
          onPress={() => handleAddContent('goal')}
        >
          <Text style={styles.quickAddButtonText}>Goal</Text>
        </Pressable>
        <Pressable 
          style={[styles.quickAddButton, styles.reflectionButton]}
          onPress={() => handleAddContent('reflection')}
        >
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickAddButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  quickAddButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  memoryButton: {
    backgroundColor: '#4A90E2',
  },
  lessonButton: {
    backgroundColor: '#50C878',
  },
  goalButton: {
    backgroundColor: '#FF9500',
  },
  reflectionButton: {
    backgroundColor: '#9B59B6',
  },
}); 