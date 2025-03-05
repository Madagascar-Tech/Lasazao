document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est connecté
    const user = sessionStorage.getItem('user');
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    // Initialiser l'interface utilisateur
    initializeDashboard(user);

    // Gérer le formulaire d'édition du profil
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newEmail = document.getElementById('editEmail').value;
            const newPassword = document.getElementById('editPassword').value;

            // Simuler la mise à jour du profil
            if (newEmail) {
                sessionStorage.setItem('user', newEmail);
                showNotification('Profil mis à jour avec succès!', 'success');
                $('#editProfileModal').modal('hide');
                initializeDashboard(newEmail);
            }
        });
    }

    // Gérer les paramètres
    const emailNotif = document.getElementById('emailNotif');
    const darkMode = document.getElementById('darkMode');

    if (emailNotif) {
        emailNotif.addEventListener('change', function() {
            showNotification(
                this.checked ? 'Notifications par email activées' : 'Notifications par email désactivées',
                'info'
            );
        });
    }

    if (darkMode) {
        darkMode.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode');
            showNotification(
                this.checked ? 'Mode sombre activé' : 'Mode sombre désactivé',
                'info'
            );
        });
    }

    // Gérer la déconnexion
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Supprimer les données de session
            sessionStorage.removeItem('user');
            
            // Afficher une notification
            showNotification('Déconnexion réussie', 'info');
            
            // Rediriger vers la page d'accueil après un court délai
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        });
    }
});

function initializeDashboard(email) {
    // Mettre à jour les informations du profil
    document.getElementById('userEmail').textContent = email;
    document.getElementById('memberSince').textContent = new Date().toLocaleDateString();
    
    // Pré-remplir le formulaire d'édition
    document.getElementById('editEmail').value = email;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 15px 25px;
        border-radius: 4px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
} 