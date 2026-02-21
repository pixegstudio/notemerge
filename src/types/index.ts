// Core Data Types for NoteMerge

export interface Page {
  id: string;
  noteId: string;
  originalImagePath: string;
  processedImagePath?: string;
  order: number;
  rotation: 0 | 90 | 180 | 270;
  corners?: { x: number; y: number }[];
  isProcessed: boolean;
  createdAt: Date;
}

export interface PDFSettings {
  pageSize: 'A4' | 'Letter' | 'Auto';
  orientation: 'Portrait' | 'Landscape' | 'Auto';
  quality: 'Low' | 'Medium' | 'High';
  colorMode: 'Color' | 'Grayscale' | 'BlackWhite';
}

export interface Note {
  id: string;
  courseId: string;
  name: string;
  pages: Page[];
  tags: string[];
  settings: PDFSettings;
  pdfPath?: string;
  thumbnail?: string;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  color: string;           // Hex color for gradient start
  colorEnd: string;        // Hex color for gradient end
  icon: string;            // Emoji or icon name
  coverDesign: 'gradient' | 'pattern' | 'solid';
  notes: Note[];
  tags: string[];
  isArchived: boolean;
  semester?: string;       // e.g., "Güz 2025", "Bahar 2026"
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface CourseStats {
  totalPages: number;
  totalNotes: number;
  totalSize: number;
  lastUpdated: Date;
}

export type RootStackParamList = {
  Home: undefined;
  Onboarding: undefined;
  CreateCourse: { courseId?: string };
  CourseDetail: { courseId: string };
  CreateNote: { courseId: string; noteId?: string };
  NoteEdit: { courseId: string; noteId: string };
  CameraCapture: { courseId: string; noteId: string };
  PDFPreview: { courseId: string; noteId: string };
  Settings: undefined;
  Premium: undefined;
  Archive: undefined;
  Search: undefined;
  TagManagement: undefined;
  TagStats: undefined;
  Notifications: undefined;
  HelpSupport: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  AppInfo: undefined;
  Backup: undefined;
};
