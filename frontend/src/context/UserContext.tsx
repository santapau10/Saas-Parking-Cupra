// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';  // Import User type from types folder
import { Tenant } from '../types/Tenant';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

// Create the UserContext with User type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  tenant: Tenant | null;
  updateTenant: (tenant: Tenant | null) => void;
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
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (tenant) {
      setTenant(JSON.parse(tenant));
    }
  }, []);

  // Update user in context and localStorage
  const updateUser = async (newUser: User | null) => {
    if (newUser) {
      const storedTenant = localStorage.getItem('tenant');
      if (storedTenant) {
        setTenant(JSON.parse(storedTenant))
        newUser._tenantId = tenant!._tenant_id; // Update newUser's _tenantId
      } else {
        try {
        const response = await axios.get(`${apiUrl}/api-gateway/getTenantFromUser/${newUser._userId}`);
        console.log(response)
        const newTenant: Tenant = {
          _name: response.data.tenant.name,
          _plan: response.data.tenant.plan,
          _tenant_id: response.data.tenant.tenantId,
          _theme: response.data.tenant.theme
        }
        setTenant(newTenant)
        localStorage.setItem('tenant', JSON.stringify(newTenant));
        newUser._tenantId = tenant!._tenant_id;
        } catch (err: any) {
          toast.error("Failed to get tenant from user.");
        }
      }
      localStorage.setItem('user', JSON.stringify(newUser)); // Persist user to localStorage
    } else {
      localStorage.removeItem('user'); // Remove user from localStorage
      localStorage.removeItem('tenant')
      setTenant(null);
    }
    setUser(newUser);
  };




  const updateTenant = (newTenant: Tenant | null) => {
    if (newTenant) {
      localStorage.setItem('tenant', JSON.stringify(newTenant));
      setTenant(newTenant)
      } else {
      localStorage.removeItem('tenant');
      setTenant(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, tenant, updateTenant }}>
      {children}
    </UserContext.Provider>
  );
};
