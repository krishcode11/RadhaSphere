import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '../hooks/useGSAP';
import Button from '../components/Button';

// Wallet utilities
import { getBalance, SUPPORTED_NETWORKS } from '../wallet/walletUtils';

const SwapService = () => {
  const navigate = useNavigate();
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDT');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [activeNetwork, setActiveNetwork] = useState('ethereum');
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');

  // Swap rate mock (for demonstration)
  const rates = {
    'ETH_USDT': 3000,
    'USDT_ETH': 0.00033,
    'ETH_BNB': 4.5,
    'BNB_ETH': 0.222,
    'BNB_USDT': 300,
    'USDT_BNB': 0.0033,
  };

  // Mock tokens list
  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', icon: '/img/logo.png' },
    { symbol: 'USDT', name: 'Tether USD', icon: '/img/logo.png' },
    { symbol: 'BNB', name: 'Binance Coin', icon: '/img/logo.png' },
    { symbol: 'MATIC', name: 'Polygon', icon: '/img/logo.png' },
    { symbol: 'AVAX', name: 'Avalanche', icon: '/img/logo.png' },
  ];

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Animate the swap card if it exists
      const swapCard = document.querySelector('.swap-card');
      if (swapCard) {
        gsap.from(swapCard, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power3.out'
        });
      }

      // Animate token items if they exist
      const tokenItems = document.querySelectorAll('.token-item');
      if (tokenItems.length > 0) {
        gsap.from(tokenItems, {
          opacity: 0,
          y: 10,
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.3
        });
      }
    });

    return () => ctx.revert();
  }, []); // Only run once on mount since we don't have any dependencies

  // Check wallet connection on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      const isWalletConnected = localStorage.getItem('walletConnected') === 'true';
      setWalletConnected(isWalletConnected);
      
      if (isWalletConnected) {
        // Get mock balance for demo
        setWalletBalance('1.234');
      }
    };

    checkWalletConnection();
  }, []);

  // Calculate swap rate
  useEffect(() => {
    if (fromAmount && fromAmount > 0) {
      const key = `${fromToken}_${toToken}`;
      const rate = rates[key] || 1;
      setToAmount((parseFloat(fromAmount) * rate).toFixed(4));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken]);

  // Handle swap tokens
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    
    if (fromAmount) {
      const key = `${toToken}_${fromToken}`;
      const rate = rates[key] || 1;
      setFromAmount((parseFloat(toAmount) * rate).toFixed(4));
    }
  };

  // Handle connect wallet
  const handleConnectWallet = () => {
    navigate('/onboarding');
  };

  // Handle swap submission
  const handleSwapSubmit = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!walletConnected) {
      handleConnectWallet();
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Mock swap process for demonstration
    setTimeout(() => {
      setLoading(false);
      // Show success message or redirect
      navigate('/dashboard?swapSuccess=true');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-10 px-6 md:px-10 lg:px-20">
      {/* Header with back button */}
      <div className="flex items-center mb-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-zentry text-3xl md:text-4xl font-bold">Swap Tokens</h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Swap Card */}
      <div className="swap-card max-w-xl mx-auto bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
        <div className="mb-6">
          <label className="block text-white/70 text-sm mb-2 font-robert-medium">From</label>
          <div className="flex items-center bg-black/30 rounded-lg border border-white/10 overflow-hidden">
            <input 
              type="number" 
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent px-4 py-3 text-white outline-none"
            />
            <div className="relative group">
              <button className="flex items-center space-x-2 bg-black/40 px-4 py-3 hover:bg-black/60 transition-colors">
                <img src="/img/logo.png" alt={fromToken} className="w-5 h-5" />
                <span>{fromToken}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Token dropdown - simplified for demo */}
              <div className="absolute right-0 mt-2 w-52 bg-gray-800 border border-white/10 rounded-lg shadow-lg p-2 hidden group-hover:block z-10">
                {tokens.map(token => (
                  <button
                    key={token.symbol}
                    onClick={() => setFromToken(token.symbol)}
                    className="token-item flex items-center space-x-2 w-full text-left px-3 py-2 hover:bg-white/10 rounded-md transition-colors"
                  >
                    <img src={token.icon} alt={token.symbol} className="w-5 h-5" />
                    <div>
                      <p className="font-robert-medium">{token.symbol}</p>
                      <p className="text-white/60 text-xs">{token.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {walletConnected && (
            <p className="text-white/60 text-xs mt-2">
              Balance: {walletBalance} {fromToken}
            </p>
          )}
        </div>
        
        {/* Swap direction button */}
        <div className="flex justify-center -my-3 relative z-10">
          <button 
            onClick={handleSwapTokens}
            className="bg-indigo-600 hover:bg-indigo-700 rounded-full p-2 transition-colors transform hover:rotate-180 duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6 mt-4">
          <label className="block text-white/70 text-sm mb-2 font-robert-medium">To</label>
          <div className="flex items-center bg-black/30 rounded-lg border border-white/10 overflow-hidden">
            <input 
              type="number" 
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent px-4 py-3 text-white outline-none"
              disabled
            />
            <div className="relative group">
              <button className="flex items-center space-x-2 bg-black/40 px-4 py-3 hover:bg-black/60 transition-colors">
                <img src="/img/logo.png" alt={toToken} className="w-5 h-5" />
                <span>{toToken}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Token dropdown - simplified for demo */}
              <div className="absolute right-0 mt-2 w-52 bg-gray-800 border border-white/10 rounded-lg shadow-lg p-2 hidden group-hover:block z-10">
                {tokens.map(token => (
                  <button
                    key={token.symbol}
                    onClick={() => setToToken(token.symbol)}
                    className="token-item flex items-center space-x-2 w-full text-left px-3 py-2 hover:bg-white/10 rounded-md transition-colors"
                  >
                    <img src={token.icon} alt={token.symbol} className="w-5 h-5" />
                    <div>
                      <p className="font-robert-medium">{token.symbol}</p>
                      <p className="text-white/60 text-xs">{token.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Exchange rate info */}
        {fromAmount && fromAmount > 0 && (
          <div className="bg-black/20 p-3 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Exchange Rate</span>
              <span className="text-sm font-robert-medium">
                1 {fromToken} = {rates[`${fromToken}_${toToken}`] || '~'} {toToken}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-white/70 text-sm">Estimated Gas Fee</span>
              <span className="text-sm font-robert-medium">~0.0025 ETH</span>
            </div>
          </div>
        )}
        
        {/* Action button */}
        <Button
          title={walletConnected ? 'Swap Tokens' : 'Connect Wallet'}
          onClick={walletConnected ? handleSwapSubmit : handleConnectWallet}
          disabled={loading || (!fromAmount || parseFloat(fromAmount) <= 0)}
          containerClass={`w-full bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-black py-3 rounded-lg font-robert-medium ${
            (loading || (!fromAmount || parseFloat(fromAmount) <= 0)) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        />
        
        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 transition ease-in-out duration-150 cursor-not-allowed">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing swap...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapService; 