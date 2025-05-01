
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen grid-bg relative">
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-radial from-crypto-purple/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-radial from-crypto-blue/10 to-transparent pointer-events-none" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full bg-crypto-purple/5 blur-3xl animate-pulse"></div>
        <div className="absolute top-[60%] right-[15%] w-40 h-40 rounded-full bg-crypto-blue/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-24 h-24 rounded-full bg-crypto-orange/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
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
