
import React from 'react';
import { Presentation } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-[hsl(var(--app-header-background))] text-[hsl(var(--app-header-foreground))] shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Presentation size={32} className="mr-3 text-primary" />
          <h1 className="text-2xl font-bold">Paper to Slides Genius</h1>
        </div>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
};

export default Header;
