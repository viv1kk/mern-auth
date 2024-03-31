// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-17ec5.firebaseapp.com",
  projectId: "mern-auth-17ec5",
  storageBucket: "mern-auth-17ec5.appspot.com",
  messagingSenderId: "549776626639",
  appId: "1:549776626639:web:9acb18daa27ec4a8f1f8ba"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);