
import React, { useState } from 'react';
import Header from './components/Header';
import TokenCreationWizard from './components/TokenCreationWizard';
import TokenPage from './components/TokenPage';
import type { TokenDetails } from './types';
import { ChainID } from './types';
import { ALL_CHAINS } from './constants';

const App: React.FC = () => {
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);

  const handleLaunchComplete = (details: TokenDetails) => {
    setTokenDetails(details);
  };

  const handleCreateAnother = () => {
    setTokenDetails(null);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-purple-500/30">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl filter opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/20 rounded-full blur-3xl filter opacity-50 animate-pulse animation-delay-4000"></div>
      </div>
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-8 md:py-12">
          {!tokenDetails ? (
            <TokenCreationWizard onLaunchComplete={handleLaunchComplete} />
          ) : (
            <TokenPage tokenDetails={tokenDetails} onCreateAnother={handleCreateAnother} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
