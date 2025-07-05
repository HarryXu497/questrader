// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmwU9ChToxGY-zD0PFwVK6Pnw2aZUNS8A",
  authDomain: "questrader-fbddb.firebaseapp.com",
  projectId: "questrader-fbddb",
  storageBucket: "questrader-fbddb.firebasestorage.app",
  messagingSenderId: "106401958747",
  appId: "1:106401958747:web:9b291fe538518d6e1fe87e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;