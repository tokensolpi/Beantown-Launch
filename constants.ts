
import type { Chain, TokenDetails } from './types';
import { ChainID } from './types';
import { SolanaIcon, EthereumIcon, PolygonIcon, AvalancheIcon, BscIcon, ArbitrumIcon } from './components/icons/ChainIcons';
import type { SwapToken } from './services/aggregatorService';

export const ALL_CHAINS: Chain[] = [
  { id: ChainID.Solana, name: 'Solana', logo: SolanaIcon },
  { id: ChainID.Ethereum, name: 'Ethereum', logo: EthereumIcon },
  { id: ChainID.Polygon, name: 'Polygon', logo: PolygonIcon },
  { id: ChainID.Avalanche, name: 'Avalanche', logo: AvalancheIcon },
  { id: ChainID.BSC, name: 'BNB Chain', logo: BscIcon },
  { id: ChainID.Arbitrum, name: 'Arbitrum', logo: ArbitrumIcon },
];

export const TOKEN_PAGE_FEE_USD = 15;

export const MOCK_TOKENS: TokenDetails[] = [
    {
        name: 'Quantum Core',
        symbol: 'QTC',
        decimals: 9,
        supply: 100000000,
        description: 'Quantum Core is a decentralized computing network powering the next generation of AI and scientific research.',
        logoUrl: 'https://picsum.photos/seed/quantum/200',
        tokenAddress: 'So11111111111111111111111111111111111111112',
        selectedChains: new Set([ChainID.Solana, ChainID.Ethereum, ChainID.Arbitrum]),
        enableMEVProtection: true,
        enableVaults: true,
        collateralFactor: 80,
        liquidationBonus: 5,
        baseInterestRate: 2.5,
        enablePresale: true,
        presaleTokenAllocation: 15,
        hardCap: 500000,
        tgeUnlockPercentage: 20,
        vestingCliff: 3,
        vestingDuration: 12,
        enableStaking: true,
        stakingTokenAllocation: 25,
        stakingAPY: 18,
    },
    {
        name: 'Nebula Protocol',
        symbol: 'NBL',
        decimals: 6,
        supply: 50000000,
        description: 'A cross-chain protocol for synthetic assets and derivatives, built on a highly scalable and secure infrastructure.',
        logoUrl: 'https://picsum.photos/seed/nebula/200',
        tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyB7uP3',
        selectedChains: new Set([ChainID.Solana, ChainID.Avalanche]),
        enableMEVProtection: false,
        enableVaults: true,
        collateralFactor: 70,
        liquidationBonus: 8,
        baseInterestRate: 3,
        enablePresale: false,
        presaleTokenAllocation: 10,
        hardCap: 200000,
        tgeUnlockPercentage: 10,
        vestingCliff: 6,
        vestingDuration: 24,
        enableStaking: true,
        stakingTokenAllocation: 20,
        stakingAPY: 12,
    },
    {
        name: 'Solaris Token',
        symbol: 'SLR',
        decimals: 8,
        supply: 1000000000,
        description: 'The native token of the Solaris gaming metaverse, used for in-game purchases, governance, and staking.',
        logoUrl: 'https://picsum.photos/seed/solaris/200',
        tokenAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNs997f',
        selectedChains: new Set([ChainID.Solana, ChainID.Polygon, ChainID.BSC]),
        enableMEVProtection: true,
        enableVaults: false,
        collateralFactor: 75,
        liquidationBonus: 5,
        baseInterestRate: 2,
        enablePresale: true,
        presaleTokenAllocation: 5,
        hardCap: 1000000,
        tgeUnlockPercentage: 100,
        vestingCliff: 0,
        vestingDuration: 0,
        enableStaking: false,
        stakingTokenAllocation: 10,
        stakingAPY: 8,
    }
];

export const SWAPPABLE_TOKENS: SwapToken[] = [
    {
        address: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        usdPrice: 170.00,
    },
    {
        address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyB7uP3',
        symbol: 'USDC',
        name: 'USD Coin',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyB7uP3/logo.png',
        usdPrice: 1.00,
    },
    {
        address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNs997f',
        symbol: 'JUP',
        name: 'Jupiter',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNs997f/logo.png',
        usdPrice: 1.15,
    },
    {
        address: MOCK_TOKENS[0].tokenAddress, // Use the one from the launchpad for consistency
        symbol: MOCK_TOKENS[0].symbol,
        name: MOCK_TOKENS[0].name,
        logo: MOCK_TOKENS[0].logoUrl,
        usdPrice: 2.05,
    },
    {
        address: MOCK_TOKENS[1].tokenAddress,
        symbol: MOCK_TOKENS[1].symbol,
        name: MOCK_TOKENS[1].name,
        logo: MOCK_TOKENS[1].logoUrl,
        usdPrice: 4.50,
    },
];
