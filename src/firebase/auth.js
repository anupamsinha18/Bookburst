// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ Import auth
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAp6aWb_klaYqfB94T4Lfg4jaaOTfxtgbo",
  authDomain: "bookburst-73a63.firebaseapp.com",
  projectId: "bookburst-73a63",
  storageBucket: "bookburst-73a63.appspot.com", // ✅ corrected typo: should be "appspot.com" not "storage.app"
  messagingSenderId: "781985203216",
  appId: "1:781985203216:web:c5e4610131941044f1f695",
  measurementId: "G-BSY7TXM7Y3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
export default app;
