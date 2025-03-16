import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaShieldAlt, FaBell, FaPalette, FaGlobe, FaKey, FaWallet, FaToggleOn, FaToggleOff, FaArrowLeft, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import gsap from 'gsap';
import { useGSAP } from '../hooks/useGSAP';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    language: 'en',
    theme: 'dark',
    currency: 'USD',
    notifications: true,
    autoLock: true,
    biometrics: false,
    gasLimit: '21000',
    slippageTolerance: '0.5'
  });

  const tabs = [
    { id: 'general', name: 'General', icon: <FaCog /> },
    { id: 'security', name: 'Security', icon: <FaShieldAlt /> },
    { id: 'notifications', name: 'Notifications', icon: <FaBell /> },
    { id: 'appearance', name: 'Appearance', icon: <FaPalette /> },
    { id: 'network', name: 'Network', icon: <FaGlobe /> }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderSettingsContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="en" className="bg-gray-800">English</option>
                <option value="es" className="bg-gray-800">Español</option>
                <option value="fr" className="bg-gray-800">Français</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="USD" className="bg-gray-800">USD</option>
                <option value="EUR" className="bg-gray-800">EUR</option>
                <option value="GBP" className="bg-gray-800">GBP</option>
              </select>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold">Auto-lock Wallet</h3>
                <p className="text-white/70 text-sm">Lock wallet after 5 minutes of inactivity</p>
              </div>
              <button
                onClick={() => handleSettingChange('autoLock', !settings.autoLock)}
                className="text-2xl text-blue-400"
              >
                {settings.autoLock ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold">Biometric Authentication</h3>
                <p className="text-white/70 text-sm">Use fingerprint or face ID to confirm transactions</p>
              </div>
              <button
                onClick={() => handleSettingChange('biometrics', !settings.biometrics)}
                className="text-2xl text-blue-400"
              >
                {settings.biometrics ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>
            <div>
              <label className="block text-white mb-2">Default Gas Limit</label>
              <input
                type="number"
                value={settings.gasLimit}
                onChange={(e) => handleSettingChange('gasLimit', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold">Push Notifications</h3>
                <p className="text-white/70 text-sm">Receive alerts for transactions and price changes</p>
              </div>
              <button
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
                className="text-2xl text-blue-400"
              >
                {settings.notifications ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="dark" className="bg-gray-800">Dark</option>
                <option value="light" className="bg-gray-800">Light</option>
                <option value="system" className="bg-gray-800">System</option>
              </select>
            </div>
          </div>
        );

      case 'network':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2">Slippage Tolerance</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={settings.slippageTolerance}
                  onChange={(e) => handleSettingChange('slippageTolerance', e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
                <span className="text-white">%</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useGSAP(() => {
    gsap.from('.settings-header', {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.from('.settings-section', {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out"
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="settings-header mb-8">
          <h1 className="text-4xl font-bold mb-4">Settings</h1>
          <p className="text-gray-400">Customize your wallet experience</p>
        </div>

        <div className="grid gap-6">
          <div className="settings-section bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6">
            {/* Network Settings */}
            <h2 className="text-2xl font-semibold mb-4">Network Settings</h2>
            {/* ... network settings content ... */}
          </div>

          <div className="settings-section bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6">
            {/* Security Settings */}
            <h2 className="text-2xl font-semibold mb-4">Security</h2>
            {/* ... security settings content ... */}
          </div>

          <div className="settings-section bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6">
            {/* Display Settings */}
            <h2 className="text-2xl font-semibold mb-4">Display</h2>
            {/* ... display settings content ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 