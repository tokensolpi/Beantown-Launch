import React, { useState, useEffect, useCallback } from 'react';
import { SWAPPABLE_TOKENS } from '../constants';
import type { SwapToken, SwapRoute } from '../services/aggregatorService';
import { findBestRoute } from '../services/aggregatorService';
import Modal from './Modal';
import { useDebounce } from '../hooks/useDebounce';

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const SwapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);


const DexPage: React.FC = () => {
    const [fromToken, setFromToken] = useState<SwapToken>(SWAPPABLE_TOKENS[0]); // Default to SOL
    const [toToken, setToToken] = useState<SwapToken | null>(null);
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [bestRoute, setBestRoute] = useState<SwapRoute | null>(null);
    const [isFetchingRoute, setIsFetchingRoute] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalField, setModalField] = useState<'from' | 'to' | null>(null);

    const debouncedFromAmount = useDebounce(fromAmount, 500);

    const handleOpenModal = (field: 'from' | 'to') => {
        setModalField(field);
        setIsModalOpen(true);
    };

    const handleSelectToken = (token: SwapToken) => {
        if (modalField === 'from') {
            if (toToken?.address === token.address) { // If new fromToken is same as toToken, swap them
                setToToken(fromToken);
            }
            setFromToken(token);
        } else {
             if (fromToken.address === token.address) { // If new toToken is same as fromToken, swap them
                setFromToken(toToken);
            }
            setToToken(token);
        }
        setIsModalOpen(false);
        setModalField(null);
    };
    
    const handleSwapTokens = () => {
        if (!toToken) return;
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };
    
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
         if (/^\d*\.?\d*$/.test(value)) {
            setFromAmount(value);
            if (value === '') {
                setToAmount('');
                setBestRoute(null);
            }
        }
    };

    useEffect(() => {
        const getBestRoute = async () => {
            if (!debouncedFromAmount || !fromToken || !toToken || parseFloat(debouncedFromAmount) <= 0) {
                setToAmount('');
                setBestRoute(null);
                setError(null);
                return;
            }
            
            setIsFetchingRoute(true);
            setError(null);
            setBestRoute(null);

            try {
                const route = await findBestRoute(fromToken, toToken, parseFloat(debouncedFromAmount));
                setBestRoute(route);
                setToAmount(route.outputAmount.toFixed(6));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setToAmount('');
            } finally {
                setIsFetchingRoute(false);
            }
        };

        getBestRoute();
    }, [debouncedFromAmount, fromToken, toToken]);

    const priceImpact = bestRoute?.priceImpact ?? 0;
    const priceImpactColor = priceImpact > 5 ? 'text-red-400' : priceImpact > 2 ? 'text-yellow-400' : 'text-green-400';

    return (
        <div className="max-w-md mx-auto animate-fade-in">
             <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl shadow-purple-900/20">
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-xl font-bold">Swap</h2>
                    <button className="text-gray-400 hover:text-white">
                        <SettingsIcon />
                    </button>
                </div>
                <div className="p-4 space-y-2 relative">
                    {/* From Input */}
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-400">You Pay</span>
                            <span className="text-xs text-gray-400">Balance: 12.5</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <input type="text" placeholder="0.0" className="bg-transparent text-3xl font-roboto-mono w-full focus:outline-none" value={fromAmount} onChange={handleAmountChange} />
                            <button onClick={() => handleOpenModal('from')} className="flex items-center gap-2 bg-purple-600/50 px-3 py-2 rounded-full font-semibold hover:bg-purple-600 transition-colors">
                                <img src={fromToken.logo} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
                                {fromToken.symbol}
                                <ChevronDownIcon />
                            </button>
                        </div>
                    </div>
                    
                    {/* Swap Button */}
                    <div className="flex justify-center py-2">
                        <button onClick={handleSwapTokens} className="p-2 bg-gray-700 border-4 border-gray-800/80 rounded-full text-gray-400 hover:text-white hover:bg-purple-600 transition-all duration-200">
                          <SwapIcon />
                        </button>
                    </div>

                    {/* To Input */}
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-400">You Receive</span>
                             <span className="text-xs text-gray-400">Balance: 0.0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <input type="text" placeholder="0.0" className={`bg-transparent text-3xl font-roboto-mono w-full focus:outline-none transition-opacity ${isFetchingRoute ? 'opacity-50 animate-pulse' : 'opacity-100'}`} value={toAmount} readOnly />
                            <button onClick={() => handleOpenModal('to')} className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-full font-semibold hover:bg-gray-600 transition-colors">
                                {toToken ? (
                                    <>
                                        <img src={toToken.logo} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
                                        {toToken.symbol}
                                    </>
                                ) : (
                                    <>
                                      <span className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs">?</span>
                                      Select
                                    </>
                                )}
                                <ChevronDownIcon />
                            </button>
                        </div>
                    </div>
                    
                    {bestRoute && !error && (
                        <div className="pt-3 px-1 space-y-1.5 text-xs text-gray-400">
                           <div className="flex justify-between"><span>Price</span><span className="font-roboto-mono">1 {fromToken.symbol} ≈ {(bestRoute.outputAmount / parseFloat(fromAmount)).toFixed(4)} {toToken?.symbol}</span></div>
                           <div className="flex justify-between"><span>Route</span><span className="font-roboto-mono text-purple-300">{bestRoute.path.join(' → ')}</span></div>
                           <div className="flex justify-between"><span>Fee (0.3%)</span><span className="font-roboto-mono">~${(bestRoute.feeInUsd).toFixed(2)}</span></div>
                           <div className="flex justify-between"><span>Price Impact</span><span className={`font-roboto-mono ${priceImpactColor}`}>{priceImpact.toFixed(2)}%</span></div>
                        </div>
                    )}
                    {error && <p className="pt-3 text-center text-sm text-red-400">{error}</p>}
                </div>
                <div className="p-4">
                    <button className="w-full py-3 text-lg font-bold bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Connect Wallet
                    </button>
                </div>
             </div>
            
             <Modal isOpen={isModalOpen}>
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Select a Token</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {SWAPPABLE_TOKENS.map(token => {
                           const isSelected = (modalField === 'from' && fromToken.address === token.address) || (modalField === 'to' && toToken?.address === token.address);
                           return (
                               <button 
                                key={token.address} 
                                onClick={() => handleSelectToken(token)}
                                disabled={isSelected}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-left">{token.name}</p>
                                        <p className="text-sm text-gray-400 text-left">{token.symbol}</p>
                                    </div>
                               </button>
                           )
                        })}
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-full mt-4 py-2 text-sm font-semibold bg-gray-600 rounded-md hover:bg-gray-500">Close</button>
                </div>
             </Modal>
        </div>
    );
};

export default DexPage;
