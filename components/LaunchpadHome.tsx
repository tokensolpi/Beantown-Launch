import React from 'react';
import type { TokenDetails } from '../types';
import { ALL_CHAINS } from '../constants';

interface Props {
    launchedTokens: TokenDetails[];
    onViewToken: (token: TokenDetails) => void;
    onCreateToken: () => void;
}

const LaunchpadHome: React.FC<Props> = ({ launchedTokens, onViewToken, onCreateToken }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Welcome to Twisted Divergence</h1>
                <p className="mt-2 text-lg text-gray-400">The premier platform for launching multichain tokens on Solana and beyond.</p>
                 <button 
                    onClick={onCreateToken} 
                    className="mt-6 px-6 py-3 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                >
                    Create Your Token Now
                </button>
            </div>

            <div className="border-t border-gray-700/50 pt-8">
                <h2 className="text-2xl font-bold mb-6">Recently Launched Projects</h2>
                {launchedTokens.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {launchedTokens.map(token => (
                            <div key={token.symbol} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col hover:border-purple-500 transition-all duration-300 group">
                                <div className="flex items-center gap-4">
                                    <img src={token.logoUrl} alt={`${token.name} Logo`} className="w-16 h-16 rounded-full border-2 border-gray-600 group-hover:border-purple-500" />
                                    <div>
                                        <h3 className="text-xl font-bold">{token.name}</h3>
                                        <p className="font-roboto-mono text-gray-400">${token.symbol}</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mt-4 flex-grow">
                                    {token.description.length > 100 ? `${token.description.substring(0, 100)}...` : token.description}
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <div className="flex flex-wrap gap-2">
                                        {ALL_CHAINS.filter(c => token.selectedChains.has(c.id)).slice(0, 4).map(chain => (
                                            <div key={chain.id} className="p-1.5 bg-gray-700 rounded-full">
                                                <chain.logo className="w-4 h-4" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => onViewToken(token)} className="w-full mt-6 px-4 py-2 text-sm font-semibold bg-gray-700 rounded-md hover:bg-purple-600 transition-colors">
                                    View Token
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-dashed border-gray-600">
                        <p className="text-gray-400">No projects have been launched yet.</p>
                        <button onClick={onCreateToken} className="mt-4 text-purple-400 hover:text-purple-300 font-semibold">
                            Be the first to launch!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LaunchpadHome;