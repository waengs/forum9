// server/firebase.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

// Initialize Firebase Admin SDK using service account credentials
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)), // Ensure the credentials are stored securely
});

// Export Firebase authentication functions
const auth = admin.auth();

export { auth };
