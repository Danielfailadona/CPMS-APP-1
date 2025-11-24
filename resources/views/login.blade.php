<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login & Register - CPMS</title>
    <link rel="stylesheet" href="{{ asset('styles/login.css') }}">
    <link rel="stylesheet" href="{{ asset('styles/login-animations.css') }}">
</head>
<body>
    <div class="container">
        <div class="login-box">
            <div class="left" id="left-panel">
                <div class="logo">
                    <img src="{{ asset('images/aw.jpg') }}" alt="CPMS Logo">
                </div>
                <h2>Sign In</h2>
                
                <div id="message" class="message"></div>
                
                <form id="loginForm">
                    @csrf
                    <input type="email" id="loginEmail" name="email" placeholder="Email Address" required>
                    <div class="field">
                        <input type="password" id="loginPassword" name="password" placeholder="Password" required>
                        <button type="button" class="toggle-btn" id="pw-toggle" aria-label="Show password" aria-pressed="false">
                            <svg id="icon-eye" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                                <circle cx="12" cy="12" r="3.2"/>
                            </svg>
                            <svg id="icon-eye-off" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="display:none;">
                                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7 1.6-2.7 4.07-4.87 7.06-6.18"/>
                                <path d="M3 3l18 18"/>
                                <path d="M14.12 14.12A3.5 3.5 0 0 1 9.88 9.88"/>
                                <path d="M9.88 9.88A3.5 3.5 0 0 0 14.12 14.12"/>
                            </svg>
                        </button>
                    </div>
                    <button type="submit" class="login-btn">Login</button>
                    <div class="auth-status" id="authStatus">Checking authentication...</div>
                </form>
            </div>
            
            <div class="right" id="right-panel">
                <h2>Construction Project<br>Management System</h2>
                <p>New to CPMS? Enter your details and start managing your construction projects.</p>
                <button class="register-btn" onclick="showRegister()">Register</button>
            </div>
        </div>
    </div>

    <script>
        function showRegister() {
            const leftPanel = document.getElementById('left-panel');
            const rightPanel = document.getElementById('right-panel');
            
            leftPanel.innerHTML = `
                <div class="logo">
                    <img src="{{ asset('images/aw.jpg') }}" alt="CPMS Logo">
                </div>
                <p style="margin-bottom: 30px; color: #666; text-align: center;">Already have an account?<br>Sign in to access your construction projects.</p>
                <button class="register-btn" onclick="showLogin()" style="background: rgb(244, 123, 32); color: white;">Login</button>
            `;
            
            rightPanel.innerHTML = `
                <h2>Sign Up</h2>
                <div id="message" class="message"></div>
                <form id="registerForm">
                    @csrf
                    <input type="text" id="registerName" name="name" placeholder="Full Name" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px;">
                    <input type="email" id="registerEmail" name="email" placeholder="Email Address" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px;">
                    <select id="registerUserType" name="user_type" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px; background: white;">
                        <option value="">Select User Type</option>
                        <option value="client">Client</option>
                        <option value="staff">Staff</option>
                        <option value="foreman">Constructor</option>
                        <option value="manager">Manager</option>
                    </select>
                    <div class="field">
                        <input type="password" id="registerPassword" name="password" placeholder="Password" required>
                        <button type="button" class="toggle-btn" id="pw-toggle-reg" aria-label="Show password" aria-pressed="false">
                            <svg id="icon-eye-reg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                                <circle cx="12" cy="12" r="3.2"/>
                            </svg>
                            <svg id="icon-eye-off-reg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="display:none;">
                                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7 1.6-2.7 4.07-4.87 7.06-6.18"/>
                                <path d="M3 3l18 18"/>
                                <path d="M14.12 14.12A3.5 3.5 0 0 1 9.88 9.88"/>
                                <path d="M9.88 9.88A3.5 3.5 0 0 0 14.12 14.12"/>
                            </svg>
                        </button>
                    </div>
                    <div class="field">
                        <input type="password" id="registerPasswordConfirmation" name="password_confirmation" placeholder="Confirm Password" required>
                        <button type="button" class="toggle-btn" id="pw-toggle-confirm" aria-label="Show password" aria-pressed="false">
                            <svg id="icon-eye-confirm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                                <circle cx="12" cy="12" r="3.2"/>
                            </svg>
                            <svg id="icon-eye-off-confirm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="display:none;">
                                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7 1.6-2.7 4.07-4.87 7.06-6.18"/>
                                <path d="M3 3l18 18"/>
                                <path d="M14.12 14.12A3.5 3.5 0 0 1 9.88 9.88"/>
                                <path d="M9.88 9.88A3.5 3.5 0 0 0 14.12 14.12"/>
                            </svg>
                        </button>
                    </div>
                    <button type="submit" class="login-btn" style="background: white; color: rgb(244, 123, 32);">Register</button>
                </form>
            `;
            
            // Add register form handler and password toggles
            document.getElementById('registerForm').addEventListener('submit', handleRegister);
            setupPasswordToggle('registerPassword', 'pw-toggle-reg', 'icon-eye-reg', 'icon-eye-off-reg');
            setupPasswordToggle('registerPasswordConfirmation', 'pw-toggle-confirm', 'icon-eye-confirm', 'icon-eye-off-confirm');
        }
        
        function showLogin() {
            const leftPanel = document.getElementById('left-panel');
            const rightPanel = document.getElementById('right-panel');
            
            leftPanel.innerHTML = `
                <div class="logo">
                    <img src="{{ asset('images/aw.jpg') }}" alt="CPMS Logo">
                </div>
                <h2>Sign In</h2>
                <div id="message" class="message"></div>
                <form id="loginForm">
                    @csrf
                    <input type="email" id="loginEmail" name="email" placeholder="Email Address" required>
                    <div class="field">
                        <input type="password" id="loginPassword" name="password" placeholder="Password" required>
                        <button type="button" class="toggle-btn" id="pw-toggle-login" aria-label="Show password" aria-pressed="false">
                            <svg id="icon-eye-login" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                                <circle cx="12" cy="12" r="3.2"/>
                            </svg>
                            <svg id="icon-eye-off-login" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="display:none;">
                                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7 1.6-2.7 4.07-4.87 7.06-6.18"/>
                                <path d="M3 3l18 18"/>
                                <path d="M14.12 14.12A3.5 3.5 0 0 1 9.88 9.88"/>
                                <path d="M9.88 9.88A3.5 3.5 0 0 0 14.12 14.12"/>
                            </svg>
                        </button>
                    </div>
                    <button type="submit" class="login-btn">Login</button>
                    <div class="auth-status" id="authStatus">Checking authentication...</div>
                </form>
            `;
            
            rightPanel.innerHTML = `
                <h2>Construction Project<br>Management System</h2>
                <p>New to CPMS? Enter your details and start managing your construction projects.</p>
                <button class="register-btn" onclick="showRegister()">Register</button>
            `;
            
            // Add login form handler and password toggle
            document.getElementById('loginForm').addEventListener('submit', handleLogin);
            setupPasswordToggle('loginPassword', 'pw-toggle-login', 'icon-eye-login', 'icon-eye-off-login');
            checkAuth();
        }

        function showMessage(message, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = message;
            messageDiv.style.display = 'block';
            messageDiv.style.color = type === 'success' ? '#155724' : '#721c24';
            messageDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
            messageDiv.style.border = `2px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }

        // Login form handler
        function handleLogin(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            
            fetch('/login', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showMessage(result.message, 'success');
                    setTimeout(() => {
                        const redirectUrl = getDashboardUrl(result.user_type);
                        window.location.href = redirectUrl;
                    }, 1000);
                } else {
                    showMessage(result.message, 'error');
                }
            })
            .catch(error => {
                showMessage('Network error. Please try again.', 'error');
            });
        }

        // Register form handler
        function handleRegister(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            
            fetch('/register', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showMessage(result.message, 'success');
                    showMessage('Registration successful! Your account is pending authorization. You will be notified once approved.', 'success');
                    document.getElementById('registerForm').reset();
                    setTimeout(() => showLogin(), 2000);
                } else {
                    showMessage(result.message, 'error');
                }
            })
            .catch(error => {
                showMessage('Network error. Please try again.', 'error');
            });
        }

        // Determine dashboard URL based on user type
        function getDashboardUrl(userType) {
            const dashboardRoutes = {
                'admin': '/admin-dashboard',
                'client': '/client-dashboard', 
                'foreman': '/foreman-dashboard',
                'manager': '/manager-dashboard',
                'ceo': '/ceo-dashboard',
                'staff': '/worker-dashboard'
            };
            
            return dashboardRoutes[userType] || '/client-dashboard';
        }

        // Check authentication status on page load
        async function checkAuth() {
            try {
                const response = await fetch('/check-auth');
                const result = await response.json();
                
                const authStatus = document.getElementById('authStatus');
                
                if (result.authenticated) {
                    const dashboardUrl = getDashboardUrl(result.user.user_type);
                    authStatus.innerHTML = `Welcome, ${result.user.name}! <a href="${dashboardUrl}">Go to Dashboard</a> | <a href="#" onclick="logout()">Logout</a>`;
                } else {
                    authStatus.innerHTML = 'You are not logged in.';
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        }

        // Logout function
        async function logout() {
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
                    showMessage(result.message, 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            } catch (error) {
                showMessage('Logout failed.', 'error');
            }
        }

        // Password toggle function (template style)
        function setupPasswordToggle(inputId, toggleId, eyeId, eyeOffId) {
            const pwInput = document.getElementById(inputId);
            const toggleBtn = document.getElementById(toggleId);
            const eye = document.getElementById(eyeId);
            const eyeOff = document.getElementById(eyeOffId);

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

        // Add login form handler on page load
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        
        // Setup password toggle for initial login form
        setupPasswordToggle('loginPassword', 'pw-toggle', 'icon-eye', 'icon-eye-off');
        
        // Check auth on page load
        checkAuth();
    </script>
</body>
</html>