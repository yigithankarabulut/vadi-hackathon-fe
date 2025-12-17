
import { createContext, useState, useContext, type ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  access_token: string;
  role: 'admin' | 'driver';
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  setContext: (userData: User) => void;
  removeContext: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const setContext = (userData: User) => {
    setUser(userData);
  };

  const removeContext = () => {
    setUser(null);
  };

  // Provider'a geçilecek değerler
  const value: UserContextType = {
    user,
    isLoggedIn: !!user, // user varsa true, yoksa false
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