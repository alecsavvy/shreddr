// Environment configuration
// These variables are loaded from .localnet.env, .testnet.env, or .mainnet.env
// based on the npm script used (dev:localnet, dev:testnet, dev:mainnet)

export type Network = 'localnet' | 'testnet' | 'mainnet';

export const config = {
  network: (import.meta.env.VITE_NETWORK || 'localnet') as Network,
  rpcUrl: import.meta.env.VITE_RPC_URL || 'http://localhost:8899',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
} as const;

export default config;

