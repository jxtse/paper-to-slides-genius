
import React from 'react';
import { Presentation, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <header className="bg-[hsl(var(--app-header-background))] text-[hsl(var(--app-header-foreground))] shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Presentation size={32} className="mr-3 text-primary" />
          <h1 className="text-2xl font-bold">Paper to Slides Genius</h1>
        </Link>
        <div>
          {isLoading ? (
            <Button variant="ghost" disabled>Loading...</Button>
          ) : user ? (
            <>
              <Link to="/protected" className="mr-4">
                <Button variant="ghost">Protected Page</Button>
              </Link>
              <Button onClick={handleLogout} variant="outline">
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate('/auth')} variant="default">
              <LogIn size={18} className="mr-2" />
              Login / Sign Up
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
