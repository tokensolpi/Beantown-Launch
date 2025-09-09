
import React, { useState } from 'react';
import Step1_TokenDetails from './steps/Step1_TokenDetails';
import Step2_TokenLogo from './steps/Step2_TokenLogo';
import Step3_LaunchConfig from './steps/Step3_LaunchConfig';
import Step4_Review from './steps/Step4_Review';
import type { TokenDetails } from '../types';
import { ChainID } from '../types';
import Modal from './Modal';
import Loader from './Loader';

interface Props {
  onLaunchComplete: (details: TokenDetails) => void;
}

const STEPS = ['Token Details', 'Logo AI', 'Launch Config', 'Review & Deploy'];

const TokenCreationWizard: React.FC<Props> = ({ onLaunchComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [formData, setFormData] = useState<TokenDetails>({
    name: '',
    symbol: '',
    decimals: 9,
    supply: 1000000,
    description: '',
    logoUrl: 'https://picsum.photos/seed/default-logo/200',
    selectedChains: new Set([ChainID.Solana]),
    enableMEVProtection: true,
  });

  const updateFormData = (data: Partial<TokenDetails>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
  
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() !== '' && formData.symbol.trim() !== '' && formData.supply > 0;
      case 1:
        return formData.logoUrl.startsWith('data:image/') || formData.logoUrl.startsWith('https://');
      case 2:
        return formData.selectedChains.size > 0;
      default:
        return true;
    }
  };
  
  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
        setIsDeploying(false);
        onLaunchComplete(formData);
    }, 4000); // Simulate deployment and Wormhole bridging
  };


  return (
    <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl shadow-purple-900/20">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Create a new Multichain Token</h2>
        <p className="text-gray-400 mt-1">Follow the steps to launch your token on Solana and beyond.</p>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between mb-1">
            {STEPS.map((step, index) => (
              <div key={step} className={`text-xs font-medium ${index <= currentStep ? 'text-purple-400' : 'text-gray-500'}`}>
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${((currentStep) / (STEPS.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {currentStep === 0 && <Step1_TokenDetails formData={formData} updateFormData={updateFormData} />}
        {currentStep === 1 && <Step2_TokenLogo formData={formData} updateFormData={updateFormData} />}
        {currentStep === 2 && <Step3_LaunchConfig formData={formData} updateFormData={updateFormData} />}
        {currentStep === 3 && <Step4_Review formData={formData} />}
      </div>

      <div className="p-6 border-t border-gray-700 flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="px-6 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleDeploy}
            className="px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-500 transition-colors"
          >
            Deploy Token
          </button>
        )}
      </div>

      <Modal isOpen={isDeploying}>
          <div className="text-center p-6">
              <Loader />
              <h3 className="text-xl font-semibold mt-4">Deployment in Progress...</h3>
              <p className="text-gray-400 mt-2">Initializing token on Solana...</p>
              <p className="text-gray-400">Configuring Wormhole bridge for multichain access...</p>
              <p className="text-gray-400">Please wait, this may take a moment.</p>
          </div>
      </Modal>
    </div>
  );
};

export default TokenCreationWizard;
