import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../types';

interface CategorySelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  multiSelect?: boolean;
  showCreate?: boolean;
  label?: string;
}

/**
 * A simplified category selector component
 */
export function CategorySelector({
  selectedIds = [],
  onChange,
  multiSelect = true,
  showCreate = true,
  label = 'Categories'
}: CategorySelectorProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { categories, addCategory, getRandomColor } = useCategories();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Handle category selection/deselection
  const handleToggleCategory = (id: string) => {
    if (multiSelect) {
      // Toggle in multi-select mode
      const newSelection = selectedIds.includes(id)
        ? selectedIds.filter(catId => catId !== id)
        : [...selectedIds, id];
      onChange(newSelection);
    } else {
      // Single selection mode
      onChange([id]);
    }
  };
  
  // Handle creating a new category
  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const id = addCategory({
        name: newCategoryName.trim(),
        color: getRandomColor(),
        icon: 'pricetag-outline' // Default icon
      });
      
      setNewCategoryName('');
      setIsCreating(false);
      
      // Add the new category to selection
      onChange([...selectedIds, id]);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={[
        styles.label, 
        isDarkMode ? styles.labelDark : styles.labelLight
      ]}>
        {label}
      </Text>
      
      {/* Category chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryScroll}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              { backgroundColor: category.color + '20' },
              selectedIds.includes(category.id) && styles.selectedChip,
              selectedIds.includes(category.id) && { borderColor: category.color }
            ]}
            onPress={() => handleToggleCategory(category.id)}
          >
            {category.icon && (
              <Ionicons 
                name={category.icon as any} 
                size={16} 
                color={category.color} 
                style={styles.categoryIcon} 
              />
            )}
            <Text style={[styles.categoryText, { color: category.color }]}>
              {category.name}
            </Text>
            {selectedIds.includes(category.id) && (
              <Ionicons name="checkmark" size={14} color={category.color} style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
        
        {showCreate && !isCreating && (
          <TouchableOpacity
            style={[
              styles.addCategoryButton,
              isDarkMode ? styles.addButtonDark : styles.addButtonLight
            ]}
            onPress={() => setIsCreating(true)}
          >
            <Ionicons name="add" size={16} color="#007AFF" />
            <Text style={styles.addCategoryText}>New</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      {/* New category form */}
      {isCreating && (
        <View style={[
          styles.createCategoryContainer,
          isDarkMode ? styles.createContainerDark : styles.createContainerLight
        ]}>
          <TextInput
            style={[
              styles.categoryInput,
              isDarkMode ? styles.inputDark : styles.inputLight
            ]}
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            placeholder="New category name"
            placeholderTextColor={isDarkMode ? '#777' : '#999'}
            autoFocus
          />
          <View style={styles.createButtonsRow}>
            <TouchableOpacity 
              style={[styles.cancelButton, isDarkMode ? styles.buttonDark : styles.buttonLight]} 
              onPress={() => setIsCreating(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.createButton, 
                !newCategoryName.trim() && styles.createButtonDisabled
              ]} 
              onPress={handleCreateCategory}
              disabled={!newCategoryName.trim()}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  labelLight: {
    color: '#000000',
  },
  labelDark: {
    color: '#FFFFFF',
  },
  categoryScroll: {
    flexGrow: 0,
    marginBottom: 8,
    padding: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedChip: {
    borderWidth: 1,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 4,
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  addButtonLight: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  addButtonDark: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  addCategoryText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  createCategoryContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  createContainerLight: {
    backgroundColor: '#F2F2F7',
  },
  createContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  categoryInput: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 16,
  },
  inputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D1D6',
    color: '#000000',
  },
  inputDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#3A3A3C',
    color: '#FFFFFF',
  },
  createButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  buttonLight: {
    backgroundColor: '#E5E5EA',
  },
  buttonDark: {
    backgroundColor: '#3A3A3C',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  createButtonDisabled: {
    backgroundColor: '#007AFF80', // 50% opacity
  },
  createButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
}); 