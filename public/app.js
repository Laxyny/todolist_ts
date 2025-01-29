const API_URL = 'http://localhost:3001/api';

// Fonction d'inscription
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const displayName = document.getElementById('registerDisplayName').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, displayName })
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
            localStorage.setItem('token', user.token);
            localStorage.setItem('displayName', user.displayName)
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
    const token = localStorage.getItem('token');
    const displayName = localStorage.getItem('displayName') ?? 'Null';
    if (!userId || !token) {
        console.log('Utilisateur non connecté ou token manquant');
        window.location.href = '/login.html';
        return;
    };

    //Afficher le displayName
    const displayNameH2 = document.getElementById('displayNameH2');
    displayNameH2.textContent = `Connecté en tant que ${displayName}`;


    try {
        const response = await fetch(`${API_URL}/todos/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erreur API:", errorData);
            return;

        }

        const todos = await response.json();
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = `${todo.title} - ${todo.description}`;
            li.style.textDecoration = todo.completed ? 'line-through' : 'none';

            // Bouton Modifier
            const editButton = document.createElement('button');
            editButton.textContent = 'Modifier';
            editButton.addEventListener('click', () => showEditForm(todo));

            // Bouton Terminer/Reprendre
            const toggleButton = document.createElement('button');
            toggleButton.textContent = todo.completed ? 'Reprendre' : 'Terminer';
            toggleButton.addEventListener('click', () => toggleTodoStatus(todo));

            // Bouton Supprimer
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.addEventListener('click', () => deleteTodo(todo.id));

            li.appendChild(editButton);
            li.appendChild(toggleButton);
            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}

// Fonction pour ajouter un todo
document.getElementById('addTodoForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
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
    const token = localStorage.getItem('token');
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        fetchTodos();
    } catch (err) {
        console.error(err);
    }
}

// Fonction pour modifier une todo
async function editTodo(id, updatedTodo) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedTodo)
        });
        fetchTodos();
    } catch (err) {
        console.error(err);
    }
}

// Fonction pour afficher le formulaire de modification
function showEditForm(todo) {
    const editForm = document.getElementById('editTodoForm');
    editForm.style.display = 'block';
    document.getElementById('editTitle').value = todo.title;
    document.getElementById('editDescription').value = todo.description;
    document.getElementById('editTodoId').value = todo.id;
}

//Si le bouton annulé est cliqué alors ne rien modifier et retirer le form document.getElementById('cancelEditButton')
document.getElementById('cancelEditButton').addEventListener('click', function () {
    document.getElementById('editTodoForm').style.display = 'none';
});

// Gérer la soumission du formulaire de modification
document.getElementById('editTodoForm')?.addEventListener('submit', (e) => {

    e.preventDefault();
    const id = document.getElementById('editTodoId').value;
    const updatedTodo = {
        title: document.getElementById('editTitle').value,
        description: document.getElementById('editDescription').value
    };
    editTodo(id, updatedTodo);
    document.getElementById('editTodoForm').style.display = 'none';
}
);

// Fonction pour basculer le statut d'une todo
async function toggleTodoStatus(todo) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`${API_URL}/todos/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed: !todo.completed })
        });
        fetchTodos();
    } catch (err) {
        console.error(err);
    }
}

// Gestion de l'affichage des todos terminé ou non
function filterTodos(filterType) {
    const allTodos = document.querySelectorAll('#todoList li');
    allTodos.forEach(todo => {
        const isCompleted = todo.style.textDecoration === 'line-through';
        if (filterType === 'completed' && !isCompleted) todo.style.display = 'none';
        else if (filterType === 'notCompleted' && isCompleted) todo.style.display = 'none';
        else todo.style.display = 'block';
    });
}


// Déconnexion
document.getElementById('logoutButton')?.addEventListener('click', () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('displayName');
    localStorage.clear();
    window.location.href = '/login.html';
});

// Charger les todos si sur la page principale
if (window.location.pathname.endsWith('index.html')) {
    fetchTodos();
}
