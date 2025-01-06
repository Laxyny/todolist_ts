import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDiHn3O6pfHts363Q23_ury8I5x5RjNI40",
    authDomain: "todolistts-4cec1.firebaseapp.com",
    projectId: "todolistts-4cec1",
    storageBucket: "todolistts-4cec1.firebasestorage.app",
    messagingSenderId: "818451994788",
    appId: "1:818451994788:web:ea78f03847b222e57dae31",
    measurementId: "G-C0PKP3BS5Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 