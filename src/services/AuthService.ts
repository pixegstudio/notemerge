import { auth } from '../config/firebase.config';
import { 
  signInAnonymously, 
  onAuthStateChanged,
  User,
  UserCredential 
} from 'firebase/auth';

/**
 * AuthService - Firebase Authentication Management
 * 
 * Handles anonymous authentication for the app.
 * Each device gets a unique anonymous user ID.
 */
class AuthService {
  private currentUser: User | null = null;
  private authListeners: Array<(user: User | null) => void> = [];

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.notifyListeners(user);
    });
  }

  /**
   * Sign in anonymously
   * Creates a new anonymous user if not already signed in
   */
  async signInAnonymously(): Promise<UserCredential> {
    try {
      const userCredential = await signInAnonymously(auth);
      console.log('✅ Anonymous sign-in successful:', userCredential.user.uid);
      return userCredential;
    } catch (error: any) {
      console.error('❌ Anonymous sign-in failed:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.currentUser?.uid || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Wait for authentication to complete
   * Useful for app initialization
   */
  async waitForAuth(): Promise<User | null> {
    return new Promise((resolve) => {
      if (this.currentUser) {
        resolve(this.currentUser);
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authListeners.push(callback);
    
    // Immediately call with current user
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of auth state change
   */
  private notifyListeners(user: User | null): void {
    this.authListeners.forEach(listener => {
      try {
        listener(user);
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }

  /**
   * Sign out (rarely needed for anonymous auth)
   */
  async signOut(): Promise<void> {
    try {
      await auth.signOut();
      console.log('✅ Sign-out successful');
    } catch (error: any) {
      console.error('❌ Sign-out failed:', error);
      throw new Error(`Sign-out failed: ${error.message}`);
    }
  }
}

// Export singleton instance
export default new AuthService();
