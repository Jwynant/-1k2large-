import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useColorScheme,
  TextInput,
  Modal,
  FlatList,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock contacts - in a real app, this would come from the device's contacts
const CONTACTS = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Jane Doe' },
  { id: '3', name: 'Michael Johnson' },
  { id: '4', name: 'Emily Davis' },
  { id: '5', name: 'Robert Wilson' },
  { id: '6', name: 'Sarah Brown' },
  { id: '7', name: 'David Miller' },
  { id: '8', name: 'Jennifer Taylor' },
];

interface PeopleTagFieldProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
}

export default function PeopleTagField({ 
  label, 
  value, 
  onChange,
  required = false
}: PeopleTagFieldProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Filter contacts based on search text
  const filteredContacts = searchText
    ? CONTACTS.filter(contact => 
        contact.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : CONTACTS;
  
  // Handle adding a person
  const handleAddPerson = (personName: string) => {
    if (!value.includes(personName)) {
      onChange([...value, personName]);
    }
    setSearchText('');
  };
  
  // Handle removing a person
  const handleRemovePerson = (personName: string) => {
    onChange(value.filter(name => name !== personName));
  };
  
  // Render contact item
  const renderContactItem = ({ item }: { item: typeof CONTACTS[0] }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleAddPerson(item.name)}
    >
      <View style={styles.contactAvatar}>
        <Text style={styles.contactInitial}>
          {item.name.charAt(0)}
        </Text>
      </View>
      <Text style={[
        styles.contactName,
        isDarkMode ? styles.lightText : styles.darkText
      ]}>
        {item.name}
      </Text>
      {value.includes(item.name) && (
        <Ionicons 
          name="checkmark-circle" 
          size={20} 
          color="#4CD964" 
        />
      )}
    </TouchableOpacity>
  );
  
  // Render person tag
  const renderPersonTag = (name: string, index: number) => (
    <View 
      key={index} 
      style={styles.personTag}
    >
      <Text style={styles.personTagText}>{name}</Text>
      <TouchableOpacity
        onPress={() => handleRemovePerson(name)}
        style={styles.removeTagButton}
      >
        <Ionicons name="close-circle" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
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
        {value.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {value.map((name, index) => renderPersonTag(name, index))}
          </ScrollView>
        ) : (
          <Text style={[
            styles.placeholderText,
            isDarkMode ? styles.lightPlaceholder : styles.darkPlaceholder
          ]}>
            Tag people in this memory
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
                Tag People
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
                placeholder="Search for people"
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
            
            {value.length > 0 && (
              <View style={styles.selectedPeopleContainer}>
                <Text style={[
                  styles.selectedPeopleTitle,
                  isDarkMode ? styles.lightText : styles.darkText
                ]}>
                  Selected ({value.length})
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.selectedPeopleList}
                >
                  {value.map((name, index) => renderPersonTag(name, index))}
                </ScrollView>
              </View>
            )}
            
            <FlatList
              data={filteredContacts}
              renderItem={renderContactItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.contactsList}
              ListHeaderComponent={
                searchText.trim() ? (
                  <TouchableOpacity
                    style={styles.addCustomPerson}
                    onPress={() => handleAddPerson(searchText.trim())}
                  >
                    <Ionicons 
                      name="add-circle" 
                      size={20} 
                      color="#0A84FF" 
                      style={styles.addIcon}
                    />
                    <Text style={[
                      styles.addCustomPersonText,
                      isDarkMode ? styles.lightText : styles.darkText
                    ]}>
                      Add "{searchText.trim()}"
                    </Text>
                  </TouchableOpacity>
                ) : null
              }
            />
            
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
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
    minHeight: 56,
  },
  darkPickerButton: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  lightPickerButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D1D6',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flex: 1,
    paddingRight: 8,
  },
  personTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A84FF',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  personTagText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
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
  selectedPeopleContainer: {
    marginBottom: 16,
  },
  selectedPeopleTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  selectedPeopleList: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  contactsList: {
    paddingBottom: 80,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  contactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contactName: {
    fontSize: 16,
    flex: 1,
  },
  addCustomPerson: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  addIcon: {
    marginRight: 12,
  },
  addCustomPersonText: {
    fontSize: 16,
    color: '#0A84FF',
  },
  doneButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 