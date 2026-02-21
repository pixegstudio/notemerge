import { StorageService } from '../services/StorageService';
import FirestoreService from '../services/FirestoreService';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Migration Utility
 * 
 * Migrates data from AsyncStorage to Firebase Firestore
 * Run this once after Firebase integration
 */

const MIGRATION_KEY = '@notemerge_migration_completed';

export async function hasMigrationCompleted(): Promise<boolean> {
  try {
    const completed = await AsyncStorage.getItem(MIGRATION_KEY);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking migration status:', error);
    return false;
  }
}

export async function markMigrationCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(MIGRATION_KEY, 'true');
  } catch (error) {
    console.error('Error marking migration completed:', error);
  }
}

export async function migrateToFirebase(): Promise<{
  success: boolean;
  message: string;
  coursesCount?: number;
  tagsCount?: number;
}> {
  try {
    console.log('🔄 Starting migration to Firebase...');

    // Check if migration already completed
    const completed = await hasMigrationCompleted();
    if (completed) {
      console.log('✅ Migration already completed');
      return {
        success: true,
        message: 'Migration already completed',
      };
    }

    // Load data from AsyncStorage
    const courses = await StorageService.getCourses();
    const tags = await StorageService.getCustomTags();

    console.log(`📦 Found ${courses.length} courses and ${tags.length} tags`);

    // Skip if no data to migrate
    if (courses.length === 0 && tags.length === 0) {
      console.log('ℹ️ No data to migrate');
      await markMigrationCompleted();
      return {
        success: true,
        message: 'No data to migrate',
        coursesCount: 0,
        tagsCount: 0,
      };
    }

    // Sync to Firestore
    await FirestoreService.syncFromLocal(courses, tags);

    // Mark migration as completed
    await markMigrationCompleted();

    console.log('✅ Migration completed successfully!');

    return {
      success: true,
      message: 'Migration completed successfully',
      coursesCount: courses.length,
      tagsCount: tags.length,
    };
  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      message: `Migration failed: ${error.message}`,
    };
  }
}

/**
 * Reset migration (for testing only)
 */
export async function resetMigration(): Promise<void> {
  try {
    await AsyncStorage.removeItem(MIGRATION_KEY);
    console.log('✅ Migration reset');
  } catch (error) {
    console.error('Error resetting migration:', error);
  }
}
