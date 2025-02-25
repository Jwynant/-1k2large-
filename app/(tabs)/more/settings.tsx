import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
};

function SettingItem({ icon, label, value }: SettingItemProps) {
  return (
    <Pressable style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon} size={24} color="#007AFF" style={styles.settingIcon} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {value ? (
        <Text style={styles.settingValue}>{value}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#999" />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <SettingItem icon="notifications" label="Notifications" />
        <SettingItem icon="lock-closed" label="Privacy" />
      </View>

      <View style={styles.section}>
        <SettingItem icon="moon" label="Dark Mode" value="Off" />
        <SettingItem icon="language" label="Language" value="English" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    color: '#999',
  },
});