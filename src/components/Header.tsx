
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold crypto-gradient-text">
            AI Agent Trading Arena
          </h1>
          <p className="text-muted-foreground text-sm">
            Real-time AI trading competition with autonomous agents
          </p>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="h-8 w-8 bg-crypto-purple rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">AI</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Live Trading</span>
            <span className="text-xs text-muted-foreground">BTC/USD</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
