import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
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
  contactCard: {
    marginHorizontal: Spacing.base,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  contactTitle: {
    fontSize: Typography.title3.fontSize,
    fontWeight: Typography.title3.fontWeight,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: Typography.callout.fontSize,
    textAlign: 'center',
    opacity: 0.8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  contactButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
  faqItem: {
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  faqQuestion: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  faqAnswer: {
    fontSize: Typography.callout.fontSize,
    lineHeight: 22,
  },
  linkItem: {
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
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  linkIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  linkText: {
    flex: 1,
  },
  linkTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '500',
  },
});

const FAQ_ITEMS = [
  {
    question: 'NoteMerge nasıl çalışır?',
    answer: 'NoteMerge ile ders notlarınızı fotoğraflayın, dersler halinde organize edin ve tek bir PDF dosyasında birleştirin.',
  },
  {
    question: 'Premium özellikleri nelerdir?',
    answer: 'Premium ile sınırsız ders ve not oluşturabilir, reklamsız deneyimin keyfini çıkarabilir ve gelişmiş özelliklere erişebilirsiniz.',
  },
  {
    question: 'Notlarımı nasıl yedeklerim?',
    answer: 'Ayarlar > Yedekleme bölümünden iCloud senkronizasyonunu aktif edebilir ve notlarınızı otomatik olarak yedekleyebilirsiniz.',
  },
  {
    question: 'PDF kalitesini nasıl artırabilirim?',
    answer: 'Premium üyelik ile yüksek kaliteli PDF export ve watermark\'sız çıktı alabilirsiniz.',
  },
  {
    question: 'Aboneliğimi nasıl iptal edebilirim?',
    answer: 'App Store > Hesap > Abonelikler bölümünden NoteMerge aboneliğinizi istediğiniz zaman iptal edebilirsiniz.',
  },
];

export const HelpSupportScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleEmail = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('mailto:support@notemerge.app?subject=NoteMerge Destek');
  };

  const handleWebsite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://notemerge.app');
  };

  const handleTwitter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://twitter.com/notemerge');
  };

  const handleInstagram = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://instagram.com/notemerge');
  };

  const LinkItem = ({
    icon,
    title,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.linkItem,
        { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border },
      ]}
    >
      <View style={styles.linkLeft}>
        <View style={[styles.linkIconContainer, { backgroundColor: theme.colors.accentGradient[0] + '20' }]}>
          <Ionicons name={icon} size={24} color={theme.colors.accentGradient[0]} />
        </View>
        <View style={styles.linkText}>
          <Text style={[styles.linkTitle, { color: theme.colors.text.primary }]}>{title}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
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
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            Yardım ve Destek
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Contact Card */}
          <View style={styles.section}>
            <LinearGradient
              colors={theme.colors.accentGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.contactCard}
            >
              <Ionicons name="chatbubbles" size={48} color={theme.colors.text.inverse} />
              <Text style={[styles.contactTitle, { color: theme.colors.text.inverse }]}>
                Size Nasıl Yardımcı Olabiliriz?
              </Text>
              <Text style={[styles.contactSubtitle, { color: theme.colors.text.inverse }]}>
                Sorularınız için bize ulaşın
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleEmail}
                style={[styles.contactButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
              >
                <Ionicons name="mail" size={20} color={theme.colors.text.inverse} />
                <Text style={[styles.contactButtonText, { color: theme.colors.text.inverse }]}>
                  E-posta Gönder
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              SIK SORULAN SORULAR
            </Text>
            
            {FAQ_ITEMS.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.faqItem,
                  { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border },
                ]}
              >
                <Text style={[styles.faqQuestion, { color: theme.colors.text.primary }]}>
                  {item.question}
                </Text>
                <Text style={[styles.faqAnswer, { color: theme.colors.text.secondary }]}>
                  {item.answer}
                </Text>
              </View>
            ))}
          </View>

          {/* Social Links */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              BİZE ULAŞIN
            </Text>
            
            <LinkItem
              icon="globe-outline"
              title="Web Sitesi"
              onPress={handleWebsite}
            />
            
            <LinkItem
              icon="logo-twitter"
              title="Twitter"
              onPress={handleTwitter}
            />
            
            <LinkItem
              icon="logo-instagram"
              title="Instagram"
              onPress={handleInstagram}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
