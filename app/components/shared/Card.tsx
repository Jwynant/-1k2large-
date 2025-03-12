import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

interface CardProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  children: ReactNode;
  onHeaderPress?: () => void;
  rightHeaderContent?: ReactNode;
  testID?: string;
  hideHeader?: boolean;
}

export default function Card({
  title,
  iconName,
  iconColor,
  children,
  onHeaderPress,
  rightHeaderContent,
  testID,
  hideHeader = false
}: CardProps) {
  const { colors } = useTheme();
  const { spacing, fontSizes } = useResponsiveLayout();
  
  return (
    <View 
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: spacing.m,
          marginBottom: spacing.l,
          shadowColor: colors.text,
        }
      ]}
      testID={testID}
      accessibilityRole="none"
      accessibilityLabel={`${title} card`}
    >
      {!hideHeader && (
        <TouchableOpacity 
          style={[
            styles.cardHeader,
            {
              paddingHorizontal: spacing.l,
              paddingVertical: spacing.m,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }
          ]}
          onPress={onHeaderPress}
          activeOpacity={onHeaderPress ? 0.7 : 1}
          disabled={!onHeaderPress}
          accessibilityRole={onHeaderPress ? "button" : "header"}
          accessibilityLabel={`${title} header${onHeaderPress ? ', tap to expand' : ''}`}
          accessibilityHint={onHeaderPress ? "Toggles expanded view" : undefined}
        >
          <View style={styles.cardTitleContainer}>
            <Ionicons 
              name={iconName} 
              size={spacing.xl} 
              color={iconColor} 
              style={[styles.cardIcon, { marginRight: spacing.s }]}
              accessibilityLabel={`${iconName} icon`}
            />
            <Text 
              style={[
                styles.cardTitle,
                {
                  fontSize: fontSizes.l,
                  color: colors.text,
                }
              ]}
            >
              {title}
            </Text>
          </View>
          {rightHeaderContent}
        </TouchableOpacity>
      )}
      <View 
        style={[
          styles.cardContent,
          { padding: spacing.l }
        ]}
        accessibilityLabel={`${title} content`}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
}); 