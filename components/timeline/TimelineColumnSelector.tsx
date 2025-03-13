import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimelineColumn } from '../../app/types';

type TimelineColumnSelectorProps = {
  columns: TimelineColumn[];
  onToggleColumn: (columnId: string) => void;
};

export default function TimelineColumnSelector({ 
  columns, 
  onToggleColumn 
}: TimelineColumnSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Columns</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {columns.map((column) => (
          <TouchableOpacity
            key={column.id}
            style={[
              styles.columnButton,
              { borderColor: column.color },
              column.visible && { backgroundColor: `${column.color}20` } // 20% opacity
            ]}
            onPress={() => onToggleColumn(column.id)}
          >
            <View style={[styles.colorDot, { backgroundColor: column.color }]} />
            <Text style={styles.columnName}>{column.title}</Text>
            <Ionicons 
              name={column.visible ? 'checkmark-circle-outline' : 'ellipse-outline'} 
              size={18} 
              color={column.visible ? column.color : '#8E8E93'} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  columnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  columnName: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 6,
  },
}); 