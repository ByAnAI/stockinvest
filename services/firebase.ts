
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApnLnmb8RuoyScX8bW7Gk0iMf6DRrx9gQ",
  authDomain: "stock-invest-b0c72.firebaseapp.com",
  projectId: "stock-invest-b0c72",
  storageBucket: "stock-invest-b0c72.firebasestorage.app",
  messagingSenderId: "445671059504",
  appId: "1:445671059504:web:6efeccd88f9d441d953df5"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Crucial: Explicitly pass the 'app' instance to 'getAuth'.
 * This ensures the auth service is registered with the correct app instance
 * in the shared Firebase registry, resolving the 'Component auth has not been registered yet' error.
 */
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
export default app;
