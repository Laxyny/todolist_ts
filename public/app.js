const API_URL = 'http://localhost:3001/api';

// Fonction d'inscription
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            alert('Compte créé avec succès !');
        } else {
            const error = await response.json();
            alert(error.error || 'Erreur lors de l\'inscription');
        }
    } catch (err) {
        console.error(err);
        alert('Erreur réseau');
    }
});

// Fonction de connexion
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const user = await response.json();
            localStorage.setItem('userId', user.uid);
            window.location.href = '/index.html';
        } else {
            const error = await response.json();
            alert(error.error || 'Erreur lors de la connexion');
        }
    } catch (err) {
        console.error(err);
        alert('Erreur réseau');
    }
});

// Fonction pour récupérer et afficher les todos
async function fetchTodos() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
        const response = await fetch(`${API_URL}/todos/${userId}`);
        const todos = await response.json();

        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = `${todo.title} - ${todo.description}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.addEventListener('click', () => deleteTodo(todo.id));

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Marquer comme terminé';
            updateButton.addEventListener('click', () => updateTodo(todo.id));

            li.appendChild(updateButton);
            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}

// Fonction pour ajouter une todo
document.getElementById('addTodoForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const userId = localStorage.getItem('userId');

    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, completed: false, userId })
        });

        if (response.ok) {
            fetchTodos();
        } else {
            const error = await response.json();
            alert(error.error || 'Erreur lors de l\'ajout de la todo');
        }
    } catch (err) {
        console.error(err);
    }
});

// Fonction pour supprimer une todo
async function deleteTodo(id) {
    try {
        await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
        fetchTodos();
    } catch (err) {
        console.error(err);
    }
}

// Fonction pour mettre à jour une todo
async function updateTodo(id) {
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true })
        });
        fetchTodos();
    } catch (err) {
        console.error(err);
    }
}

// Déconnexion
document.getElementById('logoutButton')?.addEventListener('click', () => {
    localStorage.removeItem('userId');
    window.location.href = '/login.html';
});

// Charger les todos si sur la page principale
if (window.location.pathname.endsWith('index.html')) {
    fetchTodos();
}
