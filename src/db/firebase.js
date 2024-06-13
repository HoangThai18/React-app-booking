import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDOqq7Xiq4HOD8O2zRdbk_4YNOA2c5usDY',
  authDomain: 'booking-app-cc29d.firebaseapp.com',
  projectId: 'booking-app-cc29d',
  storageBucket: 'booking-app-cc29d.appspot.com',
  messagingSenderId: '806486781637',
  appId: '1:806486781637:web:3df0cdd4f255f4991d4aac',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
