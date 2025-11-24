let currentProjectId = null;
let allAvailableUsers = [];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loadAllProjectsBtn')?.addEventListener('click', loadAllProjects);
    document.getElementById('apply-project-filters')?.addEventListener('click', filterProjectUsers);
    document.getElementById('update-project-users')?.addEventListener('click', updateProjectUsers);
    
    const searchInput = document.getElementById('search-project-users');
    const typeFilter = document.getElementById('filter-project-user-type');
    
    if (searchInput && typeFilter) {
        searchInput.addEventListener('input', filterProjectUsers);
        typeFilter.addEventListener('change', filterProjectUsers);
    }
});

function loadAllProjects() {
    fetch('/api/admin/projects')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayAllProjects(data.projects);
            }
        })
        .catch(error => console.error('Error loading projects:', error));
}

function displayAllProjects(projects) {
    const container = document.getElementById('all-projects-list');
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = '<p>No projects found.</p>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="project-card" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: rgb(244, 123, 32);">${project.name}</h4>
                <button onclick="editProject(${project.id})" class="action-btn" style="padding: 5px 10px;">Edit Users</button>
            </div>
            <p style="margin: 5px 0; color: #666;">${project.description || 'No description'}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
                <div><strong>Manager:</strong> ${project.manager_name}</div>
                <div><strong>Status:</strong> ${project.status}</div>
                <div><strong>Start:</strong> ${project.start_date}</div>
                <div><strong>End:</strong> ${project.end_date}</div>
                <div><strong>Progress:</strong> ${project.progress_percentage}%</div>
                <div><strong>Users:</strong> ${project.assigned_users}</div>
            </div>
            <div style="background: #f5f5f5; border-radius: 4px; height: 8px; margin: 10px 0;">
                <div style="background: rgb(244, 123, 32); height: 100%; border-radius: 4px; width: ${project.progress_percentage}%;"></div>
            </div>
            <div style="font-size: 14px; color: #666;">
                Milestones: ${project.completed_milestones}/${project.milestones_count} completed
            </div>
        </div>
    `).join('');
}

function editProject(projectId) {
    currentProjectId = projectId;
    
    // Load project details
    fetch(`/api/admin/projects/${projectId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayProjectDetails(data.project);
                loadAvailableUsers();
                showSection('edit-project');
            }
        })
        .catch(error => console.error('Error loading project:', error));
}

function displayProjectDetails(project) {
    const detailsContainer = document.getElementById('project-details');
    const currentUsersContainer = document.getElementById('current-users');
    
    detailsContainer.innerHTML = `
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: rgb(244, 123, 32);">${project.name}</h4>
            <p style="margin: 5px 0; color: #666;">${project.description || 'No description'}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                <div><strong>Manager:</strong> ${project.manager_name}</div>
                <div><strong>Status:</strong> ${project.status}</div>
                <div><strong>Start:</strong> ${project.start_date}</div>
                <div><strong>End:</strong> ${project.end_date}</div>
            </div>
        </div>
    `;
    
    if (project.assigned_users.length > 0) {
        currentUsersContainer.innerHTML = `
            <strong>Currently Assigned Users:</strong>
            <div style="margin-top: 5px;">
                ${project.assigned_users.map(user => `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding: 5px; background: white; border-radius: 4px; border: 1px solid #ddd;">
                        <span>${user.name} (${user.user_type}) - ${user.email}</span>
                        <button onclick="removeUserFromProject(${user.id})" style="background: #dc3545; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 12px;">×</button>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        currentUsersContainer.innerHTML = '<strong>No users currently assigned to this project.</strong>';
    }
}

function loadAvailableUsers() {
    fetch('/api/project-users')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allAvailableUsers = data.users;
                displayAvailableUsers(data.users);
            }
        })
        .catch(error => console.error('Error loading users:', error));
}

function displayAvailableUsers(users) {
    const container = document.getElementById('available-users-list');
    if (!container) return;

    const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
    
    container.innerHTML = sortedUsers.map(user => `
        <label style="display: block; margin-bottom: 8px; cursor: pointer;">
            <input type="checkbox" name="project_assigned_users[]" value="${user.id}" style="margin-right: 8px;">
            ${user.name} (${user.user_type}) - ${user.email}
        </label>
    `).join('');
}

function filterProjectUsers() {
    const searchTerm = document.getElementById('search-project-users')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('filter-project-user-type')?.value || 'all';
    
    let filteredUsers = allAvailableUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm);
        const matchesType = typeFilter === 'all' || user.user_type === typeFilter;
        
        return matchesSearch && matchesType;
    });
    
    displayAvailableUsers(filteredUsers);
}

function removeUserFromProject(userId) {
    // Uncheck the user in available users list
    const checkbox = document.querySelector(`input[name="project_assigned_users[]"][value="${userId}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    // Update the project users
    updateProjectUsers();
}

function updateProjectUsers() {
    const checkboxes = document.querySelectorAll('input[name="project_assigned_users[]"]');
    const selectedUsers = [];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedUsers.push(parseInt(checkbox.value));
        }
    });
    
    fetch(`/api/admin/projects/${currentProjectId}/users`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
            assigned_users: selectedUsers
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Project users updated successfully!');
            // Reload project details to show updated users
            editProject(currentProjectId);
        } else {
            alert('Error updating project users');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Network error occurred');
    });
}