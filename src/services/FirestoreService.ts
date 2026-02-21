import { db } from '../config/firebase.config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import AuthService from './AuthService';
import { Course, Note, Tag } from '../types';

/**
 * FirestoreService - Cloud Data Sync Layer
 * 
 * Handles all Firestore operations for courses, notes, and tags.
 * Data is stored per-user using their Firebase Auth UID.
 */

class FirestoreService {
  /**
   * Get user's collection reference
   */
  private getUserCollection(collectionName: string) {
    const userId = AuthService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return collection(db, 'users', userId, collectionName);
  }

  // ==================== COURSES ====================

  /**
   * Get all courses for current user
   */
  async getCourses(): Promise<Course[]> {
    try {
      const coursesRef = this.getUserCollection('courses');
      const q = query(coursesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis() || Date.now(),
        updatedAt: doc.data().updatedAt?.toMillis() || Date.now()
      })) as Course[];
    } catch (error: any) {
      console.error('❌ Error fetching courses:', error);
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
  }

  /**
   * Get a single course by ID
   */
  async getCourse(courseId: string): Promise<Course | null> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const courseDoc = doc(db, 'users', userId, 'courses', courseId);
      const docSnap = await getDoc(courseDoc);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          updatedAt: data.updatedAt?.toMillis() || Date.now()
        } as Course;
      }
      
      return null;
    } catch (error: any) {
      console.error('❌ Error fetching course:', error);
      throw new Error(`Failed to fetch course: ${error.message}`);
    }
  }

  /**
   * Create a new course
   */
  async createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const courseId = `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const courseDoc = doc(db, 'users', userId, 'courses', courseId);

      const newCourse: any = {
        ...course,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(courseDoc, newCourse);

      return {
        id: courseId,
        ...course,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    } catch (error: any) {
      console.error('❌ Error creating course:', error);
      throw new Error(`Failed to create course: ${error.message}`);
    }
  }

  /**
   * Update an existing course
   */
  async updateCourse(courseId: string, updates: Partial<Course>): Promise<void> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const courseDoc = doc(db, 'users', userId, 'courses', courseId);
      
      // Remove fields that shouldn't be updated
      const { id, createdAt, ...safeUpdates } = updates as any;

      await updateDoc(courseDoc, {
        ...safeUpdates,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Course updated:', courseId);
    } catch (error: any) {
      console.error('❌ Error updating course:', error);
      throw new Error(`Failed to update course: ${error.message}`);
    }
  }

  /**
   * Delete a course and all its notes
   */
  async deleteCourse(courseId: string): Promise<void> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Delete all notes in the course first
      const notes = await this.getNotes(courseId);
      const batch = writeBatch(db);

      notes.forEach(note => {
        const noteDoc = doc(db, 'users', userId, 'courses', courseId, 'notes', note.id);
        batch.delete(noteDoc);
      });

      // Delete the course
      const courseDoc = doc(db, 'users', userId, 'courses', courseId);
      batch.delete(courseDoc);

      await batch.commit();
      console.log('✅ Course and notes deleted:', courseId);
    } catch (error: any) {
      console.error('❌ Error deleting course:', error);
      throw new Error(`Failed to delete course: ${error.message}`);
    }
  }

  // ==================== NOTES ====================

  /**
   * Get all notes for a course
   */
  async getNotes(courseId: string): Promise<Note[]> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const notesRef = collection(db, 'users', userId, 'courses', courseId, 'notes');
      const q = query(notesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis() || Date.now(),
        updatedAt: doc.data().updatedAt?.toMillis() || Date.now()
      })) as Note[];
    } catch (error: any) {
      console.error('❌ Error fetching notes:', error);
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }
  }

  /**
   * Get a single note by ID
   */
  async getNote(courseId: string, noteId: string): Promise<Note | null> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const noteDoc = doc(db, 'users', userId, 'courses', courseId, 'notes', noteId);
      const docSnap = await getDoc(noteDoc);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          updatedAt: data.updatedAt?.toMillis() || Date.now()
        } as Note;
      }

      return null;
    } catch (error: any) {
      console.error('❌ Error fetching note:', error);
      throw new Error(`Failed to fetch note: ${error.message}`);
    }
  }

  /**
   * Create a new note
   */
  async createNote(courseId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const noteDoc = doc(db, 'users', userId, 'courses', courseId, 'notes', noteId);

      const newNote: any = {
        ...note,
        courseId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(noteDoc, newNote);

      return {
        id: noteId,
        ...note,
        courseId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    } catch (error: any) {
      console.error('❌ Error creating note:', error);
      throw new Error(`Failed to create note: ${error.message}`);
    }
  }

  /**
   * Update an existing note
   */
  async updateNote(courseId: string, noteId: string, updates: Partial<Note>): Promise<void> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const noteDoc = doc(db, 'users', userId, 'courses', courseId, 'notes', noteId);
      
      // Remove fields that shouldn't be updated
      const { id, createdAt, courseId: _, ...safeUpdates } = updates as any;

      await updateDoc(noteDoc, {
        ...safeUpdates,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Note updated:', noteId);
    } catch (error: any) {
      console.error('❌ Error updating note:', error);
      throw new Error(`Failed to update note: ${error.message}`);
    }
  }

  /**
   * Delete a note
   */
  async deleteNote(courseId: string, noteId: string): Promise<void> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const noteDoc = doc(db, 'users', userId, 'courses', courseId, 'notes', noteId);
      await deleteDoc(noteDoc);

      console.log('✅ Note deleted:', noteId);
    } catch (error: any) {
      console.error('❌ Error deleting note:', error);
      throw new Error(`Failed to delete note: ${error.message}`);
    }
  }

  // ==================== TAGS ====================

  /**
   * Get all custom tags for current user
   */
  async getTags(): Promise<Tag[]> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const tagsDoc = doc(db, 'users', userId, 'settings', 'tags');
      const docSnap = await getDoc(tagsDoc);

      if (docSnap.exists()) {
        return docSnap.data().tags || [];
      }

      return [];
    } catch (error: any) {
      console.error('❌ Error fetching tags:', error);
      throw new Error(`Failed to fetch tags: ${error.message}`);
    }
  }

  /**
   * Save custom tags
   */
  async saveTags(tags: Tag[]): Promise<void> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const tagsDoc = doc(db, 'users', userId, 'settings', 'tags');
      await setDoc(tagsDoc, {
        tags,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Tags saved');
    } catch (error: any) {
      console.error('❌ Error saving tags:', error);
      throw new Error(`Failed to save tags: ${error.message}`);
    }
  }

  // ==================== BATCH OPERATIONS ====================

  /**
   * Sync all data from AsyncStorage to Firestore (migration)
   */
  async syncFromLocal(courses: Course[], tags: Tag[]): Promise<void> {
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      console.log('🔄 Starting data sync to Firestore...');

      // Sync courses and notes
      for (const course of courses) {
        const courseId = course.id;
        const courseDoc = doc(db, 'users', userId, 'courses', courseId);

        // Create course
        await setDoc(courseDoc, {
          name: course.name,
          color: course.color,
          icon: course.icon,
          noteCount: course.noteCount,
          createdAt: Timestamp.fromMillis(course.createdAt),
          updatedAt: Timestamp.fromMillis(course.updatedAt)
        });

        console.log(`✅ Synced course: ${course.name}`);
      }

      // Sync tags
      if (tags.length > 0) {
        await this.saveTags(tags);
        console.log('✅ Synced tags');
      }

      console.log('✅ Data sync complete!');
    } catch (error: any) {
      console.error('❌ Error syncing data:', error);
      throw new Error(`Failed to sync data: ${error.message}`);
    }
  }
}

// Export singleton instance
export default new FirestoreService();
