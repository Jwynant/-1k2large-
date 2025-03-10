import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useColorScheme,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusAreas } from '../../hooks/useFocusAreas';
import { FocusArea } from '../../types';

interface FocusAreaPickerFieldProps {
  label: string;
  value?: string;
  onChange: (focusAreaId: string) => void;
  error?: string;
  required?: boolean;
}

export default function FocusAreaPickerField({ 
  label, 
  value, 
  onChange,
  error,
  required = false
}: FocusAreaPickerFieldProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const { focusAreas, orderedFocusAreas } = useFocusAreas();
  const [showPicker, setShowPicker] = useState(false);
  
  // Get selected focus area
  const selectedFocusArea = value 
    ? focusAreas.find(area => area.id === value) 
    : undefined;
  
  // Toggle focus area picker
  const togglePicker = () => {
    setShowPicker(!showPicker);
  };
  
  // Handle focus area selection
  const handleSelect = (focusArea: FocusArea) => {
    onChange(focusArea.id);
    setShowPicker(false);
  };
  
  // Render focus area item
  const renderFocusAreaItem = ({ item }: { item: FocusArea }) => (
    <TouchableOpacity
      style={[
        styles.focusAreaItem,
        isDarkMode ? styles.darkFocusAreaItem : styles.lightFocusAreaItem,
        value === item.id && styles.selectedFocusAreaItem
      ]}
      onPress={() => handleSelect(item)}
    >
      <View style={[styles.focusAreaColor, { backgroundColor: item.color }]} />
      <View style={styles.focusAreaContent}>
        <Text style={[
          styles.focusAreaName,
          isDarkMode ? styles.lightText : styles.darkText
        ]}>
          {item.name}
        </Text>
        <Text style={styles.focusAreaPriority}>
          {item.priorityLevel.charAt(0).toUpperCase() + item.priorityLevel.slice(1)}
        </Text>
      </View>
      {value === item.id && (
        <Ionicons 
          name="checkmark-circle" 
          size={20} 
          color="#0A84FF" 
        />
      )}
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[
          styles.label,
          isDarkMode ? styles.lightText : styles.darkText
        ]}>
          {label}
          {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.pickerButton,
          isDarkMode ? styles.darkPickerButton : styles.lightPickerButton,
          error && styles.pickerButtonError
        ]}
        onPress={togglePicker}
      >
        {selectedFocusArea ? (
          <View style={styles.selectedContainer}>
            <View style={[
              styles.focusAreaColor, 
              { backgroundColor: selectedFocusArea.color }
            ]} />
            <Text style={[
              styles.selectedText,
              isDarkMode ? styles.lightText : styles.darkText
            ]}>
              {selectedFocusArea.name}
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>
            Select a focus area
          </Text>
        )}
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={isDarkMode ? '#FFFFFF' : '#000000'} 
        />
      </TouchableOpacity>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {/* Focus Area Picker Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalContent,
            isDarkMode ? styles.darkModalContent : styles.lightModalContent
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[
                styles.modalTitle,
                isDarkMode ? styles.lightText : styles.darkText
              ]}>
                Select Focus Area
              </Text>
              <TouchableOpacity onPress={togglePicker}>
                <Ionicons 
                  name="close-circle" 
                  size={24} 
                  color={isDarkMode ? '#FFFFFF' : '#000000'} 
                />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={orderedFocusAreas}
              renderItem={renderFocusAreaItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.focusAreaList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  lightText: {
    color: '#FFFFFF',
  },
  darkText: {
    color: '#000000',
  },
  requiredStar: {
    color: '#FF453A',
    marginLeft: 4,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
  },
  darkPickerButton: {
    backgroundColor: '#2C2C2E',
  },
  lightPickerButton: {
    backgroundColor: '#FFFFFF',
  },
  pickerButtonError: {
    borderWidth: 1,
    borderColor: '#FF453A',
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusAreaColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  selectedText: {
    fontSize: 16,
  },
  placeholderText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  errorText: {
    color: '#FF453A',
    fontSize: 14,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  darkModalContent: {
    backgroundColor: '#2C2C2E',
  },
  lightModalContent: {
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  focusAreaList: {
    padding: 16,
  },
  focusAreaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  darkFocusAreaItem: {
    backgroundColor: '#1C1C1E',
  },
  lightFocusAreaItem: {
    backgroundColor: '#F2F2F7',
  },
  selectedFocusAreaItem: {
    borderWidth: 1,
    borderColor: '#0A84FF',
  },
  focusAreaContent: {
    flex: 1,
    marginLeft: 8,
  },
  focusAreaName: {
    fontSize: 16,
    fontWeight: '500',
  },
  focusAreaPriority: {
    fontSize: 14,
    color: '#8E8E93',
  },
}); 