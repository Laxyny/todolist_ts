import express from 'express';
import cors from 'cors';
import { AuthService } from './services/authService';
import { TodoService } from './services/todoService';
import path from 'path';
import { Request, Response, NextFunction, RequestHandler } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            uid: string;
            email: string;
            displayName?: string;
        };
    }
}

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Middleware
app.use(express.static(path.join(__dirname, '../public')));

// Middleware pour vérifier l'authentification
function isAuthenticated(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): void {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Vous devez vous connecter pour accéder à cette ressource' });
        return;
    }

    AuthService.verifyToken(token)
        .then((user) => {
            if (!user) {
                res.status(401).json({ message: 'Token invalide' });
                return;
            }
            req.user = user;
            next(); // Passe à la route suivante
        })
        .catch((error) => {
            console.error('Erreur d’authentification:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        });
}

app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.signUp(email, password);
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.signIn(email, password);
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/logout', async (req: Request, res: Response) => {
    try {
        await AuthService.signOut();
        res.json({ message: 'Déconnecté avec succès' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Routes des todos
app.get('/api/todos/:userId', isAuthenticated, async (req: Request, res: Response) => {
    try {
        const todos = await TodoService.getTodosByUserId(req.params.userId);
        res.json(todos);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/todos', isAuthenticated, async (req: Request, res: Response) => {
    try {
        const todo = await TodoService.createTodo(req.body);
        res.json(todo);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/todos/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
        await TodoService.updateTodo(req.params.id, req.body);
        const updatedTodo = await TodoService.getTodoById(req.params.id);
        res.json(updatedTodo);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/todos/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
        await TodoService.deleteTodo(req.params.id);
        res.json({ message: 'Todo supprimée avec succès' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/todos/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (completed !== undefined) updateData.completed = completed;

        await TodoService.updateTodo(id, updateData);
        const updatedTodo = await TodoService.getTodoById(id);
        res.json(updatedTodo);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
}); 