import { auth, googleProvider } from '../../firebase/config';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';

// Session storage keys
const AUTH_USER_KEY = 'auth_user';
const CURRENT_WALLET_KEY = 'currentWalletId';
const WALLET_CONNECTED_KEY = 'walletConnected';
const AUTH_TYPE_KEY = 'authType'; // 'web2' or 'web3'

// Store authenticated user data in session
export const storeAuthUser = (user) => {
  if (!user) {
    sessionStorage.removeItem(AUTH_USER_KEY);
    return;
  }
  
  // Store minimal user data
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    lastLogin: Date.now()
  };
  
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
};

// Get authenticated user data from session
export const getAuthUser = () => {
  try {
    const userData = sessionStorage.getItem(AUTH_USER_KEY);
    
    if (!userData) {
      return null;
    }
    
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error getting auth user:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthUser();
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    storeAuthUser(userCredential.user);
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Sign-in error:", error);
    return { success: false, error: error.message };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    storeAuthUser(userCredential.user);
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Sign-up error:", error);
    return { success: false, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    storeAuthUser(userCredential.user);
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Google sign-in error:", error);
    return { success: false, error: error.message };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    storeAuthUser(null);
    
    // Clear wallet connection
    localStorage.removeItem(WALLET_CONNECTED_KEY);
    localStorage.removeItem(CURRENT_WALLET_KEY);
    
    return { success: true };
  } catch (error) {
    console.error("Sign-out error:", error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Set the current wallet ID in session
 * @param {string} walletId - The wallet ID to set as current
 */
export const setCurrentWallet = (walletId) => {
  if (!walletId) return;
  localStorage.setItem(CURRENT_WALLET_KEY, walletId);
};

/**
 * Get the current wallet ID from session
 * @returns {string|null} The current wallet ID or null if not set
 */
export const getCurrentWallet = () => {
  return localStorage.getItem(CURRENT_WALLET_KEY);
};

/**
 * Check if a wallet is currently connected
 * @returns {boolean} True if a wallet is connected, false otherwise
 */
export const isWalletConnected = () => {
  return !!getCurrentWallet();
};

/**
 * Set the authentication type (web2 or web3)
 * @param {string} type - The authentication type ('web2' or 'web3')
 */
export const setAuthType = (type) => {
  if (type !== 'web2' && type !== 'web3') {
    console.error('Invalid auth type:', type);
    return;
  }
  localStorage.setItem(AUTH_TYPE_KEY, type);
};

/**
 * Get the current authentication type
 * @returns {string} The authentication type ('web2' or 'web3', defaults to 'web3')
 */
export const getAuthType = () => {
  return localStorage.getItem(AUTH_TYPE_KEY) || 'web3';
};

/**
 * Disconnect the current wallet
 */
export const disconnectWallet = () => {
  localStorage.removeItem(CURRENT_WALLET_KEY);
  // We keep the auth type for a better UX when logging back in
};

/**
 * Set up auth listener for changes
 * @param {Function} callback - Callback to be called when auth state changes
 */
export const setupAuthListener = (callback) => {
  if (typeof callback !== 'function') return;
  
  // Listen for storage changes
  window.addEventListener('storage', (event) => {
    if (event.key === CURRENT_WALLET_KEY) {
      callback(event.newValue);
    }
  });
  
  // Initial callback
  callback(getCurrentWallet());
}; 