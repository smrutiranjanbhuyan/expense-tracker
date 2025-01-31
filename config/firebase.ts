// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACYpR7XI9eHf9-2ES1cPZcTKvINTiyr60",
  authDomain: "expense-tracker-74041.firebaseapp.com",
  projectId: "expense-tracker-74041",
  storageBucket: "expense-tracker-74041.firebasestorage.app",
  messagingSenderId: "242274059526",
  appId: "1:242274059526:web:a183643757c6fa319f0a87",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

//db

export const firestore = getFirestore(app);
