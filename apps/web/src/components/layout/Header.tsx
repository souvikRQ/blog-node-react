import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/auth-context.js';
import { Button } from '@/components/ui/button.js';
import { PenTool, LogOut, LayoutDashboard, LogIn, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-white hover:text-indigo-400 transition-colors">
          <PenTool className="w-5 h-5 text-indigo-400" />
          <span className="tracking-tight text-lg">PenCraft</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Hello, <span className="font-semibold text-white">{user.name}</span>
              </span>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/5 flex items-center gap-1">
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/5 flex items-center gap-1">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  Settings
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/5 flex items-center gap-1"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 text-destructive" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Header;