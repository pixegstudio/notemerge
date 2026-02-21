import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { IconButton, GradientButton } from '../components';
import { useTheme } from '../context/ThemeContext';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { IAPService, SubscriptionProduct, PRODUCT_IDS } from '../services/IAPService';
import { StorageService } from '../services/StorageService';
import { Platform } from 'react-native';

type PlanType = 'monthly' | 'yearly';

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
    fontFamily: Typography.headline.fontFamily,
  },
  restoreText: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['2xl'],
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  heroTitle: {
    fontSize: Typography.titleLarge.fontSize,
    fontWeight: Typography.titleLarge.fontWeight,
    fontFamily: Typography.titleLarge.fontFamily,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: Typography.body.fontSize,
    fontFamily: Typography.body.fontFamily,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.caption.fontSize,
    fontFamily: Typography.caption.fontFamily,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.base,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  premiumHeaderBadge: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.body.fontSize,
    fontFamily: Typography.body.fontFamily,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
  },
  featureBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.xs,
  },
  featureBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  plansContainer: {
    gap: Spacing.md,
  },
  planCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 2,
    position: 'relative',
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: Spacing.base,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  planName: {
    fontSize: Typography.headline.fontSize,
    fontFamily: Typography.headline.fontFamily,
    fontWeight: '700',
  },
  planBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily: Typography.titleLarge.fontFamily,
  },
  planPeriod: {
    fontSize: Typography.headline.fontSize,
    fontFamily: Typography.headline.fontFamily,
    fontWeight: '400',
  },
  planDescription: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
  },
  selectedIndicator: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  priceNote: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  purchaseSection: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.body.fontSize,
    fontFamily: Typography.body.fontFamily,
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  benefitItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: Typography.caption.fontSize,
    fontFamily: Typography.caption.fontFamily,
    textAlign: 'center',
  },
  benefitsFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing['2xl'],
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
});

export const PremiumScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const Colors = theme.colors;
  const styles = createStyles(theme);
  
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    initializeIAP();
    
    return () => {
      IAPService.disconnect();
    };
  }, []);

  const initializeIAP = async () => {
    try {
      setIsLoading(true);
      await IAPService.initialize();
      const availableProducts = await IAPService.loadProducts();
      setProducts(availableProducts);
    } catch (error) {
      console.error('Error initializing IAP:', error);
      Alert.alert(
        'Bağlantı Hatası',
        'Ürünler yüklenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Tekrar Dene', onPress: () => initializeIAP() }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelect = (plan: PlanType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(plan);
  };

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const productId = Platform.select({
        ios: selectedPlan === 'yearly' ? PRODUCT_IDS.ios.yearly : PRODUCT_IDS.ios.monthly,
        android: selectedPlan === 'yearly' ? PRODUCT_IDS.android.yearly : PRODUCT_IDS.android.monthly,
      }) || (selectedPlan === 'yearly' ? PRODUCT_IDS.ios.yearly : PRODUCT_IDS.ios.monthly);
      
      const success = await IAPService.purchaseSubscription(productId);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Tebrikler! 🎉',
          'Premium üyeliğiniz başarıyla aktif edildi!',
          [
            {
              text: 'Harika!',
              onPress: () => navigation.goBack(),
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      
      if (error.code !== 'E_USER_CANCELLED') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(
          'Satın Alma Hatası',
          'Bir hata oluştu. Lütfen tekrar deneyin.',
          [{ text: 'Tamam' }]
        );
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const hasSubscription = await IAPService.restorePurchases();

      if (hasSubscription) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Başarılı! ✅',
          'Premium üyeliğiniz geri yüklendi!',
          [
            {
              text: 'Harika!',
              onPress: () => navigation.goBack(),
            }
          ]
        );
      } else {
        Alert.alert(
          'Satın Alma Bulunamadı',
          'Hesabınızda aktif bir premium üyelik bulunamadı.',
          [{ text: 'Tamam' }]
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Geri Yükleme Hatası',
        'Bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const FeatureItem = ({ icon, title, description, isPremium = false }: any) => (
    <View style={styles.featureItem}>
      <LinearGradient
        colors={isPremium ? theme.colors.accentGradient : [Colors.text.tertiary + '40', Colors.text.tertiary + '20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featureIcon}
      >
        <Ionicons 
          name={icon} 
          size={22} 
          color={isPremium ? Colors.text.inverse : Colors.text.tertiary} 
        />
      </LinearGradient>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: Colors.text.primary }]}>
          {title}
        </Text>
        <Text style={[styles.featureDescription, { color: Colors.text.secondary }]}>
          {description}
        </Text>
      </View>
    </View>
  );

  const PlanCard = ({ 
    type, 
    price, 
    period, 
    savings, 
    isSelected 
  }: { 
    type: PlanType; 
    price: string; 
    period: string; 
    savings?: string; 
    isSelected: boolean;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handlePlanSelect(type)}
      style={[
        styles.planCard,
        { 
          backgroundColor: Colors.card.background,
          borderColor: isSelected ? Colors.accentGradient[0] : Colors.card.border,
          borderWidth: isSelected ? 2 : 1,
        }
      ]}
    >
      {savings && (
        <View style={[styles.savingsBadge, { backgroundColor: Colors.status.success }]}>
          <Text style={styles.savingsText}>{savings}</Text>
        </View>
      )}
      <View style={styles.planHeader}>
        <Text style={[styles.planPrice, { color: Colors.text.primary }]}>{price}</Text>
        <Text style={[styles.planPeriod, { color: Colors.text.secondary }]}>/{period}</Text>
      </View>
      <Text style={[styles.planDescription, { color: Colors.text.tertiary }]}>
        {type === 'monthly' ? 'Aylık Abonelik' : 'Yıllık Abonelik'}
      </Text>
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.accentGradient[0]} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar style={theme.id === 'light' ? 'dark' : 'light'} backgroundColor="transparent" translucent={false} />
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="close" onPress={() => navigation.goBack()} />
          <Text style={[styles.headerTitle, { color: Colors.text.primary }]}>
            Premium'a Geç
          </Text>
          <TouchableOpacity onPress={handleRestore} disabled={isRestoring}>
            <Text style={[styles.restoreText, { color: Colors.accentGradient[0] }]}>
              {isRestoring ? 'Yükleniyor...' : 'Geri Yükle'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={theme.colors.accentGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroIcon}
            >
              <Ionicons name="star" size={48} color={Colors.text.inverse} />
            </LinearGradient>
            <Text style={[styles.heroTitle, { color: Colors.text.primary }]}>
              Sınırsız İmkanlar
            </Text>
            <Text style={[styles.heroSubtitle, { color: Colors.text.secondary }]}>
              Tüm özelliklerin kilidini aç ve notlarını profesyonel şekilde yönet
            </Text>
          </View>

          {/* Free vs Premium Comparison */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors.text.primary }]}>
              ÜCRETSİZ SÜRÜM
            </Text>
            
            <FeatureItem
              icon="book-outline"
              title="3 Ders"
              description="Maksimum 3 ders oluşturabilirsin"
            />
            <FeatureItem
              icon="document-text-outline"
              title="10 PDF/Ders"
              description="Her derste maksimum 10 PDF"
            />
            <FeatureItem
              icon="water-outline"
              title="Watermark"
              description="PDF'lerde küçük NoteMerge logosu"
            />
            <FeatureItem
              icon="color-palette-outline"
              title="5 Renk"
              description="Temel renk paleti"
            />
            <FeatureItem
              icon="albums-outline"
              title="Temel Kalite"
              description="Standart PDF kalitesi"
            />
          </View>

          <View style={styles.divider} />

          {/* Premium Features */}
          <View style={styles.section}>
            <View style={styles.premiumHeader}>
              <LinearGradient
                colors={theme.colors.accentGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumHeaderBadge}
              >
                <Ionicons name="star" size={16} color={Colors.text.inverse} />
              </LinearGradient>
              <Text style={[styles.sectionTitle, { color: Colors.text.primary }]}>
                PREMIUM ÖZELLİKLER
              </Text>
            </View>
            
            <FeatureItem
              icon="infinite"
              title="Sınırsız Ders"
              description="İstediğin kadar ders oluştur"
              isPremium
            />
            <FeatureItem
              icon="document-text"
              title="Sınırsız PDF"
              description="Her derste sınırsız PDF"
              isPremium
            />
            <FeatureItem
              icon="sparkles"
              title="Watermark Yok"
              description="Temiz, profesyonel PDF'ler"
              isPremium
            />
            <FeatureItem
              icon="color-palette"
              title="Tüm Renkler"
              description="8+ özel renk ve gradient"
              isPremium
            />
            <FeatureItem
              icon="diamond"
              title="Yüksek Kalite"
              description="En yüksek PDF kalitesi"
              isPremium
            />
            <FeatureItem
              icon="cloud-upload"
              title="iCloud Sync"
              description="Tüm cihazlarında senkronize"
              isPremium
            />
            <FeatureItem
              icon="text"
              title="OCR Özelliği"
              description="PDF'lerden metin tanıma"
              isPremium
            />
            <FeatureItem
              icon="archive"
              title="Ders Arşivi"
              description="Geçmiş dönem derslerini arşivle"
              isPremium
            />
            <FeatureItem
              icon="people"
              title="Grup Paylaşım"
              description="Arkadaşlarınla not paylaş"
              isPremium
            />
            <FeatureItem
              icon="headset"
              title="Öncelikli Destek"
              description="7/24 hızlı destek"
              isPremium
            />
          </View>

          {/* Pricing Plans */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors.text.primary }]}>
              BİR PLAN SEÇ
            </Text>
            
            <View style={styles.plansContainer}>
              <PlanCard
                type="yearly"
                price={products.find(p => p.type === 'yearly')?.localizedPrice || '₺349'}
                period="yıl"
                savings="40% İNDİRİM"
                isSelected={selectedPlan === 'yearly'}
              />
              <PlanCard
                type="monthly"
                price={products.find(p => p.type === 'monthly')?.localizedPrice || '₺49'}
                period="ay"
                isSelected={selectedPlan === 'monthly'}
              />
            </View>

            <Text style={[styles.priceNote, { color: Colors.text.tertiary }]}>
              {selectedPlan === 'yearly' 
                ? '₺16.58/ay - Yıllık ödeme ile %40 tasarruf et' 
                : 'İstediğin zaman iptal edebilirsin'}
            </Text>
          </View>

          {/* Purchase Button */}
          <View style={styles.purchaseSection}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.accentGradient[0]} />
                <Text style={[styles.loadingText, { color: Colors.text.secondary }]}>
                  Ürünler yükleniyor...
                </Text>
              </View>
            ) : (
              <GradientButton
                title={isPurchasing ? 'İşleniyor...' : (
                  selectedPlan === 'yearly' 
                    ? (products.find(p => p.type === 'yearly')?.localizedPrice || '₺349') + '/Yıl ile Başla'
                    : (products.find(p => p.type === 'monthly')?.localizedPrice || '₺49') + '/Ay ile Başla'
                )}
                onPress={handlePurchase}
                disabled={isPurchasing}
                icon={isPurchasing ? undefined : <Ionicons name="star" size={20} color={Colors.text.inverse} />}
              />
            )}
            
            <Text style={[styles.termsText, { color: Colors.text.tertiary }]}>
              Devam ederek Kullanım Koşulları ve Gizlilik Politikası'nı kabul etmiş olursun
            </Text>
          </View>

          {/* Benefits Footer */}
          <View style={styles.benefitsFooter}>
            <View style={styles.benefitItem}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.accentGradient[0]} />
              <Text style={[styles.benefitText, { color: Colors.text.secondary }]}>
                Güvenli Ödeme
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="refresh" size={20} color={Colors.accentGradient[0]} />
              <Text style={[styles.benefitText, { color: Colors.text.secondary }]}>
                İstediğin Zaman İptal
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
