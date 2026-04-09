import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import API from '../services/api';

export type UserRole = 'user' | 'trainer' | 'gym';

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  bio?: string;
  fitnessGoals?: string;
  followers?: string[];
  following?: string[];
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('profile');
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          // Verify token validity with a backend call
          await API.get('/auth/me');
        }
      } catch (error) {
        console.error('Failed to load user from localStorage or verify token:', error);
        localStorage.removeItem('profile');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('profile', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('profile');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
