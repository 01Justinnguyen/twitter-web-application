const ERROR_CODES_MESSAGE = {
  // Authentication Notification
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  LOGIN_FAILED: 'Login failed',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_LOCKED: 'Account is locked. Please contact support',
  ACCOUNT_NOT_ACTIVATED: 'Account is not activated. Please verify your email',
  REGISTER_FAILED: 'Registration failed',
  EMAIL_ALREADY_EXISTS: 'Email is already registered',
  WEAK_PASSWORD: 'Password does not meet strength requirements',
  INVALID_EMAIL_FORMAT: 'Email must be in a valid format',
  MISSING_REQUIRED_FIELDS: 'Please fill in all required fields',
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
  TOO_MANY_REQUESTS: 'Too many requests',
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
  INVALID_DATE_OF_BIRTH_FORMAT: 'Date of birth must be in a valid format'
} as const

export default ERROR_CODES_MESSAGE
