import React, { useMemo } from 'react';
import type { TokenDetails } from '../../types';
import { ALL_CHAINS } from '../../constants';

interface Props {
  formData: TokenDetails;
}

const Step6_Review: React.FC<Props> = ({ formData }) => {
    
  const selectedChainDetails = useMemo(() => {
    return ALL_CHAINS.filter(chain => formData.selectedChains.has(chain.id));
  }, [formData.selectedChains]);

  const presalePrice = useMemo(() => {
    if (!formData.enablePresale || !formData.hardCap || !formData.presaleTokenAllocation || !formData.supply) return 0;
    const tokensForSale = formData.supply * (formData.presaleTokenAllocation / 100);
    if (tokensForSale === 0) return 0;
    return formData.hardCap / tokensForSale;
  }, [formData]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold text-center text-purple-300">Review Your Token</h3>
      <p className="text-center text-gray-400">Please confirm all details are correct before deploying. This action is irreversible.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
        <div className="space-y-6">
            <div className="flex flex-col items-center p-6 bg-gray-700/30 rounded-lg">
                <img src={formData.logoUrl} alt="Token Logo" className="w-32 h-32 rounded-full shadow-lg border-2 border-purple-500" />
                <h4 className="text-2xl font-bold mt-4">{formData.name}</h4>
                <p className="text-gray-400 font-roboto-mono">${formData.symbol}</p>
            </div>

            <div className="p-6 bg-gray-700/30 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg text-purple-300 mb-2">Tokenomics</h4>
                <div className="flex justify-between border-b border-gray-700 pb-2"><span className="text-gray-400">Total Supply:</span><span className="font-roboto-mono">{formData.supply.toLocaleString()}</span></div>
                <div className="flex justify-between border-b border-gray-700 pb-2"><span className="text-gray-400">Decimals:</span><span className="font-roboto-mono">{formData.decimals}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">MEV Protection:</span><span className={formData.enableMEVProtection ? 'text-green-400' : 'text-red-400'}>{formData.enableMEVProtection ? 'Enabled' : 'Disabled'}</span></div>
            </div>
            
            <div className="p-6 bg-gray-700/30 rounded-lg">
                <h4 className="font-semibold text-lg text-purple-300 mb-2">Deployment Chains</h4>
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

        {/* Right Column */}
        <div className="space-y-6">
            {/* Presale Details */}
            <div className="p-6 bg-gray-700/30 rounded-lg">
                <h4 className="font-semibold text-lg text-purple-300 mb-2">Pre-Launch Sale</h4>
                <div className="flex justify-between"><span className="text-gray-400">Status:</span><span className={formData.enablePresale ? 'text-green-400' : 'text-red-400'}>{formData.enablePresale ? 'Enabled' : 'Disabled'}</span></div>
                {formData.enablePresale && (
                    <div className="pl-4 mt-2 space-y-1 text-sm border-l-2 border-gray-600">
                        <div className="flex justify-between"><span className="text-gray-400">Allocation:</span><span className="font-roboto-mono">{formData.presaleTokenAllocation}%</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Hard Cap:</span><span className="font-roboto-mono">${formData.hardCap.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Price:</span><span className="font-roboto-mono">~${presalePrice.toFixed(6)}</span></div>
                        <div className="flex justify-between pt-2 mt-1 border-t border-gray-700"><span className="text-gray-400">TGE Unlock:</span><span className="font-roboto-mono">{formData.tgeUnlockPercentage}%</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Vesting Cliff:</span><span className="font-roboto-mono">{formData.vestingCliff} Months</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Vesting Duration:</span><span className="font-roboto-mono">{formData.vestingDuration} Months</span></div>
                    </div>
                )}
            </div>
            
            {/* Staking Details */}
            <div className="p-6 bg-gray-700/30 rounded-lg">
                <h4 className="font-semibold text-lg text-green-300 mb-2">Staking Pool</h4>
                <div className="flex justify-between"><span className="text-gray-400">Status:</span><span className={formData.enableStaking ? 'text-green-400' : 'text-red-400'}>{formData.enableStaking ? 'Enabled' : 'Disabled'}</span></div>
                {formData.enableStaking && (
                    <div className="pl-4 mt-2 space-y-1 text-sm border-l-2 border-gray-600">
                        <div className="flex justify-between"><span className="text-gray-400">Rewards Allocation:</span><span className="font-roboto-mono">{formData.stakingTokenAllocation}%</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Estimated APY:</span><span className="font-roboto-mono">{formData.stakingAPY}%</span></div>
                    </div>
                )}
            </div>

             {/* Fluid Vaults */}
            <div className="p-6 bg-gray-700/30 rounded-lg">
                <h4 className="font-semibold text-lg text-blue-300 mb-2">Fluid Vaults</h4>
                <div className="flex justify-between"><span className="text-gray-400">Status:</span><span className={formData.enableVaults ? 'text-green-400' : 'text-red-400'}>{formData.enableVaults ? 'Enabled' : 'Disabled'}</span></div>
                {formData.enableVaults && (
                    <div className="pl-4 mt-2 space-y-1 text-sm border-l-2 border-gray-600">
                        <div className="flex justify-between"><span className="text-gray-400">Collateral Factor:</span><span className="font-roboto-mono">{formData.collateralFactor}%</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Liquidation Bonus:</span><span className="font-roboto-mono">{formData.liquidationBonus}%</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Base Interest Rate:</span><span className="font-roboto-mono">{formData.baseInterestRate}%</span></div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Step6_Review;
