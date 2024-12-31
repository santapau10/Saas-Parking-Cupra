// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';  // Import User type from types folder
import { Tenant } from '../types/Tenant';

// Create the UserContext with User type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  tenant: Tenant | null;
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
  const [tenant, setTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const tenant = localStorage.getItem('tenant');
    if (storedUser && tenant) {
      setUser(JSON.parse(storedUser));
      setTenant(JSON.parse(tenant));
    }
  }, []);

  // Update user in context and localStorage
  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser)); // Persist user to localStorage
      const newTenant: Tenant = { // TODO : we currently create default tenant, as we dont have the getTenant route yet
        _name: 'testTenant',
        _plan: 'enterprise',
        _tenant_id: newUser?._tenantId,
        _theme: 9
      }
      setTenant(newTenant)
      localStorage.setItem('tenant', JSON.stringify(newTenant));
    } else {
      localStorage.removeItem('user'); // Remove user from localStorage
      localStorage.removeItem('tenant')
      setTenant(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, tenant }}>
      {children}
    </UserContext.Provider>
  );
};
