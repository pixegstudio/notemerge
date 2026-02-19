import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { IconButton, GlassCard } from '../components';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { Course } from '../types';
import { useTheme } from '../context/ThemeContext';
import { StorageService } from '../services/StorageService';

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'courses' | 'notes';

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
    fontFamily: Typography.headline.fontFamily,
    color: theme.colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
    fontWeight: '600',
  },
  semesterSection: {
    marginBottom: Spacing.xl,
  },
  semesterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  semesterTitle: {
    fontSize: Typography.headline.fontSize,
    fontFamily: Typography.headline.fontFamily,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  semesterCount: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
    color: theme.colors.text.tertiary,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    backgroundColor: theme.colors.card.background,
    marginBottom: Spacing.sm,
  },
  courseIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  courseContent: {
    flex: 1,
  },
  courseName: {
    fontSize: Typography.body.fontSize,
    fontFamily: Typography.body.fontFamily,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  courseMeta: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
    color: theme.colors.text.secondary,
  },
  courseActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['4xl'],
  },
  emptyIcon: {
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
    fontFamily: Typography.headline.fontFamily,
    color: theme.colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.body.fontSize,
    fontFamily: Typography.body.fontFamily,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export const ArchiveScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const Colors = theme.colors;
  const styles = createStyles(theme);
  
  const [archivedCourses, setArchivedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  useEffect(() => {
    loadArchivedCourses();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadArchivedCourses();
    });
    return unsubscribe;
  }, [navigation]);

  const loadArchivedCourses = async () => {
    try {
      const allCourses = await StorageService.getCourses();
      console.log('📦 All courses:', allCourses.length);
      console.log('📦 Courses with isArchived:', allCourses.map(c => ({ id: c.id, name: c.name, isArchived: c.isArchived })));
      
      const archived = allCourses.filter(c => c.isArchived);
      console.log('📦 Archived courses:', archived.length);
      
      // Load notes for each archived course
      const coursesWithNotes = await Promise.all(
        archived.map(async (course) => {
          const notes = await StorageService.getNotesByCourse(course.id);
          return { ...course, notes };
        })
      );
      
      setArchivedCourses(coursesWithNotes);
    } catch (error) {
      console.error('Error loading archived courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnarchive = async (courseId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await StorageService.updateCourse(courseId, { isArchived: false });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      loadArchivedCourses();
    } catch (error) {
      console.error('Error unarchiving course:', error);
      Alert.alert('Hata', 'Ders arşivden çıkarılırken bir hata oluştu.');
    }
  };

  const handleDeletePermanently = async (courseId: string, courseName: string) => {
    Alert.alert(
      'Kalıcı Olarak Sil',
      `"${courseName}" dersini kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteCourse(courseId);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              loadArchivedCourses();
            } catch (error) {
              console.error('Error deleting course:', error);
              Alert.alert('Hata', 'Ders silinirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  // Group courses by semester
  const groupedCourses = archivedCourses.reduce((acc, course) => {
    const semester = course.semester || 'Diğer';
    if (!acc[semester]) {
      acc[semester] = [];
    }
    acc[semester].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="archive-outline" size={64} color={Colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>Arşiv boş</Text>
      <Text style={styles.emptySubtitle}>
        Arşivlenen dersler burada görünecek
      </Text>
    </View>
  );

  const CourseCard = ({ course }: { course: Course }) => {
    const noteCount = course.notes?.length || 0;
    const totalPages = course.notes?.reduce((sum, note) => sum + (note.pages?.length || 0), 0) || 0;

    return (
      <View style={styles.courseCard}>
        <LinearGradient
          colors={[course.color, course.colorEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.courseIcon}
        >
          <Ionicons name={course.icon as any} size={28} color={Colors.text.inverse} />
        </LinearGradient>
        
        <View style={styles.courseContent}>
          <Text style={styles.courseName}>{course.name}</Text>
          <Text style={styles.courseMeta}>
            {noteCount} not • {totalPages} sayfa
          </Text>
        </View>
        
        <View style={styles.courseActions}>
          <TouchableOpacity
            onPress={() => handleUnarchive(course.id)}
            style={styles.actionButton}
          >
            <Ionicons name="arrow-undo" size={22} color={Colors.status.success} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeletePermanently(course.id, course.name)}
            style={styles.actionButton}
          >
            <Ionicons name="trash" size={22} color={Colors.status.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="arrow-back" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Arşiv</Text>
          <View style={styles.headerActions}>
            <IconButton 
              icon={viewMode === 'grid' ? 'list' : 'grid'} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setViewMode(viewMode === 'grid' ? 'list' : 'grid');
              }} 
            />
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.scrollContent}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: Spacing.base }}
          >
            <View style={styles.filterContainer}>
              {(['all', 'courses', 'notes'] as FilterMode[]).map((mode) => {
                const isActive = filterMode === mode;
                const labels = { all: 'Tümü', courses: 'Dersler', notes: 'Notlar' };
                
                return (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setFilterMode(mode);
                    }}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isActive ? Colors.accentGradient[0] : 'transparent',
                        borderColor: isActive ? Colors.accentGradient[0] : Colors.card.border,
                      }
                    ]}
                  >
                    <Text style={[
                      styles.filterChipText,
                      { color: isActive ? Colors.text.inverse : Colors.text.secondary }
                    ]}>
                      {labels[mode]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {archivedCourses.length === 0 ? (
            <EmptyState />
          ) : (
            Object.entries(groupedCourses).map(([semester, courses]) => (
              <View key={semester} style={styles.semesterSection}>
                <View style={styles.semesterHeader}>
                  <Ionicons name="calendar" size={20} color={Colors.accentGradient[0]} />
                  <Text style={styles.semesterTitle}>{semester}</Text>
                  <Text style={styles.semesterCount}>({courses.length})</Text>
                </View>
                
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
