/**
 * Gestion des services
 */
document.addEventListener('DOMContentLoaded', function() {
    // Référence aux éléments du DOM
    const servicesList = document.getElementById('services-list');
    const addServiceForm = document.getElementById('add-service-form');
    const editServiceForm = document.getElementById('edit-service-form');
    const searchServiceInput = document.getElementById('search-service');
    
    // Données de test (à remplacer par des appels API)
    let services = [
        { id: 1, name: 'Visite guidée', description: 'Visite guidée des sites touristiques', price: '50000', duration: '3 heures', status: 'active' },
        { id: 2, name: 'Location de voiture', description: 'Location de voiture avec chauffeur', price: '200000', duration: '1 jour', status: 'active' },
        { id: 3, name: 'Excursion en bateau', description: 'Excursion en bateau vers les îles', price: '150000', duration: '5 heures', status: 'inactive' }
    ];
    
    // Initialiser la liste des services
    function initServicesList() {
        if (!servicesList) return;
        
        renderServicesList(services);
        
        // Gestionnaire d'événements pour la recherche
        if (searchServiceInput) {
            searchServiceInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const filteredServices = services.filter(service => 
                    service.name.toLowerCase().includes(searchTerm) || 
                    service.description.toLowerCase().includes(searchTerm)
                );
                renderServicesList(filteredServices);
            });
        }
    }
    
    // Afficher la liste des services
    function renderServicesList(servicesList) {
        if (!servicesList) return;
        
        const tableBody = document.querySelector('#services-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (servicesList.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">Aucun service trouvé</td>
                </tr>
            `;
            return;
        }
        
        servicesList.forEach(service => {
            const statusClass = `status-${service.status}`;
            const statusText = {
                'active': 'Actif',
                'inactive': 'Inactif'
            }[service.status] || service.status;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.name}</td>
                <td>${service.description}</td>
                <td>${parseInt(service.price).toLocaleString('fr-FR')} Ar</td>
                <td>${service.duration}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="row-actions">
                        <button class="action-btn edit" data-id="${service.id}" data-toggle="modal" data-target="#editServiceModal">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-id="${service.id}">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            // Ajouter des gestionnaires d'événements pour les boutons d'action
            const editBtn = row.querySelector('.edit');
            if (editBtn) {
                editBtn.addEventListener('click', function() {
                    const serviceId = parseInt(this.getAttribute('data-id'));
                    const service = services.find(s => s.id === serviceId);
                    if (service && editServiceForm) {
                        // Pré-remplir le formulaire d'édition
                        editServiceForm.querySelector('#edit-service-id').value = service.id;
                        editServiceForm.querySelector('#edit-service-name').value = service.name;
                        editServiceForm.querySelector('#edit-service-description').value = service.description;
                        editServiceForm.querySelector('#edit-service-price').value = service.price;
                        editServiceForm.querySelector('#edit-service-duration').value = service.duration;
                        editServiceForm.querySelector('#edit-service-status').value = service.status;
                    }
                });
            }
            
            const deleteBtn = row.querySelector('.delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    const serviceId = parseInt(this.getAttribute('data-id'));
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
                        // Supprimer le service
                        services = services.filter(s => s.id !== serviceId);
                        renderServicesList(services);
                        showNotification('Service supprimé avec succès', 'success');
                    }
                });
            }
            
            tableBody.appendChild(row);
        });
    }
    
    // Gérer l'ajout d'un service
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newService = {
                id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
                name: this.querySelector('#add-service-name').value,
                description: this.querySelector('#add-service-description').value,
                price: this.querySelector('#add-service-price').value,
                duration: this.querySelector('#add-service-duration').value,
                status: 'active'
            };
            
            // Ajouter le service
            services.push(newService);
            renderServicesList(services);
            
            // Fermer le modal et réinitialiser le formulaire
            $('#addServiceModal').modal('hide');
            this.reset();
            
            showNotification('Service ajouté avec succès', 'success');
        });
    }
    
    // Gérer la modification d'un service
    if (editServiceForm) {
        editServiceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const serviceId = parseInt(this.querySelector('#edit-service-id').value);
            const serviceIndex = services.findIndex(s => s.id === serviceId);
            
            if (serviceIndex !== -1) {
                // Mettre à jour le service
                services[serviceIndex] = {
                    ...services[serviceIndex],
                    name: this.querySelector('#edit-service-name').value,
                    description: this.querySelector('#edit-service-description').value,
                    price: this.querySelector('#edit-service-price').value,
                    duration: this.querySelector('#edit-service-duration').value,
                    status: this.querySelector('#edit-service-status').value
                };
                
                renderServicesList(services);
                
                // Fermer le modal
                $('#editServiceModal').modal('hide');
                
                showNotification('Service modifié avec succès', 'success');
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
    initServicesList();
}); 