import React, { useState } from 'react';
import Header from './components/Header';
import TokenCreationWizard from './components/TokenCreationWizard';
import TokenPage from './components/TokenPage';
import LaunchpadHome from './components/LaunchpadHome';
import DexPage from './components/DexPage';
import type { TokenDetails } from './types';
import { MOCK_TOKENS } from './constants';

type Page = 'home' | 'create' | 'token' | 'dex';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [launchedTokens, setLaunchedTokens] = useState<TokenDetails[]>(MOCK_TOKENS);
  const [viewingToken, setViewingToken] = useState<TokenDetails | null>(null);


  const handleLaunchComplete = (details: TokenDetails) => {
    const newTokens = [details, ...launchedTokens];
    setLaunchedTokens(newTokens);
    setViewingToken(details);
    setCurrentPage('token');
  };

  const handleViewToken = (token: TokenDetails) => {
    setViewingToken(token);
    setCurrentPage('token');
  }

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <LaunchpadHome launchedTokens={launchedTokens} onViewToken={handleViewToken} onCreateToken={() => handleNavigate('create')} />;
      case 'create':
        return <TokenCreationWizard onLaunchComplete={handleLaunchComplete} />;
      case 'dex':
        return <DexPage />;
      case 'token':
        if (viewingToken) {
          return <TokenPage tokenDetails={viewingToken} onNavigate={handleNavigate} />;
        }
        // Fallback to home if no token is being viewed
        setCurrentPage('home');
        return <LaunchpadHome launchedTokens={launchedTokens} onViewToken={handleViewToken} onCreateToken={() => handleNavigate('create')} />;
      default:
        return <div>Page not found</div>;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-purple-500/30">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl filter opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/20 rounded-full blur-3xl filter opacity-50 animate-pulse animation-delay-4000"></div>
      </div>
      <div className="relative z-10">
        <Header onNavigate={handleNavigate} />
        <main className="container mx-auto px-4 py-8 md:py-12">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
