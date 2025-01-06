import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs,
    getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Todo } from '../types/Todo';

export class TodoService {
    private static COLLECTION_NAME = 'todos';

    static async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
        const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
            ...todo,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return {
            ...todo,
            id: docRef.id
        };
    }

    static async updateTodo(id: string, todo: Partial<Todo>): Promise<void> {
        const docRef = doc(db, this.COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...todo,
            updatedAt: new Date()
        });
    }

    static async deleteTodo(id: string): Promise<void> {
        const docRef = doc(db, this.COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }

    static async getTodosByUserId(userId: string): Promise<Todo[]> {
        const q = query(
            collection(db, this.COLLECTION_NAME),
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Todo));
    }

    static async getTodoById(id: string): Promise<Todo | null> {
        const docRef = doc(db, this.COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return null;

        return {
            id: docSnap.id,
            ...docSnap.data()
        } as Todo;
    }
} 