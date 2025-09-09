
import React, { useState } from 'react';
import Step1_TokenDetails from './steps/Step1_TokenDetails';
import Step2_TokenLogo from './steps/Step2_TokenLogo';
import Step3_LaunchConfig from './steps/Step3_LaunchConfig';
import Step4_Presale from './steps/Step4_Presale';
import Step5_FluidVaults from './steps/Step5_FluidVaults';
import Step6_Review from './steps/Step6_Review';
import type { TokenDetails } from '../types';
import { ChainID } from '../types';
import Modal from './Modal';
import { ALL_CHAINS } from '../constants';

interface Props {
  onLaunchComplete: (details: TokenDetails) => void;
}

const STEPS = ['Token Details', 'Logo AI', 'Launch Config', 'Pre-Launch', 'Fluid Vaults', 'Review & Deploy'];

// Types for deployment step tracking
type DeploymentStepStatus = 'pending' | 'in-progress' | 'success' | 'error';
interface DeploymentStep {
  name: string;
  status: DeploymentStepStatus;
}

// Icons for deployment steps
const StepSuccessIcon: React.FC = () => (
    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const StepErrorIcon: React.FC = () => (
    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const StepPendingIcon: React.FC = () => (
    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const StepLoader: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const TokenCreationWizard: React.FC<Props> = ({ onLaunchComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([]);

  const [formData, setFormData] = useState<TokenDetails>({
    name: '',
    symbol: '',
    decimals: 9,
    supply: 100000000,
    description: '',
    logoUrl: 'https://picsum.photos/seed/default-logo/200',
    tokenAddress: '', // Placeholder
    selectedChains: new Set([ChainID.Solana]),
    enableMEVProtection: true,
    enableVaults: false,
    collateralFactor: 75,
    liquidationBonus: 5,
    baseInterestRate: 2,
    enablePresale: false,
    presaleTokenAllocation: 10,
    hardCap: 100000,
    tgeUnlockPercentage: 25,
    vestingCliff: 6,
    vestingDuration: 18,
    enableStaking: false,
    stakingTokenAllocation: 20,
    stakingAPY: 15,
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
  
  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentError(null);
    setDeploymentStatus('Deployment in Progress...');

    const stepsToDeploy: DeploymentStep[] = [{ name: 'Initialize on Solana', status: 'pending' }];
    if(formData.enablePresale) {
        stepsToDeploy.push({ name: 'Create Presale Vault', status: 'pending' });
    }
    const chainsToBridge = Array.from(formData.selectedChains).filter(c => c !== ChainID.Solana);

    if (chainsToBridge.length > 0) {
      stepsToDeploy.push({ name: 'Bridge via Wormhole', status: 'pending' });
    }
    if (formData.enableVaults) {
      stepsToDeploy.push({ name: 'Integrate with Fluid', status: 'pending' });
    }
    if (formData.enableStaking) {
      stepsToDeploy.push({ name: 'Deploy Staking Pool', status: 'pending' });
    }
    stepsToDeploy.push({ name: 'Finalize Deployment', status: 'pending' });
    
    setDeploymentSteps(stepsToDeploy);

    const updateStepStatus = (name: string, status: DeploymentStepStatus) => {
        setDeploymentSteps(prev => prev.map(step => step.name === name ? { ...step, status } : step));
    };

    try {
        const failChance = Math.random();

        // 1. Initialize on Solana
        updateStepStatus('Initialize on Solana', 'in-progress');
        await new Promise(res => setTimeout(res, 1500));
        if (failChance < 0.1) {
            throw new Error("SOLANA_INIT_ERROR: Insufficient SOL balance for transaction fees.");
        }
        updateStepStatus('Initialize on Solana', 'success');
        
        // 2. Presale Vault
        if(formData.enablePresale) {
            updateStepStatus('Create Presale Vault', 'in-progress');
            await new Promise(res => setTimeout(res, 1000));
            updateStepStatus('Create Presale Vault', 'success');
        }

        // 3. Bridge via Wormhole
        if (chainsToBridge.length > 0) {
            updateStepStatus('Bridge via Wormhole', 'in-progress');
            await new Promise(res => setTimeout(res, 2500));
            if (failChance >= 0.1 && failChance < 0.2) {
                 throw new Error("WORMHOLE_BRIDGE_ERROR: The Wormhole network is currently congested.");
            }
            updateStepStatus('Bridge via Wormhole', 'success');
        }
        
        // 4. Integrate with Fluid
        if (formData.enableVaults) {
            updateStepStatus('Integrate with Fluid', 'in-progress');
            await new Promise(res => setTimeout(res, 2000));
            if (failChance >= 0.2 && failChance < 0.3) {
                throw new Error("FLUID_INTEGRATION_ERROR: The collateral factor provided is too high.");
            }
            updateStepStatus('Integrate with Fluid', 'success');
        }

        // 5. Staking Pool
        if (formData.enableStaking) {
            updateStepStatus('Deploy Staking Pool', 'in-progress');
            await new Promise(res => setTimeout(res, 1500));
            updateStepStatus('Deploy Staking Pool', 'success');
        }

        // 6. Finalize
        updateStepStatus('Finalize Deployment', 'in-progress');
        await new Promise(res => setTimeout(res, 1000));
        updateStepStatus('Finalize Deployment', 'success');

        const deployedData = {
            ...formData,
            tokenAddress: `mock${Date.now().toString().slice(-6)}`
        };

        setDeploymentStatus("Deployment Successful!");
        
        setTimeout(() => {
            onLaunchComplete(deployedData);
        }, 1500);

    } catch (error) {
        let userFriendlyMessage = "An unknown error occurred during deployment.";
        if (error instanceof Error) {
            if (error.message.startsWith("SOLANA_INIT_ERROR:")) {
                userFriendlyMessage = `Solana Initialization Failed: ${error.message.split(':')[1].trim()}`;
            } else if (error.message.startsWith("WORMHOLE_BRIDGE_ERROR:")) {
                userFriendlyMessage = `Wormhole Bridge Error: ${error.message.split(':')[1].trim()}`;
            } else if (error.message.startsWith("FLUID_INTEGRATION_ERROR:")) {
                userFriendlyMessage = `Fluid Integration Error: ${error.message.split(':')[1].trim()}`;
            } else {
                userFriendlyMessage = error.message;
            }
        }
        setDeploymentError(userFriendlyMessage);
        setDeploymentStatus("Deployment Failed");
        setDeploymentSteps(prev => prev.map(step => 
            step.status === 'in-progress' ? { ...step, status: 'error' } : step
        ));
    }
  };

  const resetDeployment = () => {
      setIsDeploying(false);
      setDeploymentError(null);
      setDeploymentStatus('');
      setDeploymentSteps([]);
  };


  return (
    <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl shadow-purple-900/20">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Create a new Multichain Token</h2>
        <p className="text-gray-400 mt-1">Follow the steps to launch your token on Solana and beyond.</p>
        
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
        {currentStep === 3 && <Step4_Presale formData={formData} updateFormData={updateFormData} />}
        {currentStep === 4 && <Step5_FluidVaults formData={formData} updateFormData={updateFormData} />}
        {currentStep === 5 && <Step6_Review formData={formData} />}
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
          <div className="p-6">
            <h3 className="text-xl font-semibold text-center mb-6">
                {deploymentStatus}
            </h3>

            <div className="space-y-3">
                {deploymentSteps.map((step) => {
                    const baseContainerClass = "flex items-center justify-between p-3 bg-gray-900/50 rounded-md border transition-all duration-300";
                    let statusContainerClass = '';
                    let statusTextClass = '';

                    switch(step.status) {
                        case 'in-progress':
                            statusContainerClass = 'border-purple-500/50';
                            statusTextClass = 'text-purple-300';
                            break;
                        case 'success':
                            statusContainerClass = 'border-green-500/40';
                            statusTextClass = 'text-gray-300';
                            break;
                        case 'error':
                            statusContainerClass = 'border-red-500/40 bg-red-500/10';
                            statusTextClass = 'text-red-400';
                            break;
                        case 'pending':
                        default:
                            statusContainerClass = 'border-gray-700';
                            statusTextClass = 'text-gray-500';
                            break;
                    }

                    return (
                        <div key={step.name} className={`${baseContainerClass} ${statusContainerClass}`}>
                            <span className={`font-medium text-sm ${statusTextClass}`}>
                                {step.name}
                            </span>
                            <div className="w-5 h-5 flex items-center justify-center">
                                {step.status === 'pending' && <StepPendingIcon />}
                                {step.status === 'in-progress' && <StepLoader />}
                                {step.status === 'success' && <StepSuccessIcon />}
                                {step.status === 'error' && <StepErrorIcon />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {deploymentError && (
                <>
                    <p className="text-red-400 mt-6 text-center text-sm bg-red-500/10 p-3 rounded-md border border-red-500/30">{deploymentError}</p>
                    <button 
                        onClick={resetDeployment} 
                        className="mt-6 w-full px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                    >
                        Close
                    </button>
                </>
            )}

            {!deploymentError && deploymentStatus === 'Deployment Successful!' && (
                <div className="text-center mt-6">
                    <p className="text-green-300 font-semibold text-sm">All steps completed successfully!</p>
                </div>
            )}
          </div>
      </Modal>
    </div>
  );
};

export default TokenCreationWizard;
