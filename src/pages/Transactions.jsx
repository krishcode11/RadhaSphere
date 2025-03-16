import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '../hooks/useGSAP';
import Button from '../components/Button';

// Services
import { retrieveWalletData } from '../services/wallet/walletService';
import { getTransactionHistory, getTransactionStatus } from '../services/transactions/transactionService';
import { formatAddress, formatCurrency, getTransactionUrl, NETWORKS } from '../services/networks/networkService';
import { isWalletConnected, getCurrentWallet } from '../services/auth/authService';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeNetwork, setActiveNetwork] = useState('all');
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  // Animation
  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Animate the page title if it exists
      const pageTitle = document.querySelector('.page-title');
      if (pageTitle) {
        gsap.from(pageTitle, {
          opacity: 0,
          y: -20,
          duration: 0.6,
          ease: 'power2.out'
        });
      }

      // Animate the transaction table if it exists
      const transactionTable = document.querySelector('.transaction-table');
      if (transactionTable) {
        gsap.from(transactionTable, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.2
        });
      }

      // Animate transaction rows if they exist
      const transactionRows = document.querySelectorAll('.transaction-row');
      if (transactionRows.length > 0) {
        gsap.from(transactionRows, {
          opacity: 0,
          x: -20,
          stagger: 0.05,
          duration: 0.4,
          ease: 'power1.out',
          delay: 0.4
        });
      }
    });

    return () => ctx.revert();
  }, [filteredTransactions]); // Re-run animation when transactions are filtered
  
  // Load transactions
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Check if wallet is connected
        if (!isWalletConnected()) {
          navigate('/onboarding');
          return;
        }
        
        const walletId = getCurrentWallet();
        if (!walletId) {
          throw new Error('No wallet ID found');
        }
        
        // For demo, use a fixed password
        const password = 'demoPassword'; // In real app, prompt user for password
        
        const { success, walletData, error: walletError } = retrieveWalletData(walletId, password);
        
        if (!success || !walletData) {
          throw new Error(walletError || 'Failed to retrieve wallet');
        }
        
        setWalletAddress(walletData.address);
        
        // Get transaction history
        const history = getTransactionHistory(walletData.address);
        setTransactions(history);
        
        // Update pending transaction statuses
        const pendingTxs = history.filter(tx => tx.status === 'pending');
        await Promise.all(pendingTxs.map(async (tx) => {
          try {
            await getTransactionStatus(tx.hash, tx.network);
          } catch (e) {
            console.warn(`Failed to update status for transaction ${tx.hash}:`, e);
          }
        }));
        
        // Get updated history
        const updatedHistory = getTransactionHistory(walletData.address);
        setTransactions(updatedHistory);
        setFilteredTransactions(updatedHistory);
      } catch (error) {
        console.error('Error loading transactions:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTransactions();
  }, [navigate]);
  
  // Filter transactions by network
  useEffect(() => {
    if (activeNetwork === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(tx => tx.network === activeNetwork));
    }
  }, [activeNetwork, transactions]);
  
  // Format transaction date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Navigate to transaction details page
  const handleTransactionClick = (tx) => {
    // Open transaction in block explorer
    window.open(getTransactionUrl(tx.network, tx.hash), '_blank', 'noopener,noreferrer');
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Get transaction type icon
  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case 'send':
        return (
          <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="material-icons text-red-500 text-sm">arrow_upward</span>
          </div>
        );
      case 'receive':
        return (
          <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="material-icons text-green-500 text-sm">arrow_downward</span>
          </div>
        );
      case 'swap':
        return (
          <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="material-icons text-blue-500 text-sm">swap_horiz</span>
          </div>
        );
      default:
        return (
          <div className="h-6 w-6 rounded-full bg-gray-500/20 flex items-center justify-center">
            <span className="material-icons text-gray-500 text-sm">pending</span>
          </div>
        );
    }
  };
  
  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white"
      style={{
        backgroundImage: 'url(/img/zentinel_cover_full@lg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="page-title font-zentry text-3xl md:text-4xl font-bold mb-2">Transaction History</h1>
            <p className="text-white/70 font-robert-regular">
              {walletAddress ? `Wallet: ${formatAddress(walletAddress)}` : 'Connect your wallet to view transactions'}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/dashboard">
              <Button
                title="Back to Dashboard"
                containerClass="bg-white/10 hover:bg-white/20 text-white rounded-lg px-6 py-2"
              />
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}
        
        {/* Network Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 overflow-x-auto py-2">
            <button
              onClick={() => setActiveNetwork('all')}
              className={`py-2 px-4 rounded-full border transition-colors duration-200 ${
                activeNetwork === 'all'
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-black/20 border-white/10 text-white/70 hover:bg-black/30'
              }`}
            >
              All Networks
            </button>
            
            {Object.keys(NETWORKS).map((network) => (
              <button
                key={network}
                onClick={() => setActiveNetwork(network)}
                className={`flex items-center gap-2 py-2 px-4 rounded-full border transition-colors duration-200 ${
                  activeNetwork === network
                    ? 'bg-white/20 border-white/40 text-white'
                    : 'bg-black/20 border-white/10 text-white/70 hover:bg-black/30'
                }`}
                style={{
                  borderColor: activeNetwork === network ? NETWORKS[network].color : undefined
                }}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: NETWORKS[network].color }}></span>
                {NETWORKS[network].name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Transactions Table */}
        <div className="transaction-table bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="three-body mx-auto">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
              <p className="mt-4 text-white/70">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-white/70">No transactions found</p>
              {activeNetwork !== 'all' && (
                <p className="text-white/50 mt-2">Try selecting "All Networks" or another network</p>
              )}
              <Link to="/dashboard" className="mt-4 inline-block">
                <Button
                  title="Return to Dashboard"
                  containerClass="bg-white/10 hover:bg-white/20 text-white rounded-lg px-6 py-2"
                />
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-black/50 text-white/70 text-sm">
                <tr>
                  <th className="px-4 py-3 text-left">Transaction</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-center">Network</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr 
                    key={tx.hash} 
                    className="transaction-row border-t border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => handleTransactionClick(tx)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {getTransactionTypeIcon(tx.type)}
                        <span className="font-robert-medium">{formatAddress(tx.hash, 8, 8)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{tx.type}</td>
                    <td className="px-4 py-3 text-white/70">{formatDate(tx.timestamp)}</td>
                    <td className="px-4 py-3">
                      <span className={tx.type === 'send' ? 'text-red-400' : 'text-green-400'}>
                        {tx.type === 'send' ? '-' : '+'}{tx.amount} {NETWORKS[tx.network].symbol}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: NETWORKS[tx.network].color }}
                        ></span>
                        <span className="text-white/70">{NETWORKS[tx.network].name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(tx.status)}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions; 