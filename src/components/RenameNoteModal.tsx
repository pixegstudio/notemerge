import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';

interface RenameNoteModalProps {
  visible: boolean;
  initialName: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export const RenameNoteModal: React.FC<RenameNoteModalProps> = ({
  visible,
  initialName,
  onSave,
  onCancel,
}) => {
  const { theme } = useTheme();
  const Colors = theme.colors;
  const [text, setText] = useState(initialName);
  const inputRef = useRef<TextInput>(null);

  // Reset text when modal opens
  useEffect(() => {
    if (visible) {
      setText(initialName);
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [visible, initialName]);

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
    }
  };

  const handleCancel = () => {
    setText(initialName);
    Keyboard.dismiss();
    onCancel();
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modal: {
      backgroundColor: theme.colors.card.background,
      borderRadius: BorderRadius['2xl'],
      padding: Spacing.xl,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    title: {
      fontSize: Typography.headline.fontSize,
      fontFamily: Typography.headline.fontFamily,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: Spacing.lg,
      textAlign: 'center',
    },
    input: {
      backgroundColor: theme.colors.background,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      fontSize: Typography.body.fontSize,
      fontFamily: Typography.body.fontFamily,
      color: theme.colors.text.primary,
      marginBottom: Spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.card.border,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.sm,
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
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.title}>Notu Yeniden Adlandır</Text>
            
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Not adını girin..."
              placeholderTextColor={Colors.text.tertiary}
              selectTextOnFocus={true}
              onSubmitEditing={handleSave}
              returnKeyType="done"
              underlineColorAndroid="transparent"
              autoCorrect={false}
              autoCapitalize="sentences"
            />

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
              >
                <LinearGradient
                  colors={theme.colors.accentGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonTextSave}>Kaydet</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
