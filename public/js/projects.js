let milestoneCount = 1;

document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    loadProjectsForUpload();
    setupProjectForm();
    setupUserFilters();
    
    document.getElementById('loadProjectsBtn')?.addEventListener('click', loadProjects);
    document.getElementById('generate-milestones')?.addEventListener('click', generateMilestones);
    document.getElementById('assign-users-btn')?.addEventListener('click', assignUsers);
});

let allUsers = [];

function loadProjects() {
    fetch('/api/projects')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayProjects(data.projects);
            }
        })
        .catch(error => console.error('Error loading projects:', error));
}

function displayProjects(projects) {
    const container = document.getElementById('projects-list');
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = '<p>No projects found.</p>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="project-card" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: white;">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: rgb(244, 123, 32);">${project.name}</h4>
                <span class="badge" style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${project.status}</span>
            </div>
            <p style="margin: 5px 0; color: #666;">${project.description || 'No description'}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
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

function loadUsers() {
    fetch('/api/project-users')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allUsers = data.users;
                displayUsers(data.users);
            }
        })
        .catch(error => console.error('Error loading users:', error));
}

function displayUsers(users) {
    const container = document.getElementById('users-list');
    if (!container) return;

    const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
    
    container.innerHTML = sortedUsers.map(user => `
        <label style="display: block; margin-bottom: 8px; cursor: pointer;" data-user-name="${user.name.toLowerCase()}" data-user-email="${user.email.toLowerCase()}" data-user-type="${user.user_type}">
            <input type="checkbox" name="assigned_users[]" value="${user.id}" style="margin-right: 8px;">
            ${user.name} (${user.user_type}) - ${user.email}
        </label>
    `).join('');
}

function generateMilestones() {
    const count = parseInt(document.getElementById('milestone_count').value);
    const container = document.getElementById('milestones-container');
    
    if (count < 1 || count > 20) {
        alert('Please enter a number between 1 and 20');
        return;
    }
    
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const milestoneHtml = `
            <div class="milestone-item" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                <div style="font-weight: bold; margin-bottom: 5px; color: rgb(244, 123, 32);">Milestone ${i + 1}</div>
                <input type="text" name="milestones[${i}][name]" placeholder="Milestone name" required style="width: 100%; margin-bottom: 5px; padding: 8px;">
                <textarea name="milestones[${i}][description]" placeholder="Milestone description" style="width: 100%; margin-bottom: 5px; padding: 8px; height: 60px;"></textarea>
                <input type="date" name="milestones[${i}][due_date]" style="width: 100%; padding: 8px;">
            </div>
        `;
        container.insertAdjacentHTML('beforeend', milestoneHtml);
    }
    
    milestoneCount = count;
}

function setupProjectForm() {
    const form = document.getElementById('createProjectForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (key.includes('[')) {
                // Handle array fields like milestones
                const matches = key.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
                if (matches) {
                    const [, arrayName, index, field] = matches;
                    if (!data[arrayName]) data[arrayName] = [];
                    if (!data[arrayName][index]) data[arrayName][index] = {};
                    data[arrayName][index][field] = value;
                }
            } else if (key === 'assigned_users[]') {
                if (!data.assigned_users) data.assigned_users = [];
                data.assigned_users.push(parseInt(value));
            } else {
                data[key] = value;
            }
        }
        
        // Debug: Log the data being sent
        console.log('Project data being sent:', data);

        fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Project created successfully!');
                form.reset();
                milestoneCount = 1;
                // Reset milestones
                document.getElementById('milestone_count').value = 1;
                generateMilestones();
                loadUsers(); // Reload users
            } else {
                alert('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Network error occurred');
        });
    });
}

function loadProjectsForUpload() {
    fetch('/api/projects')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const select = document.getElementById('project_id');
                if (select) {
                    select.innerHTML = '<option value="">No Project</option>' + 
                        data.projects.map(project => 
                            `<option value="${project.id}">${project.name}</option>`
                        ).join('');
                }
            }
        })
        .catch(error => console.error('Error loading projects for upload:', error));
}

function setupUserFilters() {
    const searchInput = document.getElementById('search-users');
    const typeFilter = document.getElementById('filter-user-type');
    const applyBtn = document.getElementById('apply-user-filters');
    
    if (searchInput && typeFilter && applyBtn) {
        applyBtn.addEventListener('click', filterUsers);
        searchInput.addEventListener('input', filterUsers);
        typeFilter.addEventListener('change', filterUsers);
    }
}

function filterUsers() {
    const searchTerm = document.getElementById('search-users')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('filter-user-type')?.value || 'all';
    
    let filteredUsers = allUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm);
        const matchesType = typeFilter === 'all' || user.user_type === typeFilter;
        
        return matchesSearch && matchesType;
    });
    
    displayUsers(filteredUsers);
}

function assignUsers() {
    const checkboxes = document.querySelectorAll('input[name="assigned_users[]"]');
    const selectedUsers = [];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const label = checkbox.parentElement;
            const userName = label.textContent.trim();
            selectedUsers.push({
                id: checkbox.value,
                name: userName
            });
        }
    });
    
    const displayArea = document.getElementById('assigned-users-display');
    const listArea = document.getElementById('assigned-users-list');
    
    if (selectedUsers.length > 0) {
        displayArea.style.display = 'block';
        listArea.innerHTML = selectedUsers.map(user => 
            `<div style="margin-bottom: 5px; padding: 5px; background: white; border-radius: 4px; border: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;" data-user-id="${user.id}">
                <span>${user.name}</span>
                <button type="button" onclick="removeUser(${user.id})" style="background: #dc3545; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 12px;">×</button>
            </div>`
        ).join('');
        
        alert(`${selectedUsers.length} users assigned to project!`);
    } else {
        displayArea.style.display = 'none';
        alert('Please select users to assign.');
    }
}

function removeUser(userId) {
    // Remove from assigned users display
    const userDiv = document.querySelector(`[data-user-id="${userId}"]`);
    if (userDiv) {
        userDiv.remove();
    }
    
    // Uncheck the checkbox
    const checkbox = document.querySelector(`input[name="assigned_users[]"][value="${userId}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    // Hide display area if no users left
    const listArea = document.getElementById('assigned-users-list');
    const displayArea = document.getElementById('assigned-users-display');
    if (listArea.children.length === 0) {
        displayArea.style.display = 'none';
    }
}