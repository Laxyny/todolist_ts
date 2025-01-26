import express from 'express';
import cors from 'cors';
import { AuthService } from './services/authService';
import { TodoService } from './services/todoService';
import path from 'path';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Middleware
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.signUp(email, password);
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.signIn(email, password);
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/logout', async (req, res) => {
    try {
        await AuthService.signOut();
        res.json({ message: 'Déconnecté avec succès' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Routes des todos
app.get('/api/todos/:userId', async (req, res) => {
    try {
        const todos = await TodoService.getTodosByUserId(req.params.userId);
        res.json(todos);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        const todo = await TodoService.createTodo(req.body);
        res.json(todo);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/todos/:id', async (req, res) => {
    try {
        await TodoService.updateTodo(req.params.id, req.body);
        const updatedTodo = await TodoService.getTodoById(req.params.id);
        res.json(updatedTodo);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        await TodoService.deleteTodo(req.params.id);
        res.json({ message: 'Todo supprimée avec succès' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/todos/:id', async (req, res) => {
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