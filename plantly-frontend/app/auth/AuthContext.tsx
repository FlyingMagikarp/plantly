import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, LoginCredentials, RegisterData, LoginResponse } from '~/common/types/auth';

// Create auth context with a default value
const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    token: null,
    loading: true,
    login: async () => { throw new Error('AuthContext not initialized'); },
    register: async () => { throw new Error('AuthContext not initialized'); },
    logout: () => {}
});

// Hook for easy context consumption
export const useAuth = () => {
    return useContext(AuthContext);
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Function to handle login
    const login = async ({ email, password }: LoginCredentials): Promise<User> => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json() as LoginResponse;

            // Save token to localStorage and state
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setCurrentUser(data.user);

            return data.user;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    // Function to handle registration
    const register = async (userData: RegisterData): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            // Registration successful - will log in separately
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
    };

    // Check token validity and load user data on mount or token change
    useEffect(() => {
        const verifyToken = async () => {
            setLoading(true);
            if (!token) {
                setCurrentUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/user/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Token invalid');
                }

                const userData = await response.json() as User;
                setCurrentUser(userData);
            } catch (error) {
                console.error("Token verification error:", error);
                // Token is invalid - remove it and reset user
                localStorage.removeItem('token');
                setToken(null);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const contextValue: AuthContextType = {
        currentUser,
        token,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;