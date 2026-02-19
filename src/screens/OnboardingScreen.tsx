import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientButton } from '../components';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';
import { NightTheme } from '../constants/theme';
import { StorageService } from '../services/StorageService';

const { width } = Dimensions.get('window');

type UserSegment = 'university' | 'highschool' | 'yks' | 'work' | 'other';

interface SegmentOption {
  id: UserSegment;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const segmentOptions: SegmentOption[] = [
  { id: 'university', label: 'Üniversite', icon: 'school' },
  { id: 'highschool', label: 'Lise', icon: 'book' },
  { id: 'yks', label: 'YKS Hazırlık', icon: 'trophy' },
  { id: 'work', label: 'İş / Freelancer', icon: 'briefcase' },
  { id: 'other', label: 'Diğer', icon: 'apps' },
];

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    marginTop: '10%',
  },
  stepContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: BorderRadius['2xl'],
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  iconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius['2xl'],
  },
  stepTitle: {
    fontSize: Typography.title.fontSize,
    lineHeight: Typography.title.lineHeight,
    fontWeight: Typography.title.fontWeight,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  stepSubtitle: {
    fontSize: Typography.body.fontSize,
    lineHeight: 24,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
  },
  segmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  segmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: theme.colors.card.background,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.card.border,
  },
  segmentChipSelected: {
    backgroundColor: theme.colors.primaryGradient[0],
    borderColor: theme.colors.primaryGradient[0],
  },
  segmentText: {
    fontSize: Typography.callout.fontSize,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  segmentTextSelected: {
    color: theme.colors.text.inverse,
  },
  permissionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: theme.colors.status.success + '20',
    borderRadius: BorderRadius.lg,
  },
  permissionNoteText: {
    flex: 1,
    fontSize: Typography.footnote.fontSize,
    color: theme.colors.text.secondary,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: BorderRadius.full,
    transition: 'all 0.3s',
  },
  buttonContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['2xl'],
    gap: Spacing.md,
  },
  customButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  customButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
  },
  customButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
  arrowIcon: {
    marginLeft: Spacing.xl,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  skipButtonText: {
    fontSize: Typography.callout.fontSize,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
});

export const OnboardingScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<UserSegment | null>(null);

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      await StorageService.setOnboardingCompleted(true);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      navigation.replace('Home');
    }
  };

  const handleSegmentSelect = (segment: UserSegment) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSegment(segment);
  };

  const handleRequestPermission = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await completeOnboarding();
  };

  // Step 1: Welcome - Value Proposition
  const renderWelcomeStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={theme.colors.primaryGradient}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="sparkles" size={80} color={theme.colors.text.inverse} />
        </LinearGradient>
      </View>
      
      <Text style={styles.stepTitle}>Notlarını Dağınıklıktan Kurtar</Text>
      <Text style={styles.stepSubtitle}>
        Kağıt notlarını saniyeler içinde PDF'e dönüştür, tek yerde topla.
      </Text>
    </View>
  );

  // Step 2: Segmentation - User Type
  const renderSegmentStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Notlarını Nerede Kullanıyorsun?</Text>
      <Text style={styles.stepSubtitle}>
        Sana özel öneriler sunabilmemiz için
      </Text>
      
      <View style={styles.segmentContainer}>
        {segmentOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.7}
            onPress={() => handleSegmentSelect(option.id)}
            style={[
              styles.segmentChip,
              selectedSegment === option.id && styles.segmentChipSelected,
            ]}
          >
            <Ionicons
              name={option.icon}
              size={20}
              color={selectedSegment === option.id ? theme.colors.text.inverse : theme.colors.text.primary}
            />
            <Text
              style={[
                styles.segmentText,
                selectedSegment === option.id && styles.segmentTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Step 3: Permission - Smart Request
  const renderPermissionStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={theme.colors.accentGradient}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="camera" size={80} color={theme.colors.text.inverse} />
        </LinearGradient>
      </View>
      
      <Text style={styles.stepTitle}>Daha Hızlı Tarama İçin</Text>
      <Text style={styles.stepSubtitle}>
        Kamera erişimi, notlarını anında PDF'e dönüştürmemizi sağlar.
      </Text>
      
      <View style={styles.permissionNote}>
        <Ionicons name="shield-checkmark" size={20} color={theme.colors.status.success} />
        <Text style={styles.permissionNoteText}>
          Verileriniz cihazınızda kalır, sunucuya gönderilmez
        </Text>
      </View>
    </View>
  );

  const renderProgressDots = () => (
    <View style={styles.dotsContainer}>
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === currentStep
                  ? theme.colors.primaryGradient[0]
                  : theme.colors.text.tertiary,
              width: index === currentStep ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );

  const getButtonTitle = () => {
    if (currentStep === 0) return 'Başlayalım';
    if (currentStep === 1) return 'Devam';
    return 'Kameraya İzin Ver';
  };

  const isNextEnabled = () => {
    if (currentStep === 1) return selectedSegment !== null;
    return true;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor="transparent" translucent={false} />
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Content */}
        <View style={styles.content}>
          {currentStep === 0 && renderWelcomeStep()}
          {currentStep === 1 && renderSegmentStep()}
          {currentStep === 2 && renderPermissionStep()}
        </View>

        {/* Progress Dots */}
        {renderProgressDots()}

        {/* Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={currentStep === 2 ? handleRequestPermission : handleNext}
            disabled={!isNextEnabled()}
            style={styles.customButton}
          >
            <LinearGradient
              colors={theme.colors.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.customButtonGradient,
                { opacity: !isNextEnabled() ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.customButtonText}>{getButtonTitle()}</Text>
              <Ionicons 
                name="arrow-forward" 
                size={24} 
                color={theme.colors.text.inverse}
                style={styles.arrowIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
          
          {currentStep === 2 && (
            <TouchableOpacity
              onPress={() => navigation.replace('Home')}
              style={styles.skipButton}
            >
              <Text style={styles.skipButtonText}>Şimdi Değil</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};
