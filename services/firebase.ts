// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration from your project settings
const firebaseConfig = {
  apiKey: "AIzaSyDeF1CXx4XXLIjybrDOS8RRIMyBoFL7QUU",
  authDomain: "proai-1a536.firebaseapp.com",
  projectId: "proai-1a536",
  storageBucket: "proai-1a536.firebasestorage.app",
  messagingSenderId: "200559956179",
  appId: "1:200559956179:web:ff685d3dd380dbd3acc426",
  measurementId: "G-CYQZ9E0HS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (optional)
// getAnalytics(app);
