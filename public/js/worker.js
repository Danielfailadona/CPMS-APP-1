document.addEventListener('DOMContentLoaded', function() {
    // Initialize CRUD helpers
    const taskCrud = new CrudHelper('tasks');
    const complaintCrud = new CrudHelper('complaints');
    const uploadCrud = new CrudHelper('uploads');
    const userCrud = new CrudHelper('users');

    // Get form elements
    const taskForm = document.getElementById('taskForm');
    const uploadForm = document.getElementById('uploadForm');
    const submitTaskBtn = document.getElementById('submitTaskBtn');
    const clearTaskFormBtn = document.getElementById('clearTaskFormBtn');
    const loadTasksBtn = document.getElementById('loadTasksBtn');
    const loadComplaintsBtn = document.getElementById('loadComplaintsBtn');
    const loadUploadsBtn = document.getElementById('loadUploadsBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    
    // Get list containers
    const tasksList = document.getElementById('tasks-list');
    const complaintsList = document.getElementById('complaints-list');
    const uploadsList = document.getElementById('uploads-list');

    // Load data
    loadTasksBtn.addEventListener('click', loadTasks);
    loadComplaintsBtn.addEventListener('click', loadComplaints);
    loadUploadsBtn.addEventListener('click', loadUploads);
    clearTaskFormBtn.addEventListener('click', resetTaskForm);
    clearFormBtn.addEventListener('click', resetForm);
    
    // Filter functionality
    document.getElementById('apply-filters').addEventListener('click', () => loadUploads(true));
    document.getElementById('search-files').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') loadUploads(true);
    });

    // Handle task submission
    taskForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        submitTaskBtn.disabled = true;
        submitTaskBtn.textContent = 'Sending...';

        try {
            const taskData = {
                title: formData.get('title'),
                description: formData.get('description'),
                priority: formData.get('priority'),
                due_date: formData.get('due_date') || null,
                worker_id: await getCurrentUserId(),
                foreman_id: formData.get('foreman_id')
            };

            const result = await taskCrud.create(taskData);

            if (result.success) {
                alert('Task sent to foreman successfully!');
                resetTaskForm();
                loadTasks();
            } else {
                if (result.message && result.message.includes('already exists')) {
                    alert(result.message);
                } else {
                    alert('Error: ' + (result.message || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending task: ' + error.message);
        } finally {
            submitTaskBtn.disabled = false;
            submitTaskBtn.textContent = 'Send Task';
        }
    });

    // Handle file upload (same as foreman)
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const fileInput = document.getElementById('file');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            
            const uploadResponse = await fetch('/upload-file-test', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: uploadFormData
            });
            
            const uploadResult = await uploadResponse.json();
            
            if (!uploadResult.success) {
                throw new Error(uploadResult.message || 'File upload failed');
            }

            const uploadData = {
                filename: file.name,
                file_path: uploadResult.path,
                file_size: formatFileSize(file.size),
                mime_type: file.type,
                upload_type: formData.get('upload_type'),
                title: formData.get('title') || file.name,
                description: formData.get('description'),
                is_public: formData.get('is_public') ? true : false,
                user_id: await getCurrentUserId()
            };

            const result = await uploadCrud.create(uploadData);

            if (result.success) {
                alert('File uploaded successfully!');
                resetForm();
                loadUploads();
            } else {
                if (result.message && result.message.includes('already exists')) {
                    alert(result.message);
                } else {
                    alert('Error saving file info: ' + (result.message || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading file: ' + error.message);
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload File';
        }
    });

    async function loadComplaints() {
        try {
            const complaints = await complaintCrud.readAll();
            
            if (complaints.length === 0) {
                complaintsList.innerHTML = '<p class="no-complaints">No complaints to display.</p>';
                return;
            }
            
            const complaintsHTML = complaints.map(complaint => `
                <div class="complaint-item" data-id="${complaint.id}">
                    <div class="complaint-info">
                        <div class="complaint-title">${complaint.title}</div>
                        <div class="complaint-details">
                            <span class="complaint-priority priority-${complaint.priority}">Priority: ${complaint.priority.toUpperCase()}</span>
                            <span class="complaint-status status-${complaint.status}">Status: ${complaint.status.replace('_', ' ').toUpperCase()}</span>
                            <span class="complaint-date">Date Issued: ${new Date(complaint.created_at).toLocaleDateString()}</span>
                            <span class="complaint-client">Client ID: ${complaint.client_id}</span>
                        </div>
                        <div class="complaint-description">${complaint.description}</div>
                        ${complaint.worker_notes ? `<div class="staff-notes"><strong>My Notes:</strong> ${complaint.worker_notes}</div>` : ''}
                    </div>
                    <div class="complaint-actions">
                        ${complaint.status !== 'resolved' && complaint.status !== 'closed' ? `
                            <button class="action-btn" onclick="updateComplaintStatus(${complaint.id}, 'in_progress')">Take Action</button>
                            <button class="resolve-btn" onclick="resolveComplaint(${complaint.id})">Mark Resolved</button>
                        ` : ''}
                        <button class="notes-btn" onclick="addStaffNotes(${complaint.id})">Add Notes</button>
                    </div>
                </div>
            `).join('');
            
            complaintsList.innerHTML = complaintsHTML;
        } catch (error) {
            console.error('Error loading complaints:', error);
            complaintsList.innerHTML = '<p class="no-complaints">Error loading complaints.</p>';
        }
    }

    async function loadUploads(applyFilters = false) {
        try {
            const uploads = await uploadCrud.readAll();
            const currentUserId = await getCurrentUserId();
            
            console.log('All uploads:', uploads);
            console.log('Current user ID:', currentUserId);
            
            let userUploads = uploads.filter(upload => upload.user_id == currentUserId);
            
            console.log('User uploads:', userUploads);
            
            // Apply search and type filters
            if (applyFilters) {
                const searchTerm = document.getElementById('search-files').value.toLowerCase();
                const typeFilter = document.getElementById('filter-type').value;
                
                if (searchTerm) {
                    userUploads = userUploads.filter(upload => 
                        (upload.title && upload.title.toLowerCase().includes(searchTerm)) ||
                        (upload.filename && upload.filename.toLowerCase().includes(searchTerm))
                    );
                }
                
                if (typeFilter !== 'all') {
                    userUploads = userUploads.filter(upload => upload.upload_type === typeFilter);
                }
            }
            
            if (userUploads.length === 0) {
                uploadsList.innerHTML = '<p class="no-uploads">No files uploaded yet for your account.</p>';
                return;
            }
            
            const uploadsHTML = userUploads.map(upload => `
                <div class="upload-item" data-id="${upload.id}">
                    <div class="upload-info">
                        <div class="upload-title">${upload.title || upload.filename}</div>
                        <div class="upload-details">
                            <span class="upload-type">File Type: ${getUploadTypeLabel(upload.upload_type)}</span>
                            <span class="upload-size">File Size: ${upload.file_size}</span>
                            <span class="upload-date">Date Uploaded: ${new Date(upload.created_at).toLocaleDateString()}</span>
                            <span class="${upload.is_public ? 'upload-public' : 'upload-private'}">
                                Status: ${upload.is_public ? 'Public' : 'Private'}
                            </span>
                        </div>
                        ${upload.description ? `<div class="upload-description">${upload.description}</div>` : ''}
                    </div>
                    <div class="upload-actions">
                        <button class="download-btn" onclick="downloadUpload(event, ${upload.id}, '${upload.filename}')">Download</button>
                        <button class="view-btn" onclick="viewUpload(${upload.id})">View</button>
                        <button class="delete-btn" onclick="deleteUpload(${upload.id})">Delete</button>
                    </div>
                </div>
            `).join('');
            
            uploadsList.innerHTML = uploadsHTML;
        } catch (error) {
            console.error('Error loading uploads:', error);
            uploadsList.innerHTML = '<p class="no-uploads">Error loading files.</p>';
        }
    }

    // Update complaint status
    window.updateComplaintStatus = async function(id, status) {
        try {
            const result = await complaintCrud.update(id, { status: status });
            
            if (result.success) {
                alert(`Complaint status updated to ${status.replace('_', ' ')}!`);
                loadComplaints();
            } else {
                alert('Error: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating complaint:', error);
            alert('Error updating complaint: ' + error.message);
        }
    };

    // Resolve complaint
    window.resolveComplaint = async function(id) {
        const notes = prompt('Add resolution notes (optional):');
        
        try {
            const updateData = {
                status: 'resolved',
                resolved_at: new Date().toISOString()
            };
            
            if (notes) {
                updateData.worker_notes = notes;
            }
            
            const result = await complaintCrud.update(id, updateData);
            
            if (result.success) {
                alert('Complaint marked as resolved!');
                loadComplaints();
            } else {
                alert('Error: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error resolving complaint:', error);
            alert('Error resolving complaint: ' + error.message);
        }
    };

    // Add staff notes
    window.addStaffNotes = async function(id) {
        const notes = prompt('Enter your notes:');
        
        if (notes) {
            try {
                const result = await complaintCrud.update(id, { worker_notes: notes });
                
                if (result.success) {
                    alert('Notes added successfully!');
                    loadComplaints();
                } else {
                    alert('Error: ' + (result.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error adding notes:', error);
                alert('Error adding notes: ' + error.message);
            }
        }
    };

    // File management functions (same as foreman)
    window.downloadUpload = async function(event, id, filename) {
        try {
            const result = await uploadCrud.readOne(id);
            
            if (result.success) {
                const upload = result.data;
                
                const originalText = event.target.textContent;
                event.target.textContent = 'Downloading...';
                event.target.disabled = true;
                
                try {
                    const response = await fetch(`/download-file?path=${encodeURIComponent(upload.file_path)}&filename=${encodeURIComponent(upload.filename)}`);
                    
                    if (!response.ok) {
                        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                    }
                    
                    const blob = await response.blob();
                    
                    if (blob.size === 0) {
                        throw new Error('File is empty or not found');
                    }
                    
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = upload.filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                } catch (error) {
                    console.error('Download error:', error);
                    try {
                        window.open(`/download-file?path=${encodeURIComponent(upload.file_path)}&filename=${encodeURIComponent(upload.filename)}`, '_blank');
                    } catch (fallbackError) {
                        alert('Error downloading file: ' + error.message);
                    }
                } finally {
                    event.target.textContent = originalText;
                    event.target.disabled = false;
                }
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Error downloading file: ' + error.message);
        }
    };

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
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('file-viewer-modal');
        if (modal && e.target === modal) {
            closeFileViewer();
        }
    });

    window.deleteUpload = async function(id) {
        if (confirm('Are you sure you want to delete this file?')) {
            const result = await uploadCrud.delete(id);
            
            if (result.success) {
                alert('File deleted successfully!');
                loadUploads();
            } else {
                alert('Error: ' + (result.message || 'Unknown error'));
            }
        }
    };

    function resetForm() {
        uploadForm.reset();
        document.getElementById('is_public').checked = false;
    }

    // Helper function to get current user ID
    let currentUserId = null;
    
    async function getCurrentUserId() {
        if (currentUserId === null) {
            try {
                const response = await fetch('/current-user');
                const result = await response.json();
                if (result.success) {
                    currentUserId = result.user.id;
                } else {
                    currentUserId = 1; // fallback
                }
            } catch (error) {
                console.error('Error getting current user:', error);
                currentUserId = 1; // fallback
            }
        }
        return currentUserId;
    }

    function formatFileSize(bytes) {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function getUploadTypeLabel(type) {
        const types = {
            'task': 'Task',
            'image': 'Image',
            'report': 'Staff Report',
            'safety': 'Safety',
            'inspection': 'Inspection',
            'other': 'Other'
        };
        return types[type] || type;
    }

    async function loadTasks() {
        try {
            const [tasks, users] = await Promise.all([
                taskCrud.readAll(),
                userCrud.readAll()
            ]);
            const currentUserId = await getCurrentUserId();
            
            const userTasks = tasks.filter(task => task.worker_id == currentUserId);
            
            // Add foreman names to tasks
            userTasks.forEach(task => {
                const foreman = users.find(user => user.id == task.foreman_id);
                task.foreman_name = foreman ? foreman.name : 'Unknown Foreman';
            });
            
            if (userTasks.length === 0) {
                tasksList.innerHTML = '<p class="no-tasks">No tasks sent yet.</p>';
                return;
            }
            
            const tasksHTML = userTasks.map(task => `
                <div class="task-item" data-id="${task.id}">
                    <div class="task-info">
                        <div class="task-title">${task.title}</div>
                        <div class="task-details">
                            <span class="task-priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
                            <span class="task-status status-${task.status}">${task.status.replace('_', ' ').toUpperCase()}</span>
                            <span class="task-date">${new Date(task.created_at).toLocaleDateString()}</span>
                            ${task.due_date ? `<span class="task-due">Due: ${new Date(task.due_date).toLocaleDateString()}</span>` : ''}
                            <span class="task-foreman">Assigned to: ${task.foreman_name}</span>
                        </div>
                        <div class="task-description">${task.description}</div>
                        ${task.foreman_notes ? `<div class="foreman-notes"><strong>Foreman Notes:</strong> ${task.foreman_notes}</div>` : ''}
                    </div>
                    <div class="task-actions">
                        <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                </div>
            `).join('');
            
            tasksList.innerHTML = tasksHTML;
        } catch (error) {
            console.error('Error loading tasks:', error);
            tasksList.innerHTML = '<p class="no-tasks">Error loading tasks.</p>';
        }
    }

    // Edit task
    window.editTask = async function(id) {
        try {
            const result = await taskCrud.readOne(id);
            
            if (result.success) {
                const task = result.data;
                
                const newTitle = prompt('Edit Task Title:', task.title);
                if (newTitle === null) return;
                
                const newDescription = prompt('Edit Task Description:', task.description);
                if (newDescription === null) return;
                
                const newPriority = prompt('Edit Priority (low/medium/high/urgent):', task.priority);
                if (newPriority === null) return;
                
                const updateData = {
                    title: newTitle,
                    description: newDescription,
                    priority: newPriority
                };
                
                const updateResult = await taskCrud.update(id, updateData);
                
                if (updateResult.success) {
                    alert('Task updated successfully!');
                    loadTasks();
                } else {
                    if (updateResult.message && updateResult.message.includes('already exists')) {
                        alert(updateResult.message);
                    } else {
                        alert('Error: ' + (updateResult.message || 'Unknown error'));
                    }
                }
            }
        } catch (error) {
            console.error('Error editing task:', error);
            alert('Error editing task: ' + error.message);
        }
    };

    // Delete task
    window.deleteTask = async function(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            const result = await taskCrud.delete(id);
            
            if (result.success) {
                alert('Task deleted successfully!');
                loadTasks();
            } else {
                alert('Error: ' + (result.message || 'Unknown error'));
            }
        }
    };

    function resetTaskForm() {
        taskForm.reset();
        document.getElementById('task_priority').value = 'medium';
    }

    // Navigation function
    window.showSection = function(section) {
        // Hide all sections
        document.getElementById('tasks-section').style.display = 'none';
        document.getElementById('send-task-section').style.display = 'none';
        document.getElementById('complaints-section').style.display = 'none';
        document.getElementById('files-section').style.display = 'none';
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('camera-section').style.display = 'none';
        
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        
        // Show selected section and activate button
        if (section === 'tasks') {
            document.getElementById('tasks-section').style.display = 'block';
            event.target.classList.add('active');
            loadTasks();
        } else if (section === 'send-task') {
            document.getElementById('send-task-section').style.display = 'block';
            event.target.classList.add('active');
            loadForemen();
        } else if (section === 'complaints') {
            document.getElementById('complaints-section').style.display = 'block';
            event.target.classList.add('active');
            loadComplaints();
        } else if (section === 'files') {
            document.getElementById('files-section').style.display = 'block';
            event.target.classList.add('active');
            loadUploads();
            // Also trigger the refresh button click to ensure data loads
            document.getElementById('loadUploadsBtn').click();
        } else if (section === 'upload') {
            document.getElementById('upload-section').style.display = 'block';
            event.target.classList.add('active');
        } else if (section === 'camera') {
            document.getElementById('camera-section').style.display = 'block';
            event.target.classList.add('active');
            initializeCamera();
        }
    };

    // Camera functionality
    let cameraStream = null;
    let photoTimestamp = null;
    let photoBlob = null;

    function initializeCamera() {
        const startBtn = document.getElementById('start-camera-btn');
        const takeBtn = document.getElementById('take-photo-btn');
        const stopBtn = document.getElementById('stop-camera-btn');
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        const preview = document.getElementById('photo-preview');
        const uploadForm = document.getElementById('camera-upload-form');
        
        startBtn.addEventListener('click', startCamera);
        takeBtn.addEventListener('click', takePhoto);
        stopBtn.addEventListener('click', stopCamera);
        document.getElementById('retake-photo-btn').addEventListener('click', retakePhoto);
        uploadForm.addEventListener('submit', uploadCameraPhoto);
    }

    async function startCamera() {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' }
            });
            
            const video = document.getElementById('camera-video');
            video.srcObject = cameraStream;
            
            document.getElementById('start-camera-btn').style.display = 'none';
            document.getElementById('take-photo-btn').style.display = 'inline-block';
            document.getElementById('stop-camera-btn').style.display = 'inline-block';
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Error accessing camera. Please make sure you have granted camera permissions.');
        }
    }

    function takePhoto() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        photoTimestamp = new Date();
        
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob(function(blob) {
            photoBlob = blob;
            
            const preview = document.getElementById('photo-preview');
            const previewImg = document.getElementById('preview-image');
            const timestampDiv = document.getElementById('photo-timestamp');
            
            previewImg.src = URL.createObjectURL(blob);
            timestampDiv.textContent = `Photo taken at: ${photoTimestamp.toLocaleString()}`;
            preview.style.display = 'block';
            
            document.getElementById('take-photo-btn').style.display = 'none';
            
        }, 'image/jpeg', 0.8);
    }

    function retakePhoto() {
        document.getElementById('photo-preview').style.display = 'none';
        document.getElementById('take-photo-btn').style.display = 'inline-block';
        document.getElementById('camera-upload-form').reset();
        photoBlob = null;
        photoTimestamp = null;
    }

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
        
        document.getElementById('start-camera-btn').style.display = 'inline-block';
        document.getElementById('take-photo-btn').style.display = 'none';
        document.getElementById('stop-camera-btn').style.display = 'none';
        document.getElementById('photo-preview').style.display = 'none';
        
        const video = document.getElementById('camera-video');
        video.srcObject = null;
    }

    async function uploadCameraPhoto(e) {
        e.preventDefault();
        
        if (!photoBlob || !photoTimestamp) {
            alert('Please take a photo first.');
            return;
        }
        
        const uploadBtn = document.getElementById('upload-photo-btn');
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';
        
        try {
            const formData = new FormData();
            const filename = `photo_${Date.now()}.jpg`;
            formData.append('file', photoBlob, filename);
            
            const uploadResponse = await fetch('/upload-file-test', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            });
            
            const uploadResult = await uploadResponse.json();
            
            if (!uploadResult.success) {
                throw new Error(uploadResult.message || 'Photo upload failed');
            }
            
            const photoData = {
                filename: filename,
                file_path: uploadResult.path,
                file_size: formatFileSize(photoBlob.size),
                mime_type: 'image/jpeg',
                upload_type: 'image',
                title: document.getElementById('photo_title').value,
                description: document.getElementById('photo_description').value,
                is_public: document.getElementById('photo_is_public').checked,
                user_id: await getCurrentUserId(),
                photo_taken_at: photoTimestamp.toISOString().slice(0, 19).replace('T', ' '),
                is_camera_photo: true
            };
            
            const result = await uploadCrud.create(photoData);
            
            if (result.success) {
                alert('Photo uploaded successfully with timestamp!');
                stopCamera();
                document.getElementById('camera-upload-form').reset();
                loadUploads();
            } else {
                if (result.message && result.message.includes('already exists')) {
                    alert(result.message);
                } else {
                    alert('Error saving photo info: ' + (result.message || 'Unknown error'));
                }
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading photo: ' + error.message);
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload Photo';
        }
    }

    // Load foremen for task assignment
    async function loadForemen() {
        try {
            const users = await userCrud.readAll();
            const foremen = users.filter(user => user.user_type === 'foreman' && user.is_active && user.is_authorized);
            
            const foremanSelect = document.getElementById('task_foreman');
            foremanSelect.innerHTML = '<option value="">Select a foreman...</option>';
            
            foremen.forEach(foreman => {
                const option = document.createElement('option');
                option.value = foreman.id;
                option.textContent = foreman.name;
                foremanSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading foremen:', error);
        }
    }

    // Load data on page load
    loadTasks();
    loadForemen();
});

// Logout function
async function logout() {
    if (confirm('Are you sure you want to logout?')) {
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
                alert('Logged out successfully!');
                window.location.href = '/login';
            }
        } catch (error) {
            alert('Logout failed. Please try again.');
        }
    }
}