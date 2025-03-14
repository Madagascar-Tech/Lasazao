document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est déjà connecté (via le token stocké)
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        // Rediriger directement vers le dashboard si déjà connecté
        window.location.href = 'pages/dashboard.html';
        return;
    }

    const loginForm = document.querySelector('.login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // Désactiver le bouton de connexion et montrer un indicateur de chargement
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Connexion en cours...';

            // Appel fetch à l'API de connexion
            fetch('https://127.0.0.1:8000/api/login_check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Échec de la connexion');
                }
                return response.json();
            })
            .then(data => {
                // Stocker le token d'authentification
                if (data.token) {
                    // Stocker le token dans localStorage ou sessionStorage selon "Se souvenir de moi"
                    if (rememberMe) {
                        localStorage.setItem('authToken', data.token);
                    } else {
                        sessionStorage.setItem('authToken', data.token);
                    }
                    
                    // Stocker les informations utilisateur si disponibles
                    if (data.user) {
                        localStorage.setItem('userData', JSON.stringify(data.user));
                    }
                    
                    // Fermer le modal
                    $('#loginModal').modal('hide');
                    
                    // Redirection vers le dashboard
                    window.location.href = 'pages/dashboard.html';
                } else {
                    showError('Réponse du serveur invalide');
                }
            })
            .catch(error => {
                console.error('Erreur de connexion:', error);
                showError('Échec de la connexion. Vérifiez vos identifiants.');
            })
            .finally(() => {
                // Réactiver le bouton de connexion
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            });
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