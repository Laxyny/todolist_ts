import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = {
    
    // Auth
    register: (email: string, password: string, displayName: string) => 
        axios.post(`${API_URL}/auth/register`, { email, password, displayName }),
    
    login: (email: string, password: string) =>
        axios.post(`${API_URL}/auth/login`, { email, password }),
    
    logout: () => 
        axios.post(`${API_URL}/auth/logout`),

    // Todos
    getTodos: (userId: string) =>
        axios.get(`${API_URL}/todos/${userId}`),
    
    createTodo: (todo: any) =>
        axios.post(`${API_URL}/todos`, todo),
    
    updateTodo: (id: string, todo: any) =>
        axios.put(`${API_URL}/todos/${id}`, todo),
    
    deleteTodo: (id: string) =>
        axios.delete(`${API_URL}/todos/${id}`)
}; 