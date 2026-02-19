// Theme System - Night Light & Day Light

export type ThemeMode = 'night' | 'day';

// Course Colors - Updated for better contrast in dark mode
const CourseColors = [
  {
    id: 'blue',
    name: 'Mavi',
    gradient: ['#5A7FE8', '#7B9BF0'],
    iconName: 'calculator',
    subject: 'Matematik',
  },
  {
    id: 'cyan',
    name: 'Turkuaz',
    gradient: ['#4ECDC4', '#6FE0D8'],
    iconName: 'flash',
    subject: 'Fizik',
  },
  {
    id: 'purple',
    name: 'Mor',
    gradient: ['#8B7FD6', '#A599E8'],
    iconName: 'flask',
    subject: 'Kimya',
  },
  {
    id: 'green',
    name: 'Yeşil',
    gradient: ['#5FB894', '#7FCAA6'],
    iconName: 'leaf',
    subject: 'Biyoloji',
  },
  {
    id: 'orange',
    name: 'Turuncu',
    gradient: ['#E8A87C', '#F0BA8E'],
    iconName: 'time',
    subject: 'Tarih',
  },
  {
    id: 'pink',
    name: 'Pembe',
    gradient: ['#E88BA8', '#F09DBA'],
    iconName: 'book',
    subject: 'Edebiyat',
  },
  {
    id: 'teal',
    name: 'Deniz Mavisi',
    gradient: ['#4DB8A8', '#6FCABA'],
    iconName: 'globe',
    subject: 'Coğrafya',
  },
  {
    id: 'lavender',
    name: 'Lavanta',
    gradient: ['#A88BE8', '#BA9DF0'],
    iconName: 'color-palette',
    subject: 'Sanat',
  },
  {
    id: 'coral',
    name: 'Mercan',
    gradient: ['#E87D7D', '#F08F8F'],
    iconName: 'musical-notes',
    subject: 'Müzik',
  },
  {
    id: 'indigo',
    name: 'İndigo',
    gradient: ['#6C8EEF', '#7EA0F7'],
    iconName: 'desktop',
    subject: 'Bilgisayar',
  },
] as const;

// Tag Colors
const TagColors = [
  { name: 'Vize', color: '#5A7FE8', iconName: 'bookmark' },
  { name: 'Final', color: '#E27D7D', iconName: 'flag' },
  { name: 'Quiz', color: '#4ECDC4', iconName: 'help-circle' },
  { name: 'Lab', color: '#8B7FD6', iconName: 'flask' },
  { name: 'Ödev', color: '#E8A87C', iconName: 'create' },
  { name: 'Proje', color: '#5FB894', iconName: 'bulb' },
] as const;

export interface Theme {
  id: 'light' | 'dark';
  colors: {
    // Background Colors
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    
    // Text Colors
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    
    // UI Elements
    card: {
      background: string;
      border: string;
    };
    
    // Primary Gradient
    primaryGradient: [string, string];
    accentGradient: [string, string];
    
    // Status
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    
    // Overlay
    overlay: string;
  };
  courseColors: any[];
  tagColors: any[];
}

// Night Light Theme (Dark Mode - from screenshot)
export const NightTheme: Theme = {
  id: 'dark',
  colors: {
    background: '#1E1E2E',
    backgroundSecondary: '#2A2A3E',
    backgroundTertiary: '#363650',
    
    text: {
      primary: '#E8E8F0',
      secondary: '#A8A8B8',
      tertiary: '#6E6E80',
      inverse: '#FFFFFF',
    },
    
    card: {
      background: '#2A2A3E',
      border: '#363650',
    },
    
    primaryGradient: ['#5A7FE8', '#7B9BF0'],
    accentGradient: ['#4ECDC4', '#6FE0D8'],
    
    status: {
      success: '#5FB894',
      warning: '#E8A87C',
      error: '#E27D7D',
      info: '#7DA8E8',
    },
    
    overlay: 'rgba(30, 30, 46, 0.8)',
  },
  courseColors: CourseColors,
  tagColors: TagColors,
};

// Day Light Theme (Light Mode)
export const DayTheme: Theme = {
  id: 'light',
  colors: {
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F0F1F3',
    
    text: {
      primary: '#2D3142',
      secondary: '#5A6779',
      tertiary: '#9BA5AF',
      inverse: '#FFFFFF',
    },
    
    card: {
      background: '#FFFFFF',
      border: '#E8E9EB',
    },
    
    primaryGradient: ['#5A7FE8', '#7B9BF0'],
    accentGradient: ['#4ECDC4', '#6FE0D8'],
    
    status: {
      success: '#4FA884',
      warning: '#D8986C',
      error: '#D26D6D',
      info: '#6D98D8',
    },
    
    overlay: 'rgba(45, 49, 66, 0.4)',
  },
  courseColors: CourseColors,
  tagColors: TagColors,
};

export type CourseColorType = typeof CourseColors[number];
export type TagColorType = typeof TagColors[number];
