import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onActionPress,
  icon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={Colors.text.secondary}
            style={styles.icon}
          />
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {actionText && onActionPress && (
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: Typography.headline.fontSize,
    lineHeight: Typography.headline.lineHeight,
    fontWeight: Typography.headline.fontWeight,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.footnote.fontSize,
    lineHeight: Typography.footnote.lineHeight,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  actionText: {
    fontSize: Typography.callout.fontSize,
    fontWeight: '500',
    color: Colors.primaryGradient[0],
  },
});
