import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientButton, GlassCard, SectionHeader, IconButton } from '../components';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { Course } from '../types';
import { useTheme } from '../context/ThemeContext';
import { StorageService } from '../services/StorageService';
import { PredefinedTags } from '../constants/tags';

const { width } = Dimensions.get('window');
const GRID_PADDING = Spacing.base;
const GRID_GAP = Spacing.sm;
const CARD_WIDTH = (width - (GRID_PADDING * 2) - (GRID_GAP * 2)) / 3;

type ViewMode = 'grid' | 'list';

// ============================================================
// STYLES
// ============================================================
const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },
  stickyHeader: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.card.border + '40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginTop: '10%',
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
    zIndex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerActionItem: {
    alignItems: 'center',
    gap: 4,
    minWidth: 50,
  },
  actionLabel: {
    fontSize: 10,
    fontFamily: Typography.caption.fontFamily,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: theme.colors.text.primary,
    marginTop: 2,
    textAlign: 'center',
  },
  premiumButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.headline.fontSize,
    fontWeight: '800',
    fontFamily: Typography.headline.fontFamily,
    color: theme.colors.text.primary,
  },
  createSection: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  statsContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  statCard: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statGradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 9,
    fontFamily: Typography.caption.fontFamily,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  mostActiveCard: {
    backgroundColor: theme.colors.card.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.card.border,
  },
  mostActiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  mostActiveTitle: {
    fontSize: 11,
    fontFamily: Typography.footnote.fontFamily,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flexShrink: 0,
  },
  mostActiveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mostActiveIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mostActiveInfo: {
    flex: 1,
  },
  mostActiveName: {
    fontSize: Typography.body.fontSize,
    fontFamily: Typography.body.fontFamily,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  mostActiveStats: {
    fontSize: Typography.caption.fontSize,
    fontFamily: Typography.caption.fontFamily,
    color: theme.colors.text.secondary,
  },
  activityCard: {
    backgroundColor: theme.colors.card.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.card.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  activityTitle: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  activityContent: {
    alignItems: 'flex-end',
  },
  activityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.accentGradient[0],
  },
  activityLabel: {
    fontSize: Typography.caption.fontSize,
    fontFamily: Typography.caption.fontFamily,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing['3xl'],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['5xl'],
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: theme.colors.card.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.headline.fontSize,
    fontWeight: Typography.headline.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.callout.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  tagFiltersContainer: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.card.border,
  },
  tagFiltersContent: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    flexWrap: 'nowrap',
  },
  tagFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.card.border,
    backgroundColor: theme.colors.card.background,
    gap: Spacing.xs,
    flexShrink: 0,
  },
  tagFilterChipActive: {
    backgroundColor: theme.colors.accentGradient[0],
    borderColor: theme.colors.accentGradient[0],
  },
  tagFilterText: {
    fontSize: 11,
    fontFamily: Typography.footnote.fontFamily,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  tagFilterTextActive: {
    color: theme.colors.text.inverse,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: GRID_PADDING,
    justifyContent: 'space-between',
    rowGap: GRID_GAP,
    columnGap: GRID_GAP,
  },
  courseCardContainer: {
    width: CARD_WIDTH,
  },
  courseCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  courseName: {
    fontSize: Typography.callout.fontSize,
    fontWeight: '600',
    color: theme.colors.text.inverse,
    marginBottom: Spacing.xs,
    flex: 1,
  },
  courseStats: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    gap: 2,
  },
  statText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
  courseDate: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  coursesList: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  courseListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  courseListIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  courseListContent: {
    flex: 1,
  },
  courseListName: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  courseListMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  courseListMetaText: {
    fontSize: Typography.footnote.fontSize,
    color: theme.colors.text.secondary,
  },
  courseListDate: {
    fontSize: Typography.footnote.fontSize,
    color: theme.colors.text.tertiary,
  },
});

export const HomeScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const Colors = theme.colors;
  const CourseColors = theme.courseColors;
  const styles = createStyles(theme);
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  // Load courses from storage
  useEffect(() => {
    loadData();
    loadCustomTags();
  }, []);

  const loadCustomTags = async () => {
    const tags = await StorageService.getCustomTags();
    setCustomTags(tags);
  };

  // Reload data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const [storedCourses, premiumStatus] = await Promise.all([
        StorageService.getCourses(),
        StorageService.getPremiumStatus(),
      ]);
      
      setIsPremium(premiumStatus);
      
      // If no courses, initialize with demo data
      if (storedCourses.length === 0) {
        const demoCourses: Course[] = [
    {
      id: '1',
      name: 'Matematik',
      color: '#5A7FE8',
      colorEnd: '#7B9BF0',
      icon: 'calculator',
      coverDesign: 'gradient',
      notes: [],
      tags: [],
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Fizik',
      color: '#4ECDC4',
      colorEnd: '#6FE0D8',
      icon: 'flash',
      coverDesign: 'gradient',
      notes: [],
      tags: [],
      isArchived: false,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      name: 'Kimya',
      color: '#8B7FD6',
      colorEnd: '#A599E8',
      icon: 'flask',
      coverDesign: 'gradient',
      notes: [],
      tags: [],
      isArchived: false,
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
    },
    {
      id: '4',
      name: 'Biyoloji',
      color: '#5FB894',
      colorEnd: '#7FCAA6',
      icon: 'leaf',
      coverDesign: 'gradient',
      notes: [],
      tags: [],
      isArchived: false,
      createdAt: new Date(Date.now() - 259200000),
      updatedAt: new Date(Date.now() - 259200000),
    },
    {
      id: '5',
      name: 'Tarih',
      color: '#E8A87C',
      colorEnd: '#F0BA8E',
      icon: 'time',
      coverDesign: 'gradient',
      notes: [],
      tags: [],
      isArchived: false,
      createdAt: new Date(Date.now() - 345600000),
      updatedAt: new Date(Date.now() - 345600000),
    },
    {
      id: '6',
      name: 'Edebiyat',
      color: '#E88BA8',
      colorEnd: '#F09DBA',
      icon: 'book',
      coverDesign: 'gradient',
      notes: [],
      tags: [],
      isArchived: false,
      createdAt: new Date(Date.now() - 432000000),
      updatedAt: new Date(Date.now() - 432000000),
    },
  ];
        
        await StorageService.saveCourses(demoCourses);
        setCourses(demoCourses);
      } else {
        // Load notes for each course and filter out archived ones
        const coursesWithNotes = await Promise.all(
          storedCourses
            .filter(course => !course.isArchived) // Only show non-archived courses
            .map(async (course) => {
              const notes = await StorageService.getNotesByCourse(course.id);
              return { ...course, notes };
            })
        );
        setCourses(coursesWithNotes);
      }
      
      setIsPremium(premiumStatus);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [customTags, setCustomTags] = useState<any[]>([]);

  const toggleViewMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleCreateCourse = async () => {
    try {
      const { allowed, isPremium, currentCount } = await StorageService.canCreateCourse();
      
      if (!allowed) {
        Alert.alert(
          'Ders Limiti Doldu',
          `Ücretsiz planda maksimum ${StorageService.LIMITS.FREE_COURSE_LIMIT} ders oluşturabilirsiniz. Sınırsız ders için Premium'a geçin!`,
          [
            { text: 'İptal', style: 'cancel' },
            { 
              text: 'Premium\'a Geç', 
              onPress: () => navigation.navigate('Premium'),
              style: 'default'
            }
          ]
        );
        return;
      }
      
      navigation.navigate('CreateCourse');
    } catch (error) {
      console.error('Error checking course limit:', error);
      navigation.navigate('CreateCourse');
    }
  };

  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  const handleShareCourse = async (course: Course) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const noteCount = course.notes?.length || 0;
      const totalPages = course.notes?.reduce((sum, note) => sum + (note.pages?.length || 0), 0) || 0;
      
      const message = `📚 ${course.name}\n\n` +
        `📝 ${noteCount} not\n` +
        `📄 ${totalPages} sayfa\n\n` +
        `NoteMerge ile organize ediyorum! 🎓`;

      await Share.share({
        message: message,
        title: course.name,
      });
    } catch (error) {
      console.error('Error sharing course:', error);
    }
  };

  const formatDate = (date: Date | string) => {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diff = now.getTime() - dateObj.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Az önce';
    if (hours < 24) return `${hours} saat önce`;
    if (hours < 48) return 'Dün';
    return dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="book-outline" size={64} color={Colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>Henüz ders eklenmemiş</Text>
      <Text style={styles.emptySubtitle}>
        İlk dersinizi ekleyerek notlarınızı organize etmeye başlayın
      </Text>
    </View>
  );

  const CourseCardGrid = ({ course }: { course: Course }) => {
    const noteCount = course.notes?.length || 0;
    const totalPages = course.notes?.reduce((sum, note) => sum + (note.pages?.length || 0), 0) || 0;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleCoursePress(course.id)}
        onLongPress={() => handleShareCourse(course)}
        style={styles.courseCardContainer}
      >
        <LinearGradient
          colors={[course.color, course.colorEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.courseCard}
        >
          <Ionicons name={course.icon as any} size={28} color={Colors.text.inverse} />
          
          <Text style={styles.courseName} numberOfLines={2}>
            {course.name}
          </Text>
          
          <View style={styles.courseStats}>
            <View style={styles.statBadge}>
              <Ionicons name="document-text" size={12} color={Colors.text.inverse} />
              <Text style={styles.statText}>{noteCount}</Text>
            </View>
            {totalPages > 0 && (
              <View style={styles.statBadge}>
                <Ionicons name="albums" size={12} color={Colors.text.inverse} />
                <Text style={styles.statText}>{totalPages}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.courseDate}>{formatDate(course.updatedAt)}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const CourseCardList = ({ course }: { course: Course }) => {
    const noteCount = course.notes?.length || 0;
    const totalPages = course.notes?.reduce((sum, note) => sum + (note.pages?.length || 0), 0) || 0;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleCoursePress(course.id)}
        onLongPress={() => handleShareCourse(course)}
        style={styles.courseListItem}
      >
        <LinearGradient
          colors={[course.color, course.colorEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.courseListIcon}
        >
          <Ionicons name={course.icon as any} size={28} color={Colors.text.inverse} />
        </LinearGradient>

        <View style={styles.courseListContent}>
          <Text style={styles.courseListName}>{course.name}</Text>
          <View style={styles.courseListMeta}>
            <Text style={styles.courseListMetaText}>
              {noteCount} not • {totalPages} sayfa
            </Text>
            <Text style={styles.courseListDate}>{formatDate(course.updatedAt)}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
      </TouchableOpacity>
    );
  };

  // Filter courses by tag
  const filteredCourses = selectedTagFilter 
    ? courses.filter(course => 
        course.notes.some(note => note.tags?.includes(selectedTagFilter))
      )
    : courses;

  // Combine predefined and custom tags
  const allTags = [...PredefinedTags, ...customTags];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Sticky Header */}
        <View style={styles.stickyHeader}>
          <View style={styles.header}>
            <View style={styles.headerActions}>
              <View style={styles.headerActionItem}>
                <IconButton
                  icon="search-outline"
                  onPress={() => navigation.navigate('Search')}
                />
                <Text style={styles.actionLabel}>ARA</Text>
              </View>
              <View style={styles.headerActionItem}>
                <IconButton
                  icon={viewMode === 'grid' ? 'list' : 'grid'}
                  onPress={toggleViewMode}
                />
                <Text style={styles.actionLabel}>
                  {viewMode === 'grid' ? 'LİSTE' : 'TABLO'}
                </Text>
              </View>
              <View style={styles.headerActionItem}>
                <IconButton
                  icon="pricetag-outline"
                  onPress={() => navigation.navigate('TagManagement')}
                />
                <Text style={styles.actionLabel}>ETİKET</Text>
              </View>
              <View style={styles.headerActionItem}>
                <IconButton
                  icon="archive-outline"
                  onPress={() => navigation.navigate('Archive')}
                />
                <Text style={styles.actionLabel}>ARŞİV</Text>
              </View>
              <View style={styles.headerActionItem}>
                <IconButton
                  icon="settings-outline"
                  onPress={() => navigation.navigate('Settings')}
                />
                <Text style={styles.actionLabel}>AYAR</Text>
              </View>
              {!isPremium && (
                <View style={styles.headerActionItem}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      navigation.navigate('Premium');
                    }}
                    style={styles.premiumButton}
                  >
                    <LinearGradient
                      colors={theme.colors.accentGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.premiumButtonGradient}
                    >
                      <Ionicons name="star" size={20} color={Colors.text.inverse} />
                    </LinearGradient>
                  </TouchableOpacity>
                  <Text style={styles.actionLabel}>PRO</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Create Button */}
          <View style={styles.createSection}>
            <GradientButton
              title="Yeni Ders Ekle"
              onPress={handleCreateCourse}
              size="large"
              icon={<Ionicons name="add-circle-outline" size={24} color={Colors.text.inverse} />}
            />
          </View>

          {/* Statistics Cards - 1x4 Grid */}
        {courses.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              {/* Total Courses */}
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#5A7FE8', '#7B9BF0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statGradient}
                >
                  <Ionicons name="folder" size={18} color="#FFF" />
                  <Text style={styles.statValue}>{courses.length}</Text>
                  <Text style={styles.statLabel}>Ders</Text>
                </LinearGradient>
              </View>

              {/* Total Notes */}
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#4ECDC4', '#6FE0D8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statGradient}
                >
                  <Ionicons name="document-text" size={18} color="#FFF" />
                  <Text style={styles.statValue}>
                    {courses.reduce((sum, course) => sum + course.notes.length, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Not</Text>
                </LinearGradient>
              </View>

              {/* Total Pages */}
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#FFB84D', '#FFC870']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statGradient}
                >
                  <Ionicons name="albums" size={18} color="#FFF" />
                  <Text style={styles.statValue}>
                    {courses.reduce((sum, course) => 
                      sum + course.notes.reduce((noteSum, note) => 
                        noteSum + (note.pages?.length || 0), 0
                      ), 0
                    )}
                  </Text>
                  <Text style={styles.statLabel}>Sayfa</Text>
                </LinearGradient>
              </View>

              {/* This Month's Notes */}
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#A78BFA', '#C4B5FD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statGradient}
                >
                  <Ionicons name="calendar" size={18} color="#FFF" />
                  <Text style={styles.statValue}>
                    {(() => {
                      const now = new Date();
                      const currentMonth = now.getMonth();
                      const currentYear = now.getFullYear();
                      
                      return courses.reduce((sum, course) => 
                        sum + course.notes.filter(note => {
                          const noteDate = new Date(note.createdAt);
                          return noteDate.getMonth() === currentMonth && 
                                 noteDate.getFullYear() === currentYear;
                        }).length, 0
                      );
                    })()}
                  </Text>
                  <Text style={styles.statLabel}>Bu Ay</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Most Active Course */}
            {(() => {
              const mostActive = courses.reduce((max, course) => {
                const noteCount = course.notes.length;
                return noteCount > (max.notes?.length || 0) ? course : max;
              }, courses[0]);

              if (mostActive && mostActive.notes.length > 0) {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleCoursePress(mostActive.id)}
                    style={styles.mostActiveCard}
                  >
                    <View style={styles.mostActiveHeader}>
                      <Ionicons name="flame" size={20} color="#FF6B6B" />
                      <Text style={styles.mostActiveTitle}>En Aktif Ders</Text>
                    </View>
                    <View style={styles.mostActiveContent}>
                      <LinearGradient
                        colors={[mostActive.color, mostActive.colorEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.mostActiveIcon}
                      >
                        <Ionicons name={mostActive.icon as any} size={20} color="#FFF" />
                      </LinearGradient>
                      <View style={styles.mostActiveInfo}>
                        <Text style={styles.mostActiveName}>{mostActive.name}</Text>
                        <Text style={styles.mostActiveStats}>
                          {mostActive.notes.length} not • {
                            mostActive.notes.reduce((sum, note) => sum + (note.pages?.length || 0), 0)
                          } sayfa
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
                    </View>
                  </TouchableOpacity>
                );
              }
              return null;
            })()}

          </View>
          )}

          {/* Tag Filters */}
          {courses.length > 0 && (
            <View style={styles.tagFiltersContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagFiltersContent}
              >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedTagFilter(null);
                }}
                style={[
                  styles.tagFilterChip,
                  !selectedTagFilter && styles.tagFilterChipActive,
                ]}
              >
                <Text style={[
                  styles.tagFilterText,
                  !selectedTagFilter && styles.tagFilterTextActive,
                ]}>
                  Tümü
                </Text>
              </TouchableOpacity>

              {allTags.map((tag) => {
                // Check if any course has notes with this tag
                const hasCoursesWithTag = courses.some(course => 
                  course.notes.some(note => note.tags?.includes(tag.id))
                );
                if (!hasCoursesWithTag) return null;

                return (
                  <TouchableOpacity
                    key={tag.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedTagFilter(tag.id);
                    }}
                    style={[
                      styles.tagFilterChip,
                      selectedTagFilter === tag.id && styles.tagFilterChipActive,
                      { borderColor: tag.color },
                    ]}
                  >
                    <Ionicons 
                      name={tag.icon as any} 
                      size={16} 
                      color={selectedTagFilter === tag.id ? '#FFF' : tag.color} 
                    />
                    <Text 
                      style={[
                        styles.tagFilterText,
                        selectedTagFilter === tag.id && styles.tagFilterTextActive,
                        { color: selectedTagFilter === tag.id ? '#FFF' : tag.color },
                      ]}
                    >
                      {tag.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              </ScrollView>
            </View>
          )}

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="pricetag-outline" size={64} color={Colors.text.tertiary} />
              <Text style={styles.emptyTitle}>
                {selectedTagFilter ? 'Bu etikette ders yok' : 'Henüz ders eklemediniz'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedTagFilter ? 'Farklı bir etiket seçin veya yeni ders ekleyin' : 'Yeni ders eklemek için yukarıdaki butona dokunun'}
              </Text>
            </View>
          ) : (
            <>
              <SectionHeader
                title="Derslerim"
                subtitle={isPremium ? `${courses.length} ders` : `${courses.length}/${StorageService.LIMITS.FREE_COURSE_LIMIT} ders`}
                icon="book-outline"
              />
              {viewMode === 'grid' ? (
                <View style={styles.coursesGrid}>
                  {filteredCourses.map((course) => (
                    <CourseCardGrid key={course.id} course={course} />
                  ))}
                </View>
              ) : (
                <View style={styles.coursesList}>
                  {filteredCourses.map((course) => (
                    <CourseCardList key={course.id} course={course} />
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
