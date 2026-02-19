import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
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
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  lastUpdated: {
    fontSize: Typography.footnote.fontSize,
    marginBottom: Spacing.xl,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: Typography.title3.fontSize,
    fontWeight: Typography.title3.fontWeight,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  paragraph: {
    fontSize: Typography.body.fontSize,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  bulletPoint: {
    fontSize: Typography.body.fontSize,
    lineHeight: 24,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.base,
  },
});

export const PrivacyPolicyScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

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
            Gizlilik Politikası
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={[styles.lastUpdated, { color: theme.colors.text.secondary }]}>
            Son Güncelleme: 19 Şubat 2026
          </Text>

          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            NoteMerge olarak gizliliğinize önem veriyoruz. Bu gizlilik politikası, 
            uygulamamızı kullanırken toplanan, kullanılan ve korunan bilgiler hakkında 
            sizi bilgilendirmek için hazırlanmıştır.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            1. Toplanan Bilgiler
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            NoteMerge aşağıdaki bilgileri toplayabilir:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Ders ve not içerikleri (cihazınızda yerel olarak saklanır)
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Uygulama kullanım istatistikleri (anonim)
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Cihaz bilgileri (model, işletim sistemi versiyonu)
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Satın alma bilgileri (App Store üzerinden)
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            2. Bilgilerin Kullanımı
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            Toplanan bilgiler şu amaçlarla kullanılır:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Uygulama işlevselliğini sağlamak
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Kullanıcı deneyimini iyileştirmek
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Teknik destek sağlamak
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Premium abonelik hizmetlerini yönetmek
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            3. Veri Güvenliği
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            Verileriniz cihazınızda yerel olarak saklanır. iCloud senkronizasyonu 
            kullanıyorsanız, verileriniz Apple'ın güvenlik standartlarına uygun olarak 
            şifrelenir ve saklanır.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            4. Üçüncü Taraf Hizmetler
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            NoteMerge aşağıdaki üçüncü taraf hizmetlerini kullanır:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Apple App Store (satın alma işlemleri)
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • iCloud (opsiyonel yedekleme)
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            5. Kullanıcı Hakları
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            Kullanıcılar olarak aşağıdaki haklara sahipsiniz:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Verilerinize erişim hakkı
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Verilerinizi silme hakkı
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Verilerinizi dışa aktarma hakkı
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Veri işlemeye itiraz etme hakkı
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            6. Çocukların Gizliliği
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            NoteMerge 13 yaş altı çocuklardan bilerek kişisel bilgi toplamaz. 
            Ebeveynler, çocuklarının uygulamamızı kullanımını denetlemelidir.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            7. Politika Değişiklikleri
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler 
            olduğunda uygulama içinde bilgilendirileceksiniz.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            8. İletişim
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            Gizlilik politikamız hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            E-posta: privacy@notemerge.app
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
