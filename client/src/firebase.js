// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "motionmatrixauth.firebaseapp.com",
  projectId: "motionmatrixauth",
  storageBucket: "motionmatrixauth.appspot.com",
  messagingSenderId: "688295942791",
  appId: "1:688295942791:web:0178ee4b73feeb649bb622",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
