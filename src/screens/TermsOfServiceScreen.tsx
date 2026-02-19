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

export const TermsOfServiceScreen = ({ navigation }: any) => {
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
            Kullanım Koşulları
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
            NoteMerge uygulamasını kullanarak aşağıdaki kullanım koşullarını kabul etmiş olursunuz. 
            Lütfen bu koşulları dikkatlice okuyun.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            1. Hizmet Tanımı
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            NoteMerge, öğrencilerin ders notlarını dijitalleştirmelerine, organize etmelerine 
            ve PDF formatında birleştirmelerine olanak sağlayan bir mobil uygulamadır.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            2. Kullanıcı Sorumlulukları
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            Kullanıcılar olarak aşağıdaki sorumluluklara sahipsiniz:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Uygulamayı yasal amaçlar için kullanmak
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Telif hakkı korumalı içeriklere saygı göstermek
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Hesap güvenliğinizi korumak
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Diğer kullanıcıların haklarına saygı göstermek
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            3. Premium Abonelik
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            Premium abonelik, aylık veya yıllık olarak yenilenebilir bir hizmettir:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Abonelik otomatik olarak yenilenir
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • İptal işlemi App Store ayarlarından yapılır
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • İptal, mevcut dönemin sonunda geçerli olur
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Ücret iadesi Apple'ın politikalarına tabidir
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            4. İçerik Sahipliği
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            Uygulamaya yüklediğiniz tüm içeriklerin (notlar, fotoğraflar, PDF'ler) 
            sahipliği size aittir. NoteMerge bu içerikleri kullanmaz, paylaşmaz veya 
            üçüncü taraflarla paylaşmaz.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            5. Hizmet Değişiklikleri
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            NoteMerge, önceden haber vermeksizin:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Uygulama özelliklerini değiştirebilir
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Yeni özellikler ekleyebilir
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Mevcut özellikleri kaldırabilir
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Fiyatlandırmayı güncelleyebilir
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            6. Sorumluluk Reddi
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            NoteMerge "olduğu gibi" sunulmaktadır. Aşağıdaki durumlardan sorumlu değiliz:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Veri kaybı
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Hizmet kesintileri
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Üçüncü taraf hizmet sorunları
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Kullanıcı hatalarından kaynaklanan sorunlar
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            7. Hesap Askıya Alma ve Sonlandırma
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            Aşağıdaki durumlarda hesabınızı askıya alabilir veya sonlandırabiliriz:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Kullanım koşullarının ihlali
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Yasadışı faaliyetler
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Diğer kullanıcılara zarar verme
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.text.primary }]}>
            • Ödeme sorunları
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            8. Fikri Mülkiyet
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            NoteMerge uygulaması, logosu, tasarımı ve tüm içeriği NoteMerge'in 
            fikri mülkiyetidir ve telif hakkı yasalarıyla korunmaktadır.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            9. Uyuşmazlık Çözümü
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            Bu kullanım koşullarından kaynaklanan uyuşmazlıklar Türkiye Cumhuriyeti 
            yasalarına tabidir ve İstanbul mahkemeleri yetkilidir.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            10. İletişim
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            Kullanım koşulları hakkında sorularınız varsa:
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text.primary }]}>
            E-posta: legal@notemerge.app
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
