
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-teal-green/10 text-teal-green py-6 mt-auto">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {currentYear} Paper to Slides Genius. All rights reserved.</p>
        <p className="text-sm mt-1 opacity-70">Powered by AI & Lovable.dev</p>
      </div>
    </footer>
  );
};

export default Footer;
