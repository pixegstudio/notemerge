import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
}

export const TagStatsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const Colors = theme.colors;
  
  const [tagStats, setTagStats] = useState<TagStats[]>([]);
  const [customTags, setCustomTags] = useState<TagType[]>([]);

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

      allTags.forEach((tag) => {
        let noteCount = 0;
        let courseCount = 0;
        let totalPages = 0;
        const coursesWithTag = new Set<string>();

        courses.forEach((course) => {
          course.notes.forEach((note) => {
            if (note.tags?.includes(tag.id)) {
              noteCount++;
              totalPages += note.pages?.length || 0;
              coursesWithTag.add(course.id);
            }
          });
        });

        courseCount = coursesWithTag.size;

        if (noteCount > 0) {
          stats.push({
            tag,
            noteCount,
            courseCount,
            totalPages,
          });
        }
      });

      // Sort by note count (descending)
      stats.sort((a, b) => b.noteCount - a.noteCount);
      setTagStats(stats);
    } catch (error) {
      console.error('Error loading tag stats:', error);
    }
  };

  const StatCard = ({ stat }: { stat: TagStats }) => (
    <View style={styles.statCard}>
      <View style={[styles.tagIcon, { backgroundColor: stat.tag.color + '20' }]}>
        <Ionicons name={stat.tag.icon as any} size={28} color={stat.tag.color} />
      </View>
      
      <View style={styles.statContent}>
        <Text style={styles.tagName}>{stat.tag.name}</Text>
        
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
    statCard: {
      flexDirection: 'row',
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
      marginRight: Spacing.md,
    },
    statContent: {
      flex: 1,
      justifyContent: 'center',
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

  const totalNotes = tagStats.reduce((sum, stat) => sum + stat.noteCount, 0);
  const totalTags = tagStats.length;
  const totalPages = tagStats.reduce((sum, stat) => sum + stat.totalPages, 0);

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
          {tagStats.length > 0 ? (
            <>
              {/* Summary */}
              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Özet</Text>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{totalTags}</Text>
                    <Text style={styles.summaryLabel}>Etiket</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{totalNotes}</Text>
                    <Text style={styles.summaryLabel}>Not</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{totalPages}</Text>
                    <Text style={styles.summaryLabel}>Sayfa</Text>
                  </View>
                </View>
              </View>

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
