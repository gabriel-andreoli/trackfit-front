
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, you'd call an API
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network request
      
      // Simple validation for demo purposes
      if (email === 'demo@example.com' && password === 'password') {
        const newUser = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com'
        };
        
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      toast({
        title: "Falha no login",
        description: error instanceof Error ? error.message : "Ocorreu um erro durante o login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, you'd call an API
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network request
      
      // Simple validation for demo purposes
      if (email === 'demo@example.com') {
        throw new Error('Este email já está em uso');
      }
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      toast({
        title: "Registro concluído",
        description: "Sua conta foi criada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Falha no registro",
        description: error instanceof Error ? error.message : "Ocorreu um erro durante o registro",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
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
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
