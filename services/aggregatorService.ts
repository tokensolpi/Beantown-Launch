// --- Types ---
export interface SwapToken {
    address: string;
    symbol: string;
    name: string;
    logo: string;
    usdPrice: number; // For simulation purposes
}

export interface SwapRoute {
    path: string[];
    inputAmount: number;
    outputAmount: number;
    priceImpact: number;
    feeInUsd: number;
}

interface LiquidityPool {
    source: string;
    tokenA: string; // Address
    tokenB: string; // Address
    liquidityA: number; // Token A amount
    liquidityB: number; // Token B amount
    fee: number; // in percentage, e.g., 0.3
}

// --- Mock Data ---
import { SWAPPABLE_TOKENS } from '../constants';

const getTokenBySymbol = (symbol: string): SwapToken => {
    const token = SWAPPABLE_TOKENS.find(t => t.symbol === symbol);
    if (!token) throw new Error(`Token ${symbol} not found in mock data`);
    return token;
}

const MOCK_POOLS: LiquidityPool[] = [
    // Direct SOL Pools
    { source: 'Raydium', tokenA: getTokenBySymbol('SOL').address, tokenB: getTokenBySymbol('USDC').address, liquidityA: 50000, liquidityB: 8500000, fee: 0.25 },
    { source: 'Orca', tokenA: getTokenBySymbol('SOL').address, tokenB: getTokenBySymbol('USDC').address, liquidityA: 80000, liquidityB: 13600000, fee: 0.3 },
    { source: 'Raydium', tokenA: getTokenBySymbol('SOL').address, tokenB: getTokenBySymbol('JUP').address, liquidityA: 20000, liquidityB: 2000000, fee: 0.25 },
    
    // Direct USDC Pools
    { source: 'Orca', tokenA: getTokenBySymbol('USDC').address, tokenB: getTokenBySymbol('QTC').address, liquidityA: 1000000, liquidityB: 500000, fee: 0.3 },
    { source: 'Raydium', tokenA: getTokenBySymbol('USDC').address, tokenB: getTokenBySymbol('NBL').address, liquidityA: 800000, liquidityB: 200000, fee: 0.25 },
    
    // Multi-hop Pool (JUP to QTC)
    { source: 'Orca', tokenA: getTokenBySymbol('JUP').address, tokenB: getTokenBySymbol('QTC').address, liquidityA: 750000, liquidityB: 400000, fee: 0.3 },
];

// --- Simulation Logic ---

/**
 * Calculates the output of a swap within a single pool, including price impact.
 * Uses the constant product formula (x * y = k).
 */
const calculateSwapOutput = (pool: LiquidityPool, inputToken: SwapToken, inputAmount: number): { outputAmount: number, priceImpact: number } => {
    const isInputA = pool.tokenA === inputToken.address;
    const inputLiquidity = isInputA ? pool.liquidityA : pool.liquidityB;
    const outputLiquidity = isInputA ? pool.liquidityB : pool.liquidityA;

    // AMM constant product formula: (x + Δx) * (y - Δy) = k
    const k = inputLiquidity * outputLiquidity;
    const newInLiquidity = inputLiquidity + inputAmount;
    const newOutLiquidity = k / newInLiquidity;
    
    const amountOut = outputLiquidity - newOutLiquidity;
    const feeAmount = amountOut * (pool.fee / 100);
    const finalAmountOut = amountOut - feeAmount;

    // Calculate price impact
    const midPrice = inputLiquidity / outputLiquidity;
    const executionPrice = inputAmount / finalAmountOut;
    const priceImpact = Math.abs(((midPrice - executionPrice) / midPrice) * 100);
    
    return { outputAmount: finalAmountOut, priceImpact };
};

/**
 * Finds the best swap route by simulating trades across mock liquidity pools.
 */
export const findBestRoute = (fromToken: SwapToken, toToken: SwapToken, amount: number): Promise<SwapRoute> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const possibleRoutes: SwapRoute[] = [];

            // 1. Find direct routes
            for (const pool of MOCK_POOLS) {
                if ((pool.tokenA === fromToken.address && pool.tokenB === toToken.address) || 
                    (pool.tokenB === fromToken.address && pool.tokenA === toToken.address)) {
                    
                    const { outputAmount, priceImpact } = calculateSwapOutput(pool, fromToken, amount);
                    if (outputAmount > 0) {
                        possibleRoutes.push({
                            path: [pool.source, `${fromToken.symbol}/${toToken.symbol}`],
                            inputAmount: amount,
                            outputAmount,
                            priceImpact,
                            feeInUsd: (amount * fromToken.usdPrice) * (pool.fee / 100),
                        });
                    }
                }
            }
            
            // 2. Find multi-hop routes (e.g., A -> C -> B)
            const fromPools = MOCK_POOLS.filter(p => p.tokenA === fromToken.address || p.tokenB === fromToken.address);
            const toPools = MOCK_POOLS.filter(p => p.tokenA === toToken.address || p.tokenB === toToken.address);

            for (const fromPool of fromPools) {
                const intermediateTokenAddr = fromPool.tokenA === fromToken.address ? fromPool.tokenB : fromPool.tokenA;
                
                for (const toPool of toPools) {
                    const toPoolOtherTokenAddr = toPool.tokenA === toToken.address ? toPool.tokenB : toPool.tokenA;

                    if (intermediateTokenAddr === toPoolOtherTokenAddr && fromPool !== toPool) {
                        // Found a potential multi-hop route
                        const intermediateToken = SWAPPABLE_TOKENS.find(t => t.address === intermediateTokenAddr);
                        if (!intermediateToken) continue;

                        const step1 = calculateSwapOutput(fromPool, fromToken, amount);
                        if (step1.outputAmount <= 0) continue;

                        const step2 = calculateSwapOutput(toPool, intermediateToken, step1.outputAmount);
                         if (step2.outputAmount > 0) {
                             const totalFee = ((amount * fromToken.usdPrice) * (fromPool.fee / 100)) + ((step1.outputAmount * intermediateToken.usdPrice) * (toPool.fee / 100));
                             
                             possibleRoutes.push({
                                path: [`${fromPool.source}/${toPool.source}`, `${fromToken.symbol} → ${intermediateToken.symbol} → ${toToken.symbol}`],
                                inputAmount: amount,
                                outputAmount: step2.outputAmount,
                                priceImpact: Math.max(step1.priceImpact, step2.priceImpact), // Simplification
                                feeInUsd: totalFee
                             });
                         }
                    }
                }
            }

            if (possibleRoutes.length === 0) {
                return reject(new Error('No trade route found. Insufficient liquidity.'));
            }

            // Find the route with the highest output amount
            const bestRoute = possibleRoutes.reduce((best, current) => current.outputAmount > best.outputAmount ? current : best);
            
            resolve(bestRoute);

        }, 750); // Simulate network latency
    });
};
