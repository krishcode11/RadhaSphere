import React, { useState } from 'react';
import { FaSearch, FaGamepad, FaExchangeAlt, FaChartLine, FaStar, FaUsers, FaEthereum, FaBitcoin } from 'react-icons/fa';

const BrowseDapp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All DApps', icon: <FaSearch /> },
    { id: 'defi', name: 'DeFi', icon: <FaChartLine /> },
    { id: 'games', name: 'Games', icon: <FaGamepad /> },
    { id: 'exchange', name: 'Exchange', icon: <FaExchangeAlt /> }
  ];

  const dapps = [
    {
      id: 1,
      name: 'UniSwap',
      category: 'defi',
      description: 'Decentralized trading protocol',
      icon: '/img/dapps/uniswap.png',
      rating: 4.8,
      users: '2.5M',
      tvl: '$5.2B',
      chain: 'Ethereum'
    },
    {
      id: 2,
      name: 'Axie Infinity',
      category: 'games',
      description: 'NFT-based online game',
      icon: '/img/dapps/axie.png',
      rating: 4.5,
      users: '800K',
      tvl: '$1.8B',
      chain: 'Ethereum'
    },
    {
      id: 3,
      name: 'PancakeSwap',
      category: 'exchange',
      description: 'Leading DEX on BNB Chain',
      icon: '/img/dapps/pancakeswap.png',
      rating: 4.7,
      users: '1.2M',
      tvl: '$3.1B',
      chain: 'BNB Chain'
    },
    {
      id: 4,
      name: 'Aave',
      category: 'defi',
      description: 'Decentralized lending protocol',
      icon: '/img/dapps/aave.png',
      rating: 4.9,
      users: '500K',
      tvl: '$6.5B',
      chain: 'Ethereum'
    }
  ];

  const filteredDapps = dapps.filter(dapp => {
    const matchesSearch = dapp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dapp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dapp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDappClick = (dapp) => {
    console.log('Opening DApp:', dapp.name);
    // Handle DApp integration/navigation
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/img/4@lg.webp)' }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-sm py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Browse DApps
          </h1>

          {/* Search and Categories */}
          <div className="mb-8 space-y-6">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search DApps..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DApps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDapps.map(dapp => (
              <div
                key={dapp.id}
                onClick={() => handleDappClick(dapp)}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={dapp.icon}
                    alt={dapp.name}
                    className="w-16 h-16 rounded-xl"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{dapp.name}</h3>
                    <p className="text-white/70 text-sm mt-1">{dapp.description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-1 text-white/70 text-sm">
                        <FaStar className="text-yellow-400" />
                        <span>{dapp.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/70 text-sm mt-1">
                        <FaUsers />
                        <span>{dapp.users} users</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-sm">TVL: {dapp.tvl}</div>
                      <div className="flex items-center gap-1 text-white/70 text-sm mt-1">
                        {dapp.chain === 'Ethereum' ? <FaEthereum /> : <FaBitcoin />}
                        <span>{dapp.chain}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Integration Notice */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-6 py-3 rounded-full">
              <span>Connect your wallet to start using DApps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseDapp; 