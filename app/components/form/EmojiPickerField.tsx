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

// Common emojis for different content types
const COMMON_EMOJIS = [
  '😊', '😃', '🎉', '🎯', '🏆', '💪', '🚀', '✨', '💡', '📝',
  '📚', '🏋️', '🧠', '🌱', '🌟', '🔥', '❤️', '🙏', '👍', '👏',
  '🎓', '💼', '🏠', '🌍', '🧘', '🍎', '💰', '⏰', '🎵', '🎨'
];

interface EmojiPickerFieldProps {
  label: string;
  value: string;
  onSelect: (emoji: string) => void;
  required?: boolean;
}

export default function EmojiPickerField({ 
  label, 
  value, 
  onSelect,
  required = false
}: EmojiPickerFieldProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const [showPicker, setShowPicker] = useState(false);
  
  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowPicker(!showPicker);
  };
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    onSelect(emoji);
    setShowPicker(false);
  };
  
  // Render emoji item
  const renderEmojiItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.emojiItem}
      onPress={() => handleEmojiSelect(item)}
    >
      <Text style={styles.emoji}>{item}</Text>
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
          styles.emojiButton,
          isDarkMode ? styles.darkEmojiButton : styles.lightEmojiButton
        ]}
        onPress={toggleEmojiPicker}
      >
        {value ? (
          <Text style={styles.selectedEmoji}>{value}</Text>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons 
              name="happy-outline" 
              size={20} 
              color={isDarkMode ? '#8E8E93' : '#8E8E93'} 
            />
            <Text style={styles.placeholderText}>Select an emoji</Text>
          </View>
        )}
      </TouchableOpacity>
      
      {/* Emoji Picker Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={[
            styles.pickerContainer,
            isDarkMode ? styles.darkPickerContainer : styles.lightPickerContainer
          ]}>
            <View style={styles.pickerHeader}>
              <Text style={[
                styles.pickerTitle,
                isDarkMode ? styles.lightText : styles.darkText
              ]}>
                Select Emoji
              </Text>
              <TouchableOpacity onPress={toggleEmojiPicker}>
                <Ionicons 
                  name="close-circle" 
                  size={24} 
                  color={isDarkMode ? '#FFFFFF' : '#000000'} 
                />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={COMMON_EMOJIS}
              renderItem={renderEmojiItem}
              keyExtractor={(item) => item}
              numColumns={5}
              contentContainerStyle={styles.emojiList}
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
  emojiButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  darkEmojiButton: {
    backgroundColor: '#2C2C2E',
  },
  lightEmojiButton: {
    backgroundColor: '#FFFFFF',
  },
  selectedEmoji: {
    fontSize: 24,
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#8E8E93',
    marginLeft: 8,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    width: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  darkPickerContainer: {
    backgroundColor: '#2C2C2E',
  },
  lightPickerContainer: {
    backgroundColor: '#FFFFFF',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emojiList: {
    padding: 16,
  },
  emojiItem: {
    width: '20%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
}); 