
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyDxYN4jz3H9fXsOGz_rOifO-Aaffsn0lts",
  authDomain: "ngos-ef983.firebaseapp.com",
  projectId: "ngos-ef983",
  storageBucket: "ngos-ef983.appspot.com",
  messagingSenderId: "714801342420",
  appId: "1:714801342420:web:eae82f9949a11c5d051841",
  measurementId: "G-YSTEYXQ59B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Cloud Firestore
const imgdb = getStorage(app); // Firebase Storage

// Export the Firebase services for use in your components
export { auth, db, imgdb,app };