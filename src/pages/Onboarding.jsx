import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Button from '../components/Button';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineMail } from 'react-icons/ai';
import { FaApple, FaEthereum, FaWallet, FaKey, FaUserPlus, FaSignInAlt, FaArrowLeft } from 'react-icons/fa';

// Firebase imports
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Import wallet services
import { 
  createWallet, 
  importWalletFromMnemonic, 
  storeWalletData, 
  extractSeedWords 
} from '../services/wallet/walletService';
import { setCurrentWallet, setAuthType } from '../services/auth/authService';
import { NETWORKS } from '../services/networks/networkService';

const Onboarding = () => {
  // Main state variables
  const [step, setStep] = useState(1);
  const [mainOption, setMainOption] = useState(''); // 'create', 'import', or 'login'
  const [authType, setAuthTypeState] = useState(''); // 'web2' or 'web3'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // User credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Wallet data
  const [mnemonic, setMnemonic] = useState('');
  const [walletId, setWalletId] = useState('');
  const [extractedSeedWords, setExtractedSeedWords] = useState([]);
  const [confirmSeedWords, setConfirmSeedWords] = useState({});
  const [seedPhraseInput, setSeedPhraseInput] = useState('');
  
  const containerRef = useRef(null);
  const navigate = useNavigate();
  
  // Main entry options
  const mainOptions = [
    { 
      id: 'create', 
      name: 'Create Wallet', 
      icon: <FaUserPlus className="text-yellow-300 text-2xl" />, 
      description: 'Generate a new wallet with a recovery phrase' 
    },
    { 
      id: 'import', 
      name: 'Import Wallet', 
      icon: <FaKey className="text-blue-400 text-2xl" />, 
      description: 'Restore your wallet using a recovery phrase' 
    },
    { 
      id: 'login', 
      name: 'Login', 
      icon: <FaSignInAlt className="text-green-400 text-2xl" />, 
      description: 'If you already have an account' 
    }
  ];

  // Authentication options
  const authOptions = [
    { 
      id: 'web2', 
      name: 'Web2 Authentication', 
      icon: <FcGoogle className="text-2xl" />, 
      description: 'Sign in with Google or email' 
    },
    { 
      id: 'web3', 
      name: 'Web3 Authentication', 
      icon: <FaWallet className="text-purple-500 text-2xl" />, 
      description: 'Decentralized authentication' 
    }
  ];

  // Login options
  const loginOptions = [
    { id: 'web2', name: 'Google Sign-In', icon: <FcGoogle className="text-2xl" />, type: 'web2' },
    { id: 'web3', name: 'Password Login', icon: <FaKey className="text-yellow-500 text-2xl" />, type: 'web3' }
  ];

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Animate the container
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });

      // Animate the title if it exists
      const titles = document.querySelectorAll('.onboarding-title');
      if (titles.length > 0) {
        gsap.from(titles, {
          opacity: 0,
          y: -30,
          duration: 1.2,
          ease: 'back.out(1.7)',
          delay: 0.3
        });
      }

      // Animate the options if they exist
      const options = document.querySelectorAll('.option-item');
      if (options.length > 0) {
        gsap.from(options, {
          opacity: 0,
          y: 20,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.5
        });
      }
    });

    return () => ctx.revert();
  }, [step]); // Re-run animation when step changes

  // Handle main option selection (Create, Import, Login)
  const handleMainOptionSelect = (option) => {
    setMainOption(option);
    setLoading(true);
    
    setTimeout(() => {
      if (option === 'login') {
        setStep(2); // Login options
      } else if (option === 'create') {
        setStep(3); // Auth type selection for wallet creation
      } else if (option === 'import') {
        setStep(7); // Import wallet with seed phrase
      }
      setLoading(false);
    }, 800);
  };

  // Handle authentication type selection (Web2 or Web3)
  const handleAuthTypeSelect = (type) => {
    setAuthTypeState(type);
    setLoading(true);
    
    setTimeout(() => {
      if (mainOption === 'create') {
        if (type === 'web2') {
          handleWeb2Auth('google'); // Directly go to Google auth for Web2
        } else {
          setStep(4); // Web3 creation flow - generate seed phrase
        }
      } else if (mainOption === 'login') {
        if (type === 'web2') {
          handleWeb2Auth('google'); // Directly go to Google auth for Web2
        } else {
          setStep(10); // Web3 login - password input
        }
      }
      setLoading(false);
    }, 800);
  };

  // Handle Web2 authentication (Google Sign-In)
  const handleWeb2Auth = async (provider) => {
    setLoading(true);
    setError('');
    
    try {
      let userCredential;
      
      if (provider === 'google') {
          userCredential = await signInWithPopup(auth, googleProvider);
      } else if (provider === 'email') {
          if (!email || !password) {
            throw new Error('Email and password are required');
          }
        
        // Check if account exists and sign in, otherwise create new account
          try {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
          } catch (e) {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
          }
      } else {
          throw new Error('Invalid authentication provider');
      }
      
      if (userCredential) {
        // If creating a new wallet with Web2 auth
        if (mainOption === 'create') {
          // Create a new wallet automatically for Web2 users
          await handleCreateWalletForWeb2User(userCredential.user.uid);
        } 
        // If importing a wallet with Web2 auth
        else if (mainOption === 'import') {
          // Restore wallet for Web2 user (would be implemented in a real app)
          setSuccess('Web2 wallet restored successfully!');
          setTimeout(() => navigate('/dashboard'), 1500);
        }
        // If logging in with Web2 auth
        else if (mainOption === 'login') {
          // Set the current wallet and redirect to dashboard
          // In a real app, you would fetch the user's wallet from your backend
          setSuccess('Logged in successfully!');
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create wallet for Web2 user
  const handleCreateWalletForWeb2User = async (userId) => {
    try {
      // Create a new wallet
      const { success, wallet, mnemonic: generatedMnemonic, error: walletError } = createWallet();
      
      if (!success) {
        throw new Error(walletError || 'Failed to create wallet');
      }
      
      // Store wallet data with user ID
      const walletData = {
        userId,
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: generatedMnemonic,
        createdAt: Date.now(),
        authType: 'web2'
      };
      
      // For demo, use a fixed password or user ID as a key
      const walletPassword = userId || 'demoPassword';
      
      const { success: storeSuccess, walletId, error: storeError } = storeWalletData(walletData, walletPassword);
      
      if (!storeSuccess) {
        throw new Error(storeError || 'Failed to store wallet securely');
      }
      
      setWalletId(walletId);
      setCurrentWallet(walletId);
      setAuthType('web2');
      
      setSuccess('Web2 wallet created successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Web2 wallet creation error:', error);
      setError(error.message);
    }
  };

  // Handle generating a wallet with Web3 authentication
  const handleCreateWallet = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Create a new wallet
      const { success, wallet, mnemonic: generatedMnemonic, error: walletError } = createWallet();
      
      if (!success) {
        throw new Error(walletError || 'Failed to create wallet');
      }
      
      // Extract the specific seed words for simplified recovery
      const { success: extractSuccess, seedWords, error: extractError } = extractSeedWords(generatedMnemonic);
      
      if (!extractSuccess) {
        throw new Error(extractError || 'Failed to extract seed words');
      }
      
      setExtractedSeedWords(seedWords);
      setMnemonic(generatedMnemonic);
      setSuccess('Seed phrase generated successfully!');
      setStep(5); // Display seed phrase
      
    } catch (error) {
      console.error('Wallet creation error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle seed phrase confirmation
  const handleConfirmSeedPhrase = () => {
    // Check if all words are correct
    const isValid = extractedSeedWords.every(
      (item) => confirmSeedWords[`word_${item.position}`] === item.word
    );
    
    if (!isValid) {
      setError('Please enter the correct seed words');
      return;
    }
    
    setSuccess('Seed phrase confirmed!');
    setStep(6); // Set password for Web3 wallet
  };

  // Handle setting password for Web3 wallet
  const handleSetPassword = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Store wallet data
      const { success, wallet } = importWalletFromMnemonic(mnemonic);
      
      if (!success) {
        throw new Error('Failed to create wallet from mnemonic');
      }
      
      const walletData = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: mnemonic,
        createdAt: Date.now(),
        authType: 'web3'
      };
      
      const { success: storeSuccess, walletId, error: storeError } = storeWalletData(walletData, password);
      
      if (!storeSuccess) {
        throw new Error(storeError || 'Failed to store wallet securely');
      }
      
      setWalletId(walletId);
      setCurrentWallet(walletId);
      setAuthType('web3');
      
      setSuccess('Wallet created successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Wallet storage error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle importing wallet with seed phrase
  const handleImportWallet = async () => {
    if (!seedPhraseInput.trim()) {
      setError('Please enter your seed phrase');
      return;
    }
    
    setLoading(true);
    
    try {
      const { success, wallet, error: importError } = importWalletFromMnemonic(seedPhraseInput);
      
      if (!success) {
        throw new Error(importError || 'Invalid seed phrase');
      }
      
      // For Web3 import, go to password reset
      setMnemonic(seedPhraseInput);
      setStep(8); // Set new password
    } catch (error) {
      console.error('Import error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle setting new password for imported wallet
  const handleSetNewPassword = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create wallet from mnemonic and store it
      const { success, wallet } = importWalletFromMnemonic(mnemonic);
      
      if (!success) {
        throw new Error('Failed to restore wallet from mnemonic');
      }
      
      const walletData = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: mnemonic,
        importedAt: Date.now(),
        authType: 'web3'
      };
      
      const { success: storeSuccess, walletId, error: storeError } = storeWalletData(walletData, password);
      
      if (!storeSuccess) {
        throw new Error(storeError || 'Failed to store wallet securely');
      }
      
      setWalletId(walletId);
      setCurrentWallet(walletId);
      setAuthType('web3');
      
      setSuccess('Wallet imported successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Wallet storage error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Web3 login with password
  const handleWeb3Login = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you would verify the password against stored wallet
      // For demo purposes, we'll simply assume the login is successful
      
      setSuccess('Login successful!');
      setCurrentWallet('demo_wallet_id'); // This would be a real wallet ID in a production app
      setAuthType('web3');
      
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid password. Would you like to recover using your seed phrase?');
    } finally {
      setLoading(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
      setSuccess('');
    }
  };

  // Handle seed word input change
  const handleSeedWordChange = (position, word) => {
    setConfirmSeedWords({
      ...confirmSeedWords,
      [`word_${position}`]: word
    });
  };

  // Get background image based on step
  const getBackgroundImage = () => {
    // Different backgrounds for different flows
    if (mainOption === 'create') {
      return NETWORKS.ethereum.background;
    } else if (mainOption === 'import') {
      return NETWORKS.binance.background;
    } else if (mainOption === 'login') {
      return NETWORKS.polygon.background;
    }
    
    // Default background for main screen
    return '/img/bg-desktop@lg.jpg';
  };

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderMainOptions();
      case 2:
        return renderLoginOptions();
      case 3:
        return renderAuthOptions();
      case 4:
        return handleCreateWallet(); // Generate seed phrase
      case 5:
        return renderSeedPhrase();
      case 6:
        return renderSetPassword();
      case 7:
        return renderImportWallet();
      case 8:
        return renderSetNewPassword();
      case 9:
        return null; // Reserved for future use
      case 10:
        return renderWeb3Login();
      default:
        return null;
    }
  };

  // Render main options (Create, Import, Login)
  const renderMainOptions = () => (
    <div className="space-y-4 mb-8">
      <h2 className="onboarding-title text-2xl font-bold text-center mb-6">Welcome to RadhaSphere</h2>
      
      {mainOptions.map((option) => (
        <div 
          key={option.id}
          onClick={() => handleMainOptionSelect(option.id)}
          className="option-item flex items-center p-4 rounded-lg border border-white/20 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <div className="bg-black/30 p-3 rounded-full mr-4">
            {option.icon}
          </div>
      <div>
            <h3 className="font-robert-medium text-white">{option.name}</h3>
            <p className="text-white/60 text-sm">{option.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // Render login options
  const renderLoginOptions = () => (
    <div className="space-y-6">
      <h2 className="onboarding-title text-2xl font-bold text-center mb-4">Login</h2>
      <p className="text-gray-300 text-center mb-6">Choose your login method:</p>
      
      <div className="space-y-4">
        {loginOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleAuthTypeSelect(option.id)}
            className="option-item flex items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 cursor-pointer transition-colors"
          >
            <div className="bg-black/30 p-3 rounded-full mr-4">
              {option.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">{option.name}</h3>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="bg-red-900/40 text-red-300 p-3 rounded-md text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="flex justify-between space-x-4 mt-6">
        <Button
          title="Back"
          onClick={() => setStep(1)}
          containerClass="flex-1 py-3 border border-gray-700 text-white"
          icon={<FaArrowLeft className="mr-2" />}
        />
      </div>
    </div>
  );

  // Render authentication options
  const renderAuthOptions = () => (
    <div className="space-y-6">
      <h2 className="onboarding-title text-2xl font-bold text-center mb-4">Choose Authentication Method</h2>
      <p className="text-gray-300 text-center mb-8">
        Select how you want to secure and access your wallet:
      </p>
      
      <div className="space-y-4">
        {authOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleAuthTypeSelect(option.id)}
            className="option-item flex items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 cursor-pointer transition-colors"
          >
            <div className="bg-black/30 p-3 rounded-full mr-4">
              {option.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">{option.name}</h3>
              <p className="text-gray-400 text-sm">{option.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="bg-red-900/40 text-red-300 p-3 rounded-md text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="flex justify-between space-x-4 mt-6">
        <Button
          title="Back"
          onClick={handleBack}
          containerClass="flex-1 py-3 border border-gray-700 text-white"
          icon={<FaArrowLeft className="mr-2" />}
        />
      </div>
    </div>
  );

  // Render seed phrase display
  const renderSeedPhrase = () => (
    <div className="space-y-6">
      <h2 className="onboarding-title text-2xl font-bold text-center mb-4">Your Recovery Phrase</h2>
      
      <div className="p-4 bg-gray-800 rounded-lg">
        <p className="text-yellow-300 text-center mb-4">
          Write these words down and keep them in a safe place. They are the only way to recover your wallet if you forget your password.
        </p>
        
        <div className="grid grid-cols-3 gap-2 mb-6">
          {mnemonic.split(' ').map((word, index) => (
            <div 
              key={index}
              className="p-2 bg-gray-700 rounded-md border border-gray-600 text-center"
            >
              <span className="text-gray-400 text-xs">{index + 1}.</span> {word}
            </div>
          ))}
        </div>
        
        <div className="bg-yellow-900/30 p-4 rounded-md mb-6">
          <h3 className="text-yellow-300 font-medium mb-2">Important Warning</h3>
          <p className="text-white text-sm mb-4">
            Never share your recovery phrase with anyone. Anyone with these words can access your wallet.
          </p>
        </div>
      </div>
      
      <div className="flex justify-between space-x-4 mt-6">
        <Button
          title="Back"
          onClick={handleBack}
          containerClass="w-1/3 py-3 border border-gray-700 text-white"
          icon={<FaArrowLeft className="mr-2" />}
        />
        <Button
          title="I've Saved These Words"
          onClick={() => setStep(6)} // Go to confirm seed phrase
          containerClass="w-2/3 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium"
        />
      </div>
    </div>
  );

  // Render set password form
  const renderSetPassword = () => (
    <div className="space-y-6">
      <h2 className="onboarding-title text-2xl font-bold text-center mb-4">Set Your Password</h2>
      <p className="text-gray-300 text-center mb-6">
        Create a strong password to secure your wallet on this device.
      </p>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          placeholder="••••••••"
        />
        <p className="text-white/50 text-xs mt-1">
          Min. 8 characters with numbers and special characters
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          placeholder="••••••••"
        />
        </div>

        {error && (
        <div className="bg-red-900/40 text-red-300 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}
        
        {success && (
        <div className="bg-green-900/40 text-green-300 p-3 rounded-md text-sm text-center">
            {success}
          </div>
        )}

      <div className="flex justify-between space-x-4 mt-6">
        <Button
          title="Back"
          onClick={handleBack}
          containerClass="flex-1 py-3 border border-gray-700 text-white"
          icon={<FaArrowLeft className="mr-2" />}
        />
        <Button
          title="Create Wallet"
          onClick={handleSetPassword}
          disabled={password.length < 8 || password !== confirmPassword}
          containerClass={`flex-1 py-3 ${
            password.length < 8 || password !== confirmPassword 
            ? 'bg-gray-700 cursor-not-allowed' 
            : 'bg-yellow-500 hover:bg-yellow-400'
          }`}
        />
                </div>
              </div>
  );

  // Render import wallet form
  const renderImportWallet = () => (
    <div className="space-y-6">
      <h2 className="onboarding-title text-2xl font-bold text-center mb-4">Import Your Wallet</h2>
      <p className="text-gray-300 text-center mb-6">
        Enter your 12-word recovery phrase to restore your wallet.
      </p>
      
          <div>
        <label className="block text-sm font-medium text-white mb-2">Recovery Phrase</label>
        <textarea
          value={seedPhraseInput}
          onChange={(e) => setSeedPhraseInput(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          placeholder="Enter all 12 words separated by spaces..."
          rows={4}
        />
        <p className="text-white/50 text-xs mt-1">
          Enter all words in the correct order, separated by spaces
        </p>
                </div>
      
      {error && (
        <div className="bg-red-900/40 text-red-300 p-3 rounded-md text-sm text-center">
          {error}
          </div>
        )}

      <div className="flex justify-between space-x-4 mt-6">
        <Button
          title="Back"
          onClick={() => setStep(1)}
          containerClass="flex-1 py-3 border border-gray-700 text-white"
          icon={<FaArrowLeft className="mr-2" />}
        />
        <Button
          title="Restore Wallet"
          onClick={handleImportWallet}
          disabled={!seedPhraseInput.trim()}
          containerClass={`flex-1 py-3 ${
            !seedPhraseInput.trim() 
            ? 'bg-gray-700 cursor-not-allowed' 
            : 'bg-yellow-500 hover:bg-yellow-400'
          }`}
        />
      </div>
    </div>
  );

  // Render set new password form for imported wallet
  const renderSetNewPassword = () => (
    <div className="space-y-6">
      <h2 className="onboarding-title text-2xl font-bold text-center mb-4">Set New Password</h2>
      <p className="text-gray-300 text-center mb-6">
        Create a new password to secure your imported wallet on this device.
      </p>
      
            <div>
        <label className="block text-sm font-medium text-white mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                placeholder="••••••••"
              />
        <p className="text-white/50 text-xs mt-1">
          Min. 8 characters with numbers and special characters
        </p>
            </div>
      
            <div>
        <label className="block text-sm font-medium text-white mb-2">Confirm New Password</label>
              <input
                type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
      
      {error && (
        <div className="bg-red-900/40 text-red-300 p-3 rounded-md text-sm text-center">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/40 text-green-300 p-3 rounded-md text-sm text-center">
          {success}
          </div>
        )}

      <div className="flex justify-between space-x-4 mt-6">
        <Button
          title="Back"
          onClick={handleBack}
          containerClass="flex-1 py-3 border border-gray-700 text-white"
          icon={<FaArrowLeft className="mr-2" />}
        />
        <Button
          title="Restore Wallet"
          onClick={handleSetNewPassword}
          disabled={password.length < 8 || password !== confirmPassword}
          containerClass={`flex-1 py-3 ${
            password.length < 8 || password !== confirmPassword 
            ? 'bg-gray-700 cursor-not-allowed' 
            : 'bg-yellow-500 hover:bg-yellow-400'
          }`}
              />
            </div>
    </div>
  );

  // Render Web3 login form
  const renderWeb3Login = () => (
    <div className="space-y-6">
      <h2 className="onboarding-title text-2xl font-bold text-center mb-4">Web3 Login</h2>
      <p className="text-gray-300 text-center mb-6">
        Enter your wallet password to access your wallet.
      </p>
      
            <div>
        <label className="block text-sm font-medium text-white mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
      
      {error && (
        <div className="bg-red-900/40 text-red-300 p-3 rounded-md text-sm text-center mb-2">
          {error}
          </div>
        )}

      {error && (
            <Button
          title="Recover with Seed Phrase"
          onClick={() => setStep(7)}
          containerClass="w-full py-2 border border-yellow-500/30 text-yellow-400 text-sm hover:bg-yellow-500/10"
        />
      )}
      
      {success && (
        <div className="bg-green-900/40 text-green-300 p-3 rounded-md text-sm text-center">
          {success}
          </div>
        )}

      <div className="flex justify-between space-x-4 mt-6">
        <Button
          title="Back"
          onClick={() => setStep(2)}
          containerClass="flex-1 py-3 border border-gray-700 text-white"
          icon={<FaArrowLeft className="mr-2" />}
        />
        <Button
          title="Login"
          onClick={handleWeb3Login}
          disabled={!password}
          containerClass={`flex-1 py-3 ${
            !password 
            ? 'bg-gray-700 cursor-not-allowed' 
            : 'bg-yellow-500 hover:bg-yellow-400'
          }`}
        />
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col justify-center items-center py-12 px-4"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div 
        ref={containerRef}
        className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-2xl"
      >
        <div className="mb-6 text-center">
          <img src="/img/logo.png" alt="Wallet Logo" className="h-16 mx-auto mb-2" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text">
            RadhaSphere
          </h1>
          <p className="text-gray-400 mt-1">Your Secure Multi-Chain Wallet</p>
        </div>
        
        {renderStep()}
        
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding; 