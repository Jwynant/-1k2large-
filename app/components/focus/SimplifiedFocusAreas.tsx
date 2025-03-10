import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Pressable,
  Alert,
  ScrollView,
  TextInput,
  useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusAreas } from '../../hooks/useFocusAreas';
import { FocusArea, PriorityLevel } from '../../types';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

// Priority level colors
const PRIORITY_COLORS = {
  essential: '#ffd700', // Gold/Amber
  important: '#47a9ff', // Royal Blue
  supplemental: '#cd602a', // Bronze/Copper
};

// Priority level descriptions
const PRIORITY_DESCRIPTIONS = {
  essential: 'Must-have focus areas that are critical to your success',
  important: 'Key areas that matter but with some flexibility',
  supplemental: 'Nice-to-have areas to develop when time allows'
};

// Priority level limits
const PRIORITY_LIMITS = {
  essential: 3,
  important: 5, 
  supplemental: 7
};

// Priority level labels
const PRIORITY_LABELS = {
  essential: 'Essential',
  important: 'Important',
  supplemental: 'Supplemental'
};

export default function SimplifiedFocusAreas() {
  const { 
    orderedFocusAreas, 
    focusByLevel,
    addFocusArea, 
    updateFocusArea, 
    deleteFocusArea,
    getPresetColor,
    isPriorityLevelFull
  } = useFocusAreas();
  
  const router = useRouter();
  
  // Get color scheme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // States for adding a new focus area
  const [isAddingFocus, setIsAddingFocus] = useState(false);
  const [newFocusTitle, setNewFocusTitle] = useState('');
  const [newFocusPriority, setNewFocusPriority] = useState<PriorityLevel>('important');
  
  // Handle adding a new focus area
  const handleAddFocus = () => {
    if (!newFocusTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your focus area');
      return;
    }
    
    // Check if the priority level has reached its limit
    if (isPriorityLevelFull(newFocusPriority)) {
      Alert.alert(
        'Priority Level Full',
        `You can have at most ${PRIORITY_LIMITS[newFocusPriority]} ${newFocusPriority} focus areas. Consider removing one or choosing a different priority level.`
      );
      return;
    }
    
    // Add the new focus area
    addFocusArea({
      name: newFocusTitle.trim(),
      color: getPresetColor(),
      priorityLevel: newFocusPriority,
      rank: focusByLevel[newFocusPriority].length + 1
    });
    
    // Clear the form
    setNewFocusTitle('');
    setNewFocusPriority('important');
    setIsAddingFocus(false);
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  // Handle deleting a focus area
  const handleDeleteFocus = (area: FocusArea) => {
    Alert.alert(
      'Delete Focus Area',
      `Are you sure you want to delete "${area.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteFocusArea(area.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  };

  // Navigate to focus areas page
  const navigateToFocusAreas = () => {
    // This would navigate to a dedicated focus areas page
    // router.push('/focus');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Render focus areas grouped by priority
  const renderFocusAreasByPriority = () => {
    return Object.entries(focusByLevel).map(([priority, areas]) => {
      if (areas.length === 0) return null;
      
      return (
        <View key={priority} style={styles.prioritySection}>
          <View style={styles.priorityHeader}>
            <View style={[
              styles.priorityBadge, 
              { backgroundColor: PRIORITY_COLORS[priority as PriorityLevel] + '30' }
            ]}>
              <Text style={[
                styles.priorityBadgeText, 
                { color: PRIORITY_COLORS[priority as PriorityLevel] }
              ]}>
                {PRIORITY_LABELS[priority as PriorityLevel]}
              </Text>
            </View>
            <Text style={styles.areaCount}>{areas.length} areas</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.areasScrollContent}
          >
            {areas.map((area) => (
              <TouchableOpacity 
                key={area.id} 
                style={[
                  styles.focusAreaCard,
                  { borderColor: area.color }
                ]}
                onPress={navigateToFocusAreas}
                activeOpacity={0.7}
              >
                <View style={[styles.focusColorBar, { backgroundColor: area.color }]} />
                <Text style={styles.focusName}>
                  {area.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }).filter(Boolean); // Filter out null values
  };

  return (
    <View style={styles.container}>
      {orderedFocusAreas.length > 0 ? (
        <>
          {renderFocusAreasByPriority()}
          
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={navigateToFocusAreas}
          >
            <Text style={styles.viewAllText}>View All Focus Areas</Text>
            <Ionicons name="chevron-forward" size={16} color="#0A84FF" />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="compass-outline" size={48} color="#8E8E93" style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Focus Areas</Text>
          <Text style={styles.emptyDescription}>
            Define what matters most to you by adding focus areas
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={navigateToFocusAreas}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Focus Area</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  prioritySection: {
    marginBottom: 16,
  },
  priorityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  areaCount: {
    fontSize: 12,
    color: '#8E8E93',
  },
  areasScrollContent: {
    paddingRight: 16,
  },
  focusAreaCard: {
    backgroundColor: '#3A3A3C',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 120,
    height: 80,
    justifyContent: 'space-between',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 3,
  },
  focusColorBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  focusName: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    borderRadius: 12,
    marginTop: 8,
  },
  viewAllText: {
    color: '#0A84FF',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A84FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
}); 