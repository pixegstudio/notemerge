import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientButton, IconButton } from '../components';
import { CourseColorType } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';
import { StorageService } from '../services/StorageService';
import { Course } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Icon grid layout
const ICON_COLUMNS = 5;
const ICON_GAP = Spacing.xs;
const ICON_PADDING = Spacing.base * 2; // section padding
const ICON_SIZE = (SCREEN_WIDTH - ICON_PADDING - (ICON_GAP * (ICON_COLUMNS - 1))) / ICON_COLUMNS;

// Color grid layout
const COLOR_COLUMNS = 5;
const COLOR_GAP = Spacing.sm;
const COLOR_PADDING = Spacing.base * 2; // section padding
const COLOR_SIZE = (SCREEN_WIDTH - COLOR_PADDING - (COLOR_GAP * (COLOR_COLUMNS - 1))) / COLOR_COLUMNS;

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: theme.colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  section: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: Spacing.md,
  },
  previewSection: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  previewCard: {
    width: 160,
    aspectRatio: 0.85,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  previewName: {
    fontSize: Typography.headline.fontSize,
    fontWeight: Typography.headline.fontWeight,
    color: theme.colors.text.inverse,
    flex: 1,
  },
  previewStats: {
    flexDirection: 'row',
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  previewBadgeText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
  quickSelectContainer: {
    gap: Spacing.md,
    paddingRight: Spacing.base,
  },
  quickSelectItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickSelectGradient: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickSelectText: {
    fontSize: Typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },
  input: {
    backgroundColor: theme.colors.card.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: Typography.body.fontSize,
    color: theme.colors.text.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: COLOR_GAP,
  },
  colorItem: {
    width: COLOR_SIZE,
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  colorCircle: {
    width: COLOR_SIZE - 8,
    height: COLOR_SIZE - 8,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: theme.colors.text.primary,
  },
  colorName: {
    fontSize: Typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ICON_GAP,
  },
  iconItem: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: BorderRadius.lg,
    backgroundColor: theme.colors.card.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconItemSelected: {
    backgroundColor: theme.colors.primaryGradient[0],
    borderWidth: 2,
    borderColor: theme.colors.primaryGradient[1],
  },
  saveSection: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xl,
  },
});
export const CreateCourseScreen = ({ navigation, route }: any) => {
  const { courseId } = route.params || {};
  const isEditing = !!courseId;
  const { theme } = useTheme();
  const Colors = theme.colors;
  const CourseColors = theme.courseColors;
  const styles = createStyles(theme);

  const [courseName, setCourseName] = useState('');
  const [selectedColor, setSelectedColor] = useState<CourseColorType>(CourseColors[0]);
  const [selectedIcon, setSelectedIcon] = useState('book');

  const handleColorSelect = (color: CourseColorType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedColor(color);
  };

  const handleIconSelect = (icon: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIcon(icon);
  };

  const handleQuickSelect = (preset: CourseColorType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCourseName(preset.subject);
    setSelectedColor(preset);
    setSelectedIcon(preset.iconName);
  };

  const handleSave = async () => {
    if (!courseName.trim()) {
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newCourse: Course = {
      id: Date.now().toString(),
      name: courseName,
      color: selectedColor.gradient[0],
      colorEnd: selectedColor.gradient[1],
      icon: selectedIcon,
      coverDesign: 'gradient' as const,
      notes: [],
      tags: [],
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if (isEditing) {
        await StorageService.updateCourse(courseId, newCourse);
      } else {
        await StorageService.addCourse(newCourse);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const popularIcons = [
    // Temel Eğitim
    'book', 'book-outline', 'library', 'reader', 'newspaper',
    // Matematik & Fen
    'calculator', 'calculator-outline', 'flask', 'flask-outline', 'beaker',
    // Fizik & Kimya
    'flash', 'flash-outline', 'magnet', 'nuclear', 'planet',
    // Sosyal Bilimler
    'globe', 'globe-outline', 'map', 'compass', 'earth',
    // Dil & Edebiyat
    'language', 'chatbubbles', 'text', 'create', 'pencil',
    // Sanat & Müzik
    'musical-notes', 'musical-note', 'color-palette', 'brush', 'camera',
    // Teknoloji
    'desktop', 'laptop', 'code-slash', 'hardware-chip', 'terminal',
    // Biyoloji & Sağlık
    'leaf', 'flower', 'heart', 'fitness', 'medkit',
    // Tarih & Coğrafya
    'time', 'hourglass', 'flag', 'location', 'navigate',
    // Diğer
    'school', 'trophy', 'ribbon', 'star', 'bulb'
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style={theme.id === 'light' ? 'dark' : 'light'} backgroundColor="transparent" translucent={false} />
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="close"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>
            {isEditing ? 'Dersi Düzenle' : 'Yeni Ders'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Preview Card */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Önizleme</Text>
            <TouchableOpacity activeOpacity={1}>
              <LinearGradient
                colors={selectedColor.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.previewCard}
              >
                <Ionicons name={selectedIcon as any} size={48} color={Colors.text.inverse} />
                <Text style={styles.previewName} numberOfLines={2}>
                  {courseName || 'Ders Adı'}
                </Text>
                <View style={styles.previewStats}>
                  <View style={styles.previewBadge}>
                    <Ionicons name="document-text" size={12} color={Colors.text.inverse} />
                    <Text style={styles.previewBadgeText}>0</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Popular Courses Quick Select */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popüler Dersler</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickSelectContainer}
            >
              {CourseColors.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  onPress={() => handleQuickSelect(preset)}
                  activeOpacity={0.7}
                  style={styles.quickSelectItem}
                >
                  <LinearGradient
                    colors={preset.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.quickSelectGradient}
                  >
                    <Ionicons name={preset.iconName as any} size={32} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.quickSelectText}>{preset.subject}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Course Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ders Adı</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Matematik, Fizik, Tarih..."
              placeholderTextColor={Colors.text.tertiary}
              value={courseName}
              onChangeText={setCourseName}
              autoCapitalize="words"
            />
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Renk Seç</Text>
            <View style={styles.colorGrid}>
              {CourseColors.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  onPress={() => handleColorSelect(color)}
                  activeOpacity={0.7}
                  style={styles.colorItem}
                >
                  <LinearGradient
                    colors={color.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.colorCircle,
                      selectedColor.id === color.id && styles.colorCircleSelected,
                    ]}
                  >
                    {selectedColor.id === color.id && (
                      <Ionicons name="checkmark" size={24} color={Colors.text.inverse} />
                    )}
                  </LinearGradient>
                  <Text style={styles.colorName}>{color.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Icon Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İkon Seç</Text>
            <View style={styles.iconGrid}>
              {popularIcons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => handleIconSelect(icon)}
                  activeOpacity={0.7}
                  style={[
                    styles.iconItem,
                    selectedIcon === icon && styles.iconItemSelected,
                  ]}
                >
                  <Ionicons 
                    name={icon as any} 
                    size={28} 
                    color={selectedIcon === icon ? Colors.text.inverse : Colors.text.primary} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.saveSection}>
            <GradientButton
              title={isEditing ? 'Kaydet' : 'Ders Oluştur'}
              onPress={handleSave}
              size="large"
              disabled={!courseName.trim()}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

