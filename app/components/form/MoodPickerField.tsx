import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useColorScheme,
  Modal,
  FlatList,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define mood options
const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#4CD964' },
  { id: 'excited', label: 'Excited', emoji: '🤩', color: '#FF9500' },
  { id: 'loved', label: 'Loved', emoji: '❤️', color: '#FF2D55' },
  { id: 'relaxed', label: 'Relaxed', emoji: '😌', color: '#5856D6' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏', color: '#AF52DE' },
  { id: 'accomplished', label: 'Accomplished', emoji: '🏆', color: '#FFCC00' },
  { id: 'neutral', label: 'Neutral', emoji: '😐', color: '#8E8E93' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#30B0C7' },
  { id: 'angry', label: 'Angry', emoji: '😠', color: '#FF3B30' },
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#FF9500' },
  { id: 'tired', label: 'Tired', emoji: '😴', color: '#8E8E93' },
  { id: 'confused', label: 'Confused', emoji: '🤔', color: '#5856D6' },
];

interface MoodPickerFieldProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function MoodPickerField({ 
  label, 
  value, 
  onChange,
  required = false
}: MoodPickerFieldProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  
  // Get selected mood
  const selectedMood = MOODS.find(mood => mood.id === value);
  
  // Handle mood selection
  const handleSelectMood = (moodId: string) => {
    onChange(moodId);
    setModalVisible(false);
  };
  
  // Render mood item
  const renderMoodItem = ({ item }: { item: typeof MOODS[0] }) => (
    <TouchableOpacity
      style={[
        styles.moodItem,
        isDarkMode ? styles.darkMoodItem : styles.lightMoodItem,
        value === item.id && { borderColor: item.color, borderWidth: 2 }
      ]}
      onPress={() => handleSelectMood(item.id)}
    >
      <Text style={styles.moodEmoji}>{item.emoji}</Text>
      <Text style={[
        styles.moodLabel,
        isDarkMode ? styles.lightText : styles.darkText
      ]}>
        {item.label}
      </Text>
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
          isDarkMode ? styles.darkPickerButton : styles.lightPickerButton
        ]}
        onPress={() => setModalVisible(true)}
      >
        {selectedMood ? (
          <View style={styles.selectedMoodContainer}>
            <Text style={styles.selectedMoodEmoji}>{selectedMood.emoji}</Text>
            <Text style={[
              styles.selectedMoodLabel,
              isDarkMode ? styles.lightText : styles.darkText
            ]}>
              {selectedMood.label}
            </Text>
          </View>
        ) : (
          <Text style={[
            styles.placeholderText,
            isDarkMode ? styles.lightPlaceholder : styles.darkPlaceholder
          ]}>
            Select a mood
          </Text>
        )}
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={isDarkMode ? '#FFFFFF' : '#000000'} 
        />
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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
                Select Mood
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={isDarkMode ? '#FFFFFF' : '#000000'} 
                />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={MOODS}
              renderItem={renderMoodItem}
              keyExtractor={item => item.id}
              numColumns={3}
              contentContainerStyle={styles.moodList}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
  },
  darkPickerButton: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  lightPickerButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D1D6',
  },
  selectedMoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedMoodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  selectedMoodLabel: {
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 16,
  },
  lightPlaceholder: {
    color: '#AEAEB2',
  },
  darkPlaceholder: {
    color: '#8E8E93',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  darkModalContent: {
    backgroundColor: '#1C1C1E',
  },
  lightModalContent: {
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  moodList: {
    paddingBottom: 40,
  },
  moodItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    aspectRatio: 1,
  },
  darkMoodItem: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  lightMoodItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D1D6',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
}); 