import jwt from 'jsonwebtoken';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role?: string;
}

// Helper function to get JWT_SECRET with proper error handling
function getJWTSecret(): string {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required for authentication');
  }
  return JWT_SECRET;
}

export function generateToken(user: AuthUser): string {
  const secret = getJWTSecret();
  return jwt.sign(user, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const secret = getJWTSecret();
    const decoded = jwt.verify(token, secret);
    // Ensure the decoded token has the expected structure
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      return decoded as AuthUser;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function getAuthUser(token: string): AuthUser | null {
  return verifyToken(token);
}

// Client-side utilities
export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export function setStoredToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

export function removeStoredToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

export function isAuthenticated(): boolean {
  const token = getStoredToken();
  if (!token) return false;
  
  const user = verifyToken(token);
  return user !== null;
}

export function getCurrentUser(): AuthUser | null {
  const token = getStoredToken();
  if (!token) return null;
  
  return verifyToken(token);
}

// Logout function
export async function logout(): Promise<void> {
  const token = getStoredToken();
  
  try {
    // Call logout API if token exists
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Logout API call failed:', error);
    // Continue with local cleanup even if API fails
  }
  
  // Always clear local storage
  removeStoredToken();
}