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

interface OverallStats {
  totalTags: number;
  totalCustomTags: number;
  totalPredefinedTags: number;
  totalTaggedNotes: number;
  totalUntaggedNotes: number;
  mostUsedTag: TagStats | null;
}

export const TagStatsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const Colors = theme.colors;
  
  const [tagStats, setTagStats] = useState<TagStats[]>([]);
  const [customTags, setCustomTags] = useState<TagType[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalTags: 0,
    totalCustomTags: 0,
    totalPredefinedTags: 0,
    totalTaggedNotes: 0,
    totalUntaggedNotes: 0,
    mostUsedTag: null,
  });
  const [expandedTagId, setExpandedTagId] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [courses, customTagsData] = await Promise.all([
        StorageService.getCourses(),
        StorageService.getCustomTags(),
      ]);

      setCustomTags(customTagsData);

      const allTags = [...PredefinedTags, ...customTagsData];
      const stats: TagStats[] = [];
      let totalTaggedNotes = 0;
      let totalUntaggedNotes = 0;

      // Debug: Log all courses and their notes with tags
      console.log('=== TAG STATS DEBUG ===');
      courses.forEach((course) => {
        console.log(`Course: ${course.name}`);
        course.notes.forEach((note) => {
          console.log(`  Note: ${note.name}, Tags:`, note.tags);
        });
      });

      allTags.forEach((tag) => {
        let noteCount = 0;
        let totalPages = 0;
        const coursesWithTag = new Map<string, { name: string; noteCount: number }>();

        courses.forEach((course) => {
          let courseNoteCount = 0;
          
          course.notes.forEach((note) => {
            if (note.tags?.includes(tag.id)) {
              noteCount++;
              courseNoteCount++;
              totalPages += note.pages?.length || 0;
              console.log(`  ✓ Tag "${tag.name}" found in note "${note.name}" (course: ${course.name})`);
            }
          });

          if (courseNoteCount > 0) {
            coursesWithTag.set(course.id, {
              name: course.name,
              noteCount: courseNoteCount,
            });
          }
        });

        if (noteCount > 0) {
          stats.push({
            tag,
            noteCount,
            courseCount: coursesWithTag.size,
            totalPages,
            courses: Array.from(coursesWithTag.entries()).map(([id, data]) => ({
              id,
              name: data.name,
              noteCount: data.noteCount,
            })),
          });
        }
      });

      // Count tagged and untagged notes
      courses.forEach((course) => {
        course.notes.forEach((note) => {
          if (note.tags && note.tags.length > 0) {
            totalTaggedNotes++;
          } else {
            totalUntaggedNotes++;
          }
        });
      });

      // Sort by note count (descending)
      stats.sort((a, b) => b.noteCount - a.noteCount);
      
      setTagStats(stats);
      setOverallStats({
        totalTags: allTags.length,
        totalCustomTags: customTagsData.length,
        totalPredefinedTags: PredefinedTags.length,
        totalTaggedNotes,
        totalUntaggedNotes,
        mostUsedTag: stats[0] || null,
      });
    } catch (error) {
      console.error('Error loading tag stats:', error);
    }
  };

  const StatCard = ({ stat }: { stat: TagStats }) => {
    const isExpanded = expandedTagId === stat.tag.id;
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (stat.courses.length > 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setExpandedTagId(isExpanded ? null : stat.tag.id);
          }
        }}
        style={styles.statCard}
      >
        <View style={[styles.tagIcon, { backgroundColor: stat.tag.color + '20' }]}>
          <Ionicons name={stat.tag.icon as any} size={28} color={stat.tag.color} />
        </View>
        
        <View style={styles.statContent}>
          <View style={styles.statHeader}>
            <Text style={styles.tagName}>{stat.tag.name}</Text>
            {stat.courses.length > 0 && (
              <Ionicons 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={Colors.text.secondary} 
              />
            )}
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stat.noteCount}</Text>
              <Text style={styles.statLabel}>Not</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stat.courseCount}</Text>
              <Text style={styles.statLabel}>Ders</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stat.totalPages}</Text>
              <Text style={styles.statLabel}>Sayfa</Text>
            </View>
          </View>

          {/* Expanded Course List */}
          {isExpanded && stat.courses.length > 0 && (
            <View style={styles.courseList}>
              <Text style={styles.courseListTitle}>Kullanıldığı Dersler:</Text>
              {stat.courses.map((course) => (
                <View key={course.id} style={styles.courseItem}>
                  <Ionicons name="book-outline" size={16} color={Colors.text.secondary} />
                  <Text style={styles.courseName}>{course.name}</Text>
                  <Text style={styles.courseNoteCount}>({course.noteCount} not)</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const OverallStatsCard = () => (
    <View style={styles.overallCard}>
      <Text style={styles.overallTitle}>Genel İstatistikler</Text>
      
      <View style={styles.overallGrid}>
        <View style={styles.overallItem}>
          <Ionicons name="pricetag" size={24} color={Colors.accentGradient[0]} />
          <Text style={styles.overallValue}>{overallStats.totalTags}</Text>
          <Text style={styles.overallLabel}>Toplam Etiket</Text>
        </View>
        
        <View style={styles.overallItem}>
          <Ionicons name="create" size={24} color={Colors.accentGradient[0]} />
          <Text style={styles.overallValue}>{overallStats.totalCustomTags}</Text>
          <Text style={styles.overallLabel}>Özel Etiket</Text>
        </View>
        
        <View style={styles.overallItem}>
          <Ionicons name="document-text" size={24} color={Colors.accentGradient[0]} />
          <Text style={styles.overallValue}>{overallStats.totalTaggedNotes}</Text>
          <Text style={styles.overallLabel}>Etiketli Not</Text>
        </View>
        
        <View style={styles.overallItem}>
          <Ionicons name="document-outline" size={24} color={Colors.text.tertiary} />
          <Text style={styles.overallValue}>{overallStats.totalUntaggedNotes}</Text>
          <Text style={styles.overallLabel}>Etiketlenmemiş</Text>
        </View>
      </View>

      {overallStats.mostUsedTag && (
        <View style={styles.mostUsedSection}>
          <Text style={styles.mostUsedTitle}>En Çok Kullanılan:</Text>
          <View style={styles.mostUsedTag}>
            <View style={[styles.mostUsedIcon, { backgroundColor: overallStats.mostUsedTag.tag.color + '20' }]}>
              <Ionicons 
                name={overallStats.mostUsedTag.tag.icon as any} 
                size={20} 
                color={overallStats.mostUsedTag.tag.color} 
              />
            </View>
            <Text style={styles.mostUsedName}>{overallStats.mostUsedTag.tag.name}</Text>
            <Text style={styles.mostUsedCount}>({overallStats.mostUsedTag.noteCount} not)</Text>
          </View>
        </View>
      )}
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
    mostUsedSection: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.card.border,
      paddingTop: Spacing.md,
    },
    mostUsedTitle: {
      fontSize: Typography.callout.fontSize,
      fontWeight: '600',
      color: theme.colors.text.secondary,
      marginBottom: Spacing.sm,
    },
    mostUsedTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
    },
    mostUsedIcon: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.sm,
    },
    mostUsedName: {
      flex: 1,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    mostUsedCount: {
      fontSize: Typography.callout.fontSize,
      color: theme.colors.text.secondary,
    },
    statCard: {
      backgroundColor: theme.colors.card.background,
      borderRadius: BorderRadius.lg,
      padding: Spacing.base,
      marginBottom: Spacing.sm,
    },
    tagIcon: {
      width: 56,
      height: 56,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.sm,
    },
    statContent: {
      flex: 1,
    },
    statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    tagName: {
      fontSize: Typography.body.fontSize,
      fontFamily: Typography.body.fontFamily,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: Spacing.sm,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: Typography.headline.fontSize,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: Typography.caption.fontSize,
      color: theme.colors.text.secondary,
    },
    statDivider: {
      width: 1,
      height: 32,
      backgroundColor: theme.colors.card.border,
    },
    courseList: {
      marginTop: Spacing.md,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.card.border,
    },
    courseListTitle: {
      fontSize: Typography.caption.fontSize,
      fontWeight: '600',
      color: theme.colors.text.secondary,
      marginBottom: Spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    courseItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.xs,
      gap: Spacing.sm,
    },
    courseName: {
      flex: 1,
      fontSize: Typography.callout.fontSize,
      color: theme.colors.text.primary,
    },
    courseNoteCount: {
      fontSize: Typography.caption.fontSize,
      color: theme.colors.text.secondary,
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

          {tagStats.length > 0 ? (
            <>
              {/* Stats List */}
              <Text style={styles.sectionTitle}>Etiket Detayları</Text>
              {tagStats.map((stat) => (
                <StatCard key={stat.tag.id} stat={stat} />
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
