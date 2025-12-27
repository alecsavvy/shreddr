// Environment configuration
// These variables are loaded from .localnet.env, .testnet.env, or .mainnet.env
// based on the npm script used (dev:localnet, dev:testnet, dev:mainnet)

export type Network = 'localnet' | 'testnet' | 'mainnet';

// Coinflow environment type
export type CoinflowEnv = 'sandbox' | 'prod';

const network = (import.meta.env.VITE_NETWORK || 'localnet') as Network;

// Map our network to Solana RPC URLs
const getSolanaRpcUrl = (net: Network): string => {
  if (import.meta.env.VITE_RPC_URL) return import.meta.env.VITE_RPC_URL;
  
  switch (net) {
    case 'mainnet':
      return 'https://api.mainnet-beta.solana.com';
    case 'testnet':
      return 'https://api.testnet.solana.com';
    case 'localnet':
    default:
      return 'http://localhost:8899';
  }
};

// Map our network to Coinflow environment
const getCoinflowEnv = (net: Network): CoinflowEnv => {
  return net === 'mainnet' ? 'prod' : 'sandbox';
};

export const config = {
  // App info
  appName: 'shreddr',
  
  // Network configuration
  network,
  rpcUrl: getSolanaRpcUrl(network),
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  
  // Phantom configuration
  phantom: {
    appId: import.meta.env.VITE_PHANTOM_APP_ID || 'f1ac1f2f-cbdc-47f3-a719-dc51e4460228',
    providers: ['google', 'apple', 'injected'] as const,
  },
  
  // Coinflow configuration
  coinflow: {
    merchantId: import.meta.env.VITE_COINFLOW_MERCHANT_ID || 'shreddr',
    env: getCoinflowEnv(network),
    blockchain: 'solana' as const,
  },
} as const;

export default config;

