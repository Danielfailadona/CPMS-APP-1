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
            is_active: formData.get('is_active') ? true : false
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
                // For new users, password is required and they start unauthorized
                if (!password) {
                    showError('Password is required for new users');
                    return;
                }
                data.is_authorized = false; // New users need authorization
                result = await userCrud.create(data);
                
                if (result.success) {
                    showSuccess(result.message + ' - User created and pending authorization.');
                } else {
                    // Handle success message separately to avoid duplicate
                    return;
                }
            }

            if (result.success && !currentEditingId) {
                // Success message already shown above for new users
                resetForm();
                loadUsers();
            } else if (result.success) {
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
            let users = await userCrud.readAll();
        users = users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            console.log('Users loaded:', users);
            
            let filteredUsers = users;
            
            // Apply search and filters
            if (applyFilters) {
                const searchElement = document.getElementById('search-users');
                const roleElement = document.getElementById('filter-role');
                const statusElement = document.getElementById('filter-status');
                const authElement = document.getElementById('filter-authorization');
                
                const searchTerm = searchElement ? searchElement.value.toLowerCase() : '';
                const roleFilter = roleElement ? roleElement.value : 'all';
                const statusFilter = statusElement ? statusElement.value : 'all';
                const authFilter = authElement ? authElement.value : 'all';
                
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
                    }
                }
                
                if (authFilter !== 'all') {
                    if (authFilter === 'authorized') {
                        filteredUsers = filteredUsers.filter(user => user.is_authorized);
                    } else if (authFilter === 'unauthorized') {
                        filteredUsers = filteredUsers.filter(user => !user.is_authorized);
                    }
                }
            }
            
            if (filteredUsers.length === 0) {
                usersList.innerHTML = '<p class="no-users">No users found matching the criteria.</p>';
                return;
            }
            
            const usersHTML = filteredUsers.map(user => `
                <div class="user-item" data-id="${user.id}" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div class="user-info" style="margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <strong style="font-size: 16px; color: #333;">${user.name}</strong>
                            <span style="font-size: 12px; color: #666;">ID: ${user.id}</span>
                        </div>
                        <div style="margin-bottom: 8px;">
                            <span class="user-email" style="color: #666; font-size: 14px;">${user.email}</span>
                        </div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <span class="user-type" style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${user.user_type.toUpperCase()}</span>
                            <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                ${user.is_active ? '🟢 Active' : '🔴 Inactive'}
                            </span>
                            <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                ${user.is_authorized ? '✅ Authorized' : '⏳ Pending'}
                            </span>
                            <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                Created: ${new Date(user.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div class="user-actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="edit-btn" onclick="editUser(${user.id})" style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Edit</button>
                        <button class="toggle-active-btn" onclick="toggleActive(${user.id}, ${user.is_active})" style="background: ${user.is_active ? '#dc3545' : 'rgb(244, 123, 32)'}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            ${user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button class="authorize-btn" onclick="toggleAuthorization(${user.id}, ${user.is_authorized})" style="background: ${user.is_authorized ? '#ffc107' : 'rgb(244, 123, 32)'}; color: ${user.is_authorized ? '#212529' : 'white'}; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            ${user.is_authorized ? 'Unauthorize' : 'Authorize'}
                        </button>
                        <button class="delete-btn" onclick="deleteUser(${user.id})" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
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
            document.getElementById('is_active').checked = user.is_active;
            document.getElementById('password').value = '';
            document.getElementById('password').placeholder = 'Leave blank to keep current password';
            document.getElementById('password').required = false;
            
            // Show authorization status in form title
            const authStatus = user.is_authorized ? 'Authorized' : 'Pending Authorization';
            document.getElementById('form-title').textContent = `Edit User - ${authStatus}`;
            
            currentEditingId = user.id;
            document.getElementById('user_id').value = user.id;
            
            if (createBtn) createBtn.style.display = 'none';
            if (updateBtn) updateBtn.style.display = 'inline-block';
        }
    };

    // Toggle user authorization
    window.toggleAuthorization = async function(id, currentlyAuthorized) {
        const action = currentlyAuthorized ? 'unauthorize' : 'authorize';
        showConfirmPopup(`${action.charAt(0).toUpperCase() + action.slice(1)} User`, `Are you sure you want to ${action} this user?`, async function() {
            try {
                const result = await userCrud.update(id, {
                    is_authorized: !currentlyAuthorized
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
        });
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
        let uploads = await uploadCrud.readAll();
        uploads = uploads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
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
            <div class="upload-item" data-id="${upload.id}" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div class="upload-info" style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div class="upload-title" style="font-weight: bold; font-size: 16px; color: #333;">${upload.title || upload.filename}</div>
                        <span style="font-size: 12px; color: #666;">ID: ${upload.id}</span>
                    </div>
                    <div class="upload-details" style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">File Type: ${upload.upload_type}</span>
                        <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">File Size: ${upload.file_size}</span>
                        <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Date Uploaded: ${new Date(upload.created_at).toLocaleDateString()}</span>
                        <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">User ID: ${upload.user_id}</span>
                    </div>
                </div>
                <div class="upload-actions" style="display: flex; gap: 8px;">
                    <button class="view-btn" onclick="viewUpload(${upload.id})" style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">View</button>
                    <button class="delete-btn" onclick="deleteUpload(${upload.id})" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
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
            
            const sortedTasks = tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            const tasksHTML = sortedTasks.map(task => `
                <div class="task-item" data-id="${task.id}" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div class="task-info" style="margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div class="task-title" style="font-weight: bold; font-size: 16px; color: #333;">${task.title || 'Untitled Task'}</div>
                            <span style="font-size: 12px; color: #666;">ID: ${task.id}</span>
                        </div>
                        <div class="task-details" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
                            <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${(task.priority || 'medium').toUpperCase()}</span>
                            <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${(task.status || 'pending').replace('_', ' ').toUpperCase()}</span>
                            <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${task.created_at ? new Date(task.created_at).toLocaleDateString() : 'No date'}</span>
                            <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Staff ID: ${task.worker_id || 'Unassigned'}</span>
                            <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Foreman ID: ${task.foreman_id || 'Unassigned'}</span>
                            ${task.due_date ? `<span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Due: ${new Date(task.due_date).toLocaleDateString()}</span>` : ''}
                        </div>
                        <div class="task-description" style="color: #666; font-size: 14px; margin-bottom: 8px;">${task.description || 'No description'}</div>
                        ${task.foreman_notes ? `<div class="task-notes" style="background: #f8f9fa; padding: 8px; border-radius: 4px; font-size: 12px; color: #495057;">Notes: ${task.foreman_notes}</div>` : ''}
                    </div>
                    <div class="task-actions" style="display: flex; gap: 8px;">
                        <button class="view-btn" onclick="viewTask(${task.id})" style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">View</button>
                        <button class="delete-btn" onclick="deleteTask(${task.id})" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
                    </div>
                </div>
            `).join('');
            
            function getPriorityColor(priority) {
                switch(priority) {
                    case 'high': return '#dc3545';
                    case 'medium': return '#ffc107';
                    case 'low': return '#28a745';
                    default: return '#6c757d';
                }
            }
            
            function getStatusColor(status) {
                switch(status) {
                    case 'completed': return '#28a745';
                    case 'in_progress': return '#17a2b8';
                    case 'pending': return '#ffc107';
                    default: return '#6c757d';
                }
            }
            
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
        let complaints = await complaintCrud.readAll();
        complaints = complaints.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        if (complaints.length === 0) {
            complaintsList.innerHTML = '<p class="no-complaints">No complaints found.</p>';
            return;
        }
        
        const complaintsHTML = complaints.map(complaint => `
            <div class="complaint-item" data-id="${complaint.id}" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div class="complaint-info" style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div class="complaint-title" style="font-weight: bold; font-size: 16px; color: #333;">${complaint.title}</div>
                        <span style="font-size: 12px; color: #666;">ID: ${complaint.id}</span>
                    </div>
                    <div class="complaint-details" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
                        <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Priority: ${complaint.priority.toUpperCase()}</span>
                        <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Status: ${complaint.status.replace('_', ' ').toUpperCase()}</span>
                        <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Date Issued: ${new Date(complaint.created_at).toLocaleDateString()}</span>
                        <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Client ID: ${complaint.client_id}</span>
                    </div>
                    <div class="complaint-description" style="color: #666; font-size: 14px;">${complaint.description}</div>
                </div>
                <div class="complaint-actions" style="display: flex; gap: 8px;">
                    <button class="view-btn" onclick="viewComplaint(${complaint.id})" style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">View</button>
                    <button class="delete-btn" onclick="deleteComplaint(${complaint.id})" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
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
            showFileViewerModal(upload);
        }
    };
    
    // Show file viewer modal with image preview
    function showFileViewerModal(upload) {
        const modalHTML = `
            <div id="file-viewer-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            ">
                <div style="
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 80%;
                    max-height: 80%;
                    overflow-y: auto;
                    position: relative;
                ">
                    <button onclick="closeFileViewer()" style="
                        position: absolute;
                        top: 10px;
                        right: 15px;
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #666;
                    ">×</button>
                    
                    <h3 style="margin-top: 0; color: rgb(244, 123, 32);">${upload.title || upload.filename}</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <strong>Filename:</strong> ${upload.filename}<br>
                        <strong>Type:</strong> ${getUploadTypeLabel(upload.upload_type)}<br>
                        <strong>Size:</strong> ${upload.file_size}<br>
                        <strong>User ID:</strong> ${upload.user_id}<br>
                        <strong>Uploaded:</strong> ${new Date(upload.created_at).toLocaleString()}<br>
                        <strong>Status:</strong> ${upload.is_public ? 'Public' : 'Private'}
                    </div>
                    
                    ${upload.description ? `
                        <div style="margin-bottom: 15px;">
                            <strong>Description:</strong><br>
                            <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${upload.description}</p>
                        </div>
                    ` : ''}
                    
                    <div id="file-content" style="text-align: center;">
                        ${upload.mime_type && upload.mime_type.startsWith('image/') ? `
                            <img src="/download-file?path=${encodeURIComponent(upload.file_path)}&filename=${encodeURIComponent(upload.filename)}" 
                                 style="max-width: 100%; max-height: 400px; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" 
                                 alt="${upload.filename}">
                        ` : `
                            <div style="padding: 20px; background: #f0f0f0; border-radius: 5px; margin: 10px 0;">
                                <p><strong>File:</strong> ${upload.filename}</p>
                                <p>This file type cannot be previewed. Click download to view the file.</p>
                                <button onclick="downloadFile('${upload.file_path}', '${upload.filename}')" 
                                        style="background: rgb(244, 123, 32); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                                    Download File
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Close file viewer modal
    window.closeFileViewer = function() {
        const modal = document.getElementById('file-viewer-modal');
        if (modal) {
            modal.remove();
        }
    };
    
    // Download file from modal
    window.downloadFile = function(filePath, filename) {
        const url = `/download-file?path=${encodeURIComponent(filePath)}&filename=${encodeURIComponent(filename)}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    
    // Helper function to get upload type label
    function getUploadTypeLabel(type) {
        const types = {
            'task': 'Task Related',
            'image': 'Image',
            'report': 'Report',
            'document': 'Document',
            'blueprint': 'Blueprint',
            'safety': 'Safety Document',
            'inspection': 'Inspection Report',
            'other': 'Other'
        };
        return types[type] || type;
    }

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

    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('file-viewer-modal');
        if (modal && e.target === modal) {
            closeFileViewer();
        }
    });
    
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