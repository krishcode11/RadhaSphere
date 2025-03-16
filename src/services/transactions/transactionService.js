import { ethers } from 'ethers';
import { getNetworkProvider, NETWORKS } from '../networks/networkService';

// Local storage key for transaction history
const TX_HISTORY_KEY = 'tx_history';

// Send a transaction on a specific network
export const sendTransaction = async (wallet, toAddress, amount, network = 'ethereum') => {
  try {
    // Validate inputs
    if (!wallet || !toAddress || !amount) {
      throw new Error("Missing required parameters");
    }
    
    const provider = getNetworkProvider(network);
    const connectedWallet = wallet.connect(provider);
    
    // Validate recipient address
    if (!ethers.isAddress(toAddress)) {
      throw new Error("Invalid recipient address");
    }
    
    // Convert amount to wei
    const amountInWei = ethers.parseEther(amount.toString());
    
    // Get gas price estimate
    const feeData = await provider.getFeeData();
    
    // Prepare transaction
    const tx = {
      to: toAddress,
      value: amountInWei,
      gasLimit: 21000, // Standard gas limit for ETH transfers
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    };
    
    // Send transaction
    const transaction = await connectedWallet.sendTransaction(tx);
    
    // Save transaction to history
    const txData = {
      hash: transaction.hash,
      from: wallet.address,
      to: toAddress,
      amount: amount.toString(),
      network,
      type: 'send',
      timestamp: Date.now(),
      status: 'pending',
      confirmed: false,
    };
    
    saveTransactionToHistory(txData);
    
    // Return transaction data
    return { 
      success: true, 
      transaction,
      hash: transaction.hash,
      data: txData,
      explorerUrl: `${NETWORKS[network].explorer}/tx/${transaction.hash}`
    };
  } catch (error) {
    console.error("Transaction error:", error);
    return { success: false, error: error.message };
  }
};

// Get transaction status
export const getTransactionStatus = async (txHash, network = 'ethereum') => {
  try {
    const provider = getNetworkProvider(network);
    
    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return { success: true, status: 'pending', confirmed: false };
    }
    
    // Update transaction in history
    const status = receipt.status ? 'completed' : 'failed';
    updateTransactionInHistory(txHash, { status, confirmed: true });
    
    return { 
      success: true, 
      status,
      confirmed: true,
      receipt,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error("Error getting transaction status:", error);
    return { success: false, error: error.message };
  }
};

// Get all saved transactions
export const getTransactionHistory = (walletAddress = null, network = null) => {
  try {
    const history = JSON.parse(localStorage.getItem(TX_HISTORY_KEY) || '[]');
    
    // Filter by wallet address and/or network if provided
    return history.filter(tx => {
      if (walletAddress && tx.from.toLowerCase() !== walletAddress.toLowerCase()) {
        return false;
      }
      
      if (network && tx.network !== network) {
        return false;
      }
      
      return true;
    }).sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp (newest first)
  } catch (error) {
    console.error("Error getting transaction history:", error);
    return [];
  }
};

// Save transaction to history
export const saveTransactionToHistory = (txData) => {
  try {
    const history = JSON.parse(localStorage.getItem(TX_HISTORY_KEY) || '[]');
    
    // Add transaction to history
    history.push(txData);
    
    // Save updated history
    localStorage.setItem(TX_HISTORY_KEY, JSON.stringify(history));
    
    return { success: true };
  } catch (error) {
    console.error("Error saving transaction to history:", error);
    return { success: false, error: error.message };
  }
};

// Update transaction in history
export const updateTransactionInHistory = (txHash, updates) => {
  try {
    const history = JSON.parse(localStorage.getItem(TX_HISTORY_KEY) || '[]');
    
    // Find and update transaction
    const updatedHistory = history.map(tx => {
      if (tx.hash === txHash) {
        return { ...tx, ...updates };
      }
      return tx;
    });
    
    // Save updated history
    localStorage.setItem(TX_HISTORY_KEY, JSON.stringify(updatedHistory));
    
    return { success: true };
  } catch (error) {
    console.error("Error updating transaction in history:", error);
    return { success: false, error: error.message };
  }
};

// Estimate transaction fee
export const estimateTransactionFee = async (network = 'ethereum') => {
  try {
    const provider = getNetworkProvider(network);
    
    // Get gas price
    const feeData = await provider.getFeeData();
    
    // Standard gas limit for ETH transfers
    const gasLimit = ethers.toBigInt(21000);
    
    // Calculate fee (maxFeePerGas × gasLimit)
    const fee = feeData.maxFeePerGas * gasLimit;
    
    return {
      success: true,
      fee: ethers.formatEther(fee),
      maxFeePerGas: ethers.formatUnits(feeData.maxFeePerGas, 'gwei'),
      maxPriorityFeePerGas: ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei'),
      gasLimit: gasLimit.toString()
    };
  } catch (error) {
    console.error("Error estimating transaction fee:", error);
    return { success: false, error: error.message };
  }
}; 