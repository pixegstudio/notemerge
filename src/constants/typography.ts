// Typography Hierarchy with Inter Font Family
export const Typography = {
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  titleLarge: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  headline: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400' as const,
    fontFamily: 'Inter_400Regular',
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400' as const,
    fontFamily: 'Inter_400Regular',
  },
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '300' as const,
    fontFamily: 'Inter_300Light',
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '300' as const,
    fontFamily: 'Inter_300Light',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300' as const,
    fontFamily: 'Inter_300Light',
  },
} as const;

export type TypographyType = typeof Typography;
