/**
 * Gestion des visiteurs
 */
document.addEventListener('DOMContentLoaded', function() {
    // Référence aux éléments du DOM
    const visitorsList = document.getElementById('visitors-list');
    const addVisitorForm = document.getElementById('add-visitor-form');
    const editVisitorForm = document.getElementById('edit-visitor-form');
    const searchVisitorInput = document.getElementById('search-visitor');
    
    // Données de test (à remplacer par des appels API)
    let visitors = [
        { id: 1, name: 'Rakoto F', email: 'Rakoto@example.com', phone: '+261 34 12 34 56', date: '2023-05-15', status: 'active' },
        { id: 2, name: 'Rasoa M', email: 'marie.durand@example.com', phone: '+261 33 98 76 54', date: '2023-06-20', status: 'inactive' },
        { id: 3, name: 'Rabe', email: 'Rabe@example.com', phone: '+261 32 45 67 89', date: '2023-07-10', status: 'pending' }
    ];
    
    // Initialiser la liste des visiteurs
    function initVisitorsList() {
        if (!visitorsList) return;
        
        renderVisitorsList(visitors);
        
        // Gestionnaire d'événements pour la recherche
        if (searchVisitorInput) {
            searchVisitorInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const filteredVisitors = visitors.filter(visitor => 
                    visitor.name.toLowerCase().includes(searchTerm) || 
                    visitor.email.toLowerCase().includes(searchTerm)
                );
                renderVisitorsList(filteredVisitors);
            });
        }
    }
    
    // Afficher la liste des visiteurs
    function renderVisitorsList(visitorsList) {
        if (!visitorsList) return;
        
        const tableBody = document.querySelector('#visitors-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (visitorsList.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">Aucun visiteur trouvé</td>
                </tr>
            `;
            return;
        }
        
        visitorsList.forEach(visitor => {
            const statusClass = `status-${visitor.status}`;
            const statusText = {
                'active': 'Actif',
                'inactive': 'Inactif',
                'pending': 'En attente'
            }[visitor.status] || visitor.status;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${visitor.name}</td>
                <td>${visitor.email}</td>
                <td>${visitor.phone}</td>
                <td>${new Date(visitor.date).toLocaleDateString('fr-FR')}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="row-actions">
                        <button class="action-btn edit" data-id="${visitor.id}" data-toggle="modal" data-target="#editVisitorModal">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-id="${visitor.id}">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            // Ajouter des gestionnaires d'événements pour les boutons d'action
            const editBtn = row.querySelector('.edit');
            if (editBtn) {
                editBtn.addEventListener('click', function() {
                    const visitorId = parseInt(this.getAttribute('data-id'));
                    const visitor = visitors.find(v => v.id === visitorId);
                    if (visitor && editVisitorForm) {
                        // Pré-remplir le formulaire d'édition
                        editVisitorForm.querySelector('#edit-visitor-id').value = visitor.id;
                        editVisitorForm.querySelector('#edit-visitor-name').value = visitor.name;
                        editVisitorForm.querySelector('#edit-visitor-email').value = visitor.email;
                        editVisitorForm.querySelector('#edit-visitor-phone').value = visitor.phone;
                        editVisitorForm.querySelector('#edit-visitor-status').value = visitor.status;
                    }
                });
            }
            
            const deleteBtn = row.querySelector('.delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    const visitorId = parseInt(this.getAttribute('data-id'));
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce visiteur ?')) {
                        // Supprimer le visiteur
                        visitors = visitors.filter(v => v.id !== visitorId);
                        renderVisitorsList(visitors);
                        showNotification('Visiteur supprimé avec succès', 'success');
                    }
                });
            }
            
            tableBody.appendChild(row);
        });
    }
    
    // Gérer l'ajout d'un visiteur
    if (addVisitorForm) {
        addVisitorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newVisitor = {
                id: visitors.length > 0 ? Math.max(...visitors.map(v => v.id)) + 1 : 1,
                name: this.querySelector('#add-visitor-name').value,
                email: this.querySelector('#add-visitor-email').value,
                phone: this.querySelector('#add-visitor-phone').value,
                date: new Date().toISOString().split('T')[0],
                status: 'active'
            };
            
            // Ajouter le visiteur
            visitors.push(newVisitor);
            renderVisitorsList(visitors);
            
            // Fermer le modal et réinitialiser le formulaire
            $('#addVisitorModal').modal('hide');
            this.reset();
            
            showNotification('Visiteur ajouté avec succès', 'success');
        });
    }
    
    // Gérer la modification d'un visiteur
    if (editVisitorForm) {
        editVisitorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const visitorId = parseInt(this.querySelector('#edit-visitor-id').value);
            const visitorIndex = visitors.findIndex(v => v.id === visitorId);
            
            if (visitorIndex !== -1) {
                // Mettre à jour le visiteur
                visitors[visitorIndex] = {
                    ...visitors[visitorIndex],
                    name: this.querySelector('#edit-visitor-name').value,
                    email: this.querySelector('#edit-visitor-email').value,
                    phone: this.querySelector('#edit-visitor-phone').value,
                    status: this.querySelector('#edit-visitor-status').value
                };
                
                renderVisitorsList(visitors);
                
                // Fermer le modal
                $('#editVisitorModal').modal('hide');
                
                showNotification('Visiteur modifié avec succès', 'success');
            }
        });
    }
    
    // Afficher une notification
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
    
    // Initialiser le module
    initVisitorsList();
}); 