import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Define a more specific type for user
  login: (user: any) => void; // Define a more specific type for user
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const login = (user: any) => {
    // Implement login logic
  };

  const logout = () => {
    // Implement logout logic
  };

  const value = {
    isAuthenticated: false, // This should be dynamic based on authentication state
    user: null, // This should be dynamic based on the logged in user
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
