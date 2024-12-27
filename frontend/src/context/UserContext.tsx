// src/context/UserContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '../types/User';

// Create the UserContext
export const UserContext = createContext<User | null>(null);

// Custom hook to easily access the user context
export const useUser = () => useContext(UserContext);

// UserProvider will accept the user data and provide it to the context
export const UserProvider: React.FC<{ user: User | null; children: ReactNode }> = ({ user, children }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};