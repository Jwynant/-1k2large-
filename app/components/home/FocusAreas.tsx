import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { PriorityItem, Priority } from './content-items';
import { EmptyPriorities } from './empty-states';

interface FocusAreasProps {
  priorities: Priority[];
  isDarkMode: boolean;
  onManagePress?: () => void;
}

export const FocusAreas: React.FC<FocusAreasProps> = ({
  priorities,
  isDarkMode,
  onManagePress,
}) => {
  const hasPriorities = priorities.length > 0;
  const primaryFocus = priorities.find(p => p.isPrimary);
  const secondaryFocus = priorities.filter(p => !p.isPrimary);

  return (
    <View style={styles.focusAreasSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
          Focus Areas
        </Text>
        <Pressable onPress={onManagePress}>
          <Text style={styles.seeAllText}>Manage</Text>
        </Pressable>
      </View>
      
      {hasPriorities ? (
        <View>
          {/* Primary Focus */}
          {primaryFocus && (
            <PriorityItem 
              priority={primaryFocus} 
              isPrimary={true}
              isDarkMode={isDarkMode} 
            />
          )}
          
          {/* Secondary Focus Areas */}
          {secondaryFocus.length > 0 && (
            <>
              <Text style={[styles.secondaryFocusHeading, isDarkMode && styles.darkSecondaryText]}>
                Supporting Focus Areas
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.secondaryFocusScrollContent}
              >
                {secondaryFocus.map(priority => (
                  <PriorityItem 
                    key={priority.id} 
                    priority={priority} 
                    isDarkMode={isDarkMode} 
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      ) : (
        <EmptyPriorities isDarkMode={isDarkMode} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  focusAreasSection: {
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 16,
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
  secondaryFocusHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginVertical: 12,
  },
  secondaryFocusScrollContent: {
    paddingBottom: 8,
    paddingRight: 16,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSecondaryText: {
    color: '#EBEBF5',
  },
});

export default FocusAreas; 