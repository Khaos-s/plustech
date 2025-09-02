export const getFriendlyErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  // Firebase Auth errors
  const firebaseErrors = {
    'auth/user-not-found': 'No user found with this email address',
    'auth/wrong-password': 'Invalid email or password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password should be at least 6 characters long',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later',
    'auth/operation-not-allowed': 'Email/password sign-in is not enabled',
    'auth/invalid-credential': 'The provided credentials are invalid',
    'auth/credential-already-in-use': 'This credential is already associated with a different account',
    'auth/invalid-verification-code': 'Invalid verification code',
    'auth/invalid-verification-id': 'Invalid verification ID',
    'auth/expired-action-code': 'The action code has expired',
    'auth/invalid-action-code': 'The action code is invalid',
  };

  // JWT errors
  const jwtErrors = {
    'JsonWebTokenError': 'Invalid authentication token',
    'TokenExpiredError': 'Authentication token has expired. Please log in again',
    'NotBeforeError': 'Authentication token is not active yet',
  };

  // Check for Firebase error codes
  if (error.code && firebaseErrors[error.code]) {
    return firebaseErrors[error.code];
  }

  // Check for JWT error names
  if (error.name && jwtErrors[error.name]) {
    return jwtErrors[error.name];
  }

  // Generic error message
  return error.message || 'An unexpected error occurred. Please try again';
};