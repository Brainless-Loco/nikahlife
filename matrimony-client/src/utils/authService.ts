// utils/authService.ts
import { getCookie } from '@/utils/getToken';
import { jwtDecode } from 'jwt-decode';

export interface UserData {
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  hasBiodata?: boolean;
  subscriptionType?: string;
  [key: string]: unknown;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  success: boolean;
  data: {
    user: UserData;
    token: string;
  };
  error?: string;
}

class AuthService {
  /**
   * Login user by calling the Next.js API route
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify(credentials),
      });
      console.log(response)
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      return data;
       {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  }

  /**
   * Logout user and clear auth data
   */
  async logout(): Promise<void> {
    try {
      // Call logout API if you have one
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear auth data regardless of API call success
      this.clearAuthData();
    }
  }

  /**
   * Clear authentication data from cookies
   */
  clearAuthData(): void {
    const cookiesToClear = [
      'token',
      'user',
      'userRole',
      'hasBiodata',
      'subscriptionType',
    ];

    cookiesToClear.forEach(cookieName => {
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
    });

    // Redirect to login page or home page
    window.location.href = '/login';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = getCookie('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        this.clearAuthData();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Token decode error:', error);
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Get current user data from cookies
   */
  getCurrentUser(): UserData | null {
    try {
      const userCookie = getCookie('user');
      if (!userCookie) return null;

      return JSON.parse(userCookie);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Get user role
   */
  getUserRole(): string {
    return getCookie('userRole') || 'user';
  }

  /**
   * Check if user has biodata
   */
  getHasBiodata(): boolean {
    return getCookie('hasBiodata') === 'true';
  }

  /**
   * Get subscription type
   */
  getSubscriptionType(): string {
    return getCookie('subscriptionType') || 'free';
  }

  /**
   * Get token from cookies
   */
  getToken(): string | null {
    return getCookie('token');
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return roles.includes(userRole);
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export default for easier imports
export default authService;