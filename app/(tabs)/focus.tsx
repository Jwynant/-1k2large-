import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusAreas } from '../hooks/useFocusAreas';
import { FocusArea } from '../types';

export default function FocusScreen() {
  const { 
    orderedFocusAreas, 
    addFocusArea, 
    updateFocusArea, 
    deleteFocusArea,
    totalAllocation,
    isAllocationValid,
    normalizeAllocations,
    getPresetColor
  } = useFocusAreas();
  
  const [isAddingFocus, setIsAddingFocus] = useState(false);
  const [newFocusName, setNewFocusName] = useState('');
  const [newFocusAllocation, setNewFocusAllocation] = useState('');
  
  // Function to handle adding a new focus area
  const handleAddFocus = () => {
    if (!newFocusName.trim()) {
      Alert.alert('Error', 'Please enter a name for the focus area');
      return;
    }
    
    const allocation = parseInt(newFocusAllocation, 10) || 0;
    if (allocation <= 0 || allocation > 100) {
      Alert.alert('Error', 'Allocation must be between 1 and 100');
      return;
    }
    
    // Create a new focus area
    addFocusArea({
      name: newFocusName.trim(),
      color: getPresetColor(orderedFocusAreas.length),
      allocation: allocation,
      rank: orderedFocusAreas.length + 1, // Place at the end of the list
    });
    
    // Reset form and hide it
    setNewFocusName('');
    setNewFocusAllocation('');
    setIsAddingFocus(false);
    
    // Normalize allocations to ensure they sum to 100%
    normalizeAllocations();
  };
  
  // Function to handle deleting a focus area
  const handleDeleteFocus = (area: FocusArea) => {
    Alert.alert(
      'Delete Focus Area',
      `Are you sure you want to delete "${area.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            deleteFocusArea(area.id);
            normalizeAllocations();
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Function to handle updating allocation
  const handleUpdateAllocation = (area: FocusArea, newAllocation: string) => {
    const allocation = parseInt(newAllocation, 10) || 0;
    if (allocation <= 0 || allocation > 100) return;
    
    updateFocusArea({
      ...area,
      allocation: allocation
    });
    
    // Normalize allocations to ensure they sum to 100%
    normalizeAllocations();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Focus Areas</Text>
        <Text style={styles.subtitle}>Prioritize what matters most</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Allocation Progress Bar */}
        <View style={styles.allocationContainer}>
          <Text style={styles.allocationTitle}>
            Allocation: {totalAllocation}%
          </Text>
          <View style={styles.allocationBarContainer}>
            {orderedFocusAreas.map((area) => (
              <View 
                key={area.id} 
                style={[
                  styles.allocationSegment, 
                  { 
                    backgroundColor: area.color,
                    width: `${area.allocation}%` 
                  }
                ]} 
              />
            ))}
          </View>
          {!isAllocationValid && (
            <Text style={styles.allocationWarning}>
              Note: Allocations should sum to 100%
            </Text>
          )}
        </View>
        
        {/* Focus Areas List */}
        <Text style={styles.sectionTitle}>Your Priorities</Text>
        {orderedFocusAreas.map((area, index) => (
          <View key={area.id} style={styles.focusItem}>
            <View style={[styles.focusColor, { backgroundColor: area.color }]} />
            <View style={styles.focusContent}>
              <View style={styles.focusHeader}>
                <Text style={styles.focusName}>{area.name}</Text>
                <Text style={styles.focusRank}>
                  {index === 0 ? 'Primary' : 
                   index === 1 ? 'Secondary' : 
                   index === 2 ? 'Tertiary' : `Priority ${index + 1}`}
                </Text>
              </View>
              
              <View style={styles.focusAllocation}>
                <Text style={styles.focusAllocationLabel}>Allocation:</Text>
                <TextInput
                  style={styles.focusAllocationInput}
                  value={area.allocation.toString()}
                  keyboardType="numeric"
                  onChangeText={(value) => handleUpdateAllocation(area, value)}
                  maxLength={3}
                />
                <Text style={styles.focusAllocationPercent}>%</Text>
              </View>
            </View>
            
            <Pressable 
              style={styles.focusDeleteButton}
              onPress={() => handleDeleteFocus(area)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </Pressable>
          </View>
        ))}
        
        {/* Add Focus Form */}
        {isAddingFocus ? (
          <View style={styles.addFocusForm}>
            <Text style={styles.addFocusTitle}>New Focus Area</Text>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Health, Career, Relationships"
                value={newFocusName}
                onChangeText={setNewFocusName}
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Allocation (%)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 30"
                value={newFocusAllocation}
                onChangeText={setNewFocusAllocation}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            
            <View style={styles.formButtons}>
              <Pressable 
                style={[styles.formButton, styles.formCancelButton]}
                onPress={() => {
                  setIsAddingFocus(false);
                  setNewFocusName('');
                  setNewFocusAllocation('');
                }}
              >
                <Text style={styles.formCancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.formButton, styles.formAddButton]}
                onPress={handleAddFocus}
              >
                <Text style={styles.formAddButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable 
            style={styles.addButton}
            onPress={() => setIsAddingFocus(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.addButtonText}>Add Focus Area</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode background
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#AEAEB2',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  allocationContainer: {
    marginBottom: 24,
  },
  allocationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  allocationBarContainer: {
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2C2C2E',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  allocationSegment: {
    height: '100%',
  },
  allocationWarning: {
    fontSize: 14,
    color: '#FF453A',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },
  focusColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
  },
  focusContent: {
    flex: 1,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  focusName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  focusRank: {
    fontSize: 14,
    color: '#AEAEB2',
  },
  focusAllocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusAllocationLabel: {
    fontSize: 14,
    color: '#AEAEB2',
    marginRight: 8,
  },
  focusAllocationInput: {
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: '#FFFFFF',
    width: 48,
    textAlign: 'center',
  },
  focusAllocationPercent: {
    fontSize: 14,
    color: '#AEAEB2',
    marginLeft: 4,
  },
  focusDeleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 8,
  },
  addFocusForm: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  addFocusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: '#AEAEB2',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  formButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  formCancelButton: {
    backgroundColor: '#3A3A3C',
  },
  formCancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  formAddButton: {
    backgroundColor: '#007AFF',
  },
  formAddButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 