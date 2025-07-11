import jwt from 'jsonwebtoken';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
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