import React, { useState } from 'react';
import { FaCreditCard, FaPaypal, FaApplePay, FaGooglePay, FaBitcoin, FaEthereum } from 'react-icons/fa';

const Buy = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [crypto, setCrypto] = useState('BTC');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' }
  ];

  const cryptos = [
    { code: 'BTC', name: 'Bitcoin', icon: <FaBitcoin /> },
    { code: 'ETH', name: 'Ethereum', icon: <FaEthereum /> }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: <FaCreditCard /> },
    { id: 'paypal', name: 'PayPal', icon: <FaPaypal /> },
    { id: 'applepay', name: 'Apple Pay', icon: <FaApplePay /> },
    { id: 'googlepay', name: 'Google Pay', icon: <FaGooglePay /> }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle purchase logic here
    console.log('Purchase:', { amount, currency, crypto, paymentMethod });
  };

  // Mock exchange rates
  const getEstimatedCrypto = () => {
    const rates = {
      BTC: { USD: 50000, EUR: 45000, GBP: 40000, JPY: 5500000 },
      ETH: { USD: 3000, EUR: 2700, GBP: 2400, JPY: 330000 }
    };
    
    if (!amount) return '0';
    return (parseFloat(amount) / rates[crypto][currency]).toFixed(8);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/img/3@lg.webp)' }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-sm py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Buy Cryptocurrency
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Purchase Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Purchase Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label className="block text-white mb-2">Amount</label>
                  <div className="flex">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      {currencies.map(curr => (
                        <option key={curr.code} value={curr.code} className="bg-gray-800">
                          {curr.symbol} {curr.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 bg-white/10 border border-l-0 border-white/20 rounded-r-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Crypto Selection */}
                <div>
                  <label className="block text-white mb-2">Select Cryptocurrency</label>
                  <div className="grid grid-cols-2 gap-4">
                    {cryptos.map(c => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setCrypto(c.code)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          crypto === c.code
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {c.icon}
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-white mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    {paymentMethods.map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          paymentMethod === method.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {method.icon}
                        <span>{method.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Buy Now
                </button>
              </form>
            </div>

            {/* Summary Card */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Purchase Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-white">
                    <span>You Pay</span>
                    <span>{currencies.find(c => c.code === currency)?.symbol}{amount || '0.00'} {currency}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>You Receive</span>
                    <span>{getEstimatedCrypto()} {crypto}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Exchange Rate</span>
                    <span>1 {crypto} = {currencies.find(c => c.code === currency)?.symbol}
                      {crypto === 'BTC' ? '50,000' : '3,000'} {currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Market Trends */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Market Trends</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white">
                      <FaBitcoin />
                      <span>Bitcoin</span>
                    </div>
                    <span className="text-green-400">+2.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white">
                      <FaEthereum />
                      <span>Ethereum</span>
                    </div>
                    <span className="text-green-400">+3.8%</span>
                  </div>
                </div>
              </div>

              {/* Information Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-yellow-400 font-medium mb-2">Important Information</h3>
                <p className="text-white/80 text-sm">
                  Cryptocurrency purchases are subject to market volatility. Please review your transaction details carefully before confirming the purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy; 