
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectWallet = () => {
    setIsConnected(true);
  };

  return (
    <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-400">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-xl font-bold tracking-tight">
              Nova<span className="text-purple-400">Launch</span>
            </h1>
          </div>
          <button
            onClick={handleConnectWallet}
            disabled={isConnected}
            className="px-4 py-2 text-sm font-semibold bg-purple-600 rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isConnected ? '4AbC...XyZ' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
