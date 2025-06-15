
import React from 'react';
import { Presentation } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header>
      <div className="container mx-auto px-6 py-6 flex items-center">
        <div className="flex items-center">
          <div className="bg-mint/20 p-2 rounded-md mr-4">
             <Presentation size={28} className="text-teal-green" />
          </div>
          <h1 className="text-2xl font-bold text-teal-green">Paper to Slides Genius</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
