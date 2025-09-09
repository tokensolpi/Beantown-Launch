
import React, { useMemo } from 'react';
import type { TokenDetails } from '../../types';

interface Props {
  formData: TokenDetails;
  updateFormData: (data: Partial<TokenDetails>) => void;
}

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const Step4_Presale: React.FC<Props> = ({ formData, updateFormData }) => {

  const handleToggle = (name: 'enablePresale' | 'enableStaking') => {
    updateFormData({ [name]: !formData[name] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: Number(value) >= 0 ? Number(value) : 0 });
  };

  const presalePrice = useMemo(() => {
    if (!formData.hardCap || !formData.presaleTokenAllocation || !formData.supply) return 0;
    const tokensForSale = formData.supply * (formData.presaleTokenAllocation / 100);
    if (tokensForSale === 0) return 0;
    return formData.hardCap / tokensForSale;
  }, [formData.hardCap, formData.presaleTokenAllocation, formData.supply]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Presale Section */}
      <div className="space-y-6">
        <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between border border-gray-600">
            <div>
              <h4 className="font-medium">Enable Pre-launch Seed Round</h4>
              <p className="text-sm text-gray-400">Raise funds before your public launch.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('enablePresale')}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                formData.enablePresale ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  formData.enablePresale ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
        </div>

        {formData.enablePresale && (
          <div className="space-y-6 p-6 bg-gray-900/30 rounded-lg border border-gray-700 animate-fade-in">
              <h4 className="font-semibold text-purple-300">Presale Configuration</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Presale Allocation */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="presaleTokenAllocation" className="text-sm font-medium text-gray-300">Token Allocation</label>
                      <span className="text-purple-400 font-roboto-mono">{formData.presaleTokenAllocation}%</span>
                    </div>
                    <input type="range" id="presaleTokenAllocation" name="presaleTokenAllocation" min="1" max="50" step="1" value={formData.presaleTokenAllocation} onChange={handleInputChange} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-purple" />
                  </div>
                   {/* Hard Cap */}
                  <div className="space-y-2">
                    <label htmlFor="hardCap" className="text-sm font-medium text-gray-300">Hard Cap (USDC)</label>
                    <input type="number" id="hardCap" name="hardCap" value={formData.hardCap} onChange={handleInputChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition" />
                  </div>
              </div>
              <div className="text-sm text-gray-400 bg-gray-700/50 p-3 rounded-md">Presale Price: <span className="font-roboto-mono text-purple-300">${presalePrice.toFixed(6)}</span> per token</div>
              
              <h4 className="font-semibold text-purple-300 pt-4 border-t border-gray-700">Vesting Schedule</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* TGE Unlock */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><label className="text-sm">TGE Unlock</label><span className="text-purple-400 font-roboto-mono">{formData.tgeUnlockPercentage}%</span></div>
                    <input type="range" name="tgeUnlockPercentage" min="0" max="100" step="1" value={formData.tgeUnlockPercentage} onChange={handleInputChange} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-purple" />
                  </div>
                  {/* Cliff */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><label className="text-sm">Cliff</label><span className="text-purple-400 font-roboto-mono">{formData.vestingCliff} M</span></div>
                    <input type="range" name="vestingCliff" min="0" max="12" step="1" value={formData.vestingCliff} onChange={handleInputChange} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-purple" />
                  </div>
                  {/* Duration */}
                   <div className="space-y-2">
                    <div className="flex justify-between items-center"><label className="text-sm">Duration</label><span className="text-purple-400 font-roboto-mono">{formData.vestingDuration} M</span></div>
                    <input type="range" name="vestingDuration" min="0" max="48" step="1" value={formData.vestingDuration} onChange={handleInputChange} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-purple" />
                  </div>
              </div>
          </div>
        )}
      </div>

      {/* Staking Section */}
      <div className="space-y-6">
        <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between border border-gray-600">
            <div>
              <h4 className="font-medium">Enable Staking at Launch</h4>
              <p className="text-sm text-gray-400">Incentivize long-term holding with rewards.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('enableStaking')}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                formData.enableStaking ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  formData.enableStaking ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
        </div>
        {formData.enableStaking && (
          <div className="space-y-6 p-6 bg-gray-900/30 rounded-lg border border-gray-700 animate-fade-in">
             <h4 className="font-semibold text-green-300">Staking Pool Configuration</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Staking Allocation */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="stakingTokenAllocation" className="text-sm font-medium text-gray-300">Staking Rewards Allocation</label>
                      <span className="text-green-400 font-roboto-mono">{formData.stakingTokenAllocation}%</span>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5"><InfoIcon className="w-4 h-4 shrink-0" />Percentage of total supply for staking rewards.</p>
                    <input type="range" id="stakingTokenAllocation" name="stakingTokenAllocation" min="1" max="50" step="1" value={formData.stakingTokenAllocation} onChange={handleInputChange} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-green" />
                  </div>
                   {/* Estimated APY */}
                  <div className="space-y-2">
                    <label htmlFor="stakingAPY" className="text-sm font-medium text-gray-300">Estimated APY</label>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5"><InfoIcon className="w-4 h-4 shrink-0" />Initial annual percentage yield for stakers.</p>
                    <div className="relative">
                        <input type="number" id="stakingAPY" name="stakingAPY" value={formData.stakingAPY} onChange={handleInputChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500 transition" />
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">%</span>
                    </div>
                  </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4_Presale;
