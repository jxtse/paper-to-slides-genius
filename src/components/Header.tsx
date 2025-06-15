
import React from 'react';
import { Presentation } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-primary/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Presentation size={32} className="mr-3 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
          <h1 className="text-2xl font-bold tracking-wider uppercase">Paper to Slides Genius</h1>
        </div>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
};

export default Header;
