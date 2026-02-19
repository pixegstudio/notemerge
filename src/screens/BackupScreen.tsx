import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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
import { StorageService } from '../services/StorageService';

const BACKUP_SETTINGS_KEY = '@backup_settings';

interface BackupSettings {
  autoBackup: boolean;
  wifiOnly: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  lastBackup: string | null;
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
  actionButton: {
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  actionButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
  statsCard: {
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  statsLabel: {
    fontSize: Typography.body.fontSize,
  },
  statsValue: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
});

export const BackupScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [settings, setSettings] = useState<BackupSettings>({
    autoBackup: false,
    wifiOnly: true,
    backupFrequency: 'weekly',
    lastBackup: null,
  });
  
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [cacheSize, setCacheSize] = useState('0 MB');

  useEffect(() => {
    loadSettings();
    loadCacheSize();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(BACKUP_SETTINGS_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading backup settings:', error);
    }
  };

  const saveSettings = async (newSettings: BackupSettings) => {
    try {
      await AsyncStorage.setItem(BACKUP_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving backup settings:', error);
    }
  };

  const loadCacheSize = async () => {
    const size = await StorageService.getCacheSize();
    setCacheSize(size);
  };

  const handleToggle = (key: keyof BackupSettings) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    saveSettings(newSettings);
  };

  const handleBackupNow = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsBackingUp(true);
    
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSettings = {
        ...settings,
        lastBackup: new Date().toISOString(),
      };
      await saveSettings(newSettings);
      
      Alert.alert(
        'Yedekleme Tamamlandı',
        'Verileriniz başarıyla yedeklendi.',
        [{ text: 'Tamam', style: 'default' }]
      );
    } catch (error) {
      Alert.alert(
        'Hata',
        'Yedekleme sırasında bir hata oluştu.',
        [{ text: 'Tamam', style: 'default' }]
      );
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Yedekten Geri Yükle',
      'Son yedekleme geri yüklenecek. Mevcut veriler silinecek. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Geri Yükle',
          style: 'destructive',
          onPress: async () => {
            setIsRestoring(true);
            try {
              // Simulate restore process
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              Alert.alert(
                'Geri Yükleme Tamamlandı',
                'Verileriniz başarıyla geri yüklendi.',
                [{ text: 'Tamam', style: 'default' }]
              );
            } catch (error) {
              Alert.alert(
                'Hata',
                'Geri yükleme sırasında bir hata oluştu.',
                [{ text: 'Tamam', style: 'default' }]
              );
            } finally {
              setIsRestoring(false);
            }
          },
        },
      ]
    );
  };

  const handleClearCache = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Önbelleği Temizle',
      'Geçici dosyalar ve önbellek temizlenecek. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: async () => {
            const result = await StorageService.clearCache();
            await loadCacheSize();
            
            Alert.alert(
              result.success ? 'Başarılı' : 'Hata',
              result.message,
              [{ text: 'Tamam', style: 'default' }]
            );
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Henüz yedekleme yapılmadı';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            Yedekleme
          </Text>
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
              <Ionicons name="cloud" size={20} color={theme.colors.accentGradient[0]} />
              <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
                iCloud ile verilerinizi güvenli bir şekilde yedekleyin ve tüm cihazlarınızda senkronize edin.
              </Text>
            </View>
          </View>

          {/* Backup Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              YEDEKLEME BİLGİLERİ
            </Text>
            
            <View style={[
              styles.statsCard,
              { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
            ]}>
              <View style={styles.statsRow}>
                <Text style={[styles.statsLabel, { color: theme.colors.text.secondary }]}>
                  Son Yedekleme
                </Text>
                <Text style={[styles.statsValue, { color: theme.colors.text.primary }]}>
                  {formatDate(settings.lastBackup)}
                </Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={[styles.statsLabel, { color: theme.colors.text.secondary }]}>
                  Önbellek Boyutu
                </Text>
                <Text style={[styles.statsValue, { color: theme.colors.text.primary }]}>
                  {cacheSize}
                </Text>
              </View>
            </View>
          </View>

          {/* Auto Backup Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              OTOMATİK YEDEKLEME
            </Text>
            
            <SettingItem
              icon="sync"
              title="Otomatik Yedekleme"
              subtitle="Verilerinizi otomatik olarak yedekle"
              value={settings.autoBackup}
              onToggle={() => handleToggle('autoBackup')}
            />

            <SettingItem
              icon="wifi"
              title="Sadece Wi-Fi"
              subtitle="Yedekleme için Wi-Fi kullan"
              value={settings.wifiOnly}
              onToggle={() => handleToggle('wifiOnly')}
              disabled={!settings.autoBackup}
            />
          </View>

          {/* Manual Actions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              MANUEL İŞLEMLER
            </Text>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleBackupNow}
              disabled={isBackingUp}
              style={styles.actionButton}
            >
              <LinearGradient
                colors={theme.colors.accentGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButtonGradient}
              >
                {isBackingUp ? (
                  <ActivityIndicator color={theme.colors.text.inverse} />
                ) : (
                  <>
                    <Ionicons name="cloud-upload" size={20} color={theme.colors.text.inverse} />
                    <Text style={[styles.actionButtonText, { color: theme.colors.text.inverse }]}>
                      Şimdi Yedekle
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: Spacing.sm }} />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRestore}
              disabled={isRestoring || !settings.lastBackup}
              style={[
                styles.actionButton,
                { opacity: !settings.lastBackup ? 0.5 : 1 }
              ]}
            >
              <View style={[
                styles.actionButtonGradient,
                { backgroundColor: theme.colors.card.background, borderWidth: 1, borderColor: theme.colors.card.border }
              ]}>
                {isRestoring ? (
                  <ActivityIndicator color={theme.colors.accentGradient[0]} />
                ) : (
                  <>
                    <Ionicons name="cloud-download" size={20} color={theme.colors.accentGradient[0]} />
                    <Text style={[styles.actionButtonText, { color: theme.colors.accentGradient[0] }]}>
                      Yedekten Geri Yükle
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            <View style={{ height: Spacing.sm }} />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleClearCache}
              style={styles.actionButton}
            >
              <View style={[
                styles.actionButtonGradient,
                { backgroundColor: theme.colors.card.background, borderWidth: 1, borderColor: theme.colors.card.border }
              ]}>
                <Ionicons name="trash" size={20} color="#FF6B6B" />
                <Text style={[styles.actionButtonText, { color: '#FF6B6B' }]}>
                  Önbelleği Temizle
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
