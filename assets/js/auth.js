/**
 * Gestion de l'authentification pour les pages protégées
 */
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est authentifié
    function isAuthenticated() {
        // Vérifier d'abord dans sessionStorage (session courante)
        let token = sessionStorage.getItem('authToken');
        
        // Si pas trouvé, vérifier dans localStorage (connexion persistante)
        if (!token) {
            token = localStorage.getItem('authToken');
        }
        
        return !!token;
    }
    
    // Obtenir le token d'authentification
    function getAuthToken() {
        // Vérifier d'abord dans sessionStorage (session courante)
        let token = sessionStorage.getItem('authToken');
        
        // Si pas trouvé, vérifier dans localStorage (connexion persistante)
        if (!token) {
            token = localStorage.getItem('authToken');
        }
        
        return token;
    }
    
    // Ajouter le token à toutes les requêtes fetch
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        // Ne pas modifier les requêtes vers des domaines externes
        if (url.startsWith('http') && !url.includes('127.0.0.1:8000')) {
            return originalFetch(url, options);
        }
        
        // Cloner les options pour ne pas modifier l'objet original
        const newOptions = { ...options };
        
        // S'assurer que headers existe
        newOptions.headers = newOptions.headers || {};
        
        // Convertir les headers en objet si c'est un Headers
        if (newOptions.headers instanceof Headers) {
            const headersObj = {};
            for (const [key, value] of newOptions.headers.entries()) {
                headersObj[key] = value;
            }
            newOptions.headers = headersObj;
        }
        
        // Ajouter le token d'authentification si disponible
        const token = getAuthToken();
        if (token) {
            newOptions.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return originalFetch(url, newOptions);
    };
    
    // Rediriger vers la page de connexion si non authentifié
    // Ne pas exécuter sur la page d'accueil ou la page de connexion
    const currentPath = window.location.pathname;
    if (!currentPath.includes('index.html') && 
        !currentPath.endsWith('/') && 
        !currentPath.includes('login.html')) {
        
        if (!isAuthenticated()) {
            // Rediriger vers la page d'accueil avec un paramètre pour ouvrir la modale de connexion
            window.location.href = '../index.html?login=required';
        }
    }
    
    // Gérer la déconnexion
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Supprimer les tokens d'authentification
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            
            // Rediriger vers la page d'accueil
            window.location.href = '../index.html';
        });
    }
    
    // Ouvrir automatiquement la modale de connexion si demandé
    if (window.location.search.includes('login=required')) {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            $(loginModal).modal('show');
        }
    }
}); 