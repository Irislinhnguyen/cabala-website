// JWT Token Generator for miniOrange SSO
import jwt from 'jsonwebtoken';

// From miniOrange configuration screenshot
const JWT_SECRET = '951a13d46d67f57e472e41ecdc19d6177194f384fe95d1b7f551b6667669a5622';
const JWT_ISSUER = 'cabala-learning-system';

export interface JWTUser {
  email: string;
  username?: string; // Add optional username parameter
  firstName?: string | null;
  lastName?: string | null;
}

export function generateCabalaUsername(): string {
  // Generate UUID v4 format to match working miniOrange SSO format
  // Working example: c915c5ae-4d5b-4d59-8240-b69f37bcead5.inner-embrace
  const uuid = crypto.randomUUID();
  return `${uuid}.inner-embrace`;
}

export function generateMoodleEmail(email: string, needsUnique: boolean): string {
  if (!needsUnique) {
    return email; // Use original email
  }
  const emailPrefix = email.split('@')[0];
  const timestamp = Date.now();
  return `${emailPrefix}_${timestamp}@cabala.com.vn`;
}

export function generateJWTToken(user: JWTUser): string {
  // Use the provided username or generate one if not provided (for backward compatibility)
  const username = user.username || generateCabalaUsername();
  
  const payload = {
    sub: username,
    username: username,
    preferred_username: username,
    email: user.email,
    firstName: user.firstName || 'User',
    lastName: user.lastName || 'Student',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    iss: JWT_ISSUER
  };

  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
}

// Minimal JWT for Moodle SSO - only includes required fields
export function generateMoodleJWT(user: JWTUser): string {
  console.log('🔥 GENERATING MOODLE JWT - CODE IS RUNNING!');
  console.log('🔥 Input user data:', user);
  
  // Use the provided username or generate one if not provided
  const username = user.username || generateCabalaUsername();
  
  // Minimal payload with only required Moodle fields - using lowercase to match Moodle database
  const payload = {
    username: username,
    email: user.email,
    firstname: user.firstName || 'User',  // lowercase to match Moodle
    lastname: user.lastName || 'Student'  // lowercase to match Moodle
  };

  console.log('🔥 FINAL JWT PAYLOAD:', payload);
  
  const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
  console.log('🔥 GENERATED JWT TOKEN:', token);
  
  return token;
}

export function generateSSOUrl(token: string, redirectUrl?: string): string {
  const baseUrl = 'https://learn.cabala.com.vn/auth/sso/login.php';
  const params = new URLSearchParams({
    jwt_token: token
  });
  
  if (redirectUrl) {
    params.append('redirect', redirectUrl);
  }
  
  return `${baseUrl}?${params.toString()}`;
}

// Utility function to verify JWT tokens (for debugging)
export function verifyJWTToken(token: string): JWTUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return typeof decoded === 'object' ? decoded as JWTUser : null;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}