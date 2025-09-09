
import type { Chain } from './types';
import { ChainID } from './types';
import { SolanaIcon, EthereumIcon, PolygonIcon, AvalancheIcon, BscIcon, ArbitrumIcon } from './components/icons/ChainIcons';

export const ALL_CHAINS: Chain[] = [
  { id: ChainID.Solana, name: 'Solana', logo: SolanaIcon },
  { id: ChainID.Ethereum, name: 'Ethereum', logo: EthereumIcon },
  { id: ChainID.Polygon, name: 'Polygon', logo: PolygonIcon },
  { id: ChainID.Avalanche, name: 'Avalanche', logo: AvalancheIcon },
  { id: ChainID.BSC, name: 'BNB Chain', logo: BscIcon },
  { id: ChainID.Arbitrum, name: 'Arbitrum', logo: ArbitrumIcon },
];

export const TOKEN_PAGE_FEE_USD = 15;
