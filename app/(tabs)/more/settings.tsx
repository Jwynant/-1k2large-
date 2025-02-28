import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import UserSettings from '../../../components/settings/UserSettings';

export default function SettingsScreen() {
  const { state } = useAppContext();
  const isDarkMode = state.theme === 'light' ? false : true;

  return (
    <ScrollView 
      style={[
        styles.container,
        isDarkMode && styles.containerDark
      ]}
    >
      <UserSettings />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
});