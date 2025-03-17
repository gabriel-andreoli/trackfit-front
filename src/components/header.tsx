
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/exercises', label: 'Exercícios' },
    { path: '/workouts', label: 'Treinos' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className="text-lg font-semibold cursor-pointer" 
            onClick={() => navigate(user ? '/dashboard' : '/')}
          >
            <span className="text-primary font-bold">Track</span>Fit
          </div>
        </div>

        {user ? (
          <div className="flex items-center">
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <NavItem 
                  key={item.path} 
                  path={item.path} 
                  label={item.label} 
                  isActive={location.pathname === item.path} 
                  onClick={() => navigate(item.path)}
                />
              ))}
            </div>

            <div className="hidden md:flex items-center ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-muted-foreground hover:text-foreground"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/register')}
            >
              Registrar
            </Button>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && user && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-background/95 backdrop-blur-sm border-t"
        >
          <div className="container mx-auto py-4 px-4 flex flex-col space-y-3">
            {navItems.map((item) => (
              <Button 
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="justify-start text-muted-foreground"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

interface NavItemProps {
  path: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ path, label, isActive, onClick }: NavItemProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "relative px-3 rounded-lg transition-all",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Button>
  );
};

export default Header;
