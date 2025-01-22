// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';  // Import User type from types folder
import { Tenant } from '../types/Tenant';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";

// Create the UserContext with User type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  tenant: Tenant | null;
  setTheme: (newTheme: number) => void;
  token: string | null;
  apiUrl: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to easily access the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component to provide user data in context
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load user from localStorage on initial load
  const originalApiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>(originalApiUrl);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTenant = localStorage.getItem('tenant');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedTenant) {
      setTenant(JSON.parse(storedTenant));
      if (tenant?._plan == 'enterprise' || tenant?._plan == 'standard') {
        handleSetIp(tenant);
      }
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSetIp = async (tenant: Tenant) => {
    try {
      const response = await axios.get(`${apiUrl}/api-gateway/api/${tenant._plan}/${tenant._tenant_id}`);
      const newUrl = "http://" + response.data.ip;
      setApiUrl(newUrl);
    } catch (err: any) {
      toast.error("Failed to fetch ip from tenant.");
    }
  }

  // Update user in context and localStorage
  const updateUser = async (newUser: User | null) => {
    if (newUser) {
      const storedTenant = localStorage.getItem('tenant');
      if (storedTenant) {
        setTenant(JSON.parse(storedTenant))
        if (tenant?._plan == 'enterprise' || tenant?._plan == 'standard') {
          handleSetIp(tenant);
        }
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
        if (newTenant._plan == 'enterprise' || tenant?._plan == 'standard') {
          handleSetIp(newTenant);
        }
        localStorage.setItem('tenant', JSON.stringify(newTenant));
        newUser._tenantId = newTenant._tenant_id;
        } catch (err: any) {
          toast.error("Failed to get tenant from user.");
        }
      }

      const token = localStorage.getItem('token');
      if (token) {
        setToken(token);
      } else {
        try {
          const reqBody = {
            tenant: newUser._tenantId,
            role: newUser._role,
          }
          const response = await axios.post(`${apiUrl}/api-gateway/getToken`, reqBody);
          const responseToken = response.data.token;
          setToken(responseToken);
          localStorage.setItem('token', responseToken);
        } catch (err:any) {
          toast.error("Failed to get token.");
        }
      }

      localStorage.setItem('user', JSON.stringify(newUser)); // Persist user to localStorage
    
    } else {
      localStorage.removeItem('user'); // Remove user from localStorage
      localStorage.removeItem('tenant');
      setTenant(null);
      localStorage.removeItem('token');
      setToken(null);
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
      await axios.post(`${apiUrl}/api-gateway/setTheme`, body, {
        headers: {
          "tenant_plan": tenant?._plan,
          "Authorization": `Bearer ${token}`,
        },
      });
      localStorage.setItem('tenant', JSON.stringify(newTenant));
    } else {
      throw new Error("There is no current tenant");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, tenant, setTheme, token, apiUrl }}>
      {children}
    </UserContext.Provider>
  );
};
