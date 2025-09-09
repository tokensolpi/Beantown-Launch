import React, { useState, useMemo } from 'react';
import type { TokenDetails } from '../types';
import { ALL_CHAINS } from '../constants';
import SuperTradingViewChart from './charts/TradingViewChart';
import Modal from './Modal';
import Loader from './Loader';
import { TOKEN_PAGE_FEE_USD } from '../constants';

interface Props {
  tokenDetails: TokenDetails;
  onNavigate: (page: 'home' | 'create') => void;
}

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const VaultIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
        <path d="M2 20h20"></path>
    </svg>
);

const TokenPage: React.FC<Props> = ({ tokenDetails, onNavigate }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const selectedChainDetails = useMemo(() => {
    return ALL_CHAINS.filter(chain => tokenDetails.selectedChains.has(chain.id));
  }, [tokenDetails.selectedChains]);

  const handlePayForPage = () => {
    setIsPaying(true);
    setTimeout(() => {
        setIsPaying(false);
        setIsPaid(true);
    }, 2500); // Simulate payment processing
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
            <h2 className="text-2xl font-bold text-green-300 flex items-center justify-center gap-3">
                <CheckCircleIcon className="w-8 h-8"/>
                Deployment Successful!
            </h2>
            <p className="text-gray-300 mt-2">
                Your token <span className="font-bold text-white">{tokenDetails.name} (${tokenDetails.symbol})</span> is now live on Solana, bridged via Wormhole, and integrated with the Instadapp Fluid liquidity layer.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                    <img src={tokenDetails.logoUrl} alt={`${tokenDetails.name} Logo`} className="w-32 h-32 rounded-full mx-auto shadow-lg shadow-purple-900/50 border-2 border-purple-500" />
                    <h3 className="text-3xl font-bold text-center mt-4">{tokenDetails.name}</h3>
                    <p className="text-center text-gray-400 text-lg font-roboto-mono">${tokenDetails.symbol}</p>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                    <h4 className="font-bold text-lg mb-3">Token Details</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Token Address:</span> <span className="font-roboto-mono truncate">{tokenDetails.tokenAddress}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Decimals:</span> <span className="font-roboto-mono">{tokenDetails.decimals}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Total Supply:</span> <span className="font-roboto-mono">{tokenDetails.supply.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">MEV Protection:</span> <span className={tokenDetails.enableMEVProtection ? 'text-green-400' : 'text-red-400'}>{tokenDetails.enableMEVProtection ? 'Enabled' : 'Disabled'}</span></div>
                    </div>
                </div>
                 <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                    <h4 className="font-bold text-lg mb-3">Live on {selectedChainDetails.length} Chains</h4>
                    <div className="flex flex-wrap gap-3">
                        {selectedChainDetails.map(chain => (
                            <div key={chain.id} className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                                <chain.logo className="w-5 h-5" />
                                <span>{chain.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
                 <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                    <h4 className="font-bold text-lg mb-1">Description</h4>
                    <p className="text-gray-300 leading-relaxed">{tokenDetails.description || 'No description provided.'}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl border border-gray-700">
                   <SuperTradingViewChart tokenAddress={tokenDetails.tokenAddress} chain="solana" />
                </div>
            </div>
        </div>
        
        {tokenDetails.enableVaults && (
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <VaultIcon className="w-5 h-5 text-purple-400" />
              Lending & Borrowing Vault
            </h4>
            <div className="space-y-3 text-sm">
              <p className="text-gray-400">Your token is enabled as collateral on the Instadapp Fluid layer.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between border-t border-gray-700 pt-3 md:border-none md:pt-0"><span className="text-gray-400">Collateral Factor (LTV):</span> <span className="font-roboto-mono">{tokenDetails.collateralFactor}%</span></div>
                <div className="flex justify-between border-t border-gray-700 pt-3 md:border-none md:pt-0"><span className="text-gray-400">Liquidation Bonus:</span> <span className="font-roboto-mono">{tokenDetails.liquidationBonus}%</span></div>
                <div className="flex justify-between border-t border-gray-700 pt-3 md:border-none md:pt-0"><span className="text-gray-400">Base Borrow Rate:</span> <span className="font-roboto-mono">{tokenDetails.baseInterestRate}%</span></div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
               <button className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">
                Supply {tokenDetails.symbol}
               </button>
               <button className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 transition-colors">
                Borrow Assets
               </button>
            </div>
          </div>
        )}

        {!isPaid ? (
            <div className="p-6 bg-purple-900/30 border border-purple-700 rounded-lg text-center">
                <h3 className="text-xl font-bold">Create Your Community Token Page</h3>
                <p className="text-purple-300 mt-2 mb-4">For a one-time fee of <span className="font-bold text-white">${TOKEN_PAGE_FEE_USD}</span>, create a dedicated page for your community to track your token.</p>
                <div className="flex justify-center items-center gap-4">
                    <button onClick={handlePayForPage} className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-500 transition-colors">
                        Pay with SOL
                    </button>
                    <button onClick={handlePayForPage} className="px-5 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 transition-colors">
                        Pay with USDC
                    </button>
                    <button onClick={handlePayForPage} className="px-5 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 transition-colors">
                        Pay with USDT
                    </button>
                </div>
            </div>
        ) : (
             <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                <h3 className="text-xl font-bold text-green-300">Community Page Created!</h3>
                <p className="text-gray-300 mt-2">Your dedicated token page is now live. Share the link with your community!</p>
                <p className="mt-3 bg-gray-900 rounded-md p-3 text-purple-400 font-roboto-mono text-sm">
                    https://twisteddivergence.app/token/{tokenDetails.symbol.toLowerCase()}
                </p>
             </div>
        )}

        <div className="text-center pt-6 flex justify-center items-center gap-6">
            <button onClick={() => onNavigate('create')} className="text-purple-400 hover:text-purple-300 transition-colors">
                + Launch Another Token
            </button>
            <button onClick={() => onNavigate('home')} className="text-purple-400 hover:text-purple-300 transition-colors">
                &larr; Back to Launchpad
            </button>
        </div>
        
        <Modal isOpen={isPaying}>
            <div className="text-center p-6">
                <Loader />
                <h3 className="text-xl font-semibold mt-4">Processing Payment...</h3>
                <p className="text-gray-400 mt-2">Confirm the transaction in your wallet to proceed.</p>
            </div>
        </Modal>
    </div>
  );
};

export default TokenPage;