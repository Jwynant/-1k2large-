import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

// Form Field Container
interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({ label, error, children, required = false }: FormFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredIndicator}>*</Text>}
      </View>
      {children}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// Text Input Field
interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  required?: boolean;
  error?: string;
}

export function TextInputField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  required = false,
  error,
}: TextInputFieldProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.multilineInput,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        maxLength={maxLength}
      />
      {maxLength && (
        <Text style={styles.characterCount}>
          {value.length}/{maxLength}
        </Text>
      )}
    </FormField>
  );
}

// Date Picker Field
interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  required?: boolean;
  error?: string;
}

export function DatePickerField({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  required = false,
  error,
}: DatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formattedDate = value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <FormField label={label} error={error} required={required}>
      <TouchableOpacity
        style={[styles.datePickerButton, error && styles.inputError]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </FormField>
  );
}

// Emoji Picker Field
interface EmojiPickerFieldProps {
  label: string;
  value: string;
  onSelect: (emoji: string) => void;
  error?: string;
}

export function EmojiPickerField({
  label,
  value,
  onSelect,
  error,
}: EmojiPickerFieldProps) {
  // For now, we'll use a simple set of emojis
  // In a real app, you'd want a more comprehensive emoji picker
  const commonEmojis = ['😊', '😍', '🎉', '🎂', '🏆', '💡', '📚', '✈️', '🏠', '💼', '🎯', '🚀'];

  return (
    <FormField label={label} error={error}>
      <View style={styles.emojiPickerContainer}>
        <View style={styles.selectedEmojiContainer}>
          <Text style={styles.selectedEmoji}>{value || '😊'}</Text>
        </View>
        <View style={styles.emojiGrid}>
          {commonEmojis.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={[
                styles.emojiButton,
                value === emoji && styles.selectedEmojiButton,
              ]}
              onPress={() => onSelect(emoji)}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </FormField>
  );
}

// Media Upload Field (placeholder for now)
interface MediaUploadFieldProps {
  label: string;
  onAddMedia: () => void;
  mediaCount: number;
  error?: string;
}

export function MediaUploadField({
  label,
  onAddMedia,
  mediaCount,
  error,
}: MediaUploadFieldProps) {
  return (
    <FormField label={label} error={error}>
      <TouchableOpacity style={styles.mediaUploadButton} onPress={onAddMedia}>
        <Ionicons name="image-outline" size={24} color="#4A90E2" />
        <Text style={styles.mediaUploadText}>
          {mediaCount > 0
            ? `${mediaCount} photo${mediaCount !== 1 ? 's' : ''} selected`
            : 'Add photos'}
        </Text>
      </TouchableOpacity>
    </FormField>
  );
}

// Importance Rating Field
interface ImportanceRatingFieldProps {
  label: string;
  value: number;
  onChange: (rating: number) => void;
  error?: string;
}

export function ImportanceRatingField({
  label,
  value,
  onChange,
  error,
}: ImportanceRatingFieldProps) {
  return (
    <FormField label={label} error={error}>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingButton,
              value >= rating && styles.ratingButtonActive,
            ]}
            onPress={() => onChange(rating)}
          >
            <Text
              style={[
                styles.ratingText,
                value >= rating && styles.ratingTextActive,
              ]}
            >
              {rating}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  requiredIndicator: {
    color: '#FF3B30',
    marginLeft: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  emojiPickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  selectedEmojiContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedEmoji: {
    fontSize: 32,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emojiButton: {
    width: '16%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
  },
  selectedEmojiButton: {
    backgroundColor: '#E1EFFF',
  },
  emoji: {
    fontSize: 24,
  },
  mediaUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderStyle: 'dashed',
  },
  mediaUploadText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A90E2',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  ratingButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  ratingTextActive: {
    color: '#FFF',
  },
}); 