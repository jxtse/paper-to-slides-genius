
import React from 'react';
import { Presentation } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-teal-green text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-mint/20 p-2 rounded-md mr-4">
             <Presentation size={28} className="text-mint" />
          </div>
          <h1 className="text-2xl font-bold text-white">Paper to Slides Genius</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
