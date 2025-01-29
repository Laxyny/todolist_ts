import { AuthService } from './services/authService';
import { TodoService } from './services/todoService';

async function main() {
    try {
        // Test d'inscription
        console.log('Test d\'inscription...');
        const user = await AuthService.signUp('test@test.com', 'Test123456', 'Utilisateur');
        console.log('Utilisateur créé:', user);

        // Test de création d'une todo
        console.log('\nCréation d\'une todo...');
        const newTodo = await TodoService.createTodo({
            title: "Ma première tâche",
            description: "Ceci est un test",
            completed: false,
            userId: user.uid,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('Todo créée:', newTodo);

        // Récupération des todos de l'utilisateur
        console.log('\nRécupération des todos...');
        const todos = await TodoService.getTodosByUserId(user.uid);
        console.log('Todos trouvées:', todos);

        // Test de mise à jour d'une todo
        if (newTodo.id) {
            console.log('\nMise à jour de la todo...');
            await TodoService.updateTodo(newTodo.id, {
                completed: true
            });
            console.log('Todo mise à jour');

            // Vérification de la mise à jour
            const updatedTodo = await TodoService.getTodoById(newTodo.id);
            console.log('Todo après mise à jour:', updatedTodo);
        }

        // Déconnexion
        console.log('\nDéconnexion...');
        await AuthService.signOut();
        console.log('Déconnecté avec succès');

    } catch (error) {
        console.error('Erreur:', error);
    }
}

main(); 