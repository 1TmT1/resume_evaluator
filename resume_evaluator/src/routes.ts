/**
 * Public routes accessible to everyone.
 * @type {string[]}
 */
export const publicRoutes = [
    '/',
    '/auth/email-verification',
];

/**
 * Protected routes only visible to authenticated and registered users
 * @type {string[]}
 */
export const protectedRoutes = [
    '/dashboard',
    '/api/file-key',
]

/**
 * Routes related to authentication - will redirect to dashboard if logged in already.
 * @type {string[]}
 */
export const authRoutes = [
    '/auth/login',
    '/auth/forgot-password',
    '/auth/new-password',
    '/auth/register',
    '/auth/error'
];

/**
 * Api calls for authentication
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * Default redirect path after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";