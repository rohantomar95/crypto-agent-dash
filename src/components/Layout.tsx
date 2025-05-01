
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen grid-bg">
      {/* Gradient overlay at top */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-radial from-crypto-purple/10 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <Header />
        <main className="px-4 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
