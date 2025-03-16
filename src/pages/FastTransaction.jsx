import React, { useState } from 'react';
import { FaBolt, FaExchangeAlt, FaHistory, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const FastTransaction = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedSpeed, setSelectedSpeed] = useState('fast');
  const [selectedAsset, setSelectedAsset] = useState('ETH');

  const speeds = [
    {
      id: 'instant',
      name: 'Instant',
      time: '< 15 seconds',
      fee: '0.005 ETH',
      icon: <FaBolt />
    },
    {
      id: 'fast',
      name: 'Fast',
      time: '< 1 minute',
      fee: '0.003 ETH',
      icon: <FaExchangeAlt />
    },
    {
      id: 'standard',
      name: 'Standard',
      time: '< 3 minutes',
      fee: '0.001 ETH',
      icon: <FaClock />
    }
  ];

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
      time: '2 minutes ago',
      speed: 'fast'
    },
    {
      id: 2,
      recipient: '0x8765...4321',
      amount: '100 MATIC',
      status: 'pending',
      time: '5 minutes ago',
      speed: 'standard'
    },
    {
      id: 3,
      recipient: '0x9876...5432',
      amount: '1.2 BNB',
      status: 'completed',
      time: '10 minutes ago',
      speed: 'instant'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle transaction submission
    console.log('Transaction:', { amount, recipient, selectedSpeed, selectedAsset });
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/img/zentinel_cover_full@lg.webp)' }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-sm py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Fast Transaction
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Transaction Form */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Send Assets</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Asset Selection */}
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

                  {/* Amount Input */}
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

                  {/* Recipient Address */}
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

                  {/* Transaction Speed */}
                  <div>
                    <label className="block text-white mb-2">Transaction Speed</label>
                    <div className="grid grid-cols-3 gap-4">
                      {speeds.map(speed => (
                        <button
                          key={speed.id}
                          type="button"
                          onClick={() => setSelectedSpeed(speed.id)}
                          className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
                            selectedSpeed === speed.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          <div className="text-xl mb-2">{speed.icon}</div>
                          <span className="font-bold">{speed.name}</span>
                          <span className="text-sm mt-1">{speed.time}</span>
                          <span className="text-sm mt-1">{speed.fee}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaBolt />
                    Send Now
                  </button>
                </form>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>
                <div className="space-y-4">
                  {recentTransactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          {tx.status === 'completed' ? (
                            <FaCheckCircle className="text-green-400" />
                          ) : (
                            <FaExclamationCircle className="text-yellow-400" />
                          )}
                          <h3 className="text-white font-bold">{tx.amount}</h3>
                        </div>
                        <p className="text-white/70 text-sm mt-1">To: {tx.recipient}</p>
                        <p className="text-white/50 text-sm">{tx.time}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                          tx.speed === 'instant'
                            ? 'bg-purple-500/20 text-purple-400'
                            : tx.speed === 'fast'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {tx.speed}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Network Status */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Network Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Average Block Time</span>
                    <span className="text-white">12.5s</span>
                  </div>
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

export default FastTransaction; 