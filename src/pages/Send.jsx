import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane, FaArrowLeft, FaWallet, FaExchangeAlt, FaHistory } from 'react-icons/fa';
import gsap from 'gsap';
import { useGSAP } from '../hooks/useGSAP';

const Send = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('ETH');

  const assets = [
    { symbol: 'ETH', name: 'Ethereum', balance: '1.5' },
    { symbol: 'BNB', name: 'BNB', balance: '10.2' },
    { symbol: 'MATIC', name: 'Polygon', balance: '1000.0' }
  ];

  const recentTransactions = [
    {
      id: 1,
      recipient: '0x1234...5678',
      amount: '0.5 ETH',
      status: 'completed',
      time: '2 minutes ago'
    },
    {
      id: 2,
      recipient: '0x8765...4321',
      amount: '100 MATIC',
      status: 'pending',
      time: '5 minutes ago'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle send transaction
    console.log('Sending:', { amount, recipient, selectedAsset });
  };

  useGSAP(() => {
    gsap.from('.send-header', {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.from('.send-form', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out"
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="send-header mb-8">
          <h1 className="text-4xl font-bold mb-4">Send Crypto</h1>
          <p className="text-gray-400">Transfer your assets securely to any wallet address</p>
        </div>

        <div className="send-form bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Select Asset</label>
                  <div className="grid grid-cols-3 gap-4">
                    {assets.map(asset => (
                      <button
                        key={asset.symbol}
                        type="button"
                        onClick={() => setSelectedAsset(asset.symbol)}
                        className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
                          selectedAsset === asset.symbol
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        <span className="font-bold">{asset.symbol}</span>
                        <span className="text-sm mt-1">{asset.balance}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter ${selectedAsset} amount`}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Recipient Address</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter wallet address"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaPaperPlane />
                  Send Now
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>
                <div className="space-y-4">
                  {recentTransactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h3 className="text-white font-bold">{tx.amount}</h3>
                        <p className="text-white/70 text-sm">To: {tx.recipient}</p>
                        <p className="text-white/50 text-sm">{tx.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        tx.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Network Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Gas Price</span>
                    <span className="text-white">25 Gwei</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Network Load</span>
                    <span className="text-green-400">Normal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Send; 