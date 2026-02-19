import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { IconButton } from '../components';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';
import { StorageService } from '../services/StorageService';
import { PredefinedTags, TagType } from '../constants/tags';

interface TagStats {
  tag: TagType;
  noteCount: number;
  courseCount: number;
  totalPages: number;
  courses: Array<{ id: string; name: string; noteCount: number }>;
}

interface CourseTagStats {
  courseId: string;
  courseName: string;
  tags: Array<{
    tag: TagType;
    noteCount: number;
    notes: Array<{ id: string; name: string }>;
  }>;
  totalTaggedNotes: number;
}

interface OverallStats {
  totalTags: number;
  totalCustomTags: number;
  usedTagsCount: number;
  totalTaggedNotes: number;
  totalUntaggedNotes: number;
}

export const TagStatsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const Colors = theme.colors;
  
  const [courseTagStats, setCourseTagStats] = useState<CourseTagStats[]>([]);
  const [customTags, setCustomTags] = useState<TagType[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalTags: 0,
    totalCustomTags: 0,
    usedTagsCount: 0,
    totalTaggedNotes: 0,
    totalUntaggedNotes: 0,
  });
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [courses, customTagsData, allNotes] = await Promise.all([
        StorageService.getCourses(),
        StorageService.getCustomTags(),
        StorageService.getNotes(),
      ]);

      // Populate courses with their notes
      courses.forEach(course => {
        course.notes = allNotes.filter(note => note.courseId === course.id);
      });

      setCustomTags(customTagsData);

      const allTags = [...PredefinedTags, ...customTagsData];
      const courseStats: CourseTagStats[] = [];
      let totalTaggedNotes = 0;
      let totalUntaggedNotes = 0;
      const usedTagIds = new Set<string>();

      // Process each course
      courses.forEach((course) => {
        const courseTags: CourseTagStats['tags'] = [];
        let courseTaggedNotes = 0;

        // For each tag, check which notes in this course use it
        allTags.forEach((tag) => {
          const notesWithTag: Array<{ id: string; name: string }> = [];

          course.notes.forEach((note) => {
            if (note.tags?.includes(tag.id)) {
              notesWithTag.push({
                id: note.id,
                name: note.name,
              });
              usedTagIds.add(tag.id);
            }
          });

          if (notesWithTag.length > 0) {
            courseTags.push({
              tag,
              noteCount: notesWithTag.length,
              notes: notesWithTag,
            });
          }
        });

        // Count tagged notes in this course
        course.notes.forEach((note) => {
          if (note.tags && note.tags.length > 0) {
            courseTaggedNotes++;
            totalTaggedNotes++;
          } else {
            totalUntaggedNotes++;
          }
        });

        // Only add course if it has tagged notes
        if (courseTags.length > 0) {
          courseStats.push({
            courseId: course.id,
            courseName: course.name,
            tags: courseTags.sort((a, b) => b.noteCount - a.noteCount),
            totalTaggedNotes: courseTaggedNotes,
          });
        }
      });

      // Sort courses by total tagged notes (descending)
      courseStats.sort((a, b) => b.totalTaggedNotes - a.totalTaggedNotes);
      
      setCourseTagStats(courseStats);
      setOverallStats({
        totalTags: allTags.length,
        totalCustomTags: customTagsData.length,
        usedTagsCount: usedTagIds.size,
        totalTaggedNotes,
        totalUntaggedNotes,
      });
    } catch (error) {
      console.error('Error loading tag stats:', error);
    }
  };

  const CourseCard = ({ courseStat }: { courseStat: CourseTagStats }) => {
    const isExpanded = expandedCourseId === courseStat.courseId;
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setExpandedCourseId(isExpanded ? null : courseStat.courseId);
        }}
        style={styles.courseCard}
      >
        <View style={styles.courseCardHeader}>
          <View style={styles.courseIconContainer}>
            <Ionicons name="book" size={24} color={Colors.accentGradient[0]} />
          </View>
          
          <View style={styles.courseCardContent}>
            <Text style={styles.courseCardName}>{courseStat.courseName}</Text>
            <Text style={styles.courseCardSubtitle}>
              {courseStat.tags.length} etiket • {courseStat.totalTaggedNotes} not
            </Text>
          </View>

          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={Colors.text.secondary} 
          />
        </View>

        {/* Expanded Tag List */}
        {isExpanded && (
          <View style={styles.tagsList}>
            {courseStat.tags.map((tagStat) => (
              <View key={tagStat.tag.id} style={styles.tagItem}>
                <View style={[styles.tagItemIcon, { backgroundColor: tagStat.tag.color + '20' }]}>
                  <Ionicons name={tagStat.tag.icon as any} size={18} color={tagStat.tag.color} />
                </View>
                
                <View style={styles.tagItemContent}>
                  <Text style={styles.tagItemName}>{tagStat.tag.name}</Text>
                  <Text style={styles.tagItemNotes}>
                    {tagStat.notes.map(n => n.name).join(', ')}
                  </Text>
                </View>
                
                <View style={styles.tagItemBadge}>
                  <Text style={styles.tagItemCount}>{tagStat.noteCount}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const OverallStatsCard = () => (
    <View style={styles.overallCard}>
      <Text style={styles.overallTitle}>Genel İstatistikler</Text>
      
      <View style={styles.overallGrid}>
        <View style={styles.overallItem}>
          <Ionicons name="pricetags" size={24} color={Colors.accentGradient[0]} />
          <Text style={styles.overallValue}>{overallStats.totalTags}</Text>
          <Text style={styles.overallLabel}>Toplam Etiket</Text>
        </View>
        
        <View style={styles.overallItem}>
          <Ionicons name="create" size={24} color={Colors.accentGradient[0]} />
          <Text style={styles.overallValue}>{overallStats.totalCustomTags}</Text>
          <Text style={styles.overallLabel}>Özel Etiket</Text>
        </View>
        
        <View style={styles.overallItem}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text style={styles.overallValue}>{overallStats.usedTagsCount}</Text>
          <Text style={styles.overallLabel}>Kullanılan Etiket</Text>
        </View>
        
        <View style={styles.overallItem}>
          <Ionicons name="document-text" size={24} color={Colors.accentGradient[0]} />
          <Text style={styles.overallValue}>{overallStats.totalTaggedNotes}</Text>
          <Text style={styles.overallLabel}>Etiketli Not</Text>
        </View>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="analytics-outline" size={64} color={Colors.text.tertiary} />
      <Text style={styles.emptyTitle}>Henüz etiket kullanılmamış</Text>
      <Text style={styles.emptySubtitle}>
        Notlarınıza etiket ekleyerek istatistikleri görüntüleyin
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing['3xl'],
    },
    summary: {
      backgroundColor: theme.colors.card.background,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      marginBottom: Spacing.xl,
    },
    summaryTitle: {
      fontSize: Typography.title.fontSize,
      fontFamily: Typography.title.fontFamily,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: Spacing.md,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    summaryItem: {
      alignItems: 'center',
    },
    summaryValue: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.colors.accentGradient[0],
      marginBottom: 4,
    },
    summaryLabel: {
      fontSize: Typography.footnote.fontSize,
      fontFamily: Typography.footnote.fontFamily,
      color: theme.colors.text.secondary,
    },
    sectionTitle: {
      fontSize: Typography.headline.fontSize,
      fontFamily: Typography.headline.fontFamily,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: Spacing.md,
    },
    overallCard: {
      backgroundColor: theme.colors.card.background,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      marginBottom: Spacing.xl,
    },
    overallTitle: {
      fontSize: Typography.title.fontSize,
      fontFamily: Typography.title.fontFamily,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: Spacing.lg,
    },
    overallGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
      marginBottom: Spacing.lg,
    },
    overallItem: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.colors.background,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      alignItems: 'center',
    },
    overallValue: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginTop: Spacing.sm,
      marginBottom: 4,
    },
    overallLabel: {
      fontSize: Typography.caption.fontSize,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    courseCard: {
      backgroundColor: theme.colors.card.background,
      borderRadius: BorderRadius.lg,
      padding: Spacing.base,
      marginBottom: Spacing.md,
    },
    courseCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    courseIconContainer: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.colors.accentGradient[0] + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    courseCardContent: {
      flex: 1,
    },
    courseCardName: {
      fontSize: Typography.body.fontSize,
      fontFamily: Typography.body.fontFamily,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    courseCardSubtitle: {
      fontSize: Typography.caption.fontSize,
      color: theme.colors.text.secondary,
    },
    tagsList: {
      marginTop: Spacing.md,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.card.border,
      gap: Spacing.sm,
    },
    tagItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: BorderRadius.md,
      padding: Spacing.sm,
    },
    tagItemIcon: {
      width: 36,
      height: 36,
      borderRadius: BorderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.sm,
    },
    tagItemContent: {
      flex: 1,
    },
    tagItemName: {
      fontSize: Typography.callout.fontSize,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    tagItemNotes: {
      fontSize: Typography.caption.fontSize,
      color: theme.colors.text.secondary,
      lineHeight: 16,
    },
    tagItemBadge: {
      backgroundColor: theme.colors.accentGradient[0] + '20',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: BorderRadius.sm,
    },
    tagItemCount: {
      fontSize: Typography.caption.fontSize,
      fontWeight: '700',
      color: theme.colors.accentGradient[0],
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing['5xl'],
    },
    emptyTitle: {
      fontSize: Typography.headline.fontSize,
      fontWeight: Typography.headline.fontWeight,
      color: theme.colors.text.primary,
      marginTop: Spacing.lg,
      marginBottom: Spacing.sm,
    },
    emptySubtitle: {
      fontSize: Typography.callout.fontSize,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      paddingHorizontal: Spacing['2xl'],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="arrow-back" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Etiket İstatistikleri</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Overall Stats - Always show */}
          <OverallStatsCard />

          {courseTagStats.length > 0 ? (
            <>
              {/* Course List */}
              <Text style={styles.sectionTitle}>Dersler ve Etiketler</Text>
              {courseTagStats.map((courseStat) => (
                <CourseCard key={courseStat.courseId} courseStat={courseStat} />
              ))}
            </>
          ) : (
            <EmptyState />
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
