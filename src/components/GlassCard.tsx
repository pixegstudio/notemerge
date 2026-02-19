import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Spacing, BorderRadius } from '../constants/spacing';
import { useTheme } from '../context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
}) => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      backgroundColor: theme.colors.card.background,
      borderWidth: 1,
      borderColor: theme.colors.card.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    content: {
      padding: Spacing.base,
    },
  });
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
};
