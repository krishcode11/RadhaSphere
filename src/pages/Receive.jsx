import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '../hooks/useGSAP';
import Button from '../components/Button';
import { QRCodeSVG } from 'qrcode.react';
import { FaArrowLeft } from 'react-icons/fa';

// Services
import { retrieveWalletData } from '../services/wallet/walletService';
import { NETWORKS } from '../services/networks/networkService';
import { isWalletConnected, getCurrentWallet } from '../services/auth/authService';

// Demo mode flag - set to true for development/demo purposes
const IS_DEMO = true;

// Mock wallet data for demo mode
const MOCK_WALLET = {
  address: '0x1234567890123456789012345678901234567890',
  network: 'ethereum'
};

const Receive = () => {
  const [activeNetwork, setActiveNetwork] = useState('ethereum');
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const navigate = useNavigate();
  
  // Animation
  useGSAP(() => {
    gsap.from('.receive-header', {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: 'power2.out'
    });
    
    gsap.from('.receive-content', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.2
    });
  }, []);
  
  // Load wallet
  useEffect(() => {
    const loadWallet = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Check if wallet is connected
        if (!isWalletConnected()) {
          navigate('/onboarding');
          return;
        }

        if (IS_DEMO) {
          // Use mock data in demo mode
          setWalletAddress(MOCK_WALLET.address);
          setActiveNetwork(MOCK_WALLET.network);
        } else {
          // Production mode - retrieve actual wallet data
          const walletId = getCurrentWallet();
          if (!walletId) {
            throw new Error('No wallet ID found');
          }
          
          const { success, walletData, error: walletError } = retrieveWalletData(walletId);
          
          if (!success || !walletData) {
            throw new Error(walletError || 'Failed to retrieve wallet');
          }
          
          setWalletAddress(walletData.address);
        }
      } catch (error) {
        console.error('Wallet loading error:', error);
        setError(error.message);
        
        // If there's an error in production, redirect to onboarding
        if (!IS_DEMO) {
          setTimeout(() => navigate('/onboarding'), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWallet();
  }, [navigate]);
  
  // Handle network change
  const handleNetworkChange = (network) => {
    setActiveNetwork(network);
  };
  
  // Copy address to clipboard
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/img/2@lg.png)' }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-sm py-12 px-6">
        <div className="container mx-auto px-6">
          {/* Header with Back Button */}
          <div className="receive-header flex items-center justify-between mb-8">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-4xl font-bold text-white">Receive {NETWORKS[activeNetwork].symbol}</h1>
          </div>

          <div className="receive-content">
            {/* Network Selection */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 overflow-x-auto py-2">
                {Object.keys(NETWORKS).map((network) => (
                  <button
                    key={network}
                    onClick={() => handleNetworkChange(network)}
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
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-center">
                {error}
              </div>
            )}
            
            {/* Receive Card */}
            <div className="receive-card bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-6 max-w-lg mx-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="three-body mx-auto">
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                  </div>
                  <p className="mt-4 text-white/70">Loading your wallet address...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-white/70 mb-2">Your {NETWORKS[activeNetwork].name} Address</p>
                    <div 
                      onClick={handleCopyAddress}
                      className="bg-black/30 border border-white/20 rounded-lg p-4 cursor-pointer hover:bg-black/50 transition-colors"
                    >
                      <p className="font-mono break-all">{walletAddress}</p>
                    </div>
                    
                    {copied && (
                      <p className="text-green-400 mt-2 text-sm">
                        Address copied to clipboard!
                      </p>
                    )}
                    
                    <Button
                      title={copied ? "Copied!" : "Copy Address"}
                      onClick={handleCopyAddress}
                      containerClass={`mt-3 py-2 px-4 ${
                        copied 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    />
                  </div>
                  
                  <div className="flex justify-center py-6">
                    <div className="bg-white p-4 rounded-xl">
                      <QRCodeSVG 
                        value={walletAddress} 
                        size={200}
                        level={"H"}
                        includeMargin={true}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <h3 className="text-yellow-400 font-medium mb-2">Important Note</h3>
                    <p className="text-white/80 text-sm">
                      Make sure you're sending {NETWORKS[activeNetwork].symbol} on the <b>{NETWORKS[activeNetwork].name}</b> network. 
                      Sending assets on the wrong network may result in permanent loss of funds.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receive; 