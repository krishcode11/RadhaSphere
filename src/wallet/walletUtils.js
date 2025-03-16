import { ethers } from 'ethers';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { AES, enc } from 'crypto-js';

// Add Buffer polyfill for browser environments
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = {
    from: (arr) => new Uint8Array(arr),
    isBuffer: () => false,
  };
}

// Polyfill for crypto.randomBytes in browser environments
if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') {
  const randomBytes = (size) => {
    const array = new Uint8Array(size);
    window.crypto.getRandomValues(array);
    return array;
  };
  
  if (!window.crypto.randomBytes) {
    window.crypto.randomBytes = randomBytes;
  }
}

// Utility function to safely generate mnemonics in browser environments
const generateSafeMnemonic = () => {
  try {
    // First try using the imported generateMnemonic function
    return generateMnemonic();
  } catch (error) {
    console.warn("Failed to use bip39.generateMnemonic, falling back to ethers:", error);
    
    // If that fails, use ethers' built-in functionality
    const wallet = ethers.Wallet.createRandom();
    return wallet.mnemonic?.phrase || '';
  }
};

// Supported blockchain networks
export const SUPPORTED_NETWORKS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    explorer: 'https://etherscan.io',
    icon: '/img/logo.png'
  },
  binance: {
    id: 56,
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    explorer: 'https://bscscan.com',
    icon: '/img/logo.png'
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    icon: '/img/logo.png'
  },
  avalanche: {
    id: 43114,
    name: 'Avalanche',
    symbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    icon: '/img/logo.png'
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://explorer.solana.com',
    icon: '/img/logo.png'
  },
  // Add more networks as needed
};

// Generate a new wallet (returns mnemonic and wallet)
export const generateWallet = () => {
  try {
    // Use the safe mnemonic generator
    const mnemonic = generateSafeMnemonic();
    if (!mnemonic) {
      throw new Error("Failed to generate mnemonic");
    }
    
    // Use ethers v6 compatible methods
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return { mnemonic, wallet };
  } catch (error) {
    console.error("Error generating wallet:", error);
    
    // Fallback to creating a random wallet directly
    try {
      const randomWallet = ethers.Wallet.createRandom();
      return { 
        mnemonic: randomWallet.mnemonic?.phrase || '', 
        wallet: randomWallet 
      };
    } catch (fallbackError) {
      console.error("Fallback wallet creation also failed:", fallbackError);
      throw new Error(`Failed to generate wallet: ${error.message}`);
    }
  }
};

// Import wallet from mnemonic
export const importWalletFromMnemonic = (mnemonic) => {
  try {
    // Use ethers v6 compatible methods
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return { success: true, wallet };
  } catch (error) {
    console.error("Error importing wallet from mnemonic:", error);
    return { success: false, error: error.message };
  }
};

// Import wallet from private key
export const importWalletFromPrivateKey = (privateKey) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    return { success: true, wallet };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Encrypt wallet data for secure storage
export const encryptWallet = (walletData, password) => {
  try {
    // Convert the wallet data to a safe JSON string
    const jsonData = JSON.stringify(walletData);
    
    // Encrypt the data using AES
    const encryptedData = AES.encrypt(jsonData, password).toString();
    return { success: true, encryptedData };
  } catch (error) {
    console.error("Encryption error:", error);
    return { success: false, error: error.message };
  }
};

// Decrypt wallet data
export const decryptWallet = (encryptedData, password) => {
  try {
    // Decrypt the data
    const bytes = AES.decrypt(encryptedData, password);
    
    // Handle potential UTF-8 issues
    let decryptedString;
    try {
      decryptedString = bytes.toString(enc.Utf8);
      
      // Detect if we have invalid UTF-8 data
      if (!decryptedString || decryptedString.length === 0) {
        throw new Error("Decryption produced empty data. Likely an incorrect password.");
      }
    } catch (e) {
      console.error("UTF-8 decoding error:", e);
      throw new Error("Failed to decode wallet data. The password may be incorrect.");
    }
    
    // Parse the JSON data
    let walletData;
    try {
      walletData = JSON.parse(decryptedString);
    } catch (e) {
      console.error("JSON parsing error:", e);
      throw new Error("Failed to parse wallet data. The data may be corrupted.");
    }
    
    return { success: true, walletData };
  } catch (error) {
    console.error("Decryption error:", error);
    return { success: false, error: error.message };
  }
};

// Get provider for a specific network
export const getProvider = (network) => {
  if (!SUPPORTED_NETWORKS[network]) {
    throw new Error(`Network ${network} is not supported`);
  }
  
  return new ethers.JsonRpcProvider(SUPPORTED_NETWORKS[network].rpcUrl);
};

// Get wallet balance
export const getBalance = async (address, network = 'ethereum') => {
  try {
    const provider = getProvider(network);
    const balance = await provider.getBalance(address);
    return { 
      success: true, 
      balance: ethers.formatEther(balance),
      network
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send transaction
export const sendTransaction = async (
  privateKey, 
  toAddress, 
  amount, 
  network = 'ethereum'
) => {
  try {
    const provider = getProvider(network);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const tx = {
      to: toAddress,
      value: ethers.parseEther(amount.toString())
    };
    
    const transaction = await wallet.sendTransaction(tx);
    return { 
      success: true, 
      txHash: transaction.hash,
      network,
      explorer: SUPPORTED_NETWORKS[network].explorer
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Generate unique wallet ID
export const generateWalletId = () => {
  return 'wallet_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
};

// Store wallet in local storage (encrypted)
export const storeWallet = (walletData, password) => {
  try {
    const { success, encryptedData, error } = encryptWallet(walletData, password);
    if (!success) throw new Error(error || 'Failed to encrypt wallet');
    
    const walletId = generateWalletId();
    localStorage.setItem(walletId, encryptedData);
    
    return { success: true, walletId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Retrieve wallet from local storage
export const retrieveWallet = (walletId, password) => {
  try {
    const encryptedData = localStorage.getItem(walletId);
    if (!encryptedData) throw new Error('Wallet not found');
    
    return decryptWallet(encryptedData, password);
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 