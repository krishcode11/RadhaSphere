import { ethers } from 'ethers';

// Supported blockchain networks
export const NETWORKS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    explorer: 'https://etherscan.io',
    icon: '/img/logo.png',
    background: '/img/4@lg.webp',
    color: '#627EEA'
  },
  binance: {
    id: 56,
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    decimals: 18,
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    explorer: 'https://bscscan.com',
    icon: '/img/logo.png',
    background: '/img/1@lg.webp',
    color: '#F3BA2F'
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: 18,
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    icon: '/img/logo.png',
    background: '/img/3@lg.webp',
    color: '#8247E5'
  },
  avalanche: {
    id: 43114,
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    icon: '/img/logo.png',
    background: '/img/5@lg.webp',
    color: '#E84142'
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://explorer.solana.com',
    icon: '/img/logo.png',
    background: '/img/2@lg (1).webp',
    color: '#14F195'
  },
  // Add more networks as needed
};

// Cache for providers to avoid creating new instances
const providerCache = {};

// Get a provider for a specific network
export const getNetworkProvider = (network) => {
  const networkKey = network.toLowerCase();
  
  if (!NETWORKS[networkKey]) {
    throw new Error(`Network ${network} is not supported`);
  }
  
  // Return cached provider if available
  if (providerCache[networkKey]) {
    return providerCache[networkKey];
  }
  
  // Create new provider and cache it
  const provider = new ethers.JsonRpcProvider(NETWORKS[networkKey].rpcUrl);
  providerCache[networkKey] = provider;
  
  return provider;
};

// Format currency amounts with proper decimals and symbols
export const formatCurrency = (amount, network = 'ethereum') => {
  const networkKey = network.toLowerCase();
  
  if (!NETWORKS[networkKey]) {
    throw new Error(`Network ${network} is not supported`);
  }
  
  const { symbol, decimals } = NETWORKS[networkKey];
  
  // Format amount to fixed decimals based on size
  let formattedAmount;
  const numAmount = parseFloat(amount);
  
  if (numAmount < 0.0001) {
    formattedAmount = numAmount.toExponential(4);
  } else if (numAmount < 1) {
    formattedAmount = numAmount.toFixed(6);
  } else if (numAmount < 1000) {
    formattedAmount = numAmount.toFixed(4);
  } else {
    formattedAmount = numAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  
  return `${formattedAmount} ${symbol}`;
};

// Format address for display (shortening)
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address || address.length < (startChars + endChars + 3)) {
    return address || '';
  }
  
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};

// Generate transaction URL for block explorer
export const getTransactionUrl = (network, txHash) => {
  const networkKey = network.toLowerCase();
  
  if (!NETWORKS[networkKey]) {
    throw new Error(`Network ${network} is not supported`);
  }
  
  return `${NETWORKS[networkKey].explorer}/tx/${txHash}`;
};

// Generate address URL for block explorer
export const getAddressUrl = (network, address) => {
  const networkKey = network.toLowerCase();
  
  if (!NETWORKS[networkKey]) {
    throw new Error(`Network ${network} is not supported`);
  }
  
  return `${NETWORKS[networkKey].explorer}/address/${address}`;
};

// Get all supported networks
export const getAllNetworks = () => {
  return Object.keys(NETWORKS).map(key => ({
    id: key,
    ...NETWORKS[key]
  }));
}; 