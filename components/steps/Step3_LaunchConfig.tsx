
import React from 'react';
import type { TokenDetails } from '../../types';
import type { ChainID } from '../../types';
import ChainSelector from '../ChainSelector';
import BondingCurveChart from '../BondingCurveChart';

interface Props {
  formData: TokenDetails;
  updateFormData: (data: Partial<TokenDetails>) => void;
}

const Step3_LaunchConfig: React.FC<Props> = ({ formData, updateFormData }) => {
  const handleChainSelect = (chainId: ChainID) => {
    const newSelectedChains = new Set(formData.selectedChains);
    if (newSelectedChains.has(chainId)) {
      newSelectedChains.delete(chainId);
    } else {
      newSelectedChains.add(chainId);
    }
    updateFormData({ selectedChains: newSelectedChains });
  };
  
  const toggleMEVProtection = () => {
    updateFormData({ enableMEVProtection: !formData.enableMEVProtection });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold mb-1">Multichain Configuration (via Wormhole)</h3>
        <p className="text-sm text-gray-400 mb-4">Select which chains to launch your token on. Solana is the base chain.</p>
        <ChainSelector selectedChains={formData.selectedChains} onChainSelect={handleChainSelect} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Launch Settings</h3>
        <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between border border-gray-600">
          <div>
            <h4 className="font-medium">MEV Protection</h4>
            <p className="text-sm text-gray-400">Protect your launch from front-running bots.</p>
          </div>
          <button
            type="button"
            onClick={toggleMEVProtection}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
              formData.enableMEVProtection ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                formData.enableMEVProtection ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-1">Bonding Curve Preview</h3>
        <p className="text-sm text-gray-400 mb-4">Your token will be launched using a bonding curve to establish initial price and liquidity.</p>
        <div className="h-64 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <BondingCurveChart />
        </div>
      </div>
    </div>
  );
};

export default Step3_LaunchConfig;
