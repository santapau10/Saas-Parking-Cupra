// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';  // Import User type from types folder

// Create the UserContext with User type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to easily access the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component to provide user data in context
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load user from localStorage on initial load
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Parse user data from localStorage
    }
  }, []);

  // Update user in context and localStorage
  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser)); // Persist user to localStorage
    } else {
      localStorage.removeItem('user'); // Remove user from localStorage
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
