
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProtectedPage: React.FC = () => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate('/auth'); // Redirect to login if not authenticated
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    // Should be redirected by useEffect, but as a fallback
    return null; 
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">Protected Content</h1>
        <p className="text-lg text-muted-foreground">
          This page is only visible to logged-in users.
        </p>
        <p className="mt-4">Your email: {session.user.email}</p>
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedPage;
