import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

/**
 * StyledText component with Inter font family
 * Automatically applies Inter font based on fontWeight
 */
export const StyledText = ({ style, ...props }: TextProps) => {
  const flatStyle = StyleSheet.flatten(style);
  const fontWeight = flatStyle?.fontWeight || '400';
  
  let fontFamily = 'Inter_400Regular';
  
  if (fontWeight === '300') {
    fontFamily = 'Inter_300Light';
  } else if (fontWeight === '400') {
    fontFamily = 'Inter_400Regular';
  } else if (fontWeight === '500' || fontWeight === '600') {
    fontFamily = 'Inter_600SemiBold';
  } else if (fontWeight === '700' || fontWeight === 'bold') {
    fontFamily = 'Inter_700Bold';
  }
  
  return <RNText {...props} style={[style, { fontFamily }]} />;
};
