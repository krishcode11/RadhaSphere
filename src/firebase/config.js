// Firebase configuration 
// Replace these values with your actual Firebase project details
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB2UcbCxnJdOKdAUQesx30lHYWI4ZfvhLs",
    authDomain: "omniradhanexus.firebaseapp.com",
    projectId: "omniradhanexus",
    storageBucket: "omniradhanexus.firebasestorage.app",
    messagingSenderId: "887907222396",
    appId: "1:887907222396:web:c1aa5eae71240aac209af9",
    measurementId: "G-J824NLKGXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

export { auth, db, googleProvider, facebookProvider, twitterProvider }; 