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
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { IconButton, CreateTagModal } from '../components';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';
import { StorageService } from '../services/StorageService';
import { PredefinedTags, TagType } from '../constants/tags';

export const TagManagementScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const Colors = theme.colors;
  
  const [customTags, setCustomTags] = useState<TagType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadCustomTags();
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    const status = await StorageService.getPremiumStatus();
    setIsPremium(status);
  };

  const loadCustomTags = async () => {
    try {
      const tags = await StorageService.getCustomTags();
      setCustomTags(tags);
    } catch (error) {
      console.error('Error loading custom tags:', error);
    }
  };

  const handleCreateTag = async (tag: { name: string; color: string; icon: string }) => {
    try {
      // Check custom tag limit
      const { allowed, isPremium, currentCount } = await StorageService.canCreateCustomTag();
      
      if (!allowed) {
        Alert.alert(
          'Etiket Limiti Doldu',
          `Ücretsiz planda maksimum ${StorageService.LIMITS.FREE_CUSTOM_TAG_LIMIT} özel etiket oluşturabilirsiniz. Sınırsız etiket için Premium'a geçin!`,
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

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const newTag: TagType = {
        id: `custom_${Date.now()}`,
        ...tag,
      };
      await StorageService.addCustomTag(newTag);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowCreateModal(false);
      loadCustomTags();
    } catch (error) {
      console.error('Error creating tag:', error);
      Alert.alert('Hata', 'Etiket oluşturulurken bir hata oluştu.');
    }
  };

  const handleDeleteTag = async (tagId: string, tagName: string) => {
    Alert.alert(
      'Etiketi Sil',
      `"${tagName}" etiketini silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteCustomTag(tagId);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              loadCustomTags();
            } catch (error) {
              console.error('Error deleting tag:', error);
              Alert.alert('Hata', 'Etiket silinirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  const TagCard = ({ tag, isCustom }: { tag: TagType; isCustom: boolean }) => (
    <View style={styles.tagCard}>
      <View style={[styles.tagIcon, { backgroundColor: tag.color + '20' }]}>
        <Ionicons name={tag.icon as any} size={24} color={tag.color} />
      </View>
      <View style={styles.tagContent}>
        <Text style={styles.tagName}>{tag.name}</Text>
        <Text style={styles.tagType}>{isCustom ? 'Özel Etiket' : 'Varsayılan'}</Text>
      </View>
      {isCustom && (
        <TouchableOpacity
          onPress={() => handleDeleteTag(tag.id, tag.name)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.status.error} />
        </TouchableOpacity>
      )}
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
    section: {
      marginBottom: Spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      fontSize: Typography.headline.fontSize,
      fontFamily: Typography.headline.fontFamily,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    sectionCount: {
      fontSize: Typography.footnote.fontSize,
      fontFamily: Typography.footnote.fontFamily,
      color: theme.colors.text.tertiary,
    },
    tagCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.base,
      backgroundColor: theme.colors.card.background,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.sm,
    },
    tagIcon: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    tagContent: {
      flex: 1,
    },
    tagName: {
      fontSize: Typography.body.fontSize,
      fontFamily: Typography.body.fontFamily,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    tagType: {
      fontSize: Typography.footnote.fontSize,
      fontFamily: Typography.footnote.fontFamily,
      color: theme.colors.text.secondary,
    },
    deleteButton: {
      padding: Spacing.sm,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.base,
      backgroundColor: theme.colors.card.background,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: theme.colors.accentGradient[0],
      borderStyle: 'dashed',
      marginTop: Spacing.md,
    },
    createButtonText: {
      fontSize: Typography.body.fontSize,
      fontFamily: Typography.body.fontFamily,
      fontWeight: '600',
      color: theme.colors.accentGradient[0],
      marginLeft: Spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme.id === 'light' ? 'dark' : 'light'} />
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="arrow-back" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Etiket Yönetimi</Text>
          <IconButton 
            icon="analytics-outline" 
            onPress={() => navigation.navigate('TagStats')} 
          />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Predefined Tags */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Varsayılan Etiketler</Text>
              <Text style={styles.sectionCount}>({PredefinedTags.length})</Text>
            </View>
            {PredefinedTags.map((tag) => (
              <TagCard key={tag.id} tag={tag} isCustom={false} />
            ))}
          </View>

          {/* Custom Tags */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Özel Etiketler</Text>
              <Text style={styles.sectionCount}>
                ({isPremium ? customTags.length : `${customTags.length}/${StorageService.LIMITS.FREE_CUSTOM_TAG_LIMIT}`})
              </Text>
            </View>
            {customTags.map((tag) => (
              <TagCard key={tag.id} tag={tag} isCustom={true} />
            ))}
            
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                
                // Check custom tag limit before opening modal
                const { allowed, isPremium, currentCount } = await StorageService.canCreateCustomTag();
                
                if (!allowed) {
                  Alert.alert(
                    'Etiket Limiti Doldu',
                    `Ücretsiz planda maksimum ${StorageService.LIMITS.FREE_CUSTOM_TAG_LIMIT} özel etiket oluşturabilirsiniz. Sınırsız etiket için Premium'a geçin!`,
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
                
                setShowCreateModal(true);
              }}
              style={styles.createButton}
            >
              <Ionicons name="add-circle" size={24} color={Colors.accentGradient[0]} />
              <Text style={styles.createButtonText}>Yeni Etiket Oluştur</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Create Tag Modal */}
        <CreateTagModal
          visible={showCreateModal}
          onSave={handleCreateTag}
          onCancel={() => setShowCreateModal(false)}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};
