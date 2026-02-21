// Typography Hierarchy with San Francisco (iOS Native Font)
// React Native automatically uses SF Pro on iOS
export const Typography = {
  display: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700' as const,
  },
  largeTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  title1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
  },
  title2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  title3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  titleLarge: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600' as const,
  },
  headline: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  callout: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  subhead: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '400' as const,
  },
  footnote: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400' as const,
  },
} as const;

export type TypographyType = typeof Typography;
