import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types/User';
import admin from 'firebase-admin';
var serviceAccount = require("./serviceAccountKey.json");

// Initialisation de Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export class AuthService {
    static async signUp(email: string, password: string): Promise<User> {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email!,
            displayName: userCredential.user.displayName || undefined
        };
    }

    static async signIn(email: string, password: string): Promise<User> {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const token = await user.getIdToken(); 
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email!,
            displayName: userCredential.user.displayName || undefined,
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
            displayName: user.displayName || undefined,
        };
    }

    static async verifyToken(token: string): Promise<User | null> {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return {
                uid: decodedToken.uid,
                email: decodedToken.email!,
                displayName: decodedToken.name || undefined,
            };
        } catch (error) {
            console.error('Erreur de vérification du token:', error);
            return null;
        }
    }
} 