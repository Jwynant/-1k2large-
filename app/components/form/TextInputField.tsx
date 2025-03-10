import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  useColorScheme,
  TextInputProps
} from 'react-native';

interface TextInputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export default function TextInputField({ 
  label, 
  error, 
  required = false,
  ...props 
}: TextInputFieldProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
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
      
      <TextInput
        style={[
          styles.input,
          isDarkMode ? styles.darkInput : styles.lightInput,
          props.multiline && styles.multilineInput,
          error && styles.inputError
        ]}
        placeholderTextColor={isDarkMode ? '#8E8E93' : '#8E8E93'}
        {...props}
      />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
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
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  darkInput: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    borderColor: '#3A3A3C',
  },
  lightInput: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    borderColor: '#D1D1D6',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
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
}); 