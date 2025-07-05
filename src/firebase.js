import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC78lTWrZS9vGseVy0lOFegfU93xyfGvhM",
  authDomain: "the-red-velvet.firebaseapp.com",
  projectId: "the-red-velvet",
  storageBucket: "the-red-velvet.appspot.com",
  messagingSenderId: "1050940886017",
  appId: "1:1050940886017:web:bc214826ead049b9f30400",
  measurementId: "G-KCBF6KG8BN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

googleProvider.setCustomParameters({
  prompt: 'select_account'
}); 