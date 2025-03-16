import React from 'react';
import { FaWallet, FaExchangeAlt, FaChartLine, FaCube } from 'react-icons/fa';

const Solana = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Solana Wallet</h1>

      {/* Wallet Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaWallet className="text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">Balance</h2>
            </div>
            <p className="text-3xl font-bold text-indigo-600">123.45 SOL</p>
            <p className="text-sm text-gray-500">≈ $12,345.67 USD</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaExchangeAlt className="text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">24h Change</h2>
            </div>
            <p className="text-xl font-semibold text-green-500">+5.67%</p>
            <p className="text-sm text-gray-500">+$789.01</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaChartLine className="text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">Price</h2>
            </div>
            <p className="text-xl font-semibold text-gray-800">$98.76</p>
            <p className="text-sm text-gray-500">per SOL</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors">
          Send SOL
        </button>
        <button className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors">
          Receive SOL
        </button>
        <button className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors">
          Swap Tokens
        </button>
      </div>

      {/* Token List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">SPL Tokens</h2>
        <div className="space-y-4">
          {[
            { name: 'USDC', balance: '1,234.56', value: '$1,234.56' },
            { name: 'RAY', balance: '567.89', value: '$890.12' },
            { name: 'SRM', balance: '123.45', value: '$456.78' },
          ].map((token, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">{token.name}</h3>
                <p className="text-sm text-gray-500">{token.balance}</p>
              </div>
              <p className="text-gray-800">{token.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { type: 'Send', amount: '-10 SOL', date: '2024-03-20 14:30' },
            { type: 'Receive', amount: '+5 SOL', date: '2024-03-19 09:15' },
            { type: 'Swap', amount: 'SOL → USDC', date: '2024-03-18 16:45' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">{activity.type}</h3>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
              <p className={`font-medium ${
                activity.type === 'Receive' ? 'text-green-500' : 
                activity.type === 'Send' ? 'text-red-500' : 
                'text-gray-800'
              }`}>
                {activity.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Network Stats */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <FaCube className="text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">Network Stats</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Current Slot</p>
            <p className="text-lg font-semibold text-gray-800">123,456,789</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">TPS</p>
            <p className="text-lg font-semibold text-gray-800">2,345</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Epoch</p>
            <p className="text-lg font-semibold text-gray-800">234</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solana; 