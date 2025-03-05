document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est déjà connecté
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
        // Rediriger directement vers le dashboard si déjà connecté
        window.location.href = 'pages/dashboard.html';
        return;
    }

    // Utilisateurs de test
    const users = [
        { email: 'user@test.com', password: 'password123' },
        { email: 'admin@test.com', password: 'admin123' }
    ];

    const loginForm = document.querySelector('.login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;

            // Vérification des identifiants
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Sauvegarder l'utilisateur en session
                sessionStorage.setItem('user', email);
                
                // Fermer le modal
                $('#loginModal').modal('hide');
                
                // Redirection vers le dashboard
                window.location.replace('pages/dashboard.html');
            } else {
                showError('Email ou mot de passe incorrect');
            }
        });
    }

    function showError(message) {
        const oldError = loginForm.querySelector('.alert');
        if (oldError) oldError.remove();

        const error = document.createElement('div');
        error.className = 'alert alert-danger mt-3';
        error.textContent = message;
        loginForm.insertBefore(error, loginForm.firstChild);
    }
}); 