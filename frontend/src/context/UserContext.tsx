
import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { getCookie, removeCookie } from '../cookieManager/cookieManager';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  exp?: number;
}

export interface User {
  id: string;
  email: string;
  access_token: string;
  role: 'admin' | 'user';
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setContext: (userData: User) => void;
  removeContext: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = getCookie('access_token');
        
        if (token) {
          const decoded = jwtDecode<JwtPayload>(token);
          
          if (decoded.exp && decoded.exp * 1000 > Date.now()) {
            const userData: User = {
              id: decoded.userId,
              email: decoded.email,
              access_token: token,
              role: decoded.role,
            };
            setUser(userData);
          } else {
            removeCookie('access_token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        removeCookie('access_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const setContext = (userData: User) => {
    setUser(userData);
  };

  const removeContext = () => {
    setUser(null);
    removeCookie('access_token');
  };

  const value: UserContextType = {
    user,
    isLoggedIn: !!user,
    isLoading,
    setContext,
    removeContext,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};