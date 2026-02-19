import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { IconButton } from '../components';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { Course, Note } from '../types';
import { useTheme } from '../context/ThemeContext';
import { StorageService } from '../services/StorageService';

type SearchFilter = 'all' | 'courses' | 'notes';

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
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginTop: '10%',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    fontFamily: Typography.body.fontFamily,
    color: theme.colors.text.primary,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 11,
    fontFamily: Typography.footnote.fontFamily,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  sectionTitle: {
    fontSize: Typography.headline.fontSize,
    fontFamily: Typography.headline.fontFamily,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    backgroundColor: theme.colors.card.background,
    marginBottom: Spacing.sm,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: Typography.body.fontSize,
    fontFamily: Typography.body.fontFamily,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
    color: theme.colors.text.secondary,
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
  highlightText: {
    color: theme.colors.accentGradient[0],
    fontWeight: '700',
  },
});

export const SearchScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const Colors = theme.colors;
  const styles = createStyles(theme);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    performSearch();
  }, [searchQuery, filter, courses, notes]);

  const loadData = async () => {
    try {
      const allCourses = await StorageService.getCourses();
      const activeCourses = allCourses.filter(c => !c.isArchived);
      
      const allNotes = await StorageService.getNotes();
      
      setCourses(activeCourses);
      setNotes(allNotes);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const performSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredCourses([]);
      setFilteredNotes([]);
      return;
    }

    const query = searchQuery.toLowerCase();

    // Search courses
    if (filter === 'all' || filter === 'courses') {
      const matchedCourses = courses.filter(course =>
        course.name.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredCourses(matchedCourses);
    } else {
      setFilteredCourses([]);
    }

    // Search notes
    if (filter === 'all' || filter === 'notes') {
      const matchedNotes = notes.filter(note =>
        note.name.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredNotes(matchedNotes);
    } else {
      setFilteredNotes([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const handleCoursePress = (courseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('CourseDetail', { courseId });
  };

  const handleNotePress = (note: Note) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('PDFPreview', { courseId: note.courseId, noteId: note.id });
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={index} style={styles.highlightText}>{part}</Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    );
  };

  const EmptyState = () => {
    if (searchQuery.trim()) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="search-outline" size={64} color={Colors.text.tertiary} />
          </View>
          <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
          <Text style={styles.emptySubtitle}>
            "{searchQuery}" için sonuç bulunamadı. Farklı bir arama terimi deneyin.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Ionicons name="search" size={64} color={Colors.text.tertiary} />
        </View>
        <Text style={styles.emptyTitle}>Arama yapın</Text>
        <Text style={styles.emptySubtitle}>
          Ders veya not aramak için yukarıdaki arama çubuğunu kullanın
        </Text>
      </View>
    );
  };

  const CourseResult = ({ course }: { course: Course }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleCoursePress(course.id)}
      style={styles.resultCard}
    >
      <LinearGradient
        colors={[course.color, course.colorEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.resultIcon}
      >
        <Ionicons name={course.icon as any} size={24} color={Colors.text.inverse} />
      </LinearGradient>
      
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>
          {highlightText(course.name, searchQuery)}
        </Text>
        <Text style={styles.resultSubtitle}>
          {course.notes?.length || 0} not • Ders
        </Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
    </TouchableOpacity>
  );

  const NoteResult = ({ note }: { note: Note }) => {
    const course = courses.find(c => c.id === note.courseId);
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleNotePress(note)}
        style={styles.resultCard}
      >
        <View style={[styles.resultIcon, { backgroundColor: course?.color + '20' || Colors.card.background }]}>
          <Ionicons name="document-text" size={24} color={course?.color || Colors.text.secondary} />
        </View>
        
        <View style={styles.resultContent}>
          <Text style={styles.resultTitle}>
            {highlightText(note.name, searchQuery)}
          </Text>
          <Text style={styles.resultSubtitle}>
            {note.pages?.length || 0} sayfa • {course?.name || 'Bilinmeyen Ders'}
          </Text>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme.id === 'light' ? 'dark' : 'light'} />
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Header with Search */}
        <View style={styles.header}>
          <IconButton icon="arrow-back" onPress={() => navigation.goBack()} />
          
          <View style={styles.searchContainer}>
            <Ionicons 
              name="search" 
              size={20} 
              color={Colors.text.tertiary} 
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Ders veya not ara..."
              placeholderTextColor={Colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={Colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          {(['all', 'courses', 'notes'] as SearchFilter[]).map((f) => {
            const isActive = filter === f;
            const labels = { all: 'TÜMÜ', courses: 'DERSLER', notes: 'NOTLAR' };
            
            return (
              <TouchableOpacity
                key={f}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFilter(f);
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
                  {labels[f]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Results */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {filteredCourses.length === 0 && filteredNotes.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {filteredCourses.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>
                    Dersler ({filteredCourses.length})
                  </Text>
                  {filteredCourses.map(course => (
                    <CourseResult key={course.id} course={course} />
                  ))}
                </>
              )}
              
              {filteredNotes.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>
                    Notlar ({filteredNotes.length})
                  </Text>
                  {filteredNotes.map(note => (
                    <NoteResult key={note.id} note={note} />
                  ))}
                </>
              )}
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
