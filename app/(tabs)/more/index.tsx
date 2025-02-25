import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  href: string;
};

function MenuItem({ icon, label, href }: MenuItemProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Ionicons name={icon} size={24} color="#007AFF" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </Pressable>
    </Link>
  );
}

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>More</Text>
      
      <View style={styles.section}>
        <MenuItem
          icon="settings-outline"
          label="Settings"
          href="/more/settings"
        />
        <MenuItem
          icon="information-circle-outline"
          label="About"
          href="/more/about"
        />
        <MenuItem
          icon="help-circle-outline"
          label="Help"
          href="/more/help"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
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
});