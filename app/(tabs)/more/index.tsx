import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, useColorScheme } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';

type SettingsPath = '/more/settings' | '/more/about';

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  href: string;
  badge?: string | number;
  isPlaceholder?: boolean;
};

function MenuItem({ icon, label, href, badge, isPlaceholder = false }: MenuItemProps) {
  const { state } = useAppContext();
  const isDarkMode = state.theme === 'light' ? false : true;
  const router = useRouter();
  
  const handlePress = () => {
    if (isPlaceholder) {
      alert('This feature is coming soon!');
    } else {
      navigateTo(router, href);
    }
  };
  
  function navigateTo(router: any, path: string) {
    if (path.startsWith('/')) {
      router.push(path as any);
    }
  }
  
  return (
    <Pressable 
      style={[
        styles.menuItem, 
        isDarkMode && styles.menuItemDark,
        isPlaceholder && styles.menuItemPlaceholder
      ]}
      onPress={handlePress}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={isDarkMode ? "#0A84FF" : "#007AFF"} 
          style={styles.menuIcon} 
        />
        <Text style={[
          styles.menuLabel,
          isDarkMode && styles.textLight,
          isPlaceholder && styles.placeholderText
        ]}>
          {label}
        </Text>
      </View>
      
      <View style={styles.menuItemRight}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDarkMode ? "#666" : "#999"} 
        />
      </View>
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  const { state } = useAppContext();
  const isDarkMode = state.theme === 'light' ? false : true;
  
  return (
    <Text style={[
      styles.sectionHeader,
      isDarkMode && styles.textLight
    ]}>
      {title}
    </Text>
  );
}

export default function MoreScreen() {
  const { state } = useAppContext();
  const isDarkMode = state.theme === 'light' ? false : true;
  const router = useRouter();
  
  // Calculate user's age for profile section
  const calculateAge = () => {
    if (!state.userBirthDate) return null;
    
    const today = new Date();
    const birthDate = new Date(state.userBirthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const navigateToProfile = () => {
    navigateTo(router, '/more/settings');
  };
  
  // Helper function to handle navigation
  function navigateTo(router: any, path: string) {
    if (path.startsWith('/')) {
      router.push(path as any);
    }
  }
  
  const userAge = calculateAge();
  
  return (
    <ScrollView 
      style={[
        styles.container,
        isDarkMode && styles.containerDark
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[
        styles.title,
        isDarkMode && styles.textLight
      ]}>
        More
      </Text>
      
      {/* User Profile Section */}
      <Pressable 
        style={[
          styles.profileSection,
          isDarkMode && styles.profileSectionDark
        ]}
        onPress={navigateToProfile}
      >
        <View style={styles.profileImageContainer}>
          <View style={[
            styles.profileImage,
            isDarkMode && styles.profileImageDark
          ]}>
            <Ionicons name="person" size={40} color={isDarkMode ? "#666" : "#ccc"} />
          </View>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={[
            styles.profileName,
            isDarkMode && styles.textLight
          ]}>
            Your Profile
          </Text>
          <Text style={styles.profileDetails}>
            {userAge ? `${userAge} years old` : "Set your birth date in settings"}
          </Text>
        </View>
        
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDarkMode ? "#666" : "#999"} 
        />
      </Pressable>
      
      {/* Settings Section - Fully Implemented */}
      <SectionHeader title="Settings" />
      <View style={[
        styles.section,
        isDarkMode && styles.sectionDark
      ]}>
        <MenuItem
          icon="person-outline"
          label="Profile & Birth Date"
          href="/more/settings"
        />
        <MenuItem
          icon="color-palette-outline"
          label="Appearance"
          href="/more/settings"
        />
        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          href="/more/settings"
          isPlaceholder={true}
        />
        <MenuItem
          icon="apps-outline"
          label="Default View"
          href="/more/settings"
          isPlaceholder={true}
        />
      </View>
      
      {/* Personalization Section - Placeholder */}
      <SectionHeader title="Personalization" />
      <View style={[
        styles.section,
        isDarkMode && styles.sectionDark
      ]}>
        <MenuItem
          icon="color-wand-outline"
          label="Accent Color"
          href="/more/accent-color"
          isPlaceholder={true}
        />
        <MenuItem
          icon="bookmark-outline"
          label="Life Milestones"
          href="/more/milestones"
          isPlaceholder={true}
        />
        <MenuItem
          icon="leaf-outline"
          label="Seasons & Categories"
          href="/more/seasons"
          isPlaceholder={true}
        />
      </View>
      
      {/* Data Management Section - Placeholder */}
      <SectionHeader title="Data Management" />
      <View style={[
        styles.section,
        isDarkMode && styles.sectionDark
      ]}>
        <MenuItem
          icon="cloud-upload-outline"
          label="Backup & Restore"
          href="/more/backup"
          isPlaceholder={true}
        />
        <MenuItem
          icon="download-outline"
          label="Export Data"
          href="/more/export"
          isPlaceholder={true}
        />
        <MenuItem
          icon="lock-closed-outline"
          label="Privacy Settings"
          href="/more/privacy"
          isPlaceholder={true}
        />
      </View>
      
      {/* Life Perspective Tools - Placeholder */}
      <SectionHeader title="Life Perspective Tools" />
      <View style={[
        styles.section,
        isDarkMode && styles.sectionDark
      ]}>
        <MenuItem
          icon="hourglass-outline"
          label="Life Expectancy Calculator"
          href="/more/calculator"
          isPlaceholder={true}
        />
        <MenuItem
          icon="pie-chart-outline"
          label="Time Allocation Insights"
          href="/more/time-insights"
          isPlaceholder={true}
        />
        <MenuItem
          icon="fitness-outline"
          label="Intentionality Exercises"
          href="/more/exercises"
          isPlaceholder={true}
        />
      </View>
      
      {/* Sharing & Connectivity - Placeholder */}
      <SectionHeader title="Sharing & Connectivity" />
      <View style={[
        styles.section,
        isDarkMode && styles.sectionDark
      ]}>
        <MenuItem
          icon="share-outline"
          label="Share Visualizations"
          href="/more/share"
          isPlaceholder={true}
        />
        <MenuItem
          icon="document-outline"
          label="Export as PDF"
          href="/more/export-pdf"
          isPlaceholder={true}
        />
        <MenuItem
          icon="calendar-outline"
          label="Calendar Integration"
          href="/more/calendar"
          isPlaceholder={true}
        />
      </View>
      
      {/* App Information - Placeholder */}
      <SectionHeader title="App Information" />
      <View style={[
        styles.section,
        isDarkMode && styles.sectionDark
      ]}>
        <MenuItem
          icon="information-circle-outline"
          label="About 1000 Months"
          href="/more/about"
        />
        <MenuItem
          icon="book-outline"
          label="User Guide"
          href="/more/guide"
          isPlaceholder={true}
        />
        <MenuItem
          icon="code-outline"
          label="Version"
          href="/more/version"
          badge="1.0.0"
        />
      </View>
      
      {/* Support - Placeholder */}
      <SectionHeader title="Support" />
      <View style={[
        styles.section,
        isDarkMode && styles.sectionDark
      ]}>
        <MenuItem
          icon="help-circle-outline"
          label="FAQ"
          href="/more/faq"
          isPlaceholder={true}
        />
        <MenuItem
          icon="mail-outline"
          label="Contact Developer"
          href="/more/contact"
          isPlaceholder={true}
        />
        <MenuItem
          icon="bug-outline"
          label="Report a Bug"
          href="/more/bug"
          isPlaceholder={true}
        />
      </View>
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
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },
  textLight: {
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionDark: {
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
    color: '#000',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemDark: {
    borderBottomColor: '#2C2C2E',
  },
  menuItemPlaceholder: {
    opacity: 0.7,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 17,
    color: '#000',
  },
  placeholderText: {
    opacity: 0.8,
  },
  badge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileSectionDark: {
    backgroundColor: '#1C1C1E',
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageDark: {
    backgroundColor: '#2C2C2E',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: '#666',
  },
});