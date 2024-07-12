import {initializeApp}  from  "@firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import { initializeAuth } from 'firebase/auth';
import { initializeFirestore,getFirestore } from 'firebase/firestore';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Optionally import the services that you want to use
// import {initializeAuth} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBYXeXCwdJYFyIkOlMmgBNWZDTM26E-EQM",
  authDomain: "task-manager-86e36.firebaseapp.com",
  projectId: "task-manager-86e36",
  storageBucket: "task-manager-86e36.appspot.com",
  messagingSenderId: "319380628194",
  appId: "1:319380628194:web:9e102e4fa39c88e3f8f4bb"
};

console.log(firebaseConfig);    

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const database = getFirestore(app);





// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
