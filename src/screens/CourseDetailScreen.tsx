import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Share,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { IconButton, GlassCard, RenameNoteModal } from '../components';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { Course, Note } from '../types';
import { useTheme } from '../context/ThemeContext';
import { StorageService } from '../services/StorageService';
import { PredefinedTags } from '../constants/tags';
import { generatePDFFromNote, sharePDF, addWatermarkToPDF } from '../utils/pdfUtils';
import { CourseColors, CourseColorType } from '../constants/colors';

// ============================================================
// LAYOUT CONSTANTS
// ============================================================
const SCREEN_WIDTH = Dimensions.get('window').width;
const COLOR_COLUMNS = 5;
const COLOR_GAP = 12;
const COLOR_PADDING = 32; // modal padding
const COLOR_SIZE = (SCREEN_WIDTH - COLOR_PADDING - (COLOR_GAP * (COLOR_COLUMNS - 1))) / COLOR_COLUMNS;

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
  hero: {
    height: 180,
    overflow: 'visible',
    width: '100%',
  },
  heroBlur: {
    flex: 1,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.base,
    justifyContent: 'space-between',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  heroIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    fontSize: Typography.headline.fontSize,
    fontWeight: '700',
    color: theme.colors.text.inverse,
  },
  statsSection: {
    paddingHorizontal: Spacing.base,
    marginTop: -Spacing.xl,
    marginBottom: Spacing.base,
  },
  statsCard: {
    padding: Spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
  statsActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.card.border,
  },
  statsActivityText: {
    fontSize: Typography.footnote.fontSize,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  notesContainer: {
    flex: 1,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  noteCardGrid: {
    width: '48%',
  },
  noteCard: {
    padding: Spacing.md,
  },
  noteThumbnail: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.background,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  noteInfo: {
    flex: 1,
  },
  noteName: {
    fontSize: Typography.callout.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: Spacing.xs,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noteMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noteMetaText: {
    fontSize: Typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },
  noteDate: {
    fontSize: Typography.caption.fontSize,
    color: theme.colors.text.tertiary,
  },
  noteMenu: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  notesList: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  noteCardWrapper: {
    position: 'relative',
  },
  noteCardList: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    paddingRight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pdfIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  pdfLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.text.inverse,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  noteContentList: {
    flex: 1,
  },
  noteNameList: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  noteMetaList: {
    fontSize: Typography.footnote.fontSize,
    color: theme.colors.text.secondary,
  },
  tagBadgesContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  tagMore: {
    fontSize: 10,
    fontWeight: '600',
  },
  tagFiltersContainer: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.card.border,
  },
  tagFiltersContent: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  tagFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.card.border,
    backgroundColor: theme.colors.card.background,
    gap: Spacing.xs,
  },
  tagFilterChipActive: {
    backgroundColor: theme.colors.accentGradient[0],
    borderColor: theme.colors.accentGradient[0],
  },
  tagFilterText: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  tagFilterTextActive: {
    color: theme.colors.text.inverse,
  },
  noteMenuButton: {
    position: 'absolute',
    right: Spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: Spacing.sm,
    zIndex: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['4xl'],
  },
  emptyIllustration: {
    width: 140,
    height: 140,
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
    fontSize: Typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
  },
  emptyButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
  premiumBanner: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: theme.colors.status.info + '15',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.status.info + '30',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  premiumText: {
    fontSize: Typography.footnote.fontSize,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.base,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    backgroundColor: theme.colors.backgroundSecondary,
  },
  actionSheet: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  actionSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.text.tertiary,
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  actionSheetTitle: {
    fontSize: Typography.title3.fontSize,
    fontWeight: Typography.title3.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
    lineHeight: Typography.title3.fontSize * 1.2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Typography.callout.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 1,
    lineHeight: Typography.callout.fontSize * 1.2,
  },
  actionSubtitle: {
    fontSize: Typography.caption.fontSize,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: Typography.caption.fontSize * 1.3,
  },
  cancelButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: Typography.callout.fontSize,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // Selection Mode Styles
  selectionHeader: {
    backgroundColor: theme.colors.card.background,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.card.border + '40',
  },
  selectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  selectionCount: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectAllButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  selectAllText: {
    fontSize: Typography.footnote.fontSize,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mergeButtonContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  mergeButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mergeButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  mergeButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  checkboxContainer: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    zIndex: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  colorModalContent: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.base,
    maxHeight: '80%',
  },
  colorModalTitle: {
    fontSize: Typography.title3.fontSize,
    fontWeight: Typography.title3.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: COLOR_GAP,
    marginBottom: Spacing.base,
  },
  colorItem: {
    width: COLOR_SIZE,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  colorCircle: {
    width: COLOR_SIZE - 8,
    height: COLOR_SIZE - 8,
    borderRadius: (COLOR_SIZE - 8) / 2,
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
    textAlign: 'center',
  },
});

export const CourseDetailScreen = ({ navigation, route }: any) => {
  const { courseId } = route.params;
  const { theme } = useTheme();
  const Colors = theme.colors;
  const styles = createStyles(theme);

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load course data
  useEffect(() => {
    loadCourse();
    loadCustomTags();
    loadPremiumStatus();
  }, [courseId]);

  const loadCustomTags = async () => {
    const tags = await StorageService.getCustomTags();
    setCustomTags(tags);
  };

  const loadPremiumStatus = async () => {
    const status = await StorageService.getPremiumStatus();
    setIsPremium(status);
  };

  const loadCourse = async () => {
    try {
      const loadedCourse = await StorageService.getCourseById(courseId);
      if (loadedCourse) {
        let notes = await StorageService.getNotesByCourse(courseId);
        
        // Migrate old notes with uri to originalImagePath
        let needsMigration = false;
        const migratedNotes = await Promise.all(notes.map(async (note) => {
          const migratedPages = await Promise.all(note.pages.map(async (page) => {
            // @ts-ignore - handling legacy uri field
            if (page.uri && !page.originalImagePath) {
              needsMigration = true;
              return {
                ...page,
                // @ts-ignore
                originalImagePath: page.uri,
                // @ts-ignore
                processedImagePath: page.uri,
                noteId: note.id,
                rotation: page.rotation || 0,
                isProcessed: page.isProcessed || false,
                createdAt: page.createdAt || new Date(),
              };
            }
            
            // Migrate images from cache to permanent storage
            if (page.originalImagePath) {
              const imagePath = page.originalImagePath;
              
              // Check if it's in cache (ImagePicker cache)
              if (imagePath.includes('ImagePicker') || imagePath.includes('Caches')) {
                try {
                  // Check if file exists in cache
                  const fileInfo = await FileSystem.getInfoAsync(imagePath);
                  
                  if (fileInfo.exists) {
                    // Create images directory if needed
                    const imagesDir = `${FileSystem.documentDirectory}images`;
                    const dirInfo = await FileSystem.getInfoAsync(imagesDir);
                    if (!dirInfo.exists) {
                      await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
                    }
                    
                    // Copy to permanent location
                    const fileName = `note_${note.id}_page_${page.id}.jpg`;
                    const permanentUri = `${imagesDir}/${fileName}`;
                    
                    await FileSystem.copyAsync({
                      from: imagePath,
                      to: permanentUri,
                    });
                    
                    console.log('✅ Migrated image to permanent storage:', permanentUri);
                    needsMigration = true;
                    
                    return {
                      ...page,
                      originalImagePath: permanentUri,
                      processedImagePath: permanentUri,
                    };
                  } else {
                    console.log('⚠️ Image not found in cache, keeping original path:', imagePath);
                  }
                } catch (migrationError) {
                  console.log('⚠️ Could not migrate image:', migrationError);
                }
              }
            }
            
            return page;
          }));
          
          return {
            ...note,
            pages: migratedPages,
          };
        }));

        // Save migrated notes if changes were made
        if (needsMigration) {
          console.log('🔄 Migrating notes to permanent storage...');
          for (const note of migratedNotes) {
            await StorageService.updateNote(note.id, note);
          }
          notes = migratedNotes;
        }

        // Filter out archived notes
        const activeNotes = notes.filter(note => !note.isArchived);
        setCourse({ ...loadedCourse, notes: activeNotes });
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo notes for initial display (will be removed once real data exists)
  const demoNotes: Note[] = [
      {
        id: '1',
        name: 'Limit Konusu',
        courseId: courseId,
        pages: [
          { id: '1', uri: '', order: 0, thumbnail: '' },
          { id: '2', uri: '', order: 1, thumbnail: '' },
          { id: '3', uri: '', order: 2, thumbnail: '' },
          { id: '4', uri: '', order: 3, thumbnail: '' },
          { id: '5', uri: '', order: 4, thumbnail: '' },
          { id: '6', uri: '', order: 5, thumbnail: '' },
          { id: '7', uri: '', order: 6, thumbnail: '' },
          { id: '8', uri: '', order: 7, thumbnail: '' },
          { id: '9', uri: '', order: 8, thumbnail: '' },
          { id: '10', uri: '', order: 9, thumbnail: '' },
          { id: '11', uri: '', order: 10, thumbnail: '' },
          { id: '12', uri: '', order: 11, thumbnail: '' },
        ],
        tags: [],
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
      },
      {
        id: '2',
        name: 'Türev Notları',
        courseId: courseId,
        pages: [
          { id: '1', uri: '', order: 0, thumbnail: '' },
          { id: '2', uri: '', order: 1, thumbnail: '' },
          { id: '3', uri: '', order: 2, thumbnail: '' },
          { id: '4', uri: '', order: 3, thumbnail: '' },
          { id: '5', uri: '', order: 4, thumbnail: '' },
          { id: '6', uri: '', order: 5, thumbnail: '' },
          { id: '7', uri: '', order: 6, thumbnail: '' },
          { id: '8', uri: '', order: 7, thumbnail: '' },
        ],
        tags: [],
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date(Date.now() - 259200000),
      },
      {
        id: '3',
        name: 'Vize Çalışma PDF',
        courseId: courseId,
        pages: Array.from({ length: 24 }, (_, i) => ({
          id: `${i + 1}`,
          uri: '',
          order: i,
          thumbnail: '',
        })),
        tags: [],
        createdAt: new Date(Date.now() - 777600000),
        updatedAt: new Date(Date.now() - 777600000),
      },
      {
        id: '4',
        name: 'İntegral Örnekleri',
        courseId: courseId,
        pages: Array.from({ length: 6 }, (_, i) => ({
          id: `${i + 1}`,
          uri: '',
          order: i,
          thumbnail: '',
        })),
        tags: [],
        createdAt: new Date(Date.now() - 1209600000),
        updatedAt: new Date(Date.now() - 1209600000),
      },
    ];

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showNoteMenu, setShowNoteMenu] = useState(false);
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [customTags, setCustomTags] = useState<any[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  // Multi-select & Merge states
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [isMergingNotes, setIsMergingNotes] = useState(false);
  const [showBulkActionsMenu, setShowBulkActionsMenu] = useState(false);

  // Show loading or return null if no course
  if (isLoading || !course) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={{ color: Colors.text.primary, textAlign: 'center', marginTop: 100 }}>
            {isLoading ? 'Yükleniyor...' : 'Ders bulunamadı'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Filter notes by tag
  const filteredNotes = selectedTagFilter 
    ? course.notes.filter(note => note.tags?.includes(selectedTagFilter))
    : course.notes;

  const totalPages = filteredNotes.reduce((sum, note) => sum + (note.pages?.length || 0), 0);
  
  // Calculate approximate size with variation (200KB - 800KB per image)
  const totalSize = filteredNotes.reduce((sum, note) => {
    // Each note has different sized pages (random between 0.2-0.8 MB per page)
    const noteSize = note.pages.reduce((pageSum, page, index) => {
      // Use page order/index to create consistent but varied sizes
      const variance = ((index * 37) % 60) / 100; // 0.00 - 0.59
      const pageSize = 0.2 + variance; // 0.2 - 0.79 MB
      return pageSum + pageSize;
    }, 0);
    return sum + noteSize;
  }, 0);

  // Combine predefined and custom tags
  const allTags = [...PredefinedTags, ...customTags];

  const formatDate = (date: Date | string) => {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diff = now.getTime() - dateObj.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Az önce';
    if (hours < 24) return 'Bugün';
    if (hours < 48) return 'Dün';
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} gün önce`;
    return dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  const getFileType = (note: Note): 'image' | 'pdf' => {
    // Merged notes are always exported as PDF
    if (note.tags?.includes('merged')) {
      return 'pdf';
    }
    
    // Check if the first page is a PDF or image
    if (note.pages && note.pages.length > 0) {
      const firstPage = note.pages[0];
      const imagePath = firstPage.originalImagePath || firstPage.processedImagePath;
      if (imagePath) {
        const uri = imagePath.toLowerCase();
        // Check for PDF first
        if (uri.includes('.pdf')) {
          return 'pdf';
        }
        // Otherwise it's an image
        if (uri.includes('.jpg') || uri.includes('.jpeg') || uri.includes('.png') || 
            uri.includes('.gif') || uri.includes('.webp') || uri.includes('file://')) {
          return 'image';
        }
      }
    }
    // Default to image (most notes are images from camera/gallery)
    return 'image';
  };

  const handleCreateNote = async (method: 'camera' | 'gallery' | 'file') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowActionSheet(false);
    
    // Check note limit
    try {
      const { allowed, isPremium, currentCount } = await StorageService.canAddNote(courseId);
      
      if (!allowed) {
        Alert.alert(
          'Not Limiti Doldu',
          `Ücretsiz planda her derste maksimum ${StorageService.LIMITS.FREE_NOTE_PER_COURSE_LIMIT} not oluşturabilirsiniz. Sınırsız not için Premium'a geçin!`,
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
    } catch (error) {
      console.error('Error checking note limit:', error);
    }
    
    try {
      if (method === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('İzin Gerekli', 'Kamera kullanabilmek için izin vermeniz gerekiyor.');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 1,
          allowsEditing: false,
        });

        if (!result.canceled && result.assets[0]) {
          await createNoteFromImage(result.assets[0].uri);
        }
      } else if (method === 'gallery') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('İzin Gerekli', 'Galeri erişimi için izin vermeniz gerekiyor.');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 1,
          allowsMultipleSelection: true,
          selectionLimit: 10,
        });

        if (!result.canceled && result.assets.length > 0) {
          // If multiple images selected, create single note with multiple pages
          if (result.assets.length > 1) {
            await createNoteFromMultipleImages(result.assets);
          } else {
            // Single image = single note
            await createNoteFromImage(result.assets[0].uri);
          }
        }
      } else if (method === 'file') {
        // Pick PDF file
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/pdf',
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const file = result.assets[0];
          await createNoteFromPDF(file.uri, file.name);
        }
      }
    } catch (error) {
      console.error('Error creating note:', error);
      Alert.alert('Hata', 'Not oluşturulurken bir hata oluştu.');
    }
  };

  const createNoteFromMultipleImages = async (assets: any[]) => {
    try {
      const noteId = Date.now().toString();
      
      // Create images directory if it doesn't exist
      const imagesDir = `${FileSystem.documentDirectory}images`;
      const dirInfo = await FileSystem.getInfoAsync(imagesDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
      }
      
      // Copy all images to permanent storage
      const pages = await Promise.all(
        assets.map(async (asset, index) => {
          const fileName = `note_${noteId}_page_${index + 1}.jpg`;
          const permanentUri = `${imagesDir}/${fileName}`;
          
          await FileSystem.copyAsync({
            from: asset.uri,
            to: permanentUri,
          });
          
          console.log(`✅ Image ${index + 1}/${assets.length} copied to permanent location:`, permanentUri);
          
          return {
            id: (index + 1).toString(),
            noteId: noteId,
            originalImagePath: permanentUri,
            processedImagePath: permanentUri,
            order: index,
            rotation: 0,
            isProcessed: false,
            createdAt: new Date(),
          };
        })
      );
      
      const newNote: Note = {
        id: noteId,
        name: `Not ${new Date().toLocaleDateString('tr-TR')}`,
        courseId: courseId,
        pages: pages,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await StorageService.addNote(newNote);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      console.log(`✅ Created note with ${assets.length} pages`);
      loadCourse();
    } catch (error) {
      console.error('Error saving multi-page note:', error);
      throw error;
    }
  };

  const createNoteFromImage = async (imageUri: string) => {
    try {
      const noteId = Date.now().toString();
      
      // Create images directory if it doesn't exist
      const imagesDir = `${FileSystem.documentDirectory}images`;
      const dirInfo = await FileSystem.getInfoAsync(imagesDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
      }
      
      // Copy image to permanent storage (DocumentDirectory/images)
      const fileName = `note_${noteId}_page_1.jpg`;
      const permanentUri = `${imagesDir}/${fileName}`;
      
      await FileSystem.copyAsync({
        from: imageUri,
        to: permanentUri,
      });
      
      console.log('✅ Image copied to permanent location:', permanentUri);
      
      const newNote: Note = {
        id: noteId,
        name: `Not ${new Date().toLocaleDateString('tr-TR')}`,
        courseId: courseId,
        pages: [
          {
            id: '1',
            noteId: noteId,
            originalImagePath: permanentUri,
            processedImagePath: permanentUri,
            order: 0,
            rotation: 0,
            isProcessed: false,
            createdAt: new Date(),
          },
        ],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await StorageService.addNote(newNote);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      loadCourse(); // Reload to show new note
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  };

  const createNoteFromPDF = async (pdfUri: string, fileName: string) => {
    try {
      const noteId = Date.now().toString();
      const noteName = fileName.replace('.pdf', '') || `PDF ${new Date().toLocaleDateString('tr-TR')}`;
      
      console.log('📄 Creating note from PDF:', fileName);
      console.log('PDF URI (temp):', pdfUri);
      
      // Copy PDF to permanent location (DocumentPicker cache gets cleared)
      const permanentPath = `${FileSystem.documentDirectory}pdfs/note_${noteId}.pdf`;
      
      // Create pdfs directory if it doesn't exist
      const pdfsDir = `${FileSystem.documentDirectory}pdfs`;
      const dirInfo = await FileSystem.getInfoAsync(pdfsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(pdfsDir, { intermediates: true });
      }
      
      // Copy PDF to permanent location
      await FileSystem.copyAsync({
        from: pdfUri,
        to: permanentPath,
      });
      
      console.log('✅ PDF copied to permanent location:', permanentPath);
      
      const newNote: Note = {
        id: noteId,
        name: noteName,
        courseId: courseId,
        pages: [
          {
            id: '1',
            noteId: noteId,
            originalImagePath: permanentPath,
            processedImagePath: permanentPath,
            order: 0,
            rotation: 0,
            isProcessed: false,
            createdAt: new Date(),
          },
        ],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await StorageService.addNote(newNote);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        'PDF Eklendi!',
        `"${noteName}" başarıyla eklendi. PDF'in tüm sayfalarını görüntüleyebilirsin.`,
        [{ text: 'Tamam' }]
      );
      
      loadCourse();
    } catch (error) {
      console.error('Error saving PDF note:', error);
      throw error;
    }
  };

  const toggleViewMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleShareNote = async (note: Note) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setShowNoteMenu(false);
      
      // Export note as PDF and share
      await handleExportPDF(note);
    } catch (error) {
      console.error('Error sharing note:', error);
      Alert.alert('Hata', 'Not paylaşılırken bir hata oluştu.');
    }
  };

  const handleExportPDF = async (note: Note) => {
    if (!course) return;
    
    try {
      setIsGeneratingPDF(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Check if this is a PDF note (not images)
      const isPDFNote = note.pages.length === 1 && 
                        note.pages[0].originalImagePath?.endsWith('.pdf');

      if (isPDFNote) {
        // If it's already a PDF, add watermark and share
        console.log('📄 Processing PDF with watermark');
        const watermarkedPdfUri = await addWatermarkToPDF(
          note.pages[0].originalImagePath,
          course.name,
          note.name,
          isPremium
        );
        await sharePDF(watermarkedPdfUri, note.name);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowNoteMenu(false);
        return;
      }

      // For image notes, generate PDF
      console.log('🖼️ Generating PDF from images');

      // Load watermark icon as base64 (only if not premium)
      let watermarkBase64: string | undefined;
      if (!isPremium) {
        try {
          const watermarkPath = require('../../assets/pdf-watermark.png');
          const watermarkUri = Image.resolveAssetSource(watermarkPath).uri;
          const base64 = await fetch(watermarkUri)
            .then(res => res.blob())
            .then(blob => new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            }));
          watermarkBase64 = base64;
        } catch (error) {
          console.log('Could not load watermark icon:', error);
        }
      }

      // Generate PDF from images
      const pdfUri = await generatePDFFromNote(note, course.name, isPremium, watermarkBase64);
      
      // Share PDF
      await sharePDF(pdfUri, note.name);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowNoteMenu(false);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'PDF Oluşturulamadı',
        'PDF dosyası oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleChangeColor = async (color: CourseColorType) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Update course color
      await StorageService.updateCourse(course.id, {
        color: color.gradient[0],
        colorEnd: color.gradient[1],
      });
      
      setShowColorModal(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      loadCourse();
    } catch (error) {
      console.error('Error changing color:', error);
      Alert.alert('Hata', 'Renk değiştirilirken bir hata oluştu.');
    }
  };

  const handleShareCourse = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const noteCount = course.notes.length;
      const totalPages = course.notes.reduce((sum, note) => sum + (note.pages?.length || 0), 0);

      if (noteCount === 0) {
        Alert.alert('Uyarı', 'Bu derste henüz not yok. Paylaşmak için en az 1 not ekleyin.');
        return;
      }

      // Show options: Export as JSON or Export as PDF
      Alert.alert(
        'Dersi Nasıl Paylaşmak İstersiniz?',
        `${course.name} - ${noteCount} not, ${totalPages} sayfa`,
        [
          {
            text: 'PDF Olarak',
            onPress: async () => {
              try {
                setIsGeneratingPDF(true);
                
                // Merge all notes into one PDF
                const allPages: any[] = [];
                course.notes.forEach(note => {
                  note.pages.forEach(page => {
                    allPages.push(page);
                  });
                });

                if (allPages.length === 0) {
                  Alert.alert('Uyarı', 'Paylaşılacak sayfa bulunamadı.');
                  setIsGeneratingPDF(false);
                  return;
                }

                // Generate PDF from all pages
                const pdfUri = await generatePDFFromNote(
                  { ...course.notes[0], pages: allPages, name: course.name },
                  course.name
                );

                // Add watermark if not premium
                const finalPdfUri = isPremium 
                  ? pdfUri 
                  : await addWatermarkToPDF(pdfUri);

                // Share the PDF
                await sharePDF(finalPdfUri, course.name);
                
                setIsGeneratingPDF(false);
              } catch (error) {
                console.error('Error exporting course as PDF:', error);
                Alert.alert('Hata', 'PDF oluşturulurken bir hata oluştu.');
                setIsGeneratingPDF(false);
              }
            },
          },
          {
            text: 'JSON Dosyası Olarak',
            onPress: async () => {
              try {
                // Create export data with full course info
                const exportData = {
                  version: '1.0',
                  exportDate: new Date().toISOString(),
                  course: {
                    name: course.name,
                    color: course.color,
                    colorEnd: course.colorEnd,
                    icon: course.icon,
                    createdAt: course.createdAt,
                  },
                  notes: course.notes.map(note => ({
                    id: note.id,
                    name: note.name,
                    tags: note.tags,
                    pages: note.pages,
                    createdAt: note.createdAt,
                    updatedAt: note.updatedAt,
                  })),
                  stats: {
                    noteCount,
                    totalPages,
                  },
                };

                // Save to temporary file
                const fileName = `${course.name.replace(/[^a-z0-9]/gi, '_')}_NoteMerge.json`;
                const fileUri = `${FileSystem.documentDirectory}${fileName}`;
                
                await FileSystem.writeAsStringAsync(
                  fileUri,
                  JSON.stringify(exportData, null, 2)
                );

                // Share the file
                const isAvailable = await Sharing.isAvailableAsync();
                
                if (isAvailable) {
                  await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/json',
                    dialogTitle: `${course.name} - NoteMerge Export`,
                    UTI: 'public.json',
                  });
                }

                // Clean up temp file
                setTimeout(async () => {
                  try {
                    const fileInfo = await FileSystem.getInfoAsync(fileUri);
                    if (fileInfo.exists) {
                      await FileSystem.deleteAsync(fileUri, { idempotent: true });
                    }
                  } catch (err) {
                    console.log('Temp file cleanup:', err);
                  }
                }, 10000);
              } catch (error) {
                console.error('Error exporting course as JSON:', error);
                Alert.alert('Hata', 'JSON dosyası oluşturulurken bir hata oluştu.');
              }
            },
          },
          {
            text: 'İptal',
            style: 'cancel',
          },
        ]
      );

    } catch (error) {
      console.error('Error sharing course:', error);
      Alert.alert('Hata', 'Ders paylaşılırken bir hata oluştu.');
    }
  };

  // ============================================================
  // MULTI-SELECT & MERGE FUNCTIONS
  // ============================================================
  
  const toggleSelectionMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSelectionMode(!isSelectionMode);
    setSelectedNoteIds([]);
  };

  const toggleNoteSelection = (noteId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedNoteIds(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const selectAllNotes = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const allNoteIds = filteredNotes.map(note => note.id);
    setSelectedNoteIds(allNoteIds);
  };

  const deselectAllNotes = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedNoteIds([]);
  };

  const handleBulkArchive = async () => {
    if (selectedNoteIds.length === 0) return;

    Alert.alert(
      'Notları Arşivle',
      `${selectedNoteIds.length} not arşivlenecek. Emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Arşivle',
          style: 'destructive',
          onPress: async () => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              
              console.log('🗄️ Bulk archiving', selectedNoteIds.length, 'notes');
              for (const noteId of selectedNoteIds) {
                await StorageService.updateNote(noteId, { isArchived: true });
              }
              console.log('✅ Bulk archive successful');
              
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setIsSelectionMode(false);
              setSelectedNoteIds([]);
              setShowBulkActionsMenu(false);
              loadCourse();
            } catch (error) {
              console.error('❌ Error archiving notes:', error);
              Alert.alert('Hata', 'Notlar arşivlenirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedNoteIds.length === 0) return;

    Alert.alert(
      'Notları Sil',
      `${selectedNoteIds.length} not kalıcı olarak silinecek. Bu işlem geri alınamaz!`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              
              for (const noteId of selectedNoteIds) {
                await StorageService.deleteNote(noteId);
              }
              
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setIsSelectionMode(false);
              setSelectedNoteIds([]);
              setShowBulkActionsMenu(false);
              loadCourse();
            } catch (error) {
              console.error('Error deleting notes:', error);
              Alert.alert('Hata', 'Notlar silinirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const handleBulkAddTag = (tagId: string) => {
    Alert.alert(
      'Etiket Ekle',
      `${selectedNoteIds.length} nota "${PredefinedTags.find(t => t.id === tagId)?.name}" etiketi eklenecek.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Ekle',
          onPress: async () => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              
              for (const noteId of selectedNoteIds) {
                const note = course.notes.find(n => n.id === noteId);
                if (note) {
                  const currentTags = note.tags || [];
                  if (!currentTags.includes(tagId)) {
                    await StorageService.updateNote(noteId, { 
                      tags: [...currentTags, tagId] 
                    });
                  }
                }
              }
              
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setShowBulkActionsMenu(false);
              loadCourse();
            } catch (error) {
              console.error('Error adding tags:', error);
              Alert.alert('Hata', 'Etiketler eklenirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const handleMergeNotes = async () => {
    if (selectedNoteIds.length < 2) {
      Alert.alert('Uyarı', 'En az 2 not seçmelisiniz.');
      return;
    }

    try {
      setIsMergingNotes(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Get selected notes in order
      const selectedNotes = filteredNotes.filter(note => 
        selectedNoteIds.includes(note.id)
      );

      console.log('🔀 Merging', selectedNotes.length, 'notes');

      // Check if all notes are PDFs (for premium users)
      const allPDFs = selectedNotes.every(note => 
        note.pages.length === 1 && 
        note.pages[0].originalImagePath?.endsWith('.pdf')
      );

      let mergedNote: Note;
      const noteId = Date.now().toString();
      
      // Create meaningful merged note name
      const firstNoteName = selectedNotes[0].name;
      const additionalCount = selectedNotes.length - 1;
      
      // Shorten note name if too long (max 25 chars)
      const shortFirstName = firstNoteName.length > 25 
        ? firstNoteName.substring(0, 25) + '...'
        : firstNoteName;
      
      const mergedNoteName = additionalCount > 0 
        ? `${shortFirstName} + ${additionalCount}`
        : shortFirstName;
      
      // Calculate total pages for confirmation message
      const totalPages = selectedNotes.reduce((sum, note) => sum + (note.pages?.length || 0), 0);

      if (isPremium && allPDFs) {
        // Premium: Merge PDFs directly without extracting pages
        console.log('✨ Premium: Merging PDFs directly');
        
        // Import pdf-lib dynamically
        const { PDFDocument } = await import('pdf-lib');
        const mergedPdf = await PDFDocument.create();

        for (const note of selectedNotes) {
          const pdfUri = note.pages[0].originalImagePath;
          const pdfBytes = await FileSystem.readAsStringAsync(pdfUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const pdf = await PDFDocument.load(pdfBytes);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        // Save merged PDF
        const mergedPdfBytes = await mergedPdf.saveAsBase64();
        const mergedPdfPath = `${FileSystem.documentDirectory}merged_${noteId}.pdf`;
        await FileSystem.writeAsStringAsync(mergedPdfPath, mergedPdfBytes, {
          encoding: FileSystem.EncodingType.Base64,
        });

        mergedNote = {
          id: noteId,
          name: mergedNoteName,
          courseId: courseId,
          pages: [{
            id: '1',
            noteId: noteId,
            originalImagePath: mergedPdfPath,
            processedImagePath: mergedPdfPath,
            order: 0,
            rotation: 0,
            isProcessed: false,
            createdAt: new Date(),
          }],
          tags: ['merged'],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        // Free or mixed content: Merge all pages as images
        console.log('📄 Standard: Merging pages as images');
        const allPages = selectedNotes.flatMap(note => note.pages || []);

        mergedNote = {
          id: noteId,
          name: mergedNoteName,
          courseId: courseId,
          pages: allPages.map((page, index) => ({
            ...page,
            id: `${noteId}-${index}`,
            noteId: noteId,
            order: index,
          })),
          tags: ['merged'],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      // Save merged note
      await StorageService.addNote(mergedNote);

      // Ask if user wants to delete original notes
      Alert.alert(
        'Birleştirme Başarılı',
        `${selectedNotes.length} not birleştirildi (${totalPages} sayfa).\n\nOrijinal notları silmek ister misiniz?`,
        [
          {
            text: 'Hayır, Sakla',
            style: 'cancel',
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setIsSelectionMode(false);
              setSelectedNoteIds([]);
              loadCourse();
            }
          },
          {
            text: 'Evet, Sil',
            style: 'destructive',
            onPress: async () => {
              for (const noteId of selectedNoteIds) {
                await StorageService.deleteNote(noteId);
              }
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setIsSelectionMode(false);
              setSelectedNoteIds([]);
              loadCourse();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error merging notes:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Hata', 'Notlar birleştirilirken bir hata oluştu.');
    } finally {
      setIsMergingNotes(false);
    }
  };

  const handleAddTag = async (tagId: string) => {
    if (!selectedNote) return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Initialize tags array if it doesn't exist
      const currentTags = selectedNote.tags || [];
      
      const updatedTags = currentTags.includes(tagId)
        ? currentTags.filter(t => t !== tagId)
        : [...currentTags, tagId];

      await StorageService.updateNote(selectedNote.id, { tags: updatedTags });
      setShowTagModal(false);
      loadCourse();
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  const handleRenameNote = async (newName: string) => {
    if (!selectedNote || !newName.trim()) return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await StorageService.updateNote(selectedNote.id, { name: newName.trim() });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowRenameModal(false);
      loadCourse();
    } catch (error) {
      console.error('Error renaming note:', error);
      Alert.alert('Hata', 'Not adı değiştirilirken bir hata oluştu.');
    }
  };

  // Empty State
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIllustration}>
        <Ionicons name="document-text-outline" size={80} color={Colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>Bu derste henüz not yok</Text>
      <Text style={styles.emptySubtitle}>İlk notunu tarayarak başla</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowActionSheet(true)}
        style={styles.emptyButton}
      >
        <LinearGradient
          colors={[course.color, course.colorEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.emptyButtonGradient}
        >
          <Ionicons name="add-circle" size={24} color={Colors.text.inverse} />
          <Text style={styles.emptyButtonText}>İlk PDF'i Oluştur</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // Note Card (Grid)
  const NoteCardGrid = ({ note }: { note: Note }) => {
    const fileType = getFileType(note);
    const iconName = fileType === 'image' ? 'image' : 'document';
    
    const isSelected = selectedNoteIds.includes(note.id);
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (isSelectionMode) {
            toggleNoteSelection(note.id);
          } else {
            navigation.navigate('PDFPreview', { courseId: course.id, noteId: note.id });
          }
        }}
        onLongPress={() => {
          if (!isSelectionMode) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsSelectionMode(true);
            setSelectedNoteIds([note.id]);
          }
        }}
        style={styles.noteCardGrid}
      >
        <GlassCard style={styles.noteCard}>
          {isSelectionMode && (
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
            </View>
          )}
          <View style={styles.noteThumbnail}>
            {note.pages && note.pages.length > 0 && note.pages[0].processedImagePath ? (
              <Image 
                source={{ uri: note.pages[0].processedImagePath }} 
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name={iconName} size={40} color={Colors.text.tertiary} />
            )}
          </View>
        <View style={styles.noteInfo}>
          <Text style={styles.noteName} numberOfLines={2}>{note.name}</Text>
          <View style={styles.noteMeta}>
            <View style={styles.noteMetaBadge}>
              <Ionicons name="albums" size={10} color={Colors.text.secondary} />
              <Text style={styles.noteMetaText}>{note.pages.length}</Text>
            </View>
            <Text style={styles.noteDate}>{formatDate(note.updatedAt)}</Text>
          </View>
        </View>
        {!isSelectionMode && (
          <TouchableOpacity style={styles.noteMenu}>
            <Ionicons name="ellipsis-vertical" size={16} color={Colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </GlassCard>
    </TouchableOpacity>
    );
  };

  // Note Card (List)
  const NoteCardList = ({ note }: { note: Note }) => {
    const fileType = getFileType(note);
    const iconName = fileType === 'image' ? 'image' : 'document-text';
    const label = fileType === 'image' ? 'IMG' : 'PDF';
    
    // Calculate note size with variation
    const noteSize = note.pages.reduce((sum, page, index) => {
      const variance = ((index * 37) % 60) / 100;
      const pageSize = 0.2 + variance;
      return sum + pageSize;
    }, 0);
    
    const isSelected = selectedNoteIds.includes(note.id);
    
    return (
      <View style={styles.noteCardWrapper}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (isSelectionMode) {
              toggleNoteSelection(note.id);
            } else {
              navigation.navigate('PDFPreview', { courseId: course.id, noteId: note.id });
            }
          }}
          onLongPress={() => {
            if (!isSelectionMode) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setIsSelectionMode(true);
              setSelectedNoteIds([note.id]);
            }
          }}
          style={styles.noteCardList}
        >
          {isSelectionMode && (
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
            </View>
          )}
          <LinearGradient
            colors={[course.color, course.colorEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pdfIconContainer}
          >
            <Ionicons name={iconName} size={20} color={Colors.text.inverse} />
            <Text style={styles.pdfLabel}>{label}</Text>
          </LinearGradient>
          <View style={styles.noteContentList}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.noteNameList}>{note.name}</Text>
              {note.tags && note.tags.length > 0 && (
                <View style={styles.tagBadgesContainer}>
                  {note.tags.slice(0, 2).map((tagId) => {
                    const tag = PredefinedTags.find(t => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <View key={tagId} style={[styles.tagBadge, { backgroundColor: tag.color }]}>
                        <Text style={styles.tagBadgeText}>{tag.name}</Text>
                      </View>
                    );
                  })}
                  {note.tags.length > 2 && (
                    <Text style={[styles.tagMore, { color: Colors.text.tertiary }]}>
                      +{note.tags.length - 2}
                    </Text>
                  )}
                </View>
              )}
            </View>
            <Text style={styles.noteMetaList}>
              {note.pages.length} sayfa • {noteSize.toFixed(1)} MB • {formatDate(note.updatedAt)}
            </Text>
          </View>
        </TouchableOpacity>
        
        {!isSelectionMode && (
          <TouchableOpacity 
            style={styles.noteMenuButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedNote(note);
              setShowNoteMenu(true);
            }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Stats Card
  const StatsCard = () => (
    <GlassCard style={styles.statsCard}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {isPremium ? course.notes.length : `${course.notes.length}/${StorageService.LIMITS.FREE_NOTE_PER_COURSE_LIMIT}`}
          </Text>
          <Text style={styles.statLabel}>Not</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalPages}</Text>
          <Text style={styles.statLabel}>Sayfa</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {totalSize < 1 ? `${(totalSize * 1024).toFixed(0)} KB` : `${totalSize.toFixed(1)} MB`}
          </Text>
          <Text style={styles.statLabel}>Boyut</Text>
        </View>
      </View>
      {course.notes.length > 0 && (
        <View style={styles.statsActivity}>
          <Ionicons name="trending-up" size={14} color={Colors.status.success} />
          <Text style={styles.statsActivityText}>Bu hafta 3 PDF oluşturdun</Text>
        </View>
      )}
    </GlassCard>
  );

  // Course Menu Modal
  const CourseMenuModal = () => (
    <Modal
      visible={showCourseMenu}
      transparent
      animationType="fade"
      onRequestClose={() => setShowCourseMenu(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setShowCourseMenu(false)}
        style={styles.modalOverlay}
      >
        <View style={styles.actionSheetContainer}>
          <View style={styles.actionSheet}>
            <View style={styles.actionSheetHandle} />
            
            <Text style={styles.actionSheetTitle}>Ders Yönetimi</Text>
            
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowCourseMenu(false);
                // TODO: Navigate to edit course
                navigation.navigate('CreateCourse', { courseId: course.id });
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.status.info + '20' }]}>
                <Ionicons name="create-outline" size={24} color={Colors.status.info} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Dersi Düzenle</Text>
                <Text style={styles.actionSubtitle}>İsim ve renk değiştir</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowCourseMenu(false);
                setShowColorModal(true);
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FF6B9D20' }]}>
                <Ionicons name="color-palette-outline" size={24} color="#FF6B9D" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Renk Değiştir</Text>
                <Text style={styles.actionSubtitle}>Ders rengini özelleştir</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowCourseMenu(false);
                handleShareCourse();
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#4ECDC420' }]}>
                <Ionicons name="share-outline" size={24} color="#4ECDC4" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Bu Dersi Paylaş</Text>
                <Text style={styles.actionSubtitle}>Ders bilgilerini paylaş</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowCourseMenu(false);
                // TODO: Bulk select PDFs
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#95E1D320' }]}>
                <Ionicons name="checkmark-done-outline" size={24} color="#95E1D3" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>PDF'leri Toplu Seç</Text>
                <Text style={styles.actionSubtitle}>Birden fazla PDF seç</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowCourseMenu(false);
                Alert.alert('🚀 Yakında', 'Çalışma hatırlatıcıları v1.1.0\'da aktif olacak!');
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.accentGradient[0] + '20' }]}>
                <Ionicons name="alarm-outline" size={24} color={theme.colors.accentGradient[0]} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Çalışma Hatırlatıcısı</Text>
                <Text style={styles.actionSubtitle}>v1.1.0'da aktif olacak</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowCourseMenu(false);
                Alert.alert(
                  'Dersi Arşivle',
                  `"${course.name}" dersini arşivlemek istediğinize emin misiniz? Arşivden istediğiniz zaman geri getirebilirsiniz.`,
                  [
                    { text: 'İptal', style: 'cancel' },
                    {
                      text: 'Arşivle',
                      onPress: async () => {
                        try {
                          console.log('🗄️ Archiving course:', courseId, course.name);
                          await StorageService.updateCourse(courseId, { isArchived: true });
                          console.log('✅ Course archived successfully');
                          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          navigation.goBack();
                        } catch (error) {
                          console.error('❌ Error archiving course:', error);
                          Alert.alert('Hata', 'Ders arşivlenirken bir hata oluştu.');
                        }
                      },
                    },
                  ]
                );
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.status.warning + '20' }]}>
                <Ionicons name="archive-outline" size={24} color={Colors.status.warning} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Dersi Arşivle</Text>
                <Text style={styles.actionSubtitle}>Arşive taşı</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowCourseMenu(false);
                Alert.alert(
                  'Dersi Sil',
                  `"${course.name}" dersini ve tüm notlarını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
                  [
                    { text: 'İptal', style: 'cancel' },
                    {
                      text: 'Sil',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await StorageService.deleteCourse(courseId);
                          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          navigation.goBack();
                        } catch (error) {
                          console.error('Error deleting course:', error);
                          Alert.alert('Hata', 'Ders silinirken bir hata oluştu.');
                        }
                      },
                    },
                  ]
                );
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.status.error + '20' }]}>
                <Ionicons name="trash-outline" size={24} color={Colors.status.error} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Dersi Sil</Text>
                <Text style={styles.actionSubtitle}>Tüm notlarla birlikte sil</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowCourseMenu(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Note Menu Modal
  const NoteMenuModal = () => (
    <Modal
      visible={showNoteMenu}
      transparent
      animationType="fade"
      onRequestClose={() => setShowNoteMenu(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setShowNoteMenu(false)}
        style={styles.modalOverlay}
      >
        <View style={styles.actionSheetContainer}>
          <View style={styles.actionSheet}>
            <View style={styles.actionSheetHandle} />
            
            <Text style={styles.actionSheetTitle}>{selectedNote?.name}</Text>
            
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowNoteMenu(false);
                setShowRenameModal(true);
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#60A5FA20' }]}>
                <Ionicons name="create-outline" size={24} color="#60A5FA" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Yeniden Adlandır</Text>
                <Text style={styles.actionSubtitle}>Not adını değiştir</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowNoteMenu(false);
                if (selectedNote) {
                  handleShareNote(selectedNote);
                }
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.status.info + '20' }]}>
                <Ionicons name="share-outline" size={24} color={Colors.status.info} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Paylaş</Text>
                <Text style={styles.actionSubtitle}>Notu başkalarıyla paylaş</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (selectedNote) {
                  handleExportPDF(selectedNote);
                }
              }}
              style={styles.actionItem}
              disabled={isGeneratingPDF}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F59E0B20' }]}>
                {isGeneratingPDF ? (
                  <ActivityIndicator size="small" color="#F59E0B" />
                ) : (
                  <Ionicons name="document-text-outline" size={24} color="#F59E0B" />
                )}
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>
                  {isGeneratingPDF ? 'PDF Oluşturuluyor...' : 'PDF Olarak Paylaş'}
                </Text>
                <Text style={styles.actionSubtitle}>
                  {isGeneratingPDF ? 'Lütfen bekleyin' : 'Tüm sayfaları PDF dosyası olarak paylaş'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowNoteMenu(false);
                setShowTagModal(true);
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#A78BFA20' }]}>
                <Ionicons name="pricetag-outline" size={24} color="#A78BFA" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Etiket Ekle</Text>
                <Text style={styles.actionSubtitle}>Vize, Final, Quiz vb.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowNoteMenu(false);
                if (selectedNote) {
                  setIsSelectionMode(true);
                  setSelectedNoteIds([selectedNote.id]);
                }
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#10B981' + '20' }]}>
                <Ionicons name="git-merge-outline" size={24} color="#10B981" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Diğer Notlarla Birleştir</Text>
                <Text style={styles.actionSubtitle}>Notları tek PDF'te topla</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowNoteMenu(false);
                
                if (selectedNote) {
                  Alert.alert(
                    'Notu Arşivle',
                    `"${selectedNote.name}" notunu arşivlemek istediğinize emin misiniz?`,
                    [
                      { text: 'İptal', style: 'cancel' },
                      {
                        text: 'Arşivle',
                        onPress: async () => {
                          try {
                            console.log('🗄️ Archiving note:', selectedNote.id, selectedNote.name);
                            await StorageService.updateNote(selectedNote.id, { isArchived: true });
                            console.log('✅ Note archived successfully');
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            setShowNoteMenu(false);
                            loadCourse();
                          } catch (error) {
                            console.error('❌ Error archiving note:', error);
                            Alert.alert('Hata', 'Not arşivlenirken bir hata oluştu.');
                          }
                        },
                      },
                    ]
                  );
                }
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.status.warning + '20' }]}>
                <Ionicons name="archive-outline" size={24} color={Colors.status.warning} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Arşivle</Text>
                <Text style={styles.actionSubtitle}>Notu arşive taşı</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowNoteMenu(false);
                if (selectedNote) {
                  Alert.alert(
                    'Notu Sil',
                    `"${selectedNote.name}" notunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
                    [
                      { text: 'İptal', style: 'cancel' },
                      {
                        text: 'Sil',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await StorageService.deleteNote(selectedNote.id);
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            loadCourse(); // Reload course to update notes list
                          } catch (error) {
                            console.error('Error deleting note:', error);
                            Alert.alert('Hata', 'Not silinirken bir hata oluştu.');
                          }
                        },
                      },
                    ]
                  );
                }
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.status.error + '20' }]}>
                <Ionicons name="trash-outline" size={24} color={Colors.status.error} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Notu Sil</Text>
                <Text style={styles.actionSubtitle}>Kalıcı olarak sil</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowNoteMenu(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Action Sheet (Bottom Sheet)
  const ActionSheet = () => (
    <Modal
      visible={showActionSheet}
      transparent
      animationType="fade"
      onRequestClose={() => setShowActionSheet(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setShowActionSheet(false)}
        style={styles.modalOverlay}
      >
        <View style={styles.actionSheetContainer}>
          <View style={styles.actionSheet}>
            <View style={styles.actionSheetHandle} />
            
            <Text style={styles.actionSheetTitle}>Yeni PDF Oluştur</Text>
            
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleCreateNote('camera')}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: course.color + '20' }]}>
                <Ionicons name="camera" size={24} color={course.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Kameradan Tara</Text>
                <Text style={styles.actionSubtitle}>Anında fotoğraf çek</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleCreateNote('gallery')}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: course.color + '20' }]}>
                <Ionicons name="images" size={24} color={course.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Galeriden Seç</Text>
                <Text style={styles.actionSubtitle}>Mevcut fotoğrafları ekle</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleCreateNote('file')}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: course.color + '20' }]}>
                <Ionicons name="folder-open" size={24} color={course.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Dosyadan İçe Aktar</Text>
                <Text style={styles.actionSubtitle}>PDF veya resim ekle</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowActionSheet(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Tag Selection Modal
  const TagModal = () => (
    <Modal
      visible={showTagModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowTagModal(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setShowTagModal(false)}
        style={styles.modalOverlay}
      >
        <View style={styles.actionSheetContainer}>
          <View style={styles.actionSheet}>
            <View style={styles.actionSheetHandle} />
            
            <Text style={styles.actionSheetTitle}>Etiket Seç</Text>
            
            <ScrollView style={{ maxHeight: 350 }}>
              {PredefinedTags.map((tag) => {
                const isSelected = selectedNote?.tags?.includes(tag.id) || false;
                return (
                  <TouchableOpacity
                    key={tag.id}
                    activeOpacity={0.7}
                    onPress={() => handleAddTag(tag.id)}
                    style={styles.actionItem}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: tag.color + '20' }]}>
                      <Ionicons name={tag.icon as any} size={24} color={tag.color} />
                    </View>
                    <View style={styles.actionText}>
                      <Text style={styles.actionTitle}>{tag.name}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={tag.color} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowTagModal(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Bulk Actions Modal
  const BulkActionsModal = () => (
    <Modal
      visible={showBulkActionsMenu}
      transparent
      animationType="fade"
      onRequestClose={() => setShowBulkActionsMenu(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setShowBulkActionsMenu(false)}
        style={styles.modalOverlay}
      >
        <View style={styles.actionSheetContainer}>
          <View style={styles.actionSheet}>
            <View style={styles.actionSheetHandle} />
            
            <Text style={styles.actionSheetTitle}>
              {selectedNoteIds.length} Not İşlemleri
            </Text>
            
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowBulkActionsMenu(false);
                setTimeout(() => handleBulkArchive(), 300);
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F59E0B20' }]}>
                <Ionicons name="archive-outline" size={24} color="#F59E0B" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Arşivle</Text>
                <Text style={styles.actionSubtitle}>Notları arşive taşı</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowBulkActionsMenu(false);
                setTimeout(() => handleBulkDelete(), 300);
              }}
              style={styles.actionItem}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#EF444420' }]}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Sil</Text>
                <Text style={styles.actionSubtitle}>Notları kalıcı olarak sil</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <View style={{ marginTop: Spacing.md, marginBottom: Spacing.sm }}>
              <Text style={[styles.actionSheetTitle, { fontSize: 14 }]}>Etiket Ekle</Text>
            </View>

            <ScrollView style={{ maxHeight: 200 }}>
              {PredefinedTags.slice(0, 5).map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowBulkActionsMenu(false);
                    setTimeout(() => handleBulkAddTag(tag.id), 300);
                  }}
                  style={styles.actionItem}
                >
                  <View style={[styles.actionIcon, { backgroundColor: tag.color + '20' }]}>
                    <Ionicons name={tag.icon as any} size={24} color={tag.color} />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>{tag.name}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowBulkActionsMenu(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );


  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style={theme.id === 'light' ? 'dark' : 'light'} backgroundColor="transparent" translucent={false} />
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Content - Everything scrolls together */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <LinearGradient
            colors={[course.color, course.colorEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <BlurView intensity={20} tint="dark" style={styles.heroBlur}>
              <View style={styles.heroHeader}>
                <IconButton
                  icon="arrow-back"
                  onPress={() => navigation.goBack()}
                  backgroundColor="rgba(255, 255, 255, 0.2)"
                  color={Colors.text.inverse}
                />
                <View style={styles.heroActions}>
                  {course.notes.length > 0 && (
                    <IconButton
                      icon={isSelectionMode ? "close" : "checkmark-done"}
                      onPress={toggleSelectionMode}
                      backgroundColor={isSelectionMode ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.2)"}
                      color={Colors.text.inverse}
                    />
                  )}
                  <IconButton
                    icon={viewMode === 'list' ? 'grid' : 'list'}
                    onPress={toggleViewMode}
                    backgroundColor="rgba(255, 255, 255, 0.2)"
                    color={Colors.text.inverse}
                  />
                  <IconButton
                    icon="ellipsis-horizontal"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowCourseMenu(true);
                    }}
                    backgroundColor="rgba(255, 255, 255, 0.2)"
                    color={Colors.text.inverse}
                  />
                </View>
              </View>

              <View style={styles.heroContent}>
                <View style={styles.heroIconContainer}>
                  <Ionicons name={course.icon as any} size={28} color={Colors.text.inverse} />
                </View>
                <Text style={styles.heroTitle}>{course.name}</Text>
              </View>
            </BlurView>
          </LinearGradient>

          {/* Stats Card */}
          {course.notes.length > 0 && (
            <View style={styles.statsSection}>
              <StatsCard />
            </View>
          )}

          {/* Tag Filters */}
          {course.notes.length > 0 && (
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
                  const hasNotesWithTag = course.notes.some(note => note.tags?.includes(tag.id));
                  if (!hasNotesWithTag) return null;

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
                      <Text style={[
                        styles.tagFilterText,
                        selectedTagFilter === tag.id && styles.tagFilterTextActive,
                        { color: selectedTagFilter === tag.id ? '#FFF' : tag.color },
                      ]}>
                        {tag.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Selection Mode Header */}
          {isSelectionMode && (
            <>
              <View style={styles.selectionHeader}>
                <View style={styles.selectionHeaderLeft}>
                  <Text style={styles.selectionCount}>
                    {selectedNoteIds.length} not seçildi
                  </Text>
                  {selectedNoteIds.length < filteredNotes.length && (
                    <TouchableOpacity
                      onPress={selectAllNotes}
                      style={styles.selectAllButton}
                    >
                      <Text style={styles.selectAllText}>Tümünü Seç</Text>
                    </TouchableOpacity>
                  )}
                  {selectedNoteIds.length > 0 && (
                    <TouchableOpacity
                      onPress={deselectAllNotes}
                      style={styles.selectAllButton}
                    >
                      <Text style={styles.selectAllText}>Temizle</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {selectedNoteIds.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowBulkActionsMenu(true);
                    }}
                    style={styles.selectAllButton}
                  >
                    <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.accent} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Top Merge Button */}
              {selectedNoteIds.length >= 2 && (
                <View style={styles.mergeButtonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleMergeNotes}
                    disabled={isMergingNotes}
                    style={styles.mergeButton}
                  >
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.mergeButtonGradient}
                    >
                      {isMergingNotes ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Ionicons name="git-merge" size={20} color="#FFFFFF" />
                          <Text style={styles.mergeButtonText}>
                            {selectedNoteIds.length} Notu Birleştir
                          </Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* Notes List */}
          {filteredNotes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="pricetag-outline" size={64} color={Colors.text.tertiary} />
              <Text style={styles.emptyTitle}>
                {selectedTagFilter ? 'Bu etikette not yok' : 'Henüz not eklemediniz'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedTagFilter ? 'Farklı bir etiket seçin' : 'Yeni not eklemek için + butonuna dokunun'}
              </Text>
            </View>
          ) : (
            <View style={styles.notesContainer}>
              {viewMode === 'list' ? (
                <View style={styles.notesList}>
                  {filteredNotes.map((note) => (
                    <NoteCardList key={note.id} note={note} />
                  ))}
                </View>
              ) : (
                <View style={styles.notesGrid}>
                  {filteredNotes.map((note) => (
                    <NoteCardGrid key={note.id} note={note} />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Bottom Merge Button */}
          {isSelectionMode && selectedNoteIds.length >= 2 && (
            <View style={styles.mergeButtonContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleMergeNotes}
                disabled={isMergingNotes}
                style={styles.mergeButton}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.mergeButtonGradient}
                >
                  {isMergingNotes ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="git-merge" size={20} color="#FFFFFF" />
                      <Text style={styles.mergeButtonText}>
                        {selectedNoteIds.length} Notu Birleştir
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Premium Banner / Limit Warning */}
          {!isPremium && course.notes.length >= StorageService.LIMITS.FREE_NOTE_PER_COURSE_LIMIT - 2 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Premium')}
              style={styles.premiumBanner}
            >
              <View style={styles.premiumContent}>
                <Ionicons 
                  name={course.notes.length >= StorageService.LIMITS.FREE_NOTE_PER_COURSE_LIMIT ? "alert-circle" : "star-outline"} 
                  size={16} 
                  color={course.notes.length >= StorageService.LIMITS.FREE_NOTE_PER_COURSE_LIMIT ? Colors.status.warning : Colors.text.secondary} 
                />
                <Text style={styles.premiumText}>
                  {course.notes.length >= StorageService.LIMITS.FREE_NOTE_PER_COURSE_LIMIT 
                    ? `Not limiti doldu! Premium'a geç ve sınırsız not ekle` 
                    : `Watermark'sız PDF için Premium'a geç`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowActionSheet(true)}
          style={styles.fab}
        >
          <LinearGradient
            colors={[course.color, course.colorEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={32} color={Colors.text.inverse} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Course Menu Modal */}
        <CourseMenuModal />

        {/* Note Menu Modal */}
        <NoteMenuModal />

        {/* Tag Modal */}
        <TagModal />

        {/* Bulk Actions Modal */}
        <BulkActionsModal />

        {/* Rename Modal */}
        <RenameNoteModal
          visible={showRenameModal}
          initialName={selectedNote?.name || ''}
          onSave={handleRenameNote}
          onCancel={() => setShowRenameModal(false)}
        />

        {/* Color Change Modal */}
        <Modal
          visible={showColorModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowColorModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowColorModal(false)}
            style={styles.modalOverlay}
          >
            <TouchableWithoutFeedback>
              <View style={styles.colorModalContent}>
                <Text style={styles.colorModalTitle}>Renk Seç</Text>
                
                <View style={styles.colorGrid}>
                  {CourseColors.map((color) => (
                    <TouchableOpacity
                      key={color.id}
                      onPress={() => handleChangeColor(color)}
                      activeOpacity={0.7}
                      style={styles.colorItem}
                    >
                      <LinearGradient
                        colors={color.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.colorCircle,
                          course.color === color.gradient[0] && styles.colorCircleSelected,
                        ]}
                      >
                        {course.color === color.gradient[0] && (
                          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                        )}
                      </LinearGradient>
                      <Text style={styles.colorName}>{color.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>

        {/* Action Sheet */}
        <ActionSheet />
      </LinearGradient>
    </SafeAreaView>
  );
};
