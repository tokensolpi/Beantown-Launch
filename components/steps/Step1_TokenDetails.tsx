
import React from 'react';
import type { TokenDetails } from '../../types';

interface Props {
  formData: TokenDetails;
  updateFormData: (data: Partial<TokenDetails>) => void;
}

const Step1_TokenDetails: React.FC<Props> = ({ formData, updateFormData }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'supply' || name === 'decimals') {
        updateFormData({ [name]: Number(value) >= 0 ? Number(value) : 0 });
    } else if (name === 'symbol') {
        updateFormData({ [name]: value.toUpperCase().slice(0, 10) });
    } else {
        updateFormData({ [name]: value });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Token Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Nova Token"
            className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
        </div>
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-1">Token Symbol</label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            value={formData.symbol}
            onChange={handleInputChange}
            placeholder="e.g. NOVA"
            className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition font-roboto-mono"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="supply" className="block text-sm font-medium text-gray-300 mb-1">Total Supply</label>
          <input
            type="number"
            id="supply"
            name="supply"
            value={formData.supply}
            onChange={handleInputChange}
            min="0"
            className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
        </div>
        <div>
          <label htmlFor="decimals" className="block text-sm font-medium text-gray-300 mb-1">Decimals</label>
          <input
            type="number"
            id="decimals"
            name="decimals"
            value={formData.decimals}
            onChange={handleInputChange}
            min="0"
            max="18"
            className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          placeholder="Describe your token and its purpose."
          className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition"
        ></textarea>
      </div>
    </div>
  );
};

export default Step1_TokenDetails;
