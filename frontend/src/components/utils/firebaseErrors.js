// src/components/utils/firebaseErrors.js
const firebaseErrorMessages = {
  "auth/invalid-credential": "Incorrect email or password. Please try again.",
  "auth/wrong-password": "Incorrect email or password. Please try again.",
  "auth/user-not-found": "No account found with this email address.",
  "auth/too-many-requests": "Too many failed attempts. Please try again later.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/user-disabled": "This account has been disabled. Contact support for help.",
};

export function getFirebaseErrorMessage(error) {
  if (!error || !error.code) {
    return "An unexpected error occurred. Please try again.";
  }

  return (
    firebaseErrorMessages[error.code] ||
    "Login failed. Please check your credentials and try again."
  );
}
