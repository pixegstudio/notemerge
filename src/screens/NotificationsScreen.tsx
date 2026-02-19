import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { IconButton } from '../components';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';

interface NotificationSettings {
  pushNotifications: boolean;
  studyReminders: boolean;
  weeklyReport: boolean;
  newFeatures: boolean;
  reminderTime: string;
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginTop: '10%',
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.headline.fontSize,
    fontWeight: Typography.headline.fontWeight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: Typography.footnote.fontSize,
  },
  infoCard: {
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.footnote.fontSize,
    lineHeight: 20,
  },
});

export const NotificationsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: false,
    studyReminders: false,
    weeklyReport: false,
    newFeatures: true,
    reminderTime: '09:00',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (key === 'pushNotifications' && !settings.pushNotifications) {
      // Show alert about enabling notifications
      Alert.alert(
        'Bildirimler',
        'Bildirimler şu anda devre dışı. Ayarlar > Bildirimler\'den NoteMerge için bildirimleri açabilirsiniz.',
        [
          { text: 'Tamam', style: 'default' },
        ]
      );
    }
    
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    
    // If push notifications are disabled, disable all other notifications
    if (key === 'pushNotifications' && settings.pushNotifications) {
      newSettings.studyReminders = false;
      newSettings.weeklyReport = false;
    }
    
    saveSettings(newSettings);
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    value,
    onToggle,
    disabled = false,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    value: boolean;
    onToggle: () => void;
    disabled?: boolean;
  }) => (
    <View
      style={[
        styles.settingItem,
        { 
          backgroundColor: theme.colors.card.background, 
          borderColor: theme.colors.card.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.accentGradient[0] + '20' }]}>
          <Ionicons name={icon} size={24} color={theme.colors.accentGradient[0]} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.colors.text.secondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: theme.colors.text.tertiary, true: theme.colors.accentGradient[0] }}
        thumbColor={theme.colors.text.inverse}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="arrow-back" onPress={() => navigation.goBack()} />
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Bildirimler</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Info Card */}
          <View style={styles.section}>
            <View style={[
              styles.infoCard,
              { 
                backgroundColor: theme.colors.accentGradient[0] + '10',
                borderColor: theme.colors.accentGradient[0] + '30',
              }
            ]}>
              <Ionicons name="information-circle" size={20} color={theme.colors.accentGradient[0]} />
              <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
                Bildirimler, ders hatırlatıcıları ve haftalık raporlar almanızı sağlar. İstediğiniz zaman kapatabilirsiniz.
              </Text>
            </View>
          </View>

          {/* Main Notifications */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              GENEL
            </Text>
            
            <SettingItem
              icon="notifications"
              title="Bildirimler"
              subtitle="Tüm bildirimleri aç/kapat"
              value={settings.pushNotifications}
              onToggle={() => handleToggle('pushNotifications')}
            />
          </View>

          {/* Study Reminders */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              HATIRLATICILAR
            </Text>
            
            <SettingItem
              icon="alarm"
              title="Çalışma Hatırlatıcıları"
              subtitle="Günlük çalışma hatırlatmaları"
              value={settings.studyReminders}
              onToggle={() => handleToggle('studyReminders')}
              disabled={!settings.pushNotifications}
            />

            <SettingItem
              icon="stats-chart"
              title="Haftalık Rapor"
              subtitle="Haftalık aktivite özeti"
              value={settings.weeklyReport}
              onToggle={() => handleToggle('weeklyReport')}
              disabled={!settings.pushNotifications}
            />
          </View>

          {/* App Updates */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              UYGULAMA
            </Text>
            
            <SettingItem
              icon="sparkles"
              title="Yeni Özellikler"
              subtitle="Yeni özellik duyuruları"
              value={settings.newFeatures}
              onToggle={() => handleToggle('newFeatures')}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
