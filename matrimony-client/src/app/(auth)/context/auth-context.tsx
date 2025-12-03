"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { setCookie } from "@/utils/setCookie";
import { getCookie } from "@/utils/getToken";

interface UserData {
  userId: string;
  name: string;
  email: string;
  role?: string;
  hasBiodata?: boolean;
  subscriptionType?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  refreshAuth: () => void;
  storeAuthData: (
    token: string,
    userData?: Partial<UserData>,
    rememberMe?: boolean
  ) => UserData;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface DecodedToken {
  userId: string;
  email: string;
  role?: string;
  exp: number;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const storeAuthData = useCallback(
    (
      token: string,
      userData: Partial<UserData> = {},
      rememberMe: boolean = false
    ): UserData => {
      try {
        // JWT decode করে user data বের করা
        const decoded = jwtDecode<DecodedToken>(token);

        // User object তৈরি করা decoded data + additional userData দিয়ে
        const userToStore: UserData = {
          userId: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role || userData.role || "user",
          hasBiodata: userData.hasBiodata || false,
          subscriptionType: userData.subscriptionType || "free",
          gender: userData.gender,
          ...userData,
        };

        // Context state update করা
        setUser(userToStore);
        setToken(token);

        // Cookie এ store করা
        const days = rememberMe ? 30 : 7;
        setCookie("token", token, days);
        setCookie("user", JSON.stringify(userToStore), days);
        setCookie("userRole", userToStore?.role || "user", days);
        setCookie(
          "hasBiodata",
          userToStore.hasBiodata ? "true" : "false",
          days
        );
        setCookie(
          "subscriptionType",
          userToStore.subscriptionType || "free",
          days
        );

        console.log("Auth data stored successfully:", userToStore);
        return userToStore;
      } catch (error) {
        console.error("Error storing auth data:", error);
        clearAuthData();
        throw new Error("Failed to store authentication data");
      }
    },
    []
  );

  // Clear all auth data
  const clearAuthData = useCallback(() => {
    setUser(null);
    setToken(null);
    clearAllCookies();
  }, []);

  // Validate token and check expiration
  const isValidToken = useCallback((tokenToCheck: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(tokenToCheck);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }, []);

  // Refresh auth state from cookies - app load হলে call হবে
  const refreshAuth = useCallback(() => {
    if (typeof window === "undefined") return;
    
    const tokenFromCookie = getCookie("token");
    let userDataStr = getCookie("user");

    console.log("refreshAuth called - token:", tokenFromCookie ? "EXISTS" : "MISSING");
    console.log("refreshAuth called - user cookie:", userDataStr ? "EXISTS" : "MISSING");

    if (tokenFromCookie && isValidToken(tokenFromCookie)) {
      try {
        let parsedUser: UserData | null = null;
        
        // Try to parse user cookie if exists
        if (userDataStr) {
          // Handle URL-encoded JSON (server may encode it)
          try {
            userDataStr = decodeURIComponent(userDataStr);
          } catch {
            // Already decoded, continue
          }
          parsedUser = JSON.parse(userDataStr);
        }
        
        // If user cookie parsing failed, decode from JWT token
        if (!parsedUser) {
          console.log("User cookie missing or invalid, decoding from token...");
          const decoded = jwtDecode<DecodedToken & { hasBiodata?: boolean; subscriptionType?: string; gender?: string }>(tokenFromCookie);
          parsedUser = {
            userId: decoded.userId,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role || "user",
            hasBiodata: decoded.hasBiodata || false,
            subscriptionType: decoded.subscriptionType || "free",
            gender: decoded.gender,
          };
        }
        
        console.log("Auth restored from cookies:", parsedUser);
        setUser(parsedUser);
        setToken(tokenFromCookie);
      } catch (err) {
        console.error("Error parsing auth data:", err);
        clearAuthData();
      }
    } else if (tokenFromCookie) {
      // Token exists but invalid/expired
      console.log("Token invalid or expired, clearing auth...");
      clearAuthData();
    }
  }, [isValidToken, clearAuthData]);

  // Check auth status on mount
  useEffect(() => {
    refreshAuth();
    setLoading(false);

    // Token expiration check every 5 minutes
    const intervalId = setInterval(() => {
      const currentToken = getCookie("token");
      if (currentToken && !isValidToken(currentToken)) {
        console.log("Token expired, logging out...");
        logout();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [refreshAuth, isValidToken]);

  // Enhanced login function যা API call করে এবং data store করে
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // API call
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.success && data.data) {
        const { user: userData, token: userToken } = data.data;

        // Use your storeAuthData function
        storeAuthData(userToken, userData, credentials.rememberMe);

        // console.log("Login successful with storeAuthData:", userData);
      } else {
        throw new Error("Invalid response format");
      }
       {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during login";
      setError(errorMessage);
      clearAuthData();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced logout function
  const logout = async (): Promise<void> => {
    setLoading(true);

    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      // Clear everything regardless of API success
      clearAuthData();
      setError(null);
      setLoading(false);

      // Redirect to login
      window.location.href = "/login";
    }
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    loading,
    error,
    clearError,
    refreshAuth,
    storeAuthData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Cookie utility functions

function deleteCookie(name: string) {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? ";secure"
      : "";
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/${secure};samesite=strict`;
}

function clearAllCookies() {
  const cookiesToClear = [
    "token",
    "user",
    "userRole",
    "hasBiodata",
    "subscriptionType",
  ];
  cookiesToClear.forEach(deleteCookie);
}
