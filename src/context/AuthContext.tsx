
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';
import axios from "axios";
// import { User, User } from 'lucide-react';
import Endpoints from '@/helpers/endpoints';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setisAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setisAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const { data } = await axios.post(Endpoints.LOGIN, { emailOrUsername, password });

      const user: User = {
        userId: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
        token: data.token
      };
  
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data } = await axios.post(Endpoints.REGISTER, { name, email, password });
  
      const user: User = {
        userId: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
        token: data.token
      };

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao registrar usuário");
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
