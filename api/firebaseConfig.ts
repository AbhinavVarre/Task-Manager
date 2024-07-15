import {initializeApp}  from  "@firebase/app"
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

console.log(firebaseConfig);    

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const firestore = getFirestore(app);





// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
