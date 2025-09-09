
import React, { useMemo } from 'react';
import type { TokenDetails } from '../../types';
import { ALL_CHAINS } from '../../constants';

interface Props {
  formData: TokenDetails;
}

const Step4_Review: React.FC<Props> = ({ formData }) => {
    
  const selectedChainDetails = useMemo(() => {
    return ALL_CHAINS.filter(chain => formData.selectedChains.has(chain.id));
  }, [formData.selectedChains]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold text-center text-purple-300">Review Your Token</h3>
      <p className="text-center text-gray-400">Please confirm all details are correct before deploying. This action is irreversible.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2 flex flex-col items-center p-6 bg-gray-700/30 rounded-lg">
            <img src={formData.logoUrl} alt="Token Logo" className="w-32 h-32 rounded-full shadow-lg border-2 border-purple-500" />
            <h4 className="text-2xl font-bold mt-4">{formData.name}</h4>
            <p className="text-gray-400 font-roboto-mono">${formData.symbol}</p>
        </div>

        <div className="md:col-span-3 p-6 bg-gray-700/30 rounded-lg space-y-3">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Total Supply:</span>
            <span className="font-roboto-mono">{formData.supply.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Decimals:</span>
            <span className="font-roboto-mono">{formData.decimals}</span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">MEV Protection:</span>
            <span className={formData.enableMEVProtection ? 'text-green-400' : 'text-red-400'}>{formData.enableMEVProtection ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div>
            <span className="text-gray-400 block mb-2">Deploying to:</span>
            <div className="flex flex-wrap gap-2">
              {selectedChainDetails.map(chain => (
                <div key={chain.id} className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full text-sm">
                  <chain.logo className="w-4 h-4" />
                  <span>{chain.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-300">Description:</h4>
        <p className="text-gray-400 mt-1 bg-gray-700/30 p-4 rounded-lg text-sm leading-relaxed">
            {formData.description || 'No description provided.'}
        </p>
      </div>

    </div>
  );
};

export default Step4_Review;
