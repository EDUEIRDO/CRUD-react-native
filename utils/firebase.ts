// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJmrtSUh4NInn4sEqJ4b1LKUnzu7sYE6c",
  authDomain: "crud-9a617.firebaseapp.com",
  projectId: "crud-9a617",
  storageBucket: "crud-9a617.appspot.com",
  messagingSenderId: "221698030885",
  appId: "1:221698030885:web:74ec8550543c84bdd8aecc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };