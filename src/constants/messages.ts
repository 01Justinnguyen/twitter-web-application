const ERROR_CODES_MESSAGE = {
  // Authentication Notification
  USER_NOT_FOUND: 'User not found',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  LOGIN_FAILED: 'Login failed',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_LOCKED: 'Account is locked. Please contact support',
  ACCOUNT_NOT_ACTIVATED: 'Account is not activated. Please verify your email',
  REGISTER_FAILED: 'Registration failed',
  EMAIL_ALREADY_EXISTS: 'Email is already registered',
  WEAK_PASSWORD: 'Password does not meet strength requirements',
  INVALID_EMAIL_FORMAT: 'Email must be in a valid format',
  MISSING_REQUIRED_FIELDS: 'Please fill in all required fields',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  // Authentication Notification

  // System errors
  VALIDATION_ERROR: 'Validation error',
  AUTHENTICATION_ERROR: 'Authentication error',
  AUTHORIZATION_ERROR: 'Authorization error',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error',
  TIMEOUT_ERROR: 'Request timed out',
  BAD_REQUEST: 'Bad request',
  CONFLICT_ERROR: 'Conflict error',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
  SERVICE_UNAVAILABLE: 'Service unavailable',
  DATABASE_ERROR: 'Database error',
  INVALID_INPUT: 'Invalid input',
  UNPROCESSABLE_ENTITY: 'Unprocessable entity',
  PAYMENT_REQUIRED: 'Payment required',
  FORBIDDEN: 'Access forbidden',
  METHOD_NOT_ALLOWED: 'Method not allowed',
  UNSUPPORTED_MEDIA_TYPE: 'Unsupported media type',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  BAD_GATEWAY: 'Bad gateway',
  GATEWAY_TIMEOUT: 'Gateway timeout',
  CONNECTION_ERROR: 'Connection error',
  // System errors

  // Entity errors
  MISSING_EMAIL_OR_PASSWORD: 'Email or password is missing',
  NAME_LENGTH_ERROR: 'Name must be from 1 to 255 characters',
  PASSWORD_LENGTH_ERROR: 'Password must be from 6 to 50 characters',
  PASSWORD_STRONG_ERROR: 'Password must be strong',
  CONFIRM_PASSWORD_LENGTH_ERROR: 'Confirm password must be from 6 to 50 characters',
  CONFIRM_PASSWORD_ERROR: 'Password confirmation does not match',
  MISSING_EMAIL_ERROR: 'Email is required',
  MISSING_PASSWORD_ERROR: 'Password is required',
  MISSING_CONFIRM_PASSWORD_ERROR: 'Password confirmation is required',
  MISSING_NAME_ERROR: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm password must be a string',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  INVALID_DATE_OF_BIRTH_FORMAT: 'Date of birth must be in a valid format',
  // Entity errors

  // Unauthorized errors
  UNAUTHORIZED_ERRORS: 'Unauthorized errors',
  ACCESS_TOKEN_EXPIRED: 'Access token has expired',
  INVALID_ACCESS_TOKEN: 'Invalid access token',
  REFRESH_TOKEN_EXPIRED: 'Refresh token has expired',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid refresh token',
  INVALID_EMAIL_VERIFY_TOKEN: 'Invalid refresh token',
  TOKEN_NOT_FOUND: 'Token does not exist in the database',
  TOKEN_REVOKED: 'Token has been revoked',
  TOKEN_TAMPERED: 'Token has been tampered with',
  TOKEN_MISSING: 'Authorization token is missing',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Verify forgot password token success',
  UNAUTHORIZED_SCOPE: 'Unauthorized scope for this action',
  TOKEN_AUDIENCE_MISMATCH: 'Token audience mismatch',
  UNAUTHORIZED_USER: 'User is not authorized to access this resource',
  UNAUTHORIZED_ROLE: 'User does not have the required role to perform this action',
  PERMISSION_DENIED: 'Permission denied for the requested resource',
  FORBIDDEN_ACCESS: 'Access to this resource is forbidden',
  SESSION_EXPIRED: 'User session has expired, please log in again',
  MFA_REQUIRED: 'Multi-factor authentication is required for this action',
  // Unauthorized errors

  // Lỗi liên quan đến email verification
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  EMAIL_NOT_VERIFIED: 'Email address has not been verified',
  EMAIL_VERIFICATION_EXPIRED: 'Email verification link has expired',
  INVALID_EMAIL_VERIFICATION_TOKEN: 'Invalid email verification token',
  EMAIL_ALREADY_VERIFIED: 'Email address has already been verified',
  EMAIL_VERIFICATION_RESENT: 'Email verification link has been resent',
  EMAIL_VERIFICATION_REQUIRED: 'Email verification is required to access this resource',
  EMAIL_VERIFICATION_LIMIT_REACHED: 'Email verification attempt limit has been reached, please try again later',
  EMAIL_NOT_FOUND: 'No user found with the specified email address'
  // Lỗi liên quan đến email verification
} as const

export default ERROR_CODES_MESSAGE
