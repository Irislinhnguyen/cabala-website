import { NextRequest, NextResponse } from 'next/server';

// Rate limiting map to track requests per IP
const rateLimit = new Map<string, { count: number; lastReset: number }>();

// Constants for validation
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 1000,
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: {
    LOGIN: 5,      // 5 login attempts per 15 minutes
    REGISTER: 3,   // 3 registration attempts per 15 minutes
    API: 100,      // 100 API calls per 15 minutes
    UPLOAD: 10,    // 10 uploads per 15 minutes
  }
};

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (remoteAddr) {
    return remoteAddr;
  }
  return 'unknown';
}

/**
 * Rate limiting middleware
 */
export function checkRateLimit(
  request: NextRequest, 
  maxRequests: number = RATE_LIMIT_CONFIG.MAX_REQUESTS.API
): { allowed: boolean; remaining: number } {
  const clientIP = getClientIP(request);
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.WINDOW_MS;
  
  // Get or initialize rate limit data for this IP
  const ipData = rateLimit.get(clientIP) || { count: 0, lastReset: now };
  
  // Reset counter if window has passed
  if (ipData.lastReset < windowStart) {
    ipData.count = 0;
    ipData.lastReset = now;
  }
  
  // Check if limit exceeded
  if (ipData.count >= maxRequests) {
    rateLimit.set(clientIP, ipData);
    return { allowed: false, remaining: 0 };
  }
  
  // Increment counter
  ipData.count++;
  rateLimit.set(clientIP, ipData);
  
  return { allowed: true, remaining: maxRequests - ipData.count };
}

/**
 * Rate limiting response helper
 */
export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { 
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes in seconds
      }
    }
  );
}

/**
 * Input sanitization
 */
export function sanitizeString(input: string, maxLength: number = 255): string {
  return input.trim().slice(0, maxLength);
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Validation functions
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }
  
  const sanitized = sanitizeEmail(email);
  
  if (sanitized.length > 320) { // RFC 5321 limit
    return { valid: false, error: 'Email is too long' };
  }
  
  if (!VALIDATION_RULES.EMAIL_REGEX.test(sanitized)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters` };
  }
  
  if (password.length > VALIDATION_RULES.PASSWORD_MAX_LENGTH) {
    return { valid: false, error: 'Password is too long' };
  }
  
  // Check for at least one uppercase, lowercase, number, and special character
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    return { 
      valid: false, 
      error: 'Password must contain uppercase, lowercase, number, and special character' 
    };
  }
  
  return { valid: true };
}

export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: false, error: 'Name is required' };
  }
  
  const sanitized = sanitizeString(name, VALIDATION_RULES.NAME_MAX_LENGTH);
  
  if (sanitized.length < 1) {
    return { valid: false, error: 'Name cannot be empty' };
  }
  
  if (sanitized.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return { valid: false, error: 'Name is too long' };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!nameRegex.test(sanitized)) {
    return { valid: false, error: 'Name contains invalid characters' };
  }
  
  return { valid: true };
}

/**
 * Security headers middleware
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

/**
 * Clean up old rate limit entries (call periodically)
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.WINDOW_MS;
  
  for (const [ip, data] of rateLimit.entries()) {
    if (data.lastReset < windowStart) {
      rateLimit.delete(ip);
    }
  }
}

/**
 * Validate request body structure
 */
export function validateRequestBody(
  body: any, 
  requiredFields: string[]
): { valid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === null || body[field] === undefined) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  return { valid: true };
} 