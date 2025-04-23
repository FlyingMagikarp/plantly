export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export interface AuthState {
    currentUser: User | null;
    token: string | null;
    loading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<User>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}

export interface LoginResponse {
    token: string;
    user: User;
}