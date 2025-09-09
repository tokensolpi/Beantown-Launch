
import React from 'react';
import { ALL_CHAINS } from '../constants';
import type { Chain, ChainID } from '../types';

interface Props {
  selectedChains: Set<ChainID>;
  onChainSelect: (chainId: ChainID) => void;
}

const ChainSelector: React.FC<Props> = ({ selectedChains, onChainSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {ALL_CHAINS.map((chain: Chain) => {
        const isSelected = selectedChains.has(chain.id);
        const isSolana = chain.id === 'solana';
        
        return (
          <button
            key={chain.id}
            type="button"
            onClick={() => !isSolana && onChainSelect(chain.id)}
            disabled={isSolana}
            className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center space-y-3 transition-all duration-200
              ${isSolana ? 'bg-gray-700 border-purple-500 cursor-not-allowed opacity-80' : 
                isSelected ? 'bg-purple-600/30 border-purple-500 ring-2 ring-purple-500' : 
                'bg-gray-700/50 border-gray-600 hover:border-purple-400'
              }
            `}
          >
            <chain.logo className="w-10 h-10" />
            <span className="font-semibold text-sm">{chain.name}</span>
            {isSolana && (
              <span className="text-xs text-purple-300 absolute -top-2 bg-purple-600 px-2 py-0.5 rounded-full">
                Base
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ChainSelector;
