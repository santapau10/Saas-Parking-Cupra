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
  setTheme: (newTheme: number) => void;
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
        const newTenant: Tenant = {
          _name: response.data.tenant.name,
          _plan: response.data.tenant.plan,
          _tenant_id: response.data.tenant.tenantId,
          _theme: Number(response.data.tenant.theme)
        }
        setTenant(newTenant)
        localStorage.setItem('tenant', JSON.stringify(newTenant));
        newUser._tenantId = newTenant._tenant_id;
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




  const setTheme = async (newTheme : number) => {
    if (tenant) {
      const newTenant = { ...tenant, _theme: newTheme };
      setTenant(newTenant)
      console.log(tenant)
      const body = {
        tenantId: tenant._tenant_id,
        theme: newTheme
      }
      await axios.post(`${apiUrl}/api-gateway/setTheme`, body);
      localStorage.setItem('tenant', JSON.stringify(newTenant));
    } else {
      throw new Error("There is no current tenant");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, tenant, setTheme }}>
      {children}
    </UserContext.Provider>
  );
};
