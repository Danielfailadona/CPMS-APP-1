<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Settings - CPMS</title>
    <link rel="stylesheet" href="{{ asset('styles/sidebar.css') }}">
    <link rel="stylesheet" href="{{ asset('styles/dashboard-animations.css') }}">
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="profile">
                <div class="profile-pic">
                    <img src="{{ asset('images/aw.jpg') }}" alt="Profile">
                </div>
                <h3>PROFILE SETTINGS</h3>
            </div>

            <ul class="menu">
                <li><a href="#" onclick="showSection('profile')" class="btn active">Edit Profile</a></li>
                <li><a href="#" onclick="goBack()" class="btn">Back to Dashboard</a></li>
                <li><a href="#" onclick="logout()" class="btn">Logout</a></li>
            </ul>
        </div>

        <div class="main-content">
            <div class="section" id="profile-section">
                <div class="section-header">
                    <h3>Edit Your Profile</h3>
                </div>
                <form id="profileForm">
                    @csrf
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
                                <label for="password">New Password (optional):</label>
                                <input id="password" name="password" type="password" placeholder="Leave blank to keep current password">
                                <small class="password-hint">Must be at least 9 characters long and contain at least one special character</small>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="password_confirmation">Confirm New Password:</label>
                                <input id="password_confirmation" name="password_confirmation" type="password">
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" id="updateBtn" class="btn-primary">Update Profile</button>
                        <button type="button" id="loadProfileBtn" class="btn-clear">Reset Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <script src="{{ asset('js/crudHelper.js') }}"></script>
    <script src="{{ asset('js/popup.js') }}"></script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const userCrud = new CrudHelper('users');
        const form = document.getElementById('profileForm');
        const updateBtn = document.getElementById('updateBtn');
        const loadProfileBtn = document.getElementById('loadProfileBtn');
        
        let currentUser = null;
        
        // Load current user profile
        loadProfile();
        
        form.addEventListener('submit', updateProfile);
        loadProfileBtn.addEventListener('click', loadProfile);
        
        async function loadProfile() {
            try {
                const response = await fetch('/current-user');
                const result = await response.json();
                
                if (result.success) {
                    currentUser = result.user;
                    
                    document.getElementById('name').value = currentUser.name || '';
                    document.getElementById('email').value = currentUser.email || '';
                    document.getElementById('password').value = '';
                    document.getElementById('password_confirmation').value = '';
                } else {
                    showError('Error loading profile');
                }
            } catch (error) {
                showError('Error loading profile');
            }
        }
        
        async function updateProfile(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const password = formData.get('password');
            const confirmPassword = formData.get('password_confirmation');
            
            // Validate password if provided
            if (password) {
                if (password.length < 9) {
                    showError('Password must be at least 9 characters long');
                    return;
                }
                
                const specialCharRegex = /[!@#$%^&*(),.?\":{}|<>]/;
                if (!specialCharRegex.test(password)) {
                    showError('Password must contain at least one special character');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showError('Passwords do not match');
                    return;
                }
            }
            
            updateBtn.disabled = true;
            
            try {
                const updateData = {
                    name: formData.get('name'),
                    email: formData.get('email')
                };
                
                if (password) {
                    updateData.password = password;
                }
                
                const result = await userCrud.update(currentUser.id, updateData);
                
                if (result.success) {
                    showSuccess('Profile updated successfully!');
                    document.getElementById('password').value = '';
                    document.getElementById('password_confirmation').value = '';
                } else {
                    showError('Error updating profile: ' + result.message);
                }
            } catch (error) {
                showError('Error updating profile');
            } finally {
                updateBtn.disabled = false;
            }
        }
        
        function goBack() {
            if (currentUser) {
                const dashboardRoutes = {
                    'admin': '/admin-dashboard',
                    'client': '/client-dashboard',
                    'foreman': '/foreman-dashboard',
                    'ceo': '/ceo-dashboard',
                    'manager': '/manager-dashboard',
                    'staff': '/worker-dashboard',
                    'finance': '/finance-dashboard',
                    'constructor': '/client-dashboard'
                };
                
                const dashboardUrl = dashboardRoutes[currentUser.user_type] || '/client-dashboard';
                window.location.href = dashboardUrl;
            } else {
                window.location.href = '/login';
            }
        }
        
        window.goBack = goBack;
        
        async function logout() {
            try {
                const response = await fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                if (response.ok) {
                    window.location.href = '/login';
                }
            } catch (error) {
                window.location.href = '/login';
            }
        }
        
        window.logout = logout;
        
        function showSection(sectionName) {
            // Only one section for now
        }
        
        window.showSection = showSection;
    });
    </script>
</body>
</html>