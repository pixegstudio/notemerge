import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course, Note } from '../types';

const STORAGE_KEYS = {
  COURSES: '@notemerge_courses',
  NOTES: '@notemerge_notes',
  ONBOARDING_COMPLETED: '@notemerge_onboarding_completed',
  PREMIUM_STATUS: '@notemerge_premium_status',
  CUSTOM_TAGS: '@notemerge_custom_tags',
} as const;

export class StorageService {
  // ============================================================
  // COURSES
  // ============================================================
  
  static async getCourses(): Promise<Course[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
      if (!data) return [];
      
      const courses = JSON.parse(data);
      // Convert date strings back to Date objects
      return courses.map((course: any) => ({
        ...course,
        createdAt: new Date(course.createdAt),
        updatedAt: new Date(course.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading courses:', error);
      return [];
    }
  }

  static async saveCourses(courses: Course[]): Promise<void> {
    try {
      // Ensure dates are properly serialized
      const serializedCourses = courses.map(course => ({
        ...course,
        createdAt: course.createdAt instanceof Date ? course.createdAt.toISOString() : course.createdAt,
        updatedAt: course.updatedAt instanceof Date ? course.updatedAt.toISOString() : course.updatedAt,
      }));
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(serializedCourses));
    } catch (error) {
      console.error('Error saving courses:', error);
    }
  }

  static async addCourse(course: Course): Promise<void> {
    const courses = await this.getCourses();
    courses.push(course);
    await this.saveCourses(courses);
  }

  static async updateCourse(courseId: string, updates: Partial<Course>): Promise<void> {
    const courses = await this.getCourses();
    const index = courses.findIndex(c => c.id === courseId);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updates, updatedAt: new Date() };
      console.log('📦 Updating course:', courseId, 'with updates:', updates);
      console.log('📦 Updated course:', courses[index]);
      await this.saveCourses(courses);
      console.log('✅ Course saved successfully');
    } else {
      console.error('❌ Course not found:', courseId);
    }
  }

  static async deleteCourse(courseId: string): Promise<void> {
    const courses = await this.getCourses();
    const filtered = courses.filter(c => c.id !== courseId);
    await this.saveCourses(filtered);
    
    // Also delete all notes for this course
    const notes = await this.getNotes();
    const filteredNotes = notes.filter(n => n.courseId !== courseId);
    await this.saveNotes(filteredNotes);
  }

  static async getCourseById(courseId: string): Promise<Course | null> {
    const courses = await this.getCourses();
    return courses.find(c => c.id === courseId) || null;
  }

  // ============================================================
  // NOTES
  // ============================================================
  
  static async getNotes(): Promise<Note[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  static async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }

  static async addNote(note: Note): Promise<void> {
    const notes = await this.getNotes();
    notes.push(note);
    await this.saveNotes(notes);
  }

  static async updateNote(noteId: string, updates: Partial<Note>): Promise<void> {
    // Update in standalone notes
    const notes = await this.getNotes();
    const index = notes.findIndex(n => n.id === noteId);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updates, updatedAt: new Date() };
      await this.saveNotes(notes);
    }

    // Also update in courses
    const courses = await this.getCourses();
    let courseUpdated = false;
    
    for (const course of courses) {
      const noteIndex = course.notes.findIndex(n => n.id === noteId);
      if (noteIndex !== -1) {
        course.notes[noteIndex] = { 
          ...course.notes[noteIndex], 
          ...updates, 
          updatedAt: new Date() 
        };
        courseUpdated = true;
        break;
      }
    }

    if (courseUpdated) {
      await this.saveCourses(courses);
    }
  }

  static async deleteNote(noteId: string): Promise<void> {
    const notes = await this.getNotes();
    const filtered = notes.filter(n => n.id !== noteId);
    await this.saveNotes(filtered);
  }

  static async getNotesByCourse(courseId: string): Promise<Note[]> {
    const notes = await this.getNotes();
    return notes.filter(n => n.courseId === courseId);
  }

  static async getNoteById(noteId: string): Promise<Note | null> {
    const notes = await this.getNotes();
    return notes.find(n => n.id === noteId) || null;
  }

  // ============================================================
  // ONBOARDING
  // ============================================================
  
  static async setOnboardingCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(completed));
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  }

  static async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error('Error loading onboarding status:', error);
      return false;
    }
  }

  // ============================================================
  // PREMIUM
  // ============================================================
  
  static async setPremiumStatus(isPremium: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, JSON.stringify(isPremium));
    } catch (error) {
      console.error('Error saving premium status:', error);
    }
  }

  static async getPremiumStatus(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS);
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error('Error loading premium status:', error);
      return false;
    }
  }

  // ============================================================
  // CUSTOM TAGS
  // ============================================================
  
  static async getCustomTags(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_TAGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading custom tags:', error);
      return [];
    }
  }

  static async saveCustomTags(tags: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_TAGS, JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving custom tags:', error);
    }
  }

  static async addCustomTag(tag: any): Promise<void> {
    const tags = await this.getCustomTags();
    tags.push(tag);
    await this.saveCustomTags(tags);
  }

  static async updateCustomTag(tagId: string, updates: any): Promise<void> {
    const tags = await this.getCustomTags();
    const index = tags.findIndex(t => t.id === tagId);
    if (index !== -1) {
      tags[index] = { ...tags[index], ...updates };
      await this.saveCustomTags(tags);
    }
  }

  static async deleteCustomTag(tagId: string): Promise<void> {
    const tags = await this.getCustomTags();
    const filtered = tags.filter(t => t.id !== tagId);
    await this.saveCustomTags(filtered);
  }

  // ============================================================
  // FREEMIUM LIMITS
  // ============================================================
  
  static readonly LIMITS = {
    FREE_COURSE_LIMIT: 3,
    FREE_NOTE_PER_COURSE_LIMIT: 10,
    FREE_CUSTOM_TAG_LIMIT: 3,
  };

  static async canCreateCourse(): Promise<{ allowed: boolean; isPremium: boolean; currentCount: number }> {
    const isPremium = await this.getPremiumStatus();
    const courses = await this.getCourses();
    const currentCount = courses.length;
    
    return {
      allowed: isPremium || currentCount < this.LIMITS.FREE_COURSE_LIMIT,
      isPremium,
      currentCount,
    };
  }

  static async canAddNote(courseId: string): Promise<{ allowed: boolean; isPremium: boolean; currentCount: number }> {
    const isPremium = await this.getPremiumStatus();
    const notes = await this.getNotesByCourse(courseId);
    const currentCount = notes.length;
    
    return {
      allowed: isPremium || currentCount < this.LIMITS.FREE_NOTE_PER_COURSE_LIMIT,
      isPremium,
      currentCount,
    };
  }

  static async canCreateCustomTag(): Promise<{ allowed: boolean; isPremium: boolean; currentCount: number }> {
    const isPremium = await this.getPremiumStatus();
    const customTags = await this.getCustomTags();
    const currentCount = customTags.length;
    
    return {
      allowed: isPremium || currentCount < this.LIMITS.FREE_CUSTOM_TAG_LIMIT,
      isPremium,
      currentCount,
    };
  }

  // ============================================================
  // UTILITY
  // ============================================================
  
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.COURSES,
        STORAGE_KEYS.NOTES,
        STORAGE_KEYS.ONBOARDING_COMPLETED,
        STORAGE_KEYS.PREMIUM_STATUS,
        STORAGE_KEYS.CUSTOM_TAGS,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  static async clearCache(): Promise<{ success: boolean; message: string }> {
    try {
      // Clear only cache-related data, keep user data
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.includes('cache') || 
        key.includes('temp') ||
        key.includes('@notification_settings') ||
        key.includes('@backup_settings')
      );
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
      
      return {
        success: true,
        message: `${cacheKeys.length} önbellek öğesi temizlendi`,
      };
    } catch (error) {
      console.error('Error clearing cache:', error);
      return {
        success: false,
        message: 'Önbellek temizlenirken hata oluştu',
      };
    }
  }

  static async clearAllData(): Promise<{ success: boolean; message: string }> {
    try {
      // Clear ALL data including courses, notes, etc.
      await AsyncStorage.clear();
      
      return {
        success: true,
        message: 'Tüm veriler başarıyla silindi',
      };
    } catch (error) {
      console.error('Error clearing all data:', error);
      return {
        success: false,
        message: 'Veriler silinirken hata oluştu',
      };
    }
  }

  static async getCacheSize(): Promise<string> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      // Convert to MB
      const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
      return `${sizeInMB} MB`;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return '0 MB';
    }
  }
}
