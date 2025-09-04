// services/firebaseAuthService.js
import { 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  applyActionCode,
  checkActionCode,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

class FirebaseAuthService {
  // Sign in user and get ID token
  static async signInUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get ID token for backend verification
      const idToken = await user.getIdToken();
      
      return {
        success: true,
        user,
        idToken,
        emailVerified: user.emailVerified
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Send email verification
  static async sendVerificationEmail(user) {
    try {
      await sendEmailVerification(user);
      return { success: true, message: 'Verification email sent' };
    } catch (error) {
      return { 
        success: false, 
        error: error.code, 
        message: this.getErrorMessage(error.code) 
      };
    }
  }

  // Verify email with action code
  static async verifyEmailWithCode(actionCode) {
    try {
      await applyActionCode(auth, actionCode);
      return { success: true, message: 'Email verified successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error.code, 
        message: this.getErrorMessage(error.code) 
      };
    }
  }

  // Check action code validity
  static async checkActionCode(actionCode) {
    try {
      const info = await checkActionCode(auth, actionCode);
      return { success: true, info };
    } catch (error) {
      return { 
        success: false, 
        error: error.code, 
        message: this.getErrorMessage(error.code) 
      };
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Sign out user
  static async signOut() {
    try {
      await auth.signOut();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.code, 
        message: this.getErrorMessage(error.code) 
      };
    }
  }

  // Get current user
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Get ID token for current user
  static async getCurrentUserToken() {
    const user = this.getCurrentUser();
    if (user) {
      try {
        const idToken = await user.getIdToken();
        return { success: true, idToken };
      } catch (error) {
        return { success: false, error: error.code };
      }
    }
    return { success: false, error: 'No user signed in' };
  }

  // Error message mapping
  static getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address',
      'auth/wrong-password': 'Invalid email or password',
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/weak-password': 'Password should be at least 6 characters long',
      'auth/invalid-email': 'Invalid email address',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/user-disabled': 'This account has been disabled',
      'auth/expired-action-code': 'This verification link has expired',
      'auth/invalid-action-code': 'Invalid verification link',
      'auth/user-token-expired': 'Your session has expired. Please sign in again'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again';
  }
}

export default FirebaseAuthService;