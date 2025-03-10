import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Pressable, 
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';

interface LifeExpectancyModalProps {
  visible: boolean;
  onClose: () => void;
  currentLifeExpectancy: number;
  onSave: (years: number) => void;
}

export default function LifeExpectancyModal({ 
  visible, 
  onClose, 
  currentLifeExpectancy, 
  onSave 
}: LifeExpectancyModalProps) {
  const [lifespan, setLifespan] = useState(currentLifeExpectancy);

  // Handle slider change
  const handleLifespanChange = (value: number) => {
    setLifespan(Math.round(value));
  };
  
  // Handle slider complete
  const handleSlidingComplete = (value: number) => {
    const roundedValue = Math.round(value);
    setLifespan(roundedValue);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Handle save
  const handleSave = () => {
    onSave(lifespan);
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
            <Text style={styles.modalTitle}>Edit Life Expectancy</Text>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>

          <View style={styles.lifespanContainer}>
            <View style={styles.lifespanValueContainer}>
              <Text style={styles.lifespanValue}>{lifespan}</Text>
              <Text style={styles.lifespanUnit}>years</Text>
            </View>
            
            <Text style={styles.monthsText}>
              ({lifespan * 12} months)
            </Text>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>70</Text>
              <Slider
                style={styles.slider}
                minimumValue={70}
                maximumValue={120}
                step={1}
                value={lifespan}
                onValueChange={handleLifespanChange}
                onSlidingComplete={handleSlidingComplete}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="rgba(255,255,255,0.2)"
                thumbTintColor="#007AFF"
              />
              <Text style={styles.sliderLabel}>120</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color="rgba(255,255,255,0.7)" />
            <Text style={styles.infoText}>
              Changing your life expectancy will update your life progress calculations and adjust the number of years shown in your life grid.
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
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  lifespanContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  lifespanValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  lifespanValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  lifespanUnit: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    marginLeft: 8,
  },
  monthsText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    width: 30,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 8,
    flex: 1,
  },
}); 