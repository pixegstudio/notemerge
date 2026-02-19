import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { IconButton } from '../components';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { StorageService } from '../services/StorageService';

// ============================================================
// STYLES
// ============================================================
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
  premiumCard: {
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  premiumGradient: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: Typography.headline.fontSize,
    fontWeight: Typography.headline.fontWeight,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  premiumSubtitle: {
    fontSize: Typography.callout.fontSize,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export const SettingsScreen = ({ navigation }: any) => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const [isPremium, setIsPremium] = useState(false);
  const [cacheSize, setCacheSize] = useState('0 MB');
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    loadPremiumStatus();
    loadCacheSize();
  }, []);

  const loadPremiumStatus = async () => {
    const status = await StorageService.getPremiumStatus();
    setIsPremium(status);
  };

  const loadCacheSize = async () => {
    const size = await StorageService.getCacheSize();
    setCacheSize(size);
  };

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const handleClearCache = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      '⚠️ Önbelleği Temizle',
      'Önbellek temizlenecek. Bu işlem:\n\n• Geçici dosyaları silecek\n• Bildirim ayarlarını sıfırlayacak\n• Yedekleme ayarlarını sıfırlayacak\n\n⚠️ Not: Dersleriniz ve notlarınız silinmeyecek.\n\n💡 Devam etmeden önce yedek almanızı öneririz.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Yedek Al',
          onPress: () => navigation.navigate('Backup'),
        },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: performClearCache,
        },
      ]
    );
  };

  const performClearCache = async () => {
    setIsClearing(true);
    
    try {
      const result = await StorageService.clearCache();
      
      if (result.success) {
        await loadCacheSize();
        Alert.alert(
          '✅ Başarılı',
          result.message,
          [{ text: 'Tamam', style: 'default' }]
        );
      } else {
        Alert.alert(
          '❌ Hata',
          result.message,
          [{ text: 'Tamam', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert(
        '❌ Hata',
        'Önbellek temizlenirken bir hata oluştu.',
        [{ text: 'Tamam', style: 'default' }]
      );
    } finally {
      setIsClearing(false);
    }
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={[
        styles.settingItem,
        { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border },
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
      {rightElement || (
        onPress && <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar style={theme.id === 'light' ? 'dark' : 'light'} backgroundColor="transparent" translucent={false} />
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="arrow-back" onPress={() => navigation.goBack()} />
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Ayarlar</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Premium Section - Only show if not premium */}
          {!isPremium && (
            <View style={styles.section}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Premium')}
                style={styles.premiumCard}
              >
                <LinearGradient
                  colors={theme.colors.accentGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumGradient}
                >
                  <Ionicons name="star" size={32} color={theme.colors.text.inverse} />
                  <Text style={[styles.premiumTitle, { color: theme.colors.text.inverse }]}>
                    Premium'a Geç
                  </Text>
                  <Text style={[styles.premiumSubtitle, { color: theme.colors.text.inverse }]}>
                    Sınırsız ders, reklamsız deneyim ve daha fazlası
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Theme Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>GÖRÜNÜM</Text>
            
            <SettingItem
              icon="moon"
              title="Gece Modu"
              subtitle={themeMode === 'night' ? 'Aktif' : 'Kapalı'}
              rightElement={
                <Switch
                  value={themeMode === 'night'}
                  onValueChange={handleThemeToggle}
                  trackColor={{ false: theme.colors.text.tertiary, true: theme.colors.accentGradient[0] }}
                  thumbColor={theme.colors.text.inverse}
                />
              }
            />

            <SettingItem
              icon="sunny"
              title="Gündüz Modu"
              subtitle={themeMode === 'day' ? 'Aktif' : 'Kapalı'}
              rightElement={
                <Switch
                  value={themeMode === 'day'}
                  onValueChange={handleThemeToggle}
                  trackColor={{ false: theme.colors.text.tertiary, true: theme.colors.accentGradient[0] }}
                  thumbColor={theme.colors.text.inverse}
                />
              }
            />
          </View>

          {/* App Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>UYGULAMA</Text>
            
            <SettingItem
              icon="pricetag-outline"
              title="Etiket Yönetimi"
              subtitle="Etiketleri düzenle ve yönet"
              onPress={() => navigation.navigate('TagManagement')}
            />

            <SettingItem
              icon="notifications-outline"
              title="Bildirimler"
              subtitle="Hatırlatıcılar ve güncellemeler"
              onPress={() => navigation.navigate('Notifications')}
            />

            <SettingItem
              icon="cloud-upload-outline"
              title="Yedekleme"
              subtitle="iCloud senkronizasyonu"
              onPress={() => navigation.navigate('Backup')}
            />

            <SettingItem
              icon="trash-outline"
              title="Önbelleği Temizle"
              subtitle={isClearing ? 'Temizleniyor...' : `${cacheSize} önbellek`}
              onPress={handleClearCache}
              rightElement={
                isClearing ? (
                  <ActivityIndicator size="small" color={theme.colors.accentGradient[0]} />
                ) : undefined
              }
            />

            <SettingItem
              icon="archive-outline"
              title="Arşiv"
              subtitle="Arşivlenmiş dersler ve notlar"
              onPress={() => navigation.navigate('Archive')}
            />
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>HAKKINDA</Text>
            
            <SettingItem
              icon="information-circle-outline"
              title="Uygulama Bilgisi"
              subtitle="Versiyon 1.6.0"
              onPress={() => navigation.navigate('AppInfo')}
            />

            <SettingItem
              icon="help-circle-outline"
              title="Yardım ve Destek"
              subtitle="SSS ve iletişim"
              onPress={() => navigation.navigate('HelpSupport')}
            />

            <SettingItem
              icon="shield-checkmark-outline"
              title="Gizlilik Politikası"
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />

            <SettingItem
              icon="document-text-outline"
              title="Kullanım Koşulları"
              onPress={() => navigation.navigate('TermsOfService')}
            />
          </View>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
