<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Manager Dashboard - CPMS</title>
    <link rel="stylesheet" href="{{ asset('styles/sidebar.css') }}">
    <link rel="stylesheet" href="{{ asset('styles/dashboard-animations.css') }}">
    <link rel="stylesheet" href="{{ asset('styles/dashboard-animations.css') }}">
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="profile">
                <div class="profile-pic">
                    <img src="{{ asset('images/aw.jpg') }}" alt="Profile">
                </div>
                <h3>MANAGER DASHBOARD</h3>
            </div>

            <ul class="menu">
                <li class="dropdown">
                    <a href="#" onclick="toggleProjectsDropdown()">Projects ▼</a>
                    <ul class="dropdown-menu" id="projectsDropdown">
                        <li><a href="#" onclick="showSection('projects')">My Projects</a></li>
                        <li><a href="#" onclick="showSection('create-project')">Create Project</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" onclick="toggleViewDropdown()">Files ▼</a>
                    <ul class="dropdown-menu" id="viewDropdown">
                        <li><a href="#" onclick="showSection('files')" class="active">My Files</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" onclick="toggleActionsDropdown()">Actions ▼</a>
                    <ul class="dropdown-menu" id="actionsDropdown">
                        <li><a href="#" onclick="showSection('upload')">Upload File</a></li>
                        <li><a href="#" onclick="showSection('camera')">📷 Take Photo</a></li>
                    </ul>
                </li>
                <li><a href="#" onclick="logout()">Logout</a></li>
            </ul>
        </div>

        <!-- Main Content -->
        <div class="main-content">

            <!-- Projects Section -->
            <div class="section projects-section" id="projects-section" style="display: none;">
                <div class="section-header">
                    <h3>My Projects</h3>
                    <button type="button" id="loadProjectsBtn" class="action-btn">Refresh Projects</button>
                </div>
                <div id="projects-list" class="projects-list"></div>
            </div>

            <!-- Create Project Section -->
            <div class="section form-section" id="create-project-section" style="display: none;">
                <div class="section-header">
                    <h3>Create New Project</h3>
                </div>
                <form id="createProjectForm">
                    @csrf
                    <div class="form-fields">
                        <div class="form-row">
                            <div class="input-group">
                                <label for="project_name">Project Name:</label>
                                <input id="project_name" name="name" type="text" required placeholder="Enter project name">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label for="project_description">Description:</label>
                                <textarea id="project_description" name="description" class="form-textarea" placeholder="Project description"></textarea>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label for="start_date">Start Date:</label>
                                <input id="start_date" name="start_date" type="date" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label for="end_date">End Date:</label>
                                <input id="end_date" name="end_date" type="date" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label>Assign Users:</label>
                                <div style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">
                                    <input type="text" id="search-users" placeholder="Search users..." style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                    <select id="filter-user-type" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                        <option value="all">All Types</option>
                                        <option value="client">Client</option>
                                        <option value="foreman">Constructor</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                    <button type="button" id="apply-user-filters" class="action-btn">Apply Filters</button>
                                </div>
                                <div id="users-list" style="max-height: 150px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; border-radius: 4px;"></div>
                                <button type="button" id="assign-users-btn" class="action-btn" style="margin-top: 10px;">Assign Users</button>
                                <div id="assigned-users-display" style="margin-top: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9; display: none;">
                                    <strong>Assigned Users:</strong>
                                    <div id="assigned-users-list" style="margin-top: 5px;"></div>
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label>Milestones:</label>
                                <div style="margin-bottom: 10px;">
                                    <label for="milestone_count">Number of Milestones:</label>
                                    <input type="number" id="milestone_count" min="1" max="20" value="1" style="padding: 8px; margin-left: 10px; width: 80px; border: 1px solid #ccc; border-radius: 4px;">
                                    <button type="button" id="generate-milestones" class="action-btn" style="margin-left: 10px;">Generate Milestones</button>
                                </div>
                                <div id="milestones-container">
                                    <div class="milestone-item" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                                        <input type="text" name="milestones[0][name]" placeholder="Milestone name" required style="width: 100%; margin-bottom: 5px; padding: 8px;">
                                        <textarea name="milestones[0][description]" placeholder="Milestone description" style="width: 100%; margin-bottom: 5px; padding: 8px; height: 60px;"></textarea>
                                        <input type="date" name="milestones[0][due_date]" style="width: 100%; padding: 8px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Create Project</button>
                        <button type="button" class="btn-clear" onclick="document.getElementById('createProjectForm').reset()">Clear Form</button>
                    </div>
                </form>
            </div>

            <!-- Uploads List Section -->
            <div class="section uploads-section" id="files-section">
                <div class="section-header">
                    <h3>My Uploads</h3>
                    <button type="button" id="loadUploadsBtn" class="action-btn">Refresh Files</button>
                </div>
                <div class="file-filters" style="margin-bottom: 15px;">
                    <input type="text" id="search-files" placeholder="Search files by name..." style="padding: 8px; margin-right: 10px; width: 200px;">
                    <select id="filter-type" style="padding: 8px; margin-right: 10px;">
                        <option value="all">All Types</option>
                        <option value="report">Management Reports</option>
                        <option value="task">Task Related</option>
                        <option value="image">Images</option>
                        <option value="document">Documents</option>
                        <option value="blueprint">Blueprints</option>
                        <option value="safety">Safety</option>
                        <option value="inspection">Inspection</option>
                        <option value="other">Other</option>
                    </select>
                    <button type="button" id="apply-filters" class="action-btn">Apply Filters</button>
                </div>
                <div id="uploads-list" class="uploads-list"></div>
            </div>

            <!-- Upload Form Section -->
            <div class="section form-section" id="upload-section" style="display: none;">
                <div class="section-header">
                    <h3>Upload New File</h3>
                </div>
                <form id="uploadForm" enctype="multipart/form-data">
                    @csrf
                    
                    <div class="form-fields">
                        <div class="form-row">
                            <div class="input-group">
                                <label for="file">Select File:</label>
                                <input type="file" id="file" name="file" required accept="*/*">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="title">File Title:</label>
                                <input id="title" name="title" type="text" required placeholder="Enter a descriptive title">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="upload_type">File Type:</label>
                                <select id="upload_type" name="upload_type" class="form-select" required>
                                    <option value="report">Management Report</option>
                                    <option value="task">Task Related</option>
                                    <option value="document">Document</option>
                                    <option value="blueprint">Blueprint/Plan</option>
                                    <option value="safety">Safety Document</option>
                                    <option value="inspection">Inspection Report</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="project_id">Associate with Project:</label>
                                <select id="project_id" name="project_id" class="form-select">
                                    <option value="">No Project</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label for="description">Description:</label>
                                <textarea id="description" name="description" class="form-textarea" placeholder="Describe what this file is about"></textarea>
                            </div>
                        </div>

                        <div class="form-row checkbox-group">
                            <div class="input-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="is_public" name="is_public" value="1">
                                    <span class="checkmark"></span>
                                    Make file public
                                </label>
                                <small class="checkbox-hint">Public files can be seen by other users</small>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="form-actions">
                        <button type="submit" id="uploadBtn" class="btn-primary">Upload File</button>
                        <button type="button" id="clearFormBtn" class="btn-clear">Clear Form</button>
                    </div>
                </form>
            </div>

            <!-- Camera Section -->
            <div class="section form-section" id="camera-section" style="display: none;">
                <div class="section-header">
                    <h3>📷 Take Photo with Timestamp</h3>
                </div>
                <div class="camera-container">
                    <video id="camera-video" autoplay playsinline style="width: 100%; max-width: 400px; border-radius: 8px;"></video>
                    <canvas id="camera-canvas" style="display: none;"></canvas>
                    
                    <div class="camera-controls" style="margin-top: 15px;">
                        <button type="button" id="start-camera-btn" class="btn-primary">Start Camera</button>
                        <button type="button" id="take-photo-btn" class="btn-primary" style="display: none;">Take Photo</button>
                        <button type="button" id="stop-camera-btn" class="btn-clear" style="display: none;">Stop Camera</button>
                    </div>
                    
                    <div id="photo-preview" style="margin-top: 15px; display: none;">
                        <h4>Photo Preview:</h4>
                        <img id="preview-image" style="width: 100%; max-width: 400px; border-radius: 8px; border: 2px solid #007bff;">
                        <div id="photo-timestamp" style="margin: 10px 0; font-weight: bold; color: #007bff;"></div>
                        
                        <form id="camera-upload-form">
                            @csrf
                            <div class="form-fields">
                                <div class="form-row">
                                    <div class="input-group">
                                        <label for="photo_title">Photo Title:</label>
                                        <input id="photo_title" name="title" type="text" required placeholder="Enter photo description">
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="input-group">
                                        <label for="photo_description">Description:</label>
                                        <textarea id="photo_description" name="description" class="form-textarea" placeholder="Additional details about this photo"></textarea>
                                    </div>
                                </div>
                                
                                <div class="form-row checkbox-group">
                                    <div class="input-group">
                                        <label class="checkbox-label">
                                            <input type="checkbox" id="photo_is_public" name="is_public" value="1">
                                            <span class="checkmark"></span>
                                            Make photo public
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" id="upload-photo-btn" class="btn-primary">Upload Photo</button>
                                <button type="button" id="retake-photo-btn" class="btn-clear">Retake Photo</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="{{ asset('js/crudHelper.js') }}"></script>
    <script src="{{ asset('js/foreman.js') }}"></script>
    <script src="{{ asset('js/projects.js') }}"></script>
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
    
    function toggleViewDropdown() {
        const dropdown = document.getElementById('viewDropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
    
    function toggleActionsDropdown() {
        const dropdown = document.getElementById('actionsDropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
    
    function toggleProjectsDropdown() {
        const dropdown = document.getElementById('projectsDropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
    </script>
</body>
</html>
