<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - CPMS</title>
    <link rel="stylesheet" href="{{ asset('styles/sidebar.css') }}">
    @include('popup')
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="profile">
                <div class="profile-pic">
                    <img src="{{ asset('images/test.jpg') }}" alt="Profile">
                </div>
                <h3>ADMIN DASHBOARD</h3>
            </div>

            <ul class="menu">
                <li class="dropdown">
                    <a href="#" class="btn active dropdown-toggle" onclick="toggleDropdown()">Users ▼</a>
                    <div class="dropdown-menu" id="userDropdown">
                        <a href="#" onclick="showAddUser()">Create</a>
                        <a href="#" onclick="showEditUsers()">Update</a>
                        <a href="#" onclick="showDeleteUsers()">Delete</a>
                    </div>
                </li>
                <li><a href="#" onclick="showSection('uploads')" class="btn">Files</a></li>
                <li><a href="#" onclick="showSection('tasks')" class="btn">Tasks</a></li>
                <li><a href="#" onclick="showSection('complaints')" class="btn">Complaints</a></li>
                <li><a href="#" onclick="logout()" class="btn">Logout</a></li>
            </ul>
        </div>

        <!-- Main Content -->
        <div class="main-content">



            <!-- Users List Section (for editing) -->
            <div class="section users-section" id="users-section" style="display: none;">
                <div class="section-header">
                    <h3>Select User to Edit</h3>
                    <button type="button" id="loadUsersBtn" class="action-btn">Refresh Users</button>
                </div>
                <div id="users-list" class="users-list"></div>
            </div>

            <!-- User Form Section -->
            <div class="section form-section" id="user-form-section" style="display: none;">
                <div class="section-header">
                    <h3 id="form-title">Create User</h3>
                </div>
                <form id="userForm">
                    @csrf
                    <input type="hidden" id="user_id" name="user_id">
                    
                    <div class="form-fields">
                        <div class="form-row">
                            <div class="input-group">
                                <label for="name">Full Name:</label>
                                <input id="name" name="name" type="text" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="email">Email Address:</label>
                                <input id="email" name="email" type="email" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="user_type">User Type:</label>
                                <select id="user_type" name="user_type" class="form-select" required>
                                    <option value="client">Client</option>
                                    <option value="staff">Staff</option>
                                    <option value="foreman">Foreman</option>
                                    <option value="manager">Manager</option>
                                    <option value="ceo">CEO</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="password">Password:</label>
                                <div class="field">
                                    <input id="password" name="password" type="password" required>
                                    <button type="button" class="toggle-btn" id="pw-toggle-admin" aria-label="Show password" aria-pressed="false">
                                        <svg id="icon-eye-admin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                                            <circle cx="12" cy="12" r="3.2"/>
                                        </svg>
                                        <svg id="icon-eye-off-admin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="display:none;">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7 1.6-2.7 4.07-4.87 7.06-6.18"/>
                                            <path d="M3 3l18 18"/>
                                            <path d="M14.12 14.12A3.5 3.5 0 0 1 9.88 9.88"/>
                                            <path d="M9.88 9.88A3.5 3.5 0 0 0 14.12 14.12"/>
                                        </svg>
                                    </button>
                                </div>
                                <small class="password-hint">Must contain at least one special character</small>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="password_confirmation">Confirm Password:</label>
                                <div class="field">
                                    <input id="password_confirmation" name="password_confirmation" type="password" required>
                                    <button type="button" class="toggle-btn" id="pw-toggle-confirm-admin" aria-label="Show password" aria-pressed="false">
                                        <svg id="icon-eye-confirm-admin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                                            <circle cx="12" cy="12" r="3.2"/>
                                        </svg>
                                        <svg id="icon-eye-off-confirm-admin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="display:none;">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7 1.6-2.7 4.07-4.87 7.06-6.18"/>
                                            <path d="M3 3l18 18"/>
                                            <path d="M14.12 14.12A3.5 3.5 0 0 1 9.88 9.88"/>
                                            <path d="M9.88 9.88A3.5 3.5 0 0 0 14.12 14.12"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="form-row checkbox-group">
                            <div class="input-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="is_authorized" name="is_authorized" value="1">
                                    <span class="checkmark"></span>
                                    Authorized to Login
                                </label>
                            </div>
                        </div>

                        <div class="form-row checkbox-group">
                            <div class="input-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="is_active" name="is_active" value="1" checked>
                                    <span class="checkmark"></span>
                                    Account Active
                                </label>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="authorization_notes">Authorization Notes:</label>
                                <textarea id="authorization_notes" name="authorization_notes" class="form-textarea" placeholder="Notes about user authorization status"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="form-actions">
                        <button type="submit" id="createBtn" class="btn-primary">Create User</button>
                        <button type="button" id="updateBtn" class="btn-primary" style="display: none;">Update User</button>
                        <button type="button" id="clearBtn" class="btn-clear">Clear Form</button>
                    </div>
                </form>
            </div>

            <!-- Update User Form Section -->
            <div class="section form-section" id="updateform-section" style="display: none;">
                <div class="section-header">
                    <h3>Edit User</h3>
                </div>
                <form id="editUserForm">
                    @csrf
                    <input type="hidden" id="edit_user_id" name="user_id">
                    
                    <div class="form-fields">
                        <div class="form-row">
                            <div class="input-group">
                                <label for="edit_name">Full Name:</label>
                                <input id="edit_name" name="name" type="text" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="edit_email">Email Address:</label>
                                <input id="edit_email" name="email" type="email" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="edit_user_type">User Type:</label>
                                <select id="edit_user_type" name="user_type" class="form-select" required>
                                    <option value="client">Client</option>
                                    <option value="staff">Staff</option>
                                    <option value="foreman">Foreman</option>
                                    <option value="manager">Manager</option>
                                    <option value="ceo">CEO</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="edit_password">Password:</label>
                                <div class="field">
                                    <input id="edit_password" name="password" type="password">
                                    <button type="button" class="toggle-btn" id="pw-toggle-edit" aria-label="Show password" aria-pressed="false">
                                        <svg id="icon-eye-edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                                            <circle cx="12" cy="12" r="3.2"/>
                                        </svg>
                                        <svg id="icon-eye-off-edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="display:none;">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7 1.6-2.7 4.07-4.87 7.06-6.18"/>
                                            <path d="M3 3l18 18"/>
                                            <path d="M14.12 14.12A3.5 3.5 0 0 1 9.88 9.88"/>
                                            <path d="M9.88 9.88A3.5 3.5 0 0 0 14.12 14.12"/>
                                        </svg>
                                    </button>
                                </div>
                                <small class="password-hint">Leave blank to keep current password. Must contain at least one special character if changed.</small>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="edit_password_confirmation">Confirm Password:</label>
                                <div class="field">
                                    <input id="edit_password_confirmation" name="password_confirmation" type="password">
                                    <button type="button" class="toggle-btn" id="pw-toggle-confirm-edit" aria-label="Show password" aria-pressed="false">
                                        <svg id="icon-eye-confirm-edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                                            <circle cx="12" cy="12" r="3.2"/>
                                        </svg>
                                        <svg id="icon-eye-off-confirm-edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="display:none;">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7 1.6-2.7 4.07-4.87 7.06-6.18"/>
                                            <path d="M3 3l18 18"/>
                                            <path d="M14.12 14.12A3.5 3.5 0 0 1 9.88 9.88"/>
                                            <path d="M9.88 9.88A3.5 3.5 0 0 0 14.12 14.12"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="form-row checkbox-group">
                            <div class="input-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="edit_is_authorized" name="is_authorized" value="1">
                                    <span class="checkmark"></span>
                                    Authorized to Login
                                </label>
                            </div>
                        </div>

                        <div class="form-row checkbox-group">
                            <div class="input-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="edit_is_active" name="is_active" value="1">
                                    <span class="checkmark"></span>
                                    Account Active
                                </label>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="edit_authorization_notes">Authorization Notes:</label>
                                <textarea id="edit_authorization_notes" name="authorization_notes" class="form-textarea" placeholder="Notes about user authorization status"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Update User</button>
                        <button type="button" class="btn-clear" onclick="showEditUsers()">Back to Users</button>
                    </div>
                </form>
            </div>

            <!-- Files Section -->
            <div class="section uploads-section" id="uploads-section" style="display: none;">
                <div class="section-header">
                    <h3>All Files</h3>
                    <button type="button" id="loadUploadsBtn" class="action-btn">Refresh Files</button>
                </div>
                <div id="uploads-list" class="uploads-list"></div>
            </div>

            <!-- Tasks Section -->
            <div class="section tasks-section" id="tasks-section" style="display: none;">
                <div class="section-header">
                    <h3>All Tasks</h3>
                    <button type="button" id="loadTasksBtn" class="action-btn">Refresh Tasks</button>
                </div>
                <div id="tasks-list" class="tasks-list"></div>
            </div>

            <!-- Complaints Section -->
            <div class="section complaints-section" id="complaints-section" style="display: none;">
                <div class="section-header">
                    <h3>All Complaints</h3>
                    <button type="button" id="loadComplaintsBtn" class="action-btn">Refresh Complaints</button>
                </div>
                <div id="complaints-list" class="complaints-list"></div>
            </div>
        </div>
    </div>
    
    <script src="{{ asset('js/crudHelper.js') }}"></script>
    <script src="{{ asset('js/admin.js') }}"></script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    });
    
    function showSection(sectionName) {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }
    
    // Password toggle function
    function setupPasswordToggle(inputId, toggleId, eyeId, eyeOffId) {
        const pwInput = document.getElementById(inputId);
        const toggleBtn = document.getElementById(toggleId);
        const eye = document.getElementById(eyeId);
        const eyeOff = document.getElementById(eyeOffId);

        if (pwInput && toggleBtn && eye && eyeOff) {
            toggleBtn.addEventListener('click', () => {
                const isHidden = pwInput.type === 'password';
                pwInput.type = isHidden ? 'text' : 'password';

                toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
                toggleBtn.setAttribute('aria-pressed', isHidden ? 'true' : 'false');

                eye.style.display = isHidden ? 'none' : 'block';
                eyeOff.style.display = isHidden ? 'block' : 'none';

                pwInput.focus();
                const len = pwInput.value.length;
                pwInput.setSelectionRange(len, len);
            });
        }
    }
    
    // Setup password toggle for admin form
    setupPasswordToggle('password', 'pw-toggle-admin', 'icon-eye-admin', 'icon-eye-off-admin');
    setupPasswordToggle('password_confirmation', 'pw-toggle-confirm-admin', 'icon-eye-confirm-admin', 'icon-eye-off-confirm-admin');
    setupPasswordToggle('edit_password', 'pw-toggle-edit', 'icon-eye-edit', 'icon-eye-off-edit');
    setupPasswordToggle('edit_password_confirmation', 'pw-toggle-confirm-edit', 'icon-eye-confirm-edit', 'icon-eye-off-confirm-edit');
    
    // Password validation function
    function validatePassword(password) {
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        return specialCharRegex.test(password);
    }
    
    // Password match validation
    function validatePasswordMatch(password, confirmPassword) {
        return password === confirmPassword;
    }
    
    // Dropdown toggle function
    function toggleDropdown() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
    
    function showDeleteUsers() {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('users-section').style.display = 'block';
        document.getElementById('loadUsersBtn').click();
    }
    
    function showAddUser() {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('user-form-section').style.display = 'block';
        document.getElementById('form-title').textContent = 'Create User';
        document.getElementById('userForm').reset();
        document.getElementById('user_id').value = '';
    }
    
    function showEditUsers() {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('users-section').style.display = 'block';
        // Directly call loadUsers instead of clicking button
        if (window.loadUsers) {
            window.loadUsers();
        }
    }
    

    </script>
</body>
</html>