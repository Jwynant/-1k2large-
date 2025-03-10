import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useColorScheme,
  TextInput,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock location suggestions - in a real app, this would come from a location API
const LOCATION_SUGGESTIONS = [
  { id: '1', name: 'Home', address: 'Your home address' },
  { id: '2', name: 'Work', address: 'Your workplace' },
  { id: '3', name: 'Central Park', address: 'New York, NY, USA' },
  { id: '4', name: 'Eiffel Tower', address: 'Paris, France' },
  { id: '5', name: 'Golden Gate Bridge', address: 'San Francisco, CA, USA' },
  { id: '6', name: 'Sydney Opera House', address: 'Sydney, Australia' },
];

interface LocationPickerFieldProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function LocationPickerField({ 
  label, 
  value, 
  onChange,
  required = false
}: LocationPickerFieldProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Filter suggestions based on search text
  const filteredSuggestions = searchText
    ? LOCATION_SUGGESTIONS.filter(location => 
        location.name.toLowerCase().includes(searchText.toLowerCase()) ||
        location.address.toLowerCase().includes(searchText.toLowerCase())
      )
    : LOCATION_SUGGESTIONS;
  
  // Handle location selection
  const handleSelectLocation = (locationName: string) => {
    onChange(locationName);
    setModalVisible(false);
  };
  
  // Render location suggestion item
  const renderLocationItem = ({ item }: { item: typeof LOCATION_SUGGESTIONS[0] }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleSelectLocation(item.name)}
    >
      <Ionicons 
        name="location" 
        size={20} 
        color="#FF9500" 
        style={styles.locationIcon}
      />
      <View style={styles.locationInfo}>
        <Text style={[
          styles.locationName,
          isDarkMode ? styles.lightText : styles.darkText
        ]}>
          {item.name}
        </Text>
        <Text style={styles.locationAddress}>
          {item.address}
        </Text>
      </View>
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
        {value ? (
          <View style={styles.selectedLocationContainer}>
            <Ionicons 
              name="location" 
              size={20} 
              color="#FF9500" 
              style={styles.locationIcon}
            />
            <Text style={[
              styles.selectedLocationText,
              isDarkMode ? styles.lightText : styles.darkText
            ]}>
              {value}
            </Text>
          </View>
        ) : (
          <Text style={[
            styles.placeholderText,
            isDarkMode ? styles.lightPlaceholder : styles.darkPlaceholder
          ]}>
            Add a location
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
                Add Location
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
            
            <View style={[
              styles.searchContainer,
              isDarkMode ? styles.darkSearchContainer : styles.lightSearchContainer
            ]}>
              <Ionicons 
                name="search" 
                size={20} 
                color={isDarkMode ? '#AEAEB2' : '#8E8E93'} 
                style={styles.searchIcon}
              />
              <TextInput
                style={[
                  styles.searchInput,
                  isDarkMode ? styles.lightText : styles.darkText
                ]}
                placeholder="Search for a location"
                placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchText('')}
                  style={styles.clearButton}
                >
                  <Ionicons 
                    name="close-circle" 
                    size={20} 
                    color={isDarkMode ? '#AEAEB2' : '#8E8E93'} 
                  />
                </TouchableOpacity>
              )}
            </View>
            
            <FlatList
              data={filteredSuggestions}
              renderItem={renderLocationItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.locationList}
              ListHeaderComponent={
                <TouchableOpacity
                  style={styles.customLocationItem}
                  onPress={() => {
                    if (searchText.trim()) {
                      handleSelectLocation(searchText.trim());
                    }
                  }}
                >
                  <Ionicons 
                    name="add-circle" 
                    size={20} 
                    color="#0A84FF" 
                    style={styles.locationIcon}
                  />
                  <Text style={[
                    styles.customLocationText,
                    isDarkMode ? styles.lightText : styles.darkText
                  ]}>
                    {searchText.trim() 
                      ? `Use "${searchText.trim()}"` 
                      : "Enter a custom location"}
                  </Text>
                </TouchableOpacity>
              }
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
  selectedLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    marginRight: 8,
  },
  selectedLocationText: {
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  darkSearchContainer: {
    backgroundColor: '#2C2C2E',
  },
  lightSearchContainer: {
    backgroundColor: '#E5E5EA',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 4,
  },
  clearButton: {
    padding: 4,
  },
  locationList: {
    paddingBottom: 40,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: '#8E8E93',
  },
  customLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  customLocationText: {
    fontSize: 16,
    color: '#0A84FF',
  },
}); 