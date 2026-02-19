import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { IconButton } from '../components';
import { useTheme } from '../context/ThemeContext';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { StorageService } from '../services/StorageService';
import { Note } from '../types';
import { generatePDFFromNote, sharePDF } from '../utils/pdfUtils';

const { width } = Dimensions.get('window');

export const PDFPreviewScreen = ({ navigation, route }: any) => {
  const { courseId, noteId } = route.params;
  const { theme } = useTheme();
  const Colors = theme.colors;
  
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [showPageMenu, setShowPageMenu] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [courseName, setCourseName] = useState<string>('');
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadNote();
    loadPremiumStatus();
  }, [noteId]);

  const loadPremiumStatus = async () => {
    const status = await StorageService.getPremiumStatus();
    setIsPremium(status);
  };

  const loadNote = async () => {
    try {
      let loadedNote = await StorageService.getNoteById(noteId);
      
      if (loadedNote) {
        // Migrate old pages with uri to originalImagePath
        let needsMigration = false;
        const migratedPages = loadedNote.pages.map(page => {
          // @ts-ignore - handling legacy uri field
          if (page.uri && !page.originalImagePath) {
            needsMigration = true;
            return {
              ...page,
              // @ts-ignore
              originalImagePath: page.uri,
              // @ts-ignore
              processedImagePath: page.uri,
              noteId: loadedNote.id,
              rotation: page.rotation || 0,
              isProcessed: page.isProcessed || false,
              createdAt: page.createdAt || new Date(),
            };
          }
          return page;
        });

        // Save migrated note if changes were made
        if (needsMigration) {
          loadedNote = {
            ...loadedNote,
            pages: migratedPages,
          };
          await StorageService.updateNote(noteId, loadedNote);
        }

        setNote(loadedNote);
        
        // Load course name for PDF export
        const course = await StorageService.getCourseById(loadedNote.courseId);
        if (course) {
          setCourseName(course.name);
        }
      }
    } catch (error) {
      console.error('Error loading note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!note) return;
    
    try {
      setIsGeneratingPDF(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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

      // Generate PDF
      const pdfUri = await generatePDFFromNote(note, courseName, isPremium, watermarkBase64);
      
      // Share PDF
      await sharePDF(pdfUri, note.name);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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

  const handleAddPage = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Galeri erişimi için izin vermeniz gerekiyor.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets.length > 0 && note) {
        const newPages = result.assets.map((asset, index) => ({
          id: `${Date.now()}_${index}`,
          noteId: noteId,
          originalImagePath: asset.uri,
          processedImagePath: asset.uri,
          order: note.pages.length + index,
          rotation: 0 as const,
          isProcessed: false,
          createdAt: new Date(),
        }));

        const updatedNote = {
          ...note,
          pages: [...note.pages, ...newPages],
          updatedAt: new Date(),
        };

        await StorageService.updateNote(noteId, updatedNote);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        loadNote();
      }
    } catch (error) {
      console.error('Error adding page:', error);
      Alert.alert('Hata', 'Sayfa eklenirken bir hata oluştu.');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!note) return;
    
    Alert.alert(
      'Sayfayı Sil',
      'Bu sayfayı silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedPages = note.pages.filter(p => p.id !== pageId);
              await StorageService.updateNote(noteId, { pages: updatedPages });
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setShowPageMenu(false);
              loadNote();
            } catch (error) {
              console.error('Error deleting page:', error);
              Alert.alert('Hata', 'Sayfa silinirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  const handleMovePage = async (pageId: string, direction: 'up' | 'down') => {
    if (!note) return;
    
    const currentIndex = note.pages.findIndex(p => p.id === pageId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= note.pages.length) return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newPages = [...note.pages];
      [newPages[currentIndex], newPages[newIndex]] = [newPages[newIndex], newPages[currentIndex]];
      
      await StorageService.updateNote(noteId, { pages: newPages });
      loadNote();
    } catch (error) {
      console.error('Error moving page:', error);
      Alert.alert('Hata', 'Sayfa taşınırken bir hata oluştu.');
    }
  };

  const handlePageLongPress = (page: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPage(page);
    setShowPageMenu(true);
  };

  if (isLoading || !note) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.content}>
          <Text style={{ color: Colors.text.primary }}>
            {isLoading ? 'Yükleniyor...' : 'Not bulunamadı'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="arrow-back" onPress={() => navigation.goBack()} />
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: Colors.text.primary }]}>
              {note.name}
            </Text>
            <Text style={[styles.headerSubtitle, { color: Colors.text.tertiary }]}>
              {note.pages.length} sayfa
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleExportPDF}
              style={styles.editButton}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <ActivityIndicator size="small" color={Colors.accentGradient[0]} />
              ) : (
                <Ionicons 
                  name="download-outline" 
                  size={24}
                  color={Colors.accentGradient[0]}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setEditMode(!editMode);
              }}
              style={styles.editButton}
            >
              <Ionicons 
                name={editMode ? "checkmark-circle" : "create-outline"} 
                size={24} 
                color={editMode ? Colors.status.success : Colors.text.secondary} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddPage}
              style={styles.addButton}
            >
              <Ionicons name="add-circle" size={28} color={Colors.accentGradient[0]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* PDF Pages */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {note.pages.map((page, index) => (
            <TouchableOpacity
              key={page.id}
              activeOpacity={editMode ? 0.7 : 1}
              onLongPress={() => handlePageLongPress(page)}
              style={styles.pageContainer}
            >
              <View style={styles.pageHeader}>
                <Text style={[styles.pageNumber, { color: Colors.text.tertiary }]}>
                  Sayfa {index + 1}
                </Text>
                {editMode && (
                  <View style={styles.pageActions}>
                    <TouchableOpacity
                      onPress={() => handleMovePage(page.id, 'up')}
                      disabled={index === 0}
                      style={[styles.pageActionButton, index === 0 && styles.pageActionButtonDisabled]}
                    >
                      <Ionicons 
                        name="arrow-up" 
                        size={20} 
                        color={index === 0 ? Colors.text.disabled : Colors.text.secondary} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleMovePage(page.id, 'down')}
                      disabled={index === note.pages.length - 1}
                      style={[styles.pageActionButton, index === note.pages.length - 1 && styles.pageActionButtonDisabled]}
                    >
                      <Ionicons 
                        name="arrow-down" 
                        size={20} 
                        color={index === note.pages.length - 1 ? Colors.text.disabled : Colors.text.secondary} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeletePage(page.id)}
                      style={styles.pageActionButton}
                    >
                      <Ionicons name="trash-outline" size={20} color={Colors.status.error} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Image
                source={{ uri: page.originalImagePath || page.processedImagePath }}
                style={styles.pageImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Page Menu Modal */}
        <Modal
          visible={showPageMenu}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPageMenu(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowPageMenu(false)}
            style={styles.modalOverlay}
          >
            <View style={[styles.actionSheetContainer, { backgroundColor: Colors.card.background }]}>
              <View style={[styles.actionSheet, { backgroundColor: Colors.card.background }]}>
                <View style={[styles.actionSheetHandle, { backgroundColor: Colors.text.tertiary }]} />
                
                <Text style={[styles.actionSheetTitle, { color: Colors.text.primary }]}>
                  Sayfa İşlemleri
                </Text>
                
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowPageMenu(false);
                    if (selectedPage) {
                      const index = note.pages.findIndex(p => p.id === selectedPage.id);
                      if (index > 0) handleMovePage(selectedPage.id, 'up');
                    }
                  }}
                  style={[styles.actionItem, { borderBottomColor: Colors.card.border }]}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.status.info + '20' }]}>
                    <Ionicons name="arrow-up" size={24} color={Colors.status.info} />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={[styles.actionTitle, { color: Colors.text.primary }]}>Yukarı Taşı</Text>
                    <Text style={[styles.actionSubtitle, { color: Colors.text.secondary }]}>Bir üst sıraya taşı</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowPageMenu(false);
                    if (selectedPage) {
                      const index = note.pages.findIndex(p => p.id === selectedPage.id);
                      if (index < note.pages.length - 1) handleMovePage(selectedPage.id, 'down');
                    }
                  }}
                  style={[styles.actionItem, { borderBottomColor: Colors.card.border }]}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.status.info + '20' }]}>
                    <Ionicons name="arrow-down" size={24} color={Colors.status.info} />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={[styles.actionTitle, { color: Colors.text.primary }]}>Aşağı Taşı</Text>
                    <Text style={[styles.actionSubtitle, { color: Colors.text.secondary }]}>Bir alt sıraya taşı</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowPageMenu(false);
                    if (selectedPage) handleDeletePage(selectedPage.id);
                  }}
                  style={[styles.actionItem, { borderBottomColor: Colors.card.border }]}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.status.error + '20' }]}>
                    <Ionicons name="trash-outline" size={24} color={Colors.status.error} />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={[styles.actionTitle, { color: Colors.text.primary }]}>Sayfayı Sil</Text>
                    <Text style={[styles.actionSubtitle, { color: Colors.text.secondary }]}>Kalıcı olarak sil</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowPageMenu(false)}
                  style={[styles.cancelButton, { backgroundColor: Colors.card.background }]}
                >
                  <Text style={[styles.cancelText, { color: Colors.text.secondary }]}>İptal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.headline.fontSize,
    fontWeight: Typography.headline.fontWeight,
    fontFamily: Typography.headline.fontFamily,
  },
  headerSubtitle: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  editButton: {
    padding: 4,
  },
  addButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  pageContainer: {
    marginBottom: Spacing.lg,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  pageNumber: {
    fontSize: Typography.caption.fontSize,
    fontFamily: Typography.caption.fontFamily,
  },
  pageActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  pageActionButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageActionButtonDisabled: {
    opacity: 0.3,
  },
  pageImage: {
    width: width - (Spacing.base * 2),
    height: (width - (Spacing.base * 2)) * 1.4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    overflow: 'hidden',
  },
  actionSheet: {
    paddingBottom: Spacing['2xl'],
  },
  actionSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionSheetTitle: {
    fontSize: Typography.headline.fontSize,
    fontWeight: Typography.headline.fontWeight,
    fontFamily: Typography.headline.fontFamily,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Typography.body.fontSize,
    fontFamily: Typography.body.fontFamily,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: Typography.footnote.fontSize,
    fontFamily: Typography.footnote.fontFamily,
  },
  cancelButton: {
    marginTop: Spacing.sm,
    marginHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: Typography.body.fontSize,
    fontFamily: Typography.body.fontFamily,
    fontWeight: '600',
  },
});
