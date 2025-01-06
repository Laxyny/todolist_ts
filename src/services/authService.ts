import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types/User';

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
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email!,
            displayName: userCredential.user.displayName || undefined
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
            displayName: user.displayName || undefined
        };
    }
} 