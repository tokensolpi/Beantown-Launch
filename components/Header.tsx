import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'create' | 'dex') => void;
}

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleConnectWallet = () => {
    setIsConnected(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className="flex items-center space-x-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-400">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-xl font-bold tracking-tight">
                  Twisted<span className="text-purple-400">Divergence</span>
                </h1>
            </button>
            <nav className="hidden md:flex items-center space-x-6">
                <button onClick={() => onNavigate('dex')} className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">DEX</button>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                        Launchpad <ChevronDownIcon className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 animate-fade-in-up">
                            <a onClick={() => { onNavigate('home'); setIsDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer">Explore Projects</a>
                            <a onClick={() => { onNavigate('create'); setIsDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer">Create Token</a>
                        </div>
                    )}
                </div>
            </nav>
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