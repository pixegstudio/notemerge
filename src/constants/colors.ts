// Re-export from theme for backwards compatibility
export { CourseColors, TagColors } from './theme';
export type { CourseColorType, TagColorType } from './theme';

// Legacy Colors object for components that haven't been updated yet
export const Colors = {
  primaryGradient: ['#5A7FE8', '#7B9BF0'],
  secondaryGradient: ['#4ECDC4', '#6FE0D8'],
  accentGradient: ['#8B7FD6', '#A599E8'],
  background: '#1E1E2E',
  backgroundSecondary: '#2A2A3E',
  text: {
    primary: '#E8E8F0',
    secondary: '#A8A8B8',
    tertiary: '#6E6E80',
    inverse: '#1E1E2E',
  },
  card: {
    background: '#2A2A3E',
    border: '#363650',
  },
  status: {
    success: '#5FB894',
    warning: '#E8A87C',
    error: '#E27D7D',
    info: '#7DA8E8',
  },
  overlay: 'rgba(30, 30, 46, 0.8)',
  glassBlur: 'rgba(42, 42, 62, 0.7)',
} as const;
