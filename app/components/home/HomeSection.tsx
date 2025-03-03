import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface HomeSectionProps {
  title: string;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
  seeAllText?: string;
  children: ReactNode;
  isDarkMode: boolean;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  title,
  showSeeAll = true,
  onSeeAllPress,
  seeAllText = 'See All',
  children,
  isDarkMode
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{title}</Text>
        {showSeeAll && (
          <Pressable onPress={onSeeAllPress}>
            <Text style={styles.seeAllText}>{seeAllText}</Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  darkText: {
    color: '#FFFFFF',
  },
});

export default HomeSection; 