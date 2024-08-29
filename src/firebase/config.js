import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import { getAuth, FacebookAuthProvider, signInWithPopup, onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, addDoc, collection, serverTimestamp, connectFirestoreEmulator } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDHYN0KbRGTZPG1pyF_q4jNBL6Jf3udSQs',
    authDomain: 'chat-app-98f45.firebaseapp.com',
    projectId: 'chat-app-98f45',
    storageBucket: 'chat-app-98f45.appspot.com',
    messagingSenderId: '834722988847',
    appId: '1:834722988847:web:2bf427cd1ba58e1e8557da',
    measurementId: 'G-TECK35DBZW',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

connectAuthEmulator(auth, 'http://localhost:9099');
connectFirestoreEmulator(db, 'localhost', 8080);

export { auth, db, serverTimestamp, signInWithPopup, FacebookAuthProvider, onAuthStateChanged, addDoc, collection };
export default app;
