import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Typography } from '../constants/typography';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  style,
}) => {
  const backgroundColor = {
    primary: Colors.primaryGradient[0],
    secondary: Colors.secondaryGradient[0],
    accent: Colors.accentGradient[0],
    success: Colors.status.success,
    warning: Colors.status.warning,
  }[variant];

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
});
