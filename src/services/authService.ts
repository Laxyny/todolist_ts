import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    User as FirebaseUser,
    updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types/User';
import admin from 'firebase-admin';
import { db } from "../config/firebase";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
var serviceAccount = require("./serviceAccountKey.json");

// Initialisation de Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export class AuthService {
    static async signUp(email: string, password: string, displayName: string): Promise<User> {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName });

        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email!,
            displayName: displayName,
            createdAt: serverTimestamp() 
        });
        
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email!,
            displayName: userCredential.user.displayName || ''
        };
    }

    static async signIn(email: string, password: string): Promise<User> {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const token = await user.getIdToken(); 
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email!,
            displayName: userCredential.user.displayName || '',
            token
        };
    }

    static async signOut(): Promise<void> {
        await firebaseSignOut(auth);
    }

    static getCurrentUser(): User | null {
        const user = auth.currentUser;
        if (!user) return null;

        return {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || ''
        };
    }

    static async verifyToken(token: string): Promise<User | null> {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return {
                uid: decodedToken.uid,
                email: decodedToken.email!,
                displayName: decodedToken.name
            };
        } catch (error) {
            console.error('Erreur de vérification du token:', error);
            return null;
        }
    }
} 