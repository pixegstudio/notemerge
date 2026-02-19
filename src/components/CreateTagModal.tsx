import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';

interface CreateTagModalProps {
  visible: boolean;
  onSave: (tag: { name: string; color: string; icon: string }) => void;
  onCancel: () => void;
}

const TAG_COLORS = [
  '#FF6B9D', '#5A7FE8', '#FFB84D', '#4ECDC4', 
  '#A78BFA', '#F59E0B', '#10B981', '#EC4899',
  '#3B82F6', '#8B5CF6', '#EF4444', '#14B8A6',
  '#F97316', '#06B6D4', '#84CC16', '#F43F5E',
];

const TAG_ICONS = [
  'bookmark', 'star', 'heart', 'flag', 'flame',
  'flash', 'trophy', 'ribbon', 'medal', 'gift',
  'bulb', 'rocket', 'diamond', 'shield', 'checkmark-circle',
  'alert-circle', 'information-circle', 'warning', 'school', 'book',
];

export const CreateTagModal: React.FC<CreateTagModalProps> = ({
  visible,
  onSave,
  onCancel,
}) => {
  const { theme } = useTheme();
  const Colors = theme.colors;
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(TAG_ICONS[0]);

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name: name.trim(),
        color: selectedColor,
        icon: selectedIcon,
      });
      setName('');
      setSelectedColor(TAG_COLORS[0]);
      setSelectedIcon(TAG_ICONS[0]);
    }
  };

  const handleCancel = () => {
    setName('');
    setSelectedColor(TAG_COLORS[0]);
    setSelectedIcon(TAG_ICONS[0]);
    Keyboard.dismiss();
    onCancel();
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.base,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modal: {
      backgroundColor: theme.colors.card.background,
      borderRadius: BorderRadius['2xl'],
      padding: Spacing.xl,
      width: '100%',
      maxWidth: 500,
      maxHeight: '80%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    scrollContent: {
      flexGrow: 1,
    },
    title: {
      fontSize: Typography.headline.fontSize,
      fontFamily: Typography.headline.fontFamily,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: Spacing.lg,
      textAlign: 'center',
    },
    section: {
      marginBottom: Spacing.lg,
    },
    sectionLabel: {
      fontSize: Typography.body.fontSize,
      fontFamily: Typography.body.fontFamily,
      fontWeight: '600',
      color: theme.colors.text.secondary,
      marginBottom: Spacing.sm,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      fontSize: Typography.body.fontSize,
      fontFamily: Typography.body.fontFamily,
      color: theme.colors.text.primary,
      borderWidth: 1,
      borderColor: theme.colors.card.border,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    colorButton: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    colorButtonSelected: {
      borderColor: theme.colors.text.primary,
      borderWidth: 3,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    iconButtonSelected: {
      borderColor: selectedColor,
      borderWidth: 3,
    },
    preview: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.base,
      backgroundColor: theme.colors.background,
      borderRadius: BorderRadius.lg,
      gap: Spacing.sm,
    },
    previewIcon: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewText: {
      fontSize: Typography.body.fontSize,
      fontFamily: Typography.body.fontFamily,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginTop: Spacing.lg,
    },
    button: {
      flex: 1,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
    },
    buttonCancel: {
      backgroundColor: theme.colors.card.background,
      borderWidth: 1,
      borderColor: theme.colors.card.border,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    buttonGradient: {
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    buttonTextCancel: {
      fontSize: Typography.body.fontSize,
      fontFamily: Typography.body.fontFamily,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    buttonTextSave: {
      fontSize: Typography.body.fontSize,
      fontFamily: Typography.body.fontFamily,
      fontWeight: '600',
      color: theme.colors.text.inverse,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Özel Etiket Oluştur</Text>
              
              {/* Name Input */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Etiket Adı</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Örn: Midterm, Sunum, Makale..."
                  placeholderTextColor={Colors.text.tertiary}
                  returnKeyType="done"
                  autoCapitalize="words"
                />
              </View>

              {/* Color Picker */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Renk Seç</Text>
                <View style={styles.colorGrid}>
                  {TAG_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        selectedColor === color && styles.colorButtonSelected,
                      ]}
                    >
                      {selectedColor === color && (
                        <Ionicons name="checkmark" size={24} color="#FFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Icon Picker */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>İkon Seç</Text>
                <View style={styles.iconGrid}>
                  {TAG_ICONS.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      onPress={() => setSelectedIcon(icon)}
                      style={[
                        styles.iconButton,
                        selectedIcon === icon && styles.iconButtonSelected,
                      ]}
                    >
                      <Ionicons name={icon as any} size={24} color={selectedColor} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Preview */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Önizleme</Text>
                <View style={styles.preview}>
                  <View style={[styles.previewIcon, { backgroundColor: selectedColor + '20' }]}>
                    <Ionicons name={selectedIcon as any} size={20} color={selectedColor} />
                  </View>
                  <Text style={styles.previewText}>
                    {name.trim() || 'Etiket Adı'}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCancel}
                  style={[styles.button, styles.buttonCancel]}
                >
                  <Text style={styles.buttonTextCancel}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSave}
                  style={styles.button}
                  disabled={!name.trim()}
                >
                  <LinearGradient
                    colors={theme.colors.accentGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.buttonGradient, !name.trim() && { opacity: 0.5 }]}
                  >
                    <Text style={styles.buttonTextSave}>Oluştur</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
