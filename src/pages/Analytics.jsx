import React, { useState } from 'react';
import { FaChartLine, FaChartPie, FaHistory, FaExchangeAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('1w');
  const [selectedChart, setSelectedChart] = useState('portfolio');

  const portfolioData = {
    total: 25432.89,
    change24h: 5.23,
    assets: [
      { name: 'Bitcoin', symbol: 'BTC', value: 15000, percentage: 58.9, change24h: 3.2 },
      { name: 'Ethereum', symbol: 'ETH', value: 8000, percentage: 31.5, change24h: 7.8 },
      { name: 'BNB', symbol: 'BNB', value: 2432.89, percentage: 9.6, change24h: -2.1 }
    ],
    transactions: [
      {
        id: 1,
        type: 'buy',
        asset: 'BTC',
        amount: '0.05',
        value: '$2,500',
        date: '2024-03-15 14:30'
      },
      {
        id: 2,
        type: 'sell',
        asset: 'ETH',
        amount: '1.2',
        value: '$3,600',
        date: '2024-03-14 09:15'
      },
      {
        id: 3,
        type: 'buy',
        asset: 'BNB',
        amount: '5',
        value: '$1,500',
        date: '2024-03-13 11:45'
      }
    ]
  };

  const timeframes = [
    { id: '24h', label: '24h' },
    { id: '1w', label: '1W' },
    { id: '1m', label: '1M' },
    { id: '1y', label: '1Y' },
    { id: 'all', label: 'All' }
  ];

  const charts = [
    { id: 'portfolio', name: 'Portfolio Value', icon: <FaChartLine /> },
    { id: 'distribution', name: 'Asset Distribution', icon: <FaChartPie /> },
    { id: 'history', name: 'Transaction History', icon: <FaHistory /> }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/img/5@lg.webp)' }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-sm py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Portfolio Analytics
          </h1>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-white/70 mb-2">Total Value</h3>
              <p className="text-3xl font-bold text-white">${portfolioData.total.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-white/70 mb-2">24h Change</h3>
              <p className={`text-3xl font-bold ${portfolioData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioData.change24h >= 0 ? '+' : ''}{portfolioData.change24h}%
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-white/70 mb-2">Assets</h3>
              <p className="text-3xl font-bold text-white">{portfolioData.assets.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-white/70 mb-2">Transactions</h3>
              <p className="text-3xl font-bold text-white">{portfolioData.transactions.length}</p>
            </div>
          </div>

          {/* Chart Controls */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
            <div className="flex flex-wrap gap-4">
              {charts.map(chart => (
                <button
                  key={chart.id}
                  onClick={() => setSelectedChart(chart.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    selectedChart === chart.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {chart.icon}
                  <span>{chart.name}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {timeframes.map(tf => (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    timeframe === tf.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Asset List */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Assets</h2>
            <div className="space-y-4">
              {portfolioData.assets.map(asset => (
                <div key={asset.symbol} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="text-white font-bold">{asset.name}</h3>
                    <p className="text-white/70">{asset.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">${asset.value.toLocaleString()}</p>
                    <p className="text-white/70">{asset.percentage}%</p>
                    <p className={`text-sm ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {portfolioData.transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {tx.type === 'buy' ? (
                        <FaArrowDown className={tx.type === 'buy' ? 'text-green-400' : 'text-red-400'} />
                      ) : (
                        <FaArrowUp className={tx.type === 'buy' ? 'text-green-400' : 'text-red-400'} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">
                        {tx.type === 'buy' ? 'Buy' : 'Sell'} {tx.asset}
                      </h3>
                      <p className="text-white/70">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{tx.amount} {tx.asset}</p>
                    <p className="text-white/70">{tx.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 