document.addEventListener('DOMContentLoaded', function() {
    // L'authentification est maintenant gérée par auth.js
    // Nous n'avons plus besoin de vérifier si l'utilisateur est connecté ici
    
    // Récupérer les informations de l'utilisateur depuis l'API
    fetchUserData();

    // Gérer le formulaire d'édition du profil
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newEmail = document.getElementById('editEmail').value;
            const newPassword = document.getElementById('editPassword').value;

            // Préparer les données à envoyer
            const userData = {
                email: newEmail
            };
            
            if (newPassword && newPassword.trim() !== '') {
                userData.password = newPassword;
            }

            // Appel à l'API pour mettre à jour le profil
            updateUserProfile(userData);
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

    // La déconnexion est maintenant gérée par auth.js
});

// Récupérer les données de l'utilisateur depuis l'API
function fetchUserData() {
    // Récupérer d'abord les données stockées localement (si disponibles)
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            initializeDashboard(user);
        } catch (e) {
            console.error('Erreur lors de la lecture des données utilisateur:', e);
        }
    }

    // Ensuite, faire une requête à l'API pour obtenir les données à jour
    fetch('https://127.0.0.1:8000/api/user/profile', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec de la récupération des données utilisateur');
        }
        return response.json();
    })
    .then(data => {
        // Mettre à jour les données utilisateur dans le localStorage
        localStorage.setItem('userData', JSON.stringify(data));
        
        // Initialiser le dashboard avec les données reçues
        initializeDashboard(data);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        showNotification('Impossible de récupérer vos informations', 'danger');
    });
}

// Mettre à jour le profil utilisateur
function updateUserProfile(userData) {
    // Désactiver le bouton de soumission
    const submitButton = document.querySelector('#editProfileForm button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Mise à jour...';

    fetch('https://127.0.0.1:8000/api/user/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec de la mise à jour du profil');
        }
        return response.json();
    })
    .then(data => {
        // Mettre à jour les données utilisateur dans le localStorage
        localStorage.setItem('userData', JSON.stringify(data));
        
        // Fermer le modal
        $('#editProfileModal').modal('hide');
        
        // Mettre à jour l'interface
        initializeDashboard(data);
        
        // Afficher une notification de succès
        showNotification('Profil mis à jour avec succès!', 'success');
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        showNotification('Impossible de mettre à jour votre profil', 'danger');
    })
    .finally(() => {
        // Réactiver le bouton de soumission
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    });
}

function initializeDashboard(user) {
    // Mettre à jour les informations du profil
    const userEmail = document.getElementById('userEmail');
    const memberSince = document.getElementById('memberSince');
    const editEmail = document.getElementById('editEmail');
    
    if (userEmail) {
        userEmail.textContent = user.email || 'Non disponible';
    }
    
    if (memberSince) {
        // Utiliser la date de création du compte si disponible, sinon la date actuelle
        const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
        memberSince.textContent = createdAt.toLocaleDateString();
    }
    
    if (editEmail) {
        editEmail.value = user.email || '';
    }
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