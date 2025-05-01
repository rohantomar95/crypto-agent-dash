
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen grid-bg relative overflow-hidden">
      {/* Enhanced background elements with more dramatic gradients */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-radial from-crypto-purple/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-radial from-crypto-blue/20 to-transparent pointer-events-none" />
      
      {/* Dynamic animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-crypto-purple/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-[50%] right-[10%] w-80 h-80 rounded-full bg-crypto-blue/10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '7s' }}></div>
        <div className="absolute bottom-[20%] left-[30%] w-56 h-56 rounded-full bg-crypto-orange/10 blur-3xl animate-pulse" style={{ animationDelay: '2.7s', animationDuration: '8s' }}></div>
        
        {/* WebGL-style grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full border-t border-l border-r border-white/5" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)' }}></div>
        </div>
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
