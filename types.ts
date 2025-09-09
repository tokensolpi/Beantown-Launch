
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
  selectedChains: Set<ChainID>;
  enableMEVProtection: boolean;
}
