import React from 'react';
import { StyleSheet } from 'react-native';
import SimplifiedFocusAreas from '../focus/SimplifiedFocusAreas';
import Card from '../shared/Card';

export default function FocusAreasCard() {
  return (
    <Card
      title="Focus Areas"
      iconName="compass"
      iconColor="#FFD700"
      hideHeader={true}
    >
      <SimplifiedFocusAreas />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardContent: {
    padding: 16,
  },
}); 