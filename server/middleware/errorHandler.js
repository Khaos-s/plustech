export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Default error
  let status = 500;
  let message = 'Internal server error';

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }
  // Validation errors
  else if (error.name === 'ValidationError') {
    status = 400;
    message = error.message;
  }
  // Firebase errors
  else if (error.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        status = 404;
        message = 'User not found';
        break;
      case 'auth/wrong-password':
        status = 401;
        message = 'Invalid credentials';
        break;
      case 'auth/email-already-in-use':
        status = 400;
        message = 'Email already registered';
        break;
      case 'auth/weak-password':
        status = 400;
        message = 'Password is too weak';
        break;
      case 'auth/invalid-email':
        status = 400;
        message = 'Invalid email format';
        break;
      default:
        message = error.message || 'Authentication error';
    }
  }
  // Mongoose/MongoDB errors
  else if (error.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }
  // Custom error with status
  else if (error.status) {
    status = error.status;
    message = error.message;
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};