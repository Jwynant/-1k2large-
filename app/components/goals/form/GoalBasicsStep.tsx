import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FocusArea } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GoalBasicsStepProps {
  title: string;
  focusAreaId: string;
  focusAreas: FocusArea[];
  errors: Record<string, string>;
  onUpdateForm: (updates: { title?: string; focusAreaId?: string }) => void;
}

export default function GoalBasicsStep({ 
  title, 
  focusAreaId, 
  focusAreas,
  errors,
  onUpdateForm 
}: GoalBasicsStepProps) {
  const handleTitleChange = (text: string) => {
    onUpdateForm({ title: text });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>What's your goal?</Text>
      
      {/* Goal Title Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Goal Title</Text>
        <TextInput
          style={[
            styles.input,
            errors.title ? styles.inputError : {}
          ]}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="What do you want to accomplish?"
          placeholderTextColor="#8E8E93"
          returnKeyType="done"
          blurOnSubmit={true}
        />
        {errors.title ? (
          <Text style={styles.errorText}>{errors.title}</Text>
        ) : null}
      </View>
      
      {/* Inspirational Quote */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>
          "A goal without a plan is just a wish."
        </Text>
        <Text style={styles.quoteAuthor}>— Antoine de Saint-Exupéry</Text>
      </View>
      
      {/* Focus Area Selection */}
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Focus Area</Text>
          <Text style={styles.optionalLabel}>(Optional)</Text>
        </View>
        {errors.focusAreaId ? (
          <Text style={styles.errorText}>{errors.focusAreaId}</Text>
        ) : null}
        
        <View style={styles.focusAreasGrid}>
          {focusAreas.map((area) => (
            <TouchableOpacity
              key={area.id}
              style={[
                styles.focusAreaCard,
                { borderLeftColor: area.color }
              ]}
              onPress={() => onUpdateForm({ focusAreaId: area.id })}
              activeOpacity={0.7}
            >
              <View style={styles.focusAreaContent}>
                <View style={[styles.focusAreaColor, { backgroundColor: area.color }]} />
                <Text 
                  style={styles.focusAreaName}
                  numberOfLines={2}
                >
                  {area.name}
                </Text>
                {focusAreaId === area.id && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={20} color={area.color} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* No Focus Area Option */}
        {focusAreaId && (
          <TouchableOpacity
            style={styles.clearFocusArea}
            onPress={() => onUpdateForm({ focusAreaId: '' })}
          >
            <Ionicons name="close-circle-outline" size={16} color="#FF453A" />
            <Text style={styles.clearFocusAreaText}>Clear selection</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.tipContainer}>
        <Ionicons name="bulb-outline" size={20} color="#FFCC00" style={styles.tipIcon} />
        <Text style={styles.tipText}>
          Great goals are specific, measurable, and have a clear deadline.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionalLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 18,
    height: 56,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    ...Platform.select({
      ios: {
        paddingTop: 16,
        paddingBottom: 16,
      },
      android: {
        textAlignVertical: 'center',
      },
    }),
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF453A',
  },
  errorText: {
    color: '#FF453A',
    fontSize: 14,
    marginTop: 4,
  },
  quoteContainer: {
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#0A84FF',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#AEAEB2',
    textAlign: 'right',
  },
  focusAreasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  focusAreaCard: {
    width: (SCREEN_WIDTH - 56) / 2,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderLeftWidth: 3,
  },
  focusAreaContent: {
    backgroundColor: '#2C2C2E',
    padding: 12,
    minHeight: 80,
    justifyContent: 'center',
    position: 'relative',
  },
  focusAreaColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  focusAreaName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  clearFocusArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 8,
  },
  clearFocusAreaText: {
    color: '#FF453A',
    fontSize: 14,
    marginLeft: 4,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  tipIcon: {
    marginRight: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#FFCC00',
    flex: 1,
  },
}); 