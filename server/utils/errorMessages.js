// utils/errorMessages.js

// Helper function to get user-friendly error messages
export const getFriendlyErrorMessage = (error) => {
  const errorCode = error.code;
  
  switch (errorCode) {
    case 'auth/email-already-exists':
      return 'This email is already registered. Please try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or create a new account.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid login credentials. Please check your email and password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment before trying again.';
    case 'auth/user-disabled':
      return 'This account has been temporarily disabled. Please contact support.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled. Please contact support.';
    case 'auth/id-token-expired':
      return 'Your session has expired. Please log in again.';
    case 'auth/invalid-id-token':
      return 'Invalid session. Please log in again.';
    case 'auth/argument-error':
      return 'Please fill in all required fields correctly.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/internal-error':
      return 'Something went wrong on our end. Please try again in a moment.';
    default:
      return 'Something went wrong. Please try again or contact support if the problem persists.';
  }
};