import { verifyToken, AuthUser } from '@/lib/auth';

export interface AdminAuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: AuthUser | null;
  error?: string;
}

export function getAdminAuth(token: string | null): AdminAuthResult {
  if (!token) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      error: 'No authentication token provided'
    };
  }

  const user = verifyToken(token);
  
  if (!user) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      error: 'Invalid authentication token'
    };
  }

  const isAdmin = user.role === 'ADMIN';
  
  return {
    isAuthenticated: true,
    isAdmin,
    user,
    error: isAdmin ? undefined : 'Access denied: Admin role required'
  };
}

export function requireAdminAuth(token: string | null): AuthUser {
  const authResult = getAdminAuth(token);
  
  if (!authResult.isAuthenticated) {
    throw new Error(authResult.error || 'Authentication required');
  }
  
  if (!authResult.isAdmin) {
    throw new Error(authResult.error || 'Admin access required');
  }
  
  return authResult.user!;
}

// Client-side admin authentication helper
export function useAdminAuth() {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, isAdmin: false, user: null };
  }

  const token = localStorage.getItem('auth_token');
  return getAdminAuth(token);
}