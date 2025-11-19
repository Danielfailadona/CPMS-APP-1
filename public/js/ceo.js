// CEO Dashboard JavaScript
let projects = [];
let uploads = [];
let weeklyReports = [];

const projectCrud = new CrudHelper('projects');
const uploadCrud = new CrudHelper('uploads');
const weeklyReportCrud = new CrudHelper('weekly_reports');

document.addEventListener('DOMContentLoaded', function() {
    loadProjectOverview();
    
    const refreshOverviewBtn = document.getElementById('refreshOverviewBtn');
    if (refreshOverviewBtn) {
        refreshOverviewBtn.addEventListener('click', loadProjectOverview);
    }
    

    
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }
    
    // Add event listeners for file section
    const loadUploadsBtn = document.getElementById('loadUploadsBtn');
    if (loadUploadsBtn) {
        loadUploadsBtn.addEventListener('click', () => loadUploads());
    }
    
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => loadUploads(true));
    }
    
    const searchFiles = document.getElementById('search-files');
    if (searchFiles) {
        searchFiles.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') loadUploads(true);
        });
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('file-viewer-modal');
        if (modal && e.target === modal) {
            closeFileViewer();
        }
    });
});

async function loadProjectOverview() {
    try {
        [projects, uploads, weeklyReports] = await Promise.all([
            projectCrud.readAll(),
            uploadCrud.readAll(),
            weeklyReportCrud.readAll()
        ]);
        
        // Create sample project if none exist
        if (projects.length === 0) {
            await createSampleProject();
            projects = await projectCrud.readAll();
        }
        
        updateProjectStats();
        displayProjectsList();
    } catch (error) {
        console.error('Error loading project overview:', error);
        showError('Error loading project data');
    }
}

async function createSampleProject() {
    try {
        const projectData = {
            name: 'Construction Site Alpha',
            description: 'Main construction project for residential complex',
            start_date: new Date().toISOString().split('T')[0],
            total_phases: 10,
            completed_phases: 3,
            completion_percentage: 30,
            status: 'active'
        };
        
        await projectCrud.create(projectData);
    } catch (error) {
        console.error('Error creating sample project:', error);
    }
}

function updateProjectStats() {
    const totalElement = document.getElementById('total-projects');
    const activeElement = document.getElementById('active-projects');
    const reportsElement = document.getElementById('total-reports');
    
    if (totalElement) totalElement.textContent = 0;
    if (activeElement) activeElement.textContent = 0;
    if (reportsElement) reportsElement.textContent = 0;
}

function displayProjectsList() {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;
    
    projectsList.innerHTML = '';
}

window.updateProjectProgress = async function(projectId) {
    const project = projects.find(p => p.id == projectId);
    if (!project) return;
    
    const completedPhases = prompt(`Enter completed phases (current: ${project.completed_phases}/${project.total_phases}):`);
    if (completedPhases === null) return;
    
    const phases = parseInt(completedPhases);
    if (isNaN(phases) || phases < 0 || phases > project.total_phases) {
        showError('Invalid number of phases');
        return;
    }
    
    try {
        const updateData = {
            completed_phases: phases
        };
        
        const result = await projectCrud.update(projectId, updateData);
        if (result.success) {
            showSuccess('Project progress updated!');
            loadProjectOverview();
        } else {
            showError('Error updating progress: ' + result.message);
        }
    } catch (error) {
        showError('Error updating project progress');
    }
};



async function handleUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const uploadBtn = document.getElementById('uploadBtn');
    
    if (uploadBtn) uploadBtn.disabled = true;
    
    try {
        const result = await uploadCrud.create(formData);
        if (result.success) {
            showSuccess('File uploaded successfully!');
            e.target.reset();
        } else {
            showError('Error uploading file: ' + result.message);
        }
    } catch (error) {
        showError('Error uploading file');
    } finally {
        if (uploadBtn) uploadBtn.disabled = false;
    }
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
        
        if (sectionName === 'files') {
            loadUploads();
        }
    }
}

async function loadUploads(applyFilters = false) {
    try {
        let uploads = await uploadCrud.readAll();
        uploads = uploads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        let filteredUploads = uploads;
        
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
        
        const uploadsList = document.getElementById('uploads-list');
        if (!uploadsList) return;
        
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
                        <span style="background: rgb(244, 123, 32); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">File Type: ${getUploadTypeLabel(upload.upload_type)}</span>
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
    } catch (error) {
        console.error('Error loading uploads:', error);
        const uploadsList = document.getElementById('uploads-list');
        if (uploadsList) {
            uploadsList.innerHTML = '<p class="no-uploads">Error loading files.</p>';
        }
    }
}

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

console.log('CEO dashboard initialized');

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

window.viewUpload = async function(id) {
    const result = await uploadCrud.readOne(id);
    if (result.success) {
        const upload = result.data;
        showFileViewerModal(upload);
    }
};

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

window.closeFileViewer = function() {
    const modal = document.getElementById('file-viewer-modal');
    if (modal) {
        modal.remove();
    }
};

window.downloadFile = function(filePath, filename) {
    const url = `/download-file?path=${encodeURIComponent(filePath)}&filename=${encodeURIComponent(filename)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

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