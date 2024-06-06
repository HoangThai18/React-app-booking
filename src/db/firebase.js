import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBap2hQM8yIG934FxGKb7oGKXRd3sM1SOg',
  authDomain: 'aurora-reactjs-training.firebaseapp.com',
  projectId: 'aurora-reactjs-training',
  storageBucket: 'aurora-reactjs-training.appspot.com',
  messagingSenderId: '438985091248',
  appId: '1:438985091248:web:bdf54b6c979813060ab375',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
