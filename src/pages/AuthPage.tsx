
import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  if (session) {
     // Already handled by useEffect, but good for clarity or if redirect fails
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-md p-8 bg-card shadow-xl rounded-lg border border-border">
          <h2 className="text-2xl font-bold text-center text-foreground mb-6">Login or Sign Up</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'github']} // Example providers
            redirectTo={window.location.origin + '/'} // Redirect after successful login
            theme="dark" // Or "light" or "default" based on your app's theme
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
