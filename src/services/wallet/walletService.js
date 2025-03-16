import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';
import { generateMnemonic } from 'bip39';
import { getNetworkProvider } from '../networks/networkService';
import { v4 as uuidv4 } from 'uuid';

const utils  = ethers.utils;

// Extract specific seed words from mnemonic for simplified recovery
export const extractSeedWords = (mnemonic) => {
  try {
    if (!mnemonic || !utils.isValidMnemonic(mnemonic)) {
      return {
        success: false,
        error: 'Invalid mnemonic'
      };
    }
    
    const words = mnemonic.split(' ');
    
    // Select specific positions that will be used for recovery
    // For example: words at positions 3, 6, 9, 12 (1-indexed)
    const positions = [3, 6, 9, 12];
    
    const seedWords = positions.map(position => ({
      position, // 1-indexed position
      word: words[position - 1]
    }));
    
    return {
      success: true,
      seedWords
    };
  } catch (error) {
    console.error('Error extracting seed words:', error);
    return {
      success: false,
      error: error.message || 'Failed to extract seed words'
    };
  }
};

// Validate imported 4-word seed phrase against a full mnemonic
export const validatePartialMnemonic = (partialMnemonic, originalMnemonic) => {
  try {
    if (!partialMnemonic || !originalMnemonic) {
      return false;
    }
    
    const partialWords = partialMnemonic.trim().split(/\s+/);
    const originalWords = originalMnemonic.trim().split(/\s+/);
    
    // Check if both have required lengths
    if (partialWords.length !== 4 || originalWords.length < 12) {
      return false;
    }
    
    // Check if the partial words match positions 9, 3, 7, 11 in the original
    const isValid = 
      partialWords[0] === originalWords[8] && // 9th word
      partialWords[1] === originalWords[2] && // 3rd word
      partialWords[2] === originalWords[6] && // 7th word
      partialWords[3] === originalWords[10];  // 11th word
    
    return isValid;
  } catch (error) {
    console.error("Error validating partial mnemonic:", error);
    return false;
  }
};

// Utility function to safely generate mnemonics in browser environments
const generateSafeMnemonic = () => {
  try {
    return generateMnemonic();
  } catch (error) {
    console.warn("Failed to use bip39.generateMnemonic, falling back to ethers:", error);
    
    const wallet = ethers.Wallet.createRandom();
    return wallet.mnemonic?.phrase || '';
  }
};

// Create a new wallet with mnemonic
export const createWallet = () => {
  try {
    const wallet = ethers.Wallet.createRandom();
    return {
      success: true,
      wallet,
      mnemonic: wallet.mnemonic.phrase
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return {
      success: false,
      error: error.message || 'Failed to create wallet'
    };
  }
};

// Import wallet from mnemonic phrase
export const importWalletFromMnemonic = (mnemonic) => {
  try {
    // Validate the mnemonic
    if (!utils.isValidMnemonic(mnemonic)) {
      return {
        success: false,
        error: 'Invalid mnemonic phrase'
      };
    }
    
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    return {
      success: true,
      wallet
    };
  } catch (error) {
    console.error('Error importing wallet:', error);
    return {
      success: false,
      error: error.message || 'Failed to import wallet'
    };
  }
};

// Import wallet from private key
export const importWalletFromPrivateKey = (privateKey) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    return { success: true, wallet };
  } catch (error) {
    console.error("Error importing wallet from private key:", error);
    return { success: false, error: error.message };
  }
};

// Encrypt wallet data for secure storage
export const encryptWalletData = (walletData, password) => {
  try {
    // Add a timestamp for verification during decryption
    const secureData = {
      ...walletData,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    const jsonData = JSON.stringify(secureData);
    const encryptedData = AES.encrypt(jsonData, password).toString();
    
    return { success: true, encryptedData };
  } catch (error) {
    console.error("Encryption error:", error);
    return { success: false, error: error.message };
  }
};

// Decrypt wallet data
export const decryptWalletData = (encryptedData, password) => {
  try {
    // Decrypt the data
    const bytes = AES.decrypt(encryptedData, password);
    
    // Handle potential UTF-8 issues
    let decryptedString;
    try {
      decryptedString = bytes.toString(enc.Utf8);
      
      if (!decryptedString || decryptedString.length === 0) {
        throw new Error("Invalid password or corrupted data");
      }
    } catch (e) {
      console.error("UTF-8 decoding error:", e);
      throw new Error("Failed to decode wallet data. The password may be incorrect.");
    }
    
    // Parse the JSON data
    try {
      const walletData = JSON.parse(decryptedString);
      
      // Verify the data has expected format
      if (!walletData.address) {
        throw new Error("Wallet data is missing required fields");
      }
      
      return { success: true, walletData };
    } catch (e) {
      console.error("JSON parsing error:", e);
      throw new Error("Failed to parse wallet data. The data may be corrupted.");
    }
  } catch (error) {
    console.error("Decryption error:", error);
    return { success: false, error: error.message };
  }
};

// Generate a unique wallet ID
export const generateWalletId = () => {
  return 'wallet_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
};

// Store wallet data securely in local storage
export const storeWalletData = (walletData, password) => {
  try {
    // Generate a unique ID for the wallet
    const walletId = uuidv4();
    
    // Encrypt the wallet data with the password
    const encryptedData = AES.encrypt(
      JSON.stringify(walletData),
      password
    ).toString();
    
    // Store in localStorage
    const walletStore = JSON.parse(localStorage.getItem('wallets') || '{}');
    walletStore[walletId] = encryptedData;
    localStorage.setItem('wallets', JSON.stringify(walletStore));
    
    return {
      success: true,
      walletId
    };
  } catch (error) {
    console.error('Error storing wallet data:', error);
    return {
      success: false,
      error: error.message || 'Failed to store wallet data'
    };
  }
};

// Retrieve wallet data from local storage
export const retrieveWalletData = (walletId, password) => {
  try {
    // Get from localStorage
    const walletStore = JSON.parse(localStorage.getItem('wallets') || '{}');
    const encryptedData = walletStore[walletId];
    
    if (!encryptedData) {
      return {
        success: false,
        error: 'Wallet not found'
      };
    }
    
    // Decrypt the wallet data
    const decryptedBytes = AES.decrypt(encryptedData, password);
    const decryptedData = decryptedBytes.toString(enc.Utf8);
    
    if (!decryptedData) {
      return {
        success: false,
        error: 'Incorrect password'
      };
    }
    
    const walletData = JSON.parse(decryptedData);
    
    return {
      success: true,
      walletData
    };
  } catch (error) {
    console.error('Error retrieving wallet data:', error);
    return {
      success: false,
      error: error.message || 'Failed to retrieve wallet data'
    };
  }
};

// Get all stored wallet IDs
export const getAllWalletIds = () => {
  try {
    return JSON.parse(localStorage.getItem('walletIds') || '[]');
  } catch (error) {
    console.error("Error getting wallet IDs:", error);
    return [];
  }
};

// Get wallet balance for a specific network
export const getWalletBalance = async (address, network = 'ethereum') => {
  try {
    const provider = getNetworkProvider(network);
    const balance = await provider.getBalance(address);
    
    return { 
      success: true, 
      balance: ethers.formatEther(balance),
      network
    };
  } catch (error) {
    console.error("Error getting wallet balance:", error);
    return { success: false, error: error.message };
  }
};

// Connect a wallet instance to a network provider
export const connectWalletToNetwork = (wallet, network = 'ethereum') => {
  try {
    const provider = getNetworkProvider(network);
    const connectedWallet = wallet.connect(provider);
    
    return { success: true, wallet: connectedWallet };
  } catch (error) {
    console.error("Error connecting wallet to network:", error);
    return { success: false, error: error.message };
  }
}; 