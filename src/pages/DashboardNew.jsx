import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '../hooks/useGSAP';
import Button from '../components/Button';
import { 
  FaWallet, 
  FaExchangeAlt, 
  FaArrowRight, 
  FaPaperPlane, 
  FaUndo, 
  FaSignOutAlt, 
  FaBell, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
  FaDownload,
  FaShoppingCart,
  FaCompass,
  FaChartLine,
  FaBolt,
  FaSun,
  FaCog
} from 'react-icons/fa';

// Mock data for networks - replace with your actual network data or import
const MOCK_NETWORKS = {
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/img/networks/ethereum.png',
    background: '/img/backgrounds/ethereum-bg.jpg',
    video: '/img/videos/ethereum-bg.mp4',
    color: '#627EEA',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-indigo-600'
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    icon: '/img/networks/solana.png',
    background: '/img/backgrounds/solana-bg.jpg',
    video: '/img/videos/solana-bg.mp4',
    color: '#14F195',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-600'
  },
  binance: {
    name: 'Binance',
    symbol: 'BNB',
    icon: '/img/networks/binance.png',
    background: '/img/backgrounds/binance-bg.jpg',
    video: '/img/videos/binance-bg.mp4',
    color: '#F3BA2F',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-yellow-400'
  },
  polygon: {
    name: 'Polygon',
    symbol: 'MATIC',
    icon: '/img/networks/polygon.png',
    background: '/img/backgrounds/polygon-bg.jpg',
    video: '/img/videos/polygon-bg.mp4',
    color: '#8247E5',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-purple-500'
  },
  arbitrum: {
    name: 'Arbitrum',
    symbol: 'ARB',
    icon: '/img/networks/arbitrum.png',
    background: '/img/backgrounds/arbitrum-bg.jpg',
    video: '/img/videos/arbitrum-bg.mp4',
    color: '#28A0F0',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-400'
  },
  optimism: {
    name: 'Optimism',
    symbol: 'OP',
    icon: '/img/networks/optimism.png',
    background: '/img/backgrounds/optimism-bg.jpg',
    video: '/img/videos/optimism-bg.mp4',
    color: '#FF0420',
    gradientFrom: 'from-red-600',
    gradientTo: 'to-red-500'
  }
};

const DashboardNew = () => {
  const [activeNetwork, setActiveNetwork] = useState('ethereum');
  const [walletAddress, setWalletAddress] = useState('0x1234567890123456789012345678901234567890');
  const [walletBalance, setWalletBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [authType, setAuthType] = useState('web3');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const navigate = useNavigate();
  
  // Format balance with 4 decimal places and commas for thousands
  const formatBalance = (balance) => {
    if (balance === null || balance === undefined) return '--';
    return parseFloat(balance).toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 4 
    });
  };

  // Mock transaction data
  const mockTransactions = {
    ethereum: [
      {
        id: 'eth_tx1',
        type: 'sent',
        amount: '0.025',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        date: '2023-09-15 14:35'
      },
      {
        id: 'eth_tx2',
        type: 'received',
        amount: '0.1',
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        date: '2023-09-12 09:20'
      }
    ],
    binance: [
      {
        id: 'bnb_tx1',
        type: 'sent',
        amount: '0.5',
        address: '0x7890abcdef1234567890abcdef1234567890abcd',
        date: '2023-09-14 11:22'
      }
    ],
    polygon: [
      {
        id: 'matic_tx1',
        type: 'received',
        amount: '12.5',
        address: '0xdef1234567890abcdef1234567890abcdef123456',
        date: '2023-09-13 16:48'
      },
      {
        id: 'matic_tx2',
        type: 'received',
        amount: '7.2',
        address: '0x4567890abcdef1234567890abcdef1234567890ab',
        date: '2023-09-10 22:15'
      }
    ],
    arbitrum: [],
    optimism: [
      {
        id: 'op_tx1',
        type: 'sent',
        amount: '1.4',
        address: '0x567890abcdef1234567890abcdef1234567890abc',
        date: '2023-09-11 08:10'
      }
    ]
  };
  
  // Mock balances
  const mockBalances = {
    'ethereum': '0.5721',
    'binance': '2.4567',
    'polygon': '12.7821',
    'arbitrum': '0.1234',
    'optimism': '0.7652'
  };

  // Add a notification
  const addNotification = (title, message, type = 'info', autoClose = true) => {
    const id = Date.now();
    const newNotification = {
      id,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    if (autoClose) {
      setTimeout(() => {
        dismissNotification(id);
      }, 5000);
    }
  };

  // Dismiss a notification
  const dismissNotification = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, dismissed: true } : notif
      )
    );
  };

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => {
        if (notif.id === id && !notif.read) {
          setUnreadCount(count => Math.max(0, count - 1));
          return { ...notif, read: true };
        }
        return notif;
      })
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };
  
  useGSAP(() => {
    gsap.from('.service-card', {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out"
    });
  }, []);
  
  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set wallet balance for current network
        setWalletBalance(mockBalances[activeNetwork] || '0.0000');
        
        // Set transactions for current network
        setTransactions(mockTransactions[activeNetwork] || []);

        // Add a notification about the network switch
        addNotification(
          `Switched to ${MOCK_NETWORKS[activeNetwork].name}`,
          `Your wallet is now connected to the ${MOCK_NETWORKS[activeNetwork].name} network.`,
          'info'
        );
        
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error.message || 'Failed to load dashboard data');
        
        // Add error notification
        addNotification(
          'Error Loading Data',
          error.message || 'Failed to load dashboard data',
          'error',
          false
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [activeNetwork]);

  // Add initial notifications
  useEffect(() => {
    // Add welcome notification when component mounts
    addNotification(
      'Welcome to RadhaSphere',
      'Your secure multi-chain wallet is ready to use',
      'success',
      false
    );

    // Add a notification about market prices
    setTimeout(() => {
      addNotification(
        'Market Update',
        `${MOCK_NETWORKS.ethereum.name} price increased by 2.5% in the last 24h`,
        'info'
      );
    }, 3000);
  }, []);
  
  // Handle network change
  const handleNetworkChange = (network) => {
    setActiveNetwork(network);
  };
  
  // Handle disconnect button click
  const handleDisconnect = () => {
    addNotification(
      'Wallet Disconnected',
      'You have been successfully logged out of your wallet.',
      'info'
    );
    
    // Just navigate to onboarding since we're using mock data
    setTimeout(() => navigate('/'), 1500);
  };

  // Handle send button click - prevent default navigation to demonstrate functionality
  const handleSend = (e) => {
    e.preventDefault();
    addNotification(
      'Send Function',
      'The Send functionality is currently being developed. It will be available soon!',
      'info'
    );
  };

  // Handle receive button click
  const handleReceive = (e) => {
    e.preventDefault();
    addNotification(
      'Receive Function',
      'The Receive functionality is currently being developed. It will be available soon!',
      'info'
    );
  };

  // Handle swap button click
  const handleSwap = (e) => {
    e.preventDefault();
    addNotification(
      'Swap Function',
      'The Swap functionality is currently being developed. It will be available soon!',
      'info'
    );
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };
  
  const services = [
    {
      title: 'Send',
      icon: <FaPaperPlane className="text-3xl" />,
      description: 'Send crypto to any wallet address',
      link: '/pages/Send',
      bgImage: '/img/1@lg.webp',
      color: 'from-blue-600/80 to-blue-800/80'
    },
    {
      title: 'Receive',
      icon: <FaDownload className="text-3xl" />,
      description: 'Receive crypto from others',
      link: '/pages/Receive',
      bgImage: '/img/2@lg.png',
      color: 'from-purple-600/80 to-purple-800/80'
    },
    {
      title: 'Buy',
      icon: <FaShoppingCart className="text-3xl" />,
      description: 'Buy crypto with fiat currency',
      link: '/pages/Buy',
      bgImage: '/img/3@lg.webp',
      color: 'from-green-600/80 to-green-800/80'
    },
    {
      title: 'Browse DApps',
      icon: <FaCompass className="text-3xl" />,
      description: 'Explore decentralized applications',
      link: '/pages/BrowseDapps',
      bgImage: '/img/4@lg.webp',
      color: 'from-orange-600/80 to-orange-800/80'
    },
    {
      title: 'Analytics',
      icon: <FaChartLine className="text-3xl" />,
      description: 'Track your portfolio performance',
      link: '/pages/Analytics',
      bgImage: '/img/5@lg.webp',
      color: 'from-indigo-600/80 to-indigo-800/80'
    },
    {
      title: 'Fast Transaction',
      icon: <FaBolt className="text-3xl" />,
      description: 'Execute rapid transactions',
      link: '/pages/FastTransaction',
      bgImage: '/img/zentinel_cover_full@lg.webp',
      color: 'from-yellow-600/80 to-yellow-800/80'
    },
    {
      title: 'Solana',
      icon: <FaSun className="text-3xl" />,
      description: 'Manage your Solana assets',
      link: '/pages/Solana',
      bgImage: '/img/gallery-3.webp',
      color: 'from-teal-600/80 to-teal-800/80'
    },
    {
      title: 'Settings',
      icon: <FaCog className="text-3xl" />,
      description: 'Configure your wallet',
      link: '/pages/Settings',
      bgImage: '/img/gallery-5.webp',
      color: 'from-gray-600/80 to-gray-800/80'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        className="fixed inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/reverse.webm" type="video/webm" />
      </video>

      <div className="min-h-screen bg-black/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header with Controls */}
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Zentry Regular' }}>
              RadhaSphere Wallet
            </h1>
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <FaBell className="text-white text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl z-50">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
                      <h3 className="font-medium text-white">Notifications</h3>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          Mark all as read
                        </button>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        !notification.dismissed && (
                          <div 
                            key={notification.id}
                            className={`p-4 border-b border-gray-700 hover:bg-gray-800/50 ${
                              notification.read ? 'opacity-70' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex gap-3">
                              {getNotificationIcon(notification.type)}
                              <div>
                                <p className="text-white font-medium">{notification.title}</p>
                                <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Disconnect Button */}
              <button 
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
              >
                <FaSignOutAlt /> Disconnect
              </button>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3">
              <p className="text-white/70" style={{ fontFamily: 'Robert Regular' }}>Total Balance</p>
              <p className="text-2xl font-bold text-white">$25,432.89</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3">
              <p className="text-white/70" style={{ fontFamily: 'Robert Regular' }}>24h Change</p>
              <p className="text-2xl font-bold text-green-400">+5.23%</p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={service.title}
                to={service.link}
                className="service-card group relative overflow-hidden rounded-2xl transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
                     style={{ backgroundImage: `url(${service.bgImage})` }}>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-90`}></div>
                <div className="relative p-6 h-full flex flex-col justify-between min-h-[200px]">
                  <div className="text-white/90 mb-4">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Zentry Regular' }}>
                      {service.title}
                    </h3>
                    <p className="text-white/80" style={{ fontFamily: 'Robert Regular' }}>
                      {service.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Network Selection */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Zentry Regular' }}>
              Available Networks
            </h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(MOCK_NETWORKS).map(([key, network]) => (
                <button
                  key={key}
                  onClick={() => handleNetworkChange(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeNetwork === key
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/15'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: network.color }}></div>
                  <span>{network.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Network Status */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span style={{ fontFamily: 'Robert Regular' }}>All Networks Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNew; 