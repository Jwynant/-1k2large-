import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Pressable, 
  Platform,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type ThemeOption = 'dark' | 'light' | 'system';

interface ThemeModalProps {
  visible: boolean;
  onClose: () => void;
  currentTheme: ThemeOption;
  onSave: (theme: ThemeOption) => void;
}

export default function ThemeModal({ 
  visible, 
  onClose, 
  currentTheme, 
  onSave 
}: ThemeModalProps) {
  // Theme options - removed light mode option
  const themeOptions: { value: ThemeOption; label: string; icon: string }[] = [
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'system', label: 'System', icon: 'settings' },
  ];

  // Handle theme selection
  const handleSelectTheme = (theme: ThemeOption) => {
    onSave(theme);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.modalTitle}>Select Theme</Text>
            <View style={{ width: 30 }} />
          </View>

          <View style={styles.themeOptionsContainer}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  currentTheme === option.value && styles.selectedThemeOption
                ]}
                onPress={() => handleSelectTheme(option.value)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={option.icon as any} 
                  size={24} 
                  color={currentTheme === option.value ? '#FFFFFF' : 'rgba(255,255,255,0.7)'} 
                />
                <Text style={[
                  styles.themeOptionText,
                  currentTheme === option.value && styles.selectedThemeOptionText
                ]}>
                  {option.label}
                </Text>
                {currentTheme === option.value && (
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color="rgba(255,255,255,0.7)" />
            <Text style={styles.infoText}>
              The app currently only supports dark mode. The system option will still use dark mode regardless of your device settings.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  closeButton: {
    padding: 5,
  },
  themeOptionsContainer: {
    marginVertical: 20,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedThemeOption: {
    backgroundColor: '#007AFF',
  },
  themeOptionText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 12,
    flex: 1,
  },
  selectedThemeOptionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 8,
    flex: 1,
  },
}); 