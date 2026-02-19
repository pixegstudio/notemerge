import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { IconButton } from '../components';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';

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
    alignItems: 'center',
  },
  appIconContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  appIcon: {
    width: 120,
    height: 120,
    borderRadius: 26,
  },
  appName: {
    fontSize: Typography.largeTitle.fontSize,
    fontWeight: Typography.largeTitle.fontWeight,
    marginBottom: Spacing.xs,
  },
  appVersion: {
    fontSize: Typography.body.fontSize,
    marginBottom: Spacing.xl,
  },
  appDescription: {
    fontSize: Typography.body.fontSize,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginBottom: Spacing.xl,
  },
  statCard: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 100,
  },
  statValue: {
    fontSize: Typography.title2.fontSize,
    fontWeight: Typography.title2.fontWeight,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.footnote.fontSize,
  },
  section: {
    width: '100%',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: Typography.body.fontSize,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  madeWithLove: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  madeWithLoveText: {
    fontSize: Typography.footnote.fontSize,
  },
});

export const AppInfoScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSocial = (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  };

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
            Uygulama Bilgisi
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* App Icon */}
          <View style={styles.appIconContainer}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.appIcon}
            />
          </View>

          {/* App Name & Version */}
          <Text style={[styles.appName, { color: theme.colors.text.primary }]}>
            NoteMerge
          </Text>
          <Text style={[styles.appVersion, { color: theme.colors.text.secondary }]}>
            Versiyon 1.6.0
          </Text>

          {/* Description */}
          <Text style={[styles.appDescription, { color: theme.colors.text.primary }]}>
            Öğrenciler için akıllı not birleştirme uygulaması. Ders notlarınızı 
            kolayca organize edin ve tek bir PDF'te birleştirin.
          </Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={[
              styles.statCard,
              { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
            ]}>
              <Text style={[styles.statValue, { color: theme.colors.accentGradient[0] }]}>
                10K+
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Kullanıcı
              </Text>
            </View>
            <View style={[
              styles.statCard,
              { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
            ]}>
              <Text style={[styles.statValue, { color: theme.colors.accentGradient[0] }]}>
                4.8
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Puan
              </Text>
            </View>
            <View style={[
              styles.statCard,
              { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
            ]}>
              <Text style={[styles.statValue, { color: theme.colors.accentGradient[0] }]}>
                100K+
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Not
              </Text>
            </View>
          </View>

          {/* Technical Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              TEKNİK BİLGİLER
            </Text>
            
            <View style={[
              styles.infoItem,
              { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
            ]}>
              <Text style={[styles.infoLabel, { color: theme.colors.text.primary }]}>
                Versiyon
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text.secondary }]}>
                1.6.0
              </Text>
            </View>

            <View style={[
              styles.infoItem,
              { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
            ]}>
              <Text style={[styles.infoLabel, { color: theme.colors.text.primary }]}>
                Derleme
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text.secondary }]}>
                160
              </Text>
            </View>

            <View style={[
              styles.infoItem,
              { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
            ]}>
              <Text style={[styles.infoLabel, { color: theme.colors.text.primary }]}>
                Platform
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text.secondary }]}>
                iOS & Android
              </Text>
            </View>

            <View style={[
              styles.infoItem,
              { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
            ]}>
              <Text style={[styles.infoLabel, { color: theme.colors.text.primary }]}>
                Framework
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text.secondary }]}>
                React Native
              </Text>
            </View>
          </View>

          {/* Social Links */}
          <View style={styles.socialButtons}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSocial('https://notemerge.app')}
              style={[
                styles.socialButton,
                { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
              ]}
            >
              <Ionicons name="globe-outline" size={24} color={theme.colors.accentGradient[0]} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSocial('https://twitter.com/notemerge')}
              style={[
                styles.socialButton,
                { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
              ]}
            >
              <Ionicons name="logo-twitter" size={24} color={theme.colors.accentGradient[0]} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSocial('https://instagram.com/notemerge')}
              style={[
                styles.socialButton,
                { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
              ]}
            >
              <Ionicons name="logo-instagram" size={24} color={theme.colors.accentGradient[0]} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSocial('https://github.com/notemerge')}
              style={[
                styles.socialButton,
                { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border }
              ]}
            >
              <Ionicons name="logo-github" size={24} color={theme.colors.accentGradient[0]} />
            </TouchableOpacity>
          </View>

          {/* Made with Love */}
          <View style={styles.madeWithLove}>
            <Text style={[styles.madeWithLoveText, { color: theme.colors.text.secondary }]}>
              Made with
            </Text>
            <Ionicons name="heart" size={16} color="#FF6B6B" />
            <Text style={[styles.madeWithLoveText, { color: theme.colors.text.secondary }]}>
              in Istanbul
            </Text>
          </View>

          <Text style={[styles.madeWithLoveText, { color: theme.colors.text.tertiary }]}>
            © 2026 NoteMerge. Tüm hakları saklıdır.
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
