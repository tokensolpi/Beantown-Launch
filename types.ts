
export enum ChainID {
  Solana = 'solana',
  Ethereum = 'ethereum',
  Polygon = 'polygon',
  Avalanche = 'avalanche',
  BSC = 'bsc',
  Arbitrum = 'arbitrum',
}

export interface Chain {
  id: ChainID;
  name: string;
  logo: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface TokenDetails {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  description: string;
  logoUrl: string;
  tokenAddress: string;
  selectedChains: Set<ChainID>;
  enableMEVProtection: boolean;
  
  // Fluid Vaults
  enableVaults: boolean;
  collateralFactor: number;
  liquidationBonus: number;
  baseInterestRate: number;

  // Pre-launch Sale & Vesting
  enablePresale: boolean;
  presaleTokenAllocation: number; // percentage
  hardCap: number; // in USDC
  tgeUnlockPercentage: number;
  vestingCliff: number; // in months
  vestingDuration: number; // in months

  // Staking
  enableStaking: boolean;
  stakingTokenAllocation: number; // percentage
  stakingAPY: number;
}
