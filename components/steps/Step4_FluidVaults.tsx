
import React from 'react';
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

const Step4_FluidVaults: React.FC<Props> = ({ formData, updateFormData }) => {

  const handleToggleVaults = () => {
    updateFormData({ enableVaults: !formData.enableVaults });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: Number(value) });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold mb-1">Instadapp Fluid Integration</h3>
        <p className="text-sm text-gray-400 mb-4">
          Optionally, create a lending & borrowing vault for your token, powered by the Instadapp Fluid liquidity layer. 
          This allows holders to use your token as collateral.
        </p>
      </div>

      <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between border border-gray-600">
        <div>
          <h4 className="font-medium">Enable Fluid Vault</h4>
          <p className="text-sm text-gray-400">Create a market for your token on Instadapp Fluid.</p>
        </div>
        <button
          type="button"
          onClick={handleToggleVaults}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
            formData.enableVaults ? 'bg-purple-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
              formData.enableVaults ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {formData.enableVaults && (
        <div className="space-y-6 p-6 bg-gray-900/30 rounded-lg border border-gray-700 animate-fade-in">
          <h4 className="font-semibold text-purple-300">Vault Configuration</h4>
          
          {/* Collateral Factor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="collateralFactor" className="block text-sm font-medium text-gray-300">Collateral Factor (LTV)</label>
              <span className="text-purple-400 font-roboto-mono text-lg">{formData.collateralFactor}%</span>
            </div>
             <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <InfoIcon className="w-4 h-4 shrink-0" />
              The maximum amount that can be borrowed against your token as collateral.
            </p>
            <input
              type="range"
              id="collateralFactor"
              name="collateralFactor"
              min="0"
              max="90"
              step="1"
              value={formData.collateralFactor}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-purple"
            />
          </div>

          {/* Liquidation Bonus */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="liquidationBonus" className="block text-sm font-medium text-gray-300">Liquidation Bonus</label>
              <span className="text-purple-400 font-roboto-mono text-lg">{formData.liquidationBonus}%</span>
            </div>
             <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <InfoIcon className="w-4 h-4 shrink-0" />
              The discount a liquidator receives when purchasing collateral from an unhealthy vault.
            </p>
            <input
              type="range"
              id="liquidationBonus"
              name="liquidationBonus"
              min="0"
              max="20"
              step="1"
              value={formData.liquidationBonus}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-purple"
            />
          </div>

          {/* Base Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="baseInterestRate" className="block text-sm font-medium text-gray-300">Base Borrow Interest Rate</label>
              <span className="text-purple-400 font-roboto-mono text-lg">{formData.baseInterestRate}%</span>
            </div>
             <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <InfoIcon className="w-4 h-4 shrink-0" />
              The starting annual interest rate for borrowing assets from the vault.
            </p>
            <input
              type="range"
              id="baseInterestRate"
              name="baseInterestRate"
              min="0"
              max="15"
              step="0.5"
              value={formData.baseInterestRate}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-purple"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4_FluidVaults;