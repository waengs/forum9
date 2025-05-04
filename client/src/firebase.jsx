// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Firebase configuration (DO NOT expose in public repos)
const firebaseConfig = {
  apiKey: "AIzaSyAx-pjUUJi-6_lRnXFU10ossHAG5-9wlYo",
  authDomain: "todoforum-7ec55.firebaseapp.com",
  projectId: "todoforum-7ec55",
  storageBucket: "todoforum-7ec55.appspot.com", // ✅ corrected
  messagingSenderId: "593587318258",
  appId: "1:593587318258:web:3608568ebb75b339bb8f6b",
  measurementId: "G-8BS5297C46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };