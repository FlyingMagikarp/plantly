import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, LoginCredentials, RegisterData } from '~/common/types/auth';
import { API_URL, USER_ROLE_ADMIN } from "~/common/constants/constants";

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {
    throw new Error('AuthContext not initialized');
  },
  register: async () => {
    throw new Error('AuthContext not initialized');
  },
  logout: () => {
  },
  isAuthenticated: false,
  isAdmin: false,
  fetchUserData: async () => {
    throw new Error('AuthContext not initialized');
  },
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export const AuthProvider = ({children, initialUser}: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser ?? null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(initialUser?.role === USER_ROLE_ADMIN);


  const fetchUserData = useCallback(async (): Promise<User | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/me`, {
        credentials: 'include'
      });

      if (!response.ok) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        console.log('response')
        throw new Error('Failed to fetch user data');
      }

      const user = await response.json() as User;
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsAdmin(user.role === USER_ROLE_ADMIN);

      return user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({username, password}: LoginCredentials): Promise<User> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: username, password}),
        credentials: 'include', // Include cookies if your API uses them
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'LoginIndexRoute failed');
      }

      const data = await response.json() as User;
      setCurrentUser(data);
      setIsAdmin(data.role === USER_ROLE_ADMIN);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      console.error("LoginIndexRoute error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<User> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json() as User;
      return data;

    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.warn("Logout request failed (maybe already logged out)", e);
    } finally {
      setLoading(false);
    }

    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  }, []);

  const contextValue: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    fetchUserData,
  };

  return (
      <AuthContext.Provider value={contextValue}>
        {!loading && children}
      </AuthContext.Provider>
  );
};

export default AuthContext;