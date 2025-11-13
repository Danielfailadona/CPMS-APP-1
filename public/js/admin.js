document.addEventListener('DOMContentLoaded', function() {
    // Initialize CRUD helpers for all tables
    const userCrud = new CrudHelper('users');
    const uploadCrud = new CrudHelper('uploads');
    const taskCrud = new CrudHelper('tasks');
    const complaintCrud = new CrudHelper('complaints');
    
    console.log('CRUD helpers initialized');
    console.log('CSRF Token:', document.querySelector('input[name="_token"]')?.value);
    
    const form = document.getElementById('userForm');
    const createBtn = document.getElementById('createBtn');
    const updateBtn = document.getElementById('updateBtn');
    
    // Add null checks for buttons
    if (updateBtn) {
        updateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        });
    }
    const loadUsersBtn = document.getElementById('loadUsersBtn');
    const loadUploadsBtn = document.getElementById('loadUploadsBtn');
    const loadTasksBtn = document.getElementById('loadTasksBtn');
    const loadComplaintsBtn = document.getElementById('loadComplaintsBtn');
    const clearBtn = document.getElementById('clearBtn');
    const usersList = document.getElementById('users-list');
    const uploadsList = document.getElementById('uploads-list');
    const tasksList = document.getElementById('tasks-list');
    const complaintsList = document.getElementById('complaints-list');

    let currentEditingId = null;

    // Create or Update user
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            user_type: formData.get('user_type'),
            is_authorized: formData.get('is_authorized') ? true : false,
            is_active: formData.get('is_active') ? true : false,
            authorization_notes: formData.get('authorization_notes')
        };

        // Password validation
        const password = formData.get('password');
        const confirmPassword = formData.get('password_confirmation');
        
        if (password) {
            // Validate password requirements
            if (!validatePasswordStrength(password)) {
                return; // Error already shown in validation function
            }
            
            // Validate password confirmation
            if (!validatePasswordMatch(password, confirmPassword)) {
                showError('Passwords do not match');
                return;
            }
            
            data.password = password;
        }

        try {
            let result;
            if (currentEditingId) {
                result = await userCrud.update(currentEditingId, data);
            } else {
                // For new users, password is required
                if (!password) {
                    showError('Password is required for new users');
                    return;
                }
                result = await userCrud.create(data);
            }

            if (result.success) {
                showSuccess(result.message);
                resetForm();
                loadUsers();
            } else {
                if (result.message && result.message.includes('already exists')) {
                    showError(result.message);
                } else {
                    showError('Error: ' + (result.message || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Error processing request');
        }
    });

    // Update button click handler moved above with null check

    // Load data event listeners
    loadUsersBtn.addEventListener('click', loadUsers);
    loadUploadsBtn.addEventListener('click', loadUploads);
    if (loadTasksBtn) {
        loadTasksBtn.addEventListener('click', loadTasks);
    }
    loadComplaintsBtn.addEventListener('click', loadComplaints);
    
    // Filter functionality with null checks
    const applyUserFilters = document.getElementById('apply-user-filters');
    const searchUsers = document.getElementById('search-users');
    const applyFilters = document.getElementById('apply-filters');
    const searchFiles = document.getElementById('search-files');
    
    if (applyUserFilters) {
        applyUserFilters.addEventListener('click', () => loadUsers(true));
    }
    if (searchUsers) {
        searchUsers.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') loadUsers(true);
        });
    }
    if (applyFilters) {
        applyFilters.addEventListener('click', () => loadUploads(true));
    }
    if (searchFiles) {
        searchFiles.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') loadUploads(true);
        });
    }

    // Clear form
    clearBtn.addEventListener('click', resetForm);

    async function loadUsers(applyFilters = false) {
        console.log('Loading users...');
        try {
            const users = await userCrud.readAll();
            console.log('Users loaded:', users);
            
            let filteredUsers = users;
            
            // Apply search and filters
            if (applyFilters) {
                const searchElement = document.getElementById('search-users');
                const roleElement = document.getElementById('filter-role');
                const statusElement = document.getElementById('filter-status');
                
                const searchTerm = searchElement ? searchElement.value.toLowerCase() : '';
                const roleFilter = roleElement ? roleElement.value : 'all';
                const statusFilter = statusElement ? statusElement.value : 'all';
                
                if (searchTerm) {
                    filteredUsers = filteredUsers.filter(user => 
                        (user.name && user.name.toLowerCase().includes(searchTerm)) ||
                        (user.email && user.email.toLowerCase().includes(searchTerm))
                    );
                }
                
                if (roleFilter !== 'all') {
                    filteredUsers = filteredUsers.filter(user => user.user_type === roleFilter);
                }
                
                if (statusFilter !== 'all') {
                    if (statusFilter === 'active') {
                        filteredUsers = filteredUsers.filter(user => user.is_active);
                    } else if (statusFilter === 'inactive') {
                        filteredUsers = filteredUsers.filter(user => !user.is_active);
                    } else if (statusFilter === 'authorized') {
                        filteredUsers = filteredUsers.filter(user => user.is_authorized);
                    } else if (statusFilter === 'unauthorized') {
                        filteredUsers = filteredUsers.filter(user => !user.is_authorized);
                    }
                }
            }
            
            if (filteredUsers.length === 0) {
                usersList.innerHTML = '<p class="no-users">No users found matching the criteria.</p>';
                return;
            }
            
            const usersHTML = filteredUsers.map(user => `
                <div class="user-item" data-id="${user.id}">
                    <div class="user-info">
                        <strong>${user.name}</strong> 
                        <span class="user-email">(${user.email})</span>
                        <span class="user-type ${user.user_type}">${user.user_type.toUpperCase()}</span>
                        <span class="user-status ${user.is_authorized ? 'authorized' : 'pending'}">
                            ${user.is_authorized ? '✓ Authorized' : '⏳ Pending'}
                        </span>
                        <span class="user-active ${user.is_active ? 'active' : 'inactive'}">
                            ${user.is_active ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                    </div>
                    <div class="user-actions">
                        <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
                        <button class="toggle-auth-btn ${user.is_authorized ? 'unauth' : 'auth'}" onclick="toggleAuthorization(${user.id}, ${user.is_authorized})">
                            ${user.is_authorized ? 'Unauthorize' : 'Authorize'}
                        </button>
                        <button class="toggle-active-btn ${user.is_active ? 'deactivate' : 'activate'}" onclick="toggleActive(${user.id}, ${user.is_active})">
                            ${user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                    </div>
                </div>
            `).join('');
            
            usersList.innerHTML = usersHTML;
        } catch (error) {
            console.error('Error loading users:', error);
            usersList.innerHTML = '<p class="no-users">Error loading users. Check console for details.</p>';
            return;
        }
    }

    // Edit user - load all user data into form
    window.editUser = async function(id) {
        const result = await userCrud.readOne(id);
        
        if (result.success) {
            const user = result.data;
            
            // Hide all sections and show user form section
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById('user-form-section').style.display = 'block';
            
            // Populate form fields
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('user_type').value = user.user_type;
            document.getElementById('is_authorized').checked = user.is_authorized;
            document.getElementById('is_active').checked = user.is_active;
            document.getElementById('authorization_notes').value = user.authorization_notes || '';
            document.getElementById('password').value = '';
            document.getElementById('password').placeholder = 'Leave blank to keep current password';
            document.getElementById('password').required = false;
            
            currentEditingId = user.id;
            document.getElementById('user_id').value = user.id;
            
            if (createBtn) createBtn.style.display = 'none';
            if (updateBtn) updateBtn.style.display = 'inline-block';
        }
    };

    // Toggle user authorization
    window.toggleAuthorization = async function(id, currentlyAuthorized) {
        const action = currentlyAuthorized ? 'unauthorize' : 'authorize';
        if (confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                const result = await userCrud.update(id, {
                    is_authorized: !currentlyAuthorized,
                    authorization_notes: `${action}d by admin on ${new Date().toLocaleString()}`
                });
                
                if (result.success) {
                    showSuccess(`User ${action}d successfully!`);
                    loadUsers();
                } else {
                    showError('Error: ' + (result.message || 'Unknown error'));
                }
            } catch (error) {
                showError('Error updating user authorization');
            }
        }
    };

    // Toggle user active status
    window.toggleActive = async function(id, currentlyActive) {
        const action = currentlyActive ? 'deactivate' : 'activate';
        showConfirmPopup(`${action.charAt(0).toUpperCase() + action.slice(1)} User`, `Are you sure you want to ${action} this user?`, async function() {
            try {
                const result = await userCrud.update(id, {
                    is_active: !currentlyActive
                });
                
                if (result.success) {
                    showSuccess(`User ${action}d successfully!`);
                    loadUsers();
                } else {
                    showError('Error: ' + (result.message || 'Unknown error'));
                }
            } catch (error) {
                showError('Error updating user status');
            }
        });
    };

    // Delete user
    window.deleteUser = async function(id) {
        showConfirmPopup('Delete User', 'Are you sure you want to delete this user? This action cannot be undone.', async function() {
            const result = await userCrud.delete(id);
            
            if (result.success) {
                showSuccess(result.message);
                loadUsers();
                if (currentEditingId === id) {
                    resetForm();
                }
            } else {
                showError('Error: ' + (result.message || 'Unknown error'));
            }
        });
    };

    // View user details
    window.viewUser = async function(id) {
        const result = await userCrud.readOne(id);
        
        if (result.success) {
            const user = result.data;
            const status = user.is_authorized ? 'Authorized' : 'Pending Authorization';
            const active = user.is_active ? 'Active' : 'Inactive';
            
            showInfo(`User Details:\n\nID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}\nType: ${user.user_type}\nStatus: ${status}\nActive: ${active}\nCreated: ${new Date(user.created_at).toLocaleString()}\nNotes: ${user.authorization_notes || 'None'}`);
        }
    };

    function resetForm() {
        form.reset();
        currentEditingId = null;
        document.getElementById('user_id').value = '';
        document.getElementById('password').required = true;
        document.getElementById('password').placeholder = '';
        document.getElementById('is_active').checked = true;
        if (createBtn) createBtn.style.display = 'inline-block';
        if (updateBtn) updateBtn.style.display = 'none';
    }

    // Show edit users section
    window.showEditUsers = function() {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('users-section').style.display = 'block';
        loadUsers();
    };

    // Show add user form
    window.showAddUser = function() {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('user-form-section').style.display = 'block';
        resetForm();
    };

    // Show delete users
    window.showDeleteUsers = function() {
        showEditUsers();
    };

    // Toggle dropdown menu
    window.toggleDropdown = function() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    };

    // Navigation function
    window.showSection = function(section) {
        document.getElementById('users-section').style.display = 'none';
        document.getElementById('user-form-section').style.display = 'none';
        document.getElementById('uploads-section').style.display = 'none';
        document.getElementById('tasks-section').style.display = 'none';
        document.getElementById('complaints-section').style.display = 'none';
        
        if (section === 'users') {
            document.getElementById('users-section').style.display = 'block';
            document.getElementById('user-form-section').style.display = 'block';
            loadUsers();
        } else if (section === 'uploads') {
            document.getElementById('uploads-section').style.display = 'block';
            loadUploads();
        } else if (section === 'tasks') {
            document.getElementById('tasks-section').style.display = 'block';
            loadTasks();
        } else if (section === 'complaints') {
            document.getElementById('complaints-section').style.display = 'block';
            loadComplaints();
        }
    };

    // Load uploads function
    async function loadUploads(applyFilters = false) {
        const uploads = await uploadCrud.readAll();
        
        let filteredUploads = uploads;
        
        // Apply search and type filters
        if (applyFilters) {
            const searchElement = document.getElementById('search-files');
            const typeElement = document.getElementById('filter-type');
            
            const searchTerm = searchElement ? searchElement.value.toLowerCase() : '';
            const typeFilter = typeElement ? typeElement.value : 'all';
            
            if (searchTerm) {
                filteredUploads = filteredUploads.filter(upload => 
                    (upload.title && upload.title.toLowerCase().includes(searchTerm)) ||
                    (upload.filename && upload.filename.toLowerCase().includes(searchTerm))
                );
            }
            
            if (typeFilter !== 'all') {
                filteredUploads = filteredUploads.filter(upload => upload.upload_type === typeFilter);
            }
        }
        
        if (filteredUploads.length === 0) {
            uploadsList.innerHTML = '<p class="no-uploads">No files found matching the criteria.</p>';
            return;
        }
        
        const uploadsHTML = filteredUploads.map(upload => `
            <div class="upload-item" data-id="${upload.id}">
                <div class="upload-info">
                    <div class="upload-title">${upload.title || upload.filename}</div>
                    <div class="upload-details">
                        <span class="upload-type">${upload.upload_type}</span>
                        <span class="upload-size">${upload.file_size}</span>
                        <span class="upload-date">${new Date(upload.created_at).toLocaleDateString()}</span>
                        <span class="upload-user">User: ${upload.user_id}</span>
                    </div>
                </div>
                <div class="upload-actions">
                    <button class="view-btn" onclick="viewUpload(${upload.id})">View</button>
                    <button class="delete-btn" onclick="deleteUpload(${upload.id})">Delete</button>
                </div>
            </div>
        `).join('');
        
        uploadsList.innerHTML = uploadsHTML;
    }

    // Load tasks function
    async function loadTasks() {
        console.log('Loading tasks...');
        try {
            console.log('Making request to /crud/tasks');
            const response = await fetch('/crud/tasks', {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]')?.value || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response data:', result);
            
            if (!tasksList) {
                console.error('Tasks list element not found');
                return;
            }
            
            if (!result.success) {
                console.error('API error:', result.message);
                tasksList.innerHTML = `<p class="no-tasks">Error: ${result.message}</p>`;
                return;
            }
            
            const tasks = result.data || [];
            console.log('Tasks array:', tasks, 'Length:', tasks.length);
            
            if (!tasks || tasks.length === 0) {
                tasksList.innerHTML = '<p class="no-tasks">No tasks found in database.</p>';
                return;
            }
            
            const tasksHTML = tasks.map(task => `
                <div class="task-item" data-id="${task.id}">
                    <div class="task-info">
                        <div class="task-title">${task.title || 'Untitled Task'}</div>
                        <div class="task-details">
                            <span class="task-priority priority-${task.priority || 'medium'}">${(task.priority || 'medium').toUpperCase()}</span>
                            <span class="task-status status-${task.status || 'pending'}">${(task.status || 'pending').replace('_', ' ').toUpperCase()}</span>
                            <span class="task-date">${task.created_at ? new Date(task.created_at).toLocaleDateString() : 'No date'}</span>
                            <span class="task-worker">Staff: ${task.worker_id || 'Unassigned'}</span>
                            <span class="task-foreman">Foreman: ${task.foreman_id || 'Unassigned'}</span>
                            ${task.due_date ? `<span class="task-due">Due: ${new Date(task.due_date).toLocaleDateString()}</span>` : ''}
                        </div>
                        <div class="task-description">${task.description || 'No description'}</div>
                        ${task.foreman_notes ? `<div class="task-notes">Notes: ${task.foreman_notes}</div>` : ''}
                    </div>
                    <div class="task-actions">
                        <button class="view-btn" onclick="viewTask(${task.id})">View</button>
                        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                </div>
            `).join('');
            
            tasksList.innerHTML = tasksHTML;
        } catch (error) {
            console.error('Error loading tasks:', error);
            if (tasksList) {
                tasksList.innerHTML = '<p class="no-tasks">Error loading tasks. Check console for details.</p>';
            }
        }
    }

    // Load complaints function
    async function loadComplaints() {
        const complaints = await complaintCrud.readAll();
        
        if (complaints.length === 0) {
            complaintsList.innerHTML = '<p class="no-complaints">No complaints found.</p>';
            return;
        }
        
        const complaintsHTML = complaints.map(complaint => `
            <div class="complaint-item" data-id="${complaint.id}">
                <div class="complaint-info">
                    <div class="complaint-title">${complaint.title}</div>
                    <div class="complaint-details">
                        <span class="complaint-priority priority-${complaint.priority}">${complaint.priority.toUpperCase()}</span>
                        <span class="complaint-status status-${complaint.status}">${complaint.status.replace('_', ' ').toUpperCase()}</span>
                        <span class="complaint-date">${new Date(complaint.created_at).toLocaleDateString()}</span>
                        <span class="complaint-client">Client: ${complaint.client_id}</span>
                    </div>
                    <div class="complaint-description">${complaint.description}</div>
                </div>
                <div class="complaint-actions">
                    <button class="view-btn" onclick="viewComplaint(${complaint.id})">View</button>
                    <button class="delete-btn" onclick="deleteComplaint(${complaint.id})">Delete</button>
                </div>
            </div>
        `).join('');
        
        complaintsList.innerHTML = complaintsHTML;
    }

    // View functions for other tables
    window.viewUpload = async function(id) {
        const result = await uploadCrud.readOne(id);
        if (result.success) {
            const upload = result.data;
            showInfo(`File Details:\n\nTitle: ${upload.title}\nFilename: ${upload.filename}\nType: ${upload.upload_type}\nSize: ${upload.file_size}\nUser ID: ${upload.user_id}\nUploaded: ${new Date(upload.created_at).toLocaleString()}`);
        }
    };

    window.viewTask = async function(id) {
        try {
            const result = await taskCrud.readOne(id);
            if (result.success) {
                const task = result.data;
                const dueDate = task.due_date ? `\nDue Date: ${new Date(task.due_date).toLocaleDateString()}` : '';
                const completedAt = task.completed_at ? `\nCompleted: ${new Date(task.completed_at).toLocaleString()}` : '';
                const notes = task.foreman_notes ? `\nForeman Notes: ${task.foreman_notes}` : '';
                
                showInfo(`Task Details:\n\nTitle: ${task.title || 'Untitled'}\nDescription: ${task.description || 'No description'}\nPriority: ${(task.priority || 'medium').toUpperCase()}\nStatus: ${(task.status || 'pending').toUpperCase()}\nStaff ID: ${task.worker_id || 'Unassigned'}\nForeman ID: ${task.foreman_id || 'Unassigned'}${dueDate}${completedAt}${notes}\nCreated: ${task.created_at ? new Date(task.created_at).toLocaleString() : 'Unknown'}`);
            } else {
                showError('Error loading task details: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error viewing task:', error);
            showError('Error loading task details');
        }
    };

    window.viewComplaint = async function(id) {
        const result = await complaintCrud.readOne(id);
        if (result.success) {
            const complaint = result.data;
            showInfo(`Complaint Details:\n\nTitle: ${complaint.title}\nDescription: ${complaint.description}\nPriority: ${complaint.priority}\nStatus: ${complaint.status}\nClient ID: ${complaint.client_id}\nCreated: ${new Date(complaint.created_at).toLocaleString()}`);
        }
    };

    // Delete functions for other tables
    window.deleteUpload = async function(id) {
        showConfirmPopup('Delete File', 'Are you sure you want to delete this file?', async function() {
            const result = await uploadCrud.delete(id);
            if (result.success) {
                showSuccess('File deleted successfully!');
                loadUploads();
            } else {
                showError('Error: ' + (result.message || 'Unknown error'));
            }
        });
    };

    window.deleteTask = async function(id) {
        showConfirmPopup('Delete Task', 'Are you sure you want to delete this task?', async function() {
            try {
                const result = await taskCrud.delete(id);
                if (result.success) {
                    showSuccess('Task deleted successfully!');
                    loadTasks();
                } else {
                    showError('Error: ' + (result.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                showError('Error deleting task');
            }
        });
    };

    window.deleteComplaint = async function(id) {
        showConfirmPopup('Delete Complaint', 'Are you sure you want to delete this complaint?', async function() {
            const result = await complaintCrud.delete(id);
            if (result.success) {
                showSuccess('Complaint deleted successfully!');
                loadComplaints();
            } else {
                showError('Error: ' + (result.message || 'Unknown error'));
            }
        });
    };

    // Password validation functions
    function validatePasswordStrength(password) {
        // Check minimum length (9 characters)
        if (password.length < 9) {
            showError('Password must be at least 9 characters long');
            return false;
        }
        
        // Check for at least one special character
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(password)) {
            showError('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
            return false;
        }
        
        // Prohibit weak password "123456789"
        if (password === '123456789') {
            showError('Password "123456789" is not allowed. Please choose a stronger password.');
            return false;
        }
        
        return true;
    }
    
    function validatePasswordMatch(password, confirmPassword) {
        return password === confirmPassword;
    }
    
    // Make validation functions globally available
    window.validatePasswordStrength = validatePasswordStrength;
    window.validatePasswordMatch = validatePasswordMatch;

    // Load users on page load
    loadUsers();
    
    // Debug: Test task loading on page load
    console.log('Testing task loading on page load...');
    setTimeout(() => {
        if (tasksList) {
            console.log('Tasks list element found, testing load...');
            loadTasks();
        } else {
            console.log('Tasks list element not found on page load');
        }
    }, 1000);
});

// Logout function
async function logout() {
    showConfirmPopup('Logout', 'Are you sure you want to logout?', async function() {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess('Logged out successfully!');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            }
        } catch (error) {
            showError('Logout failed. Please try again.');
        }
    });
}