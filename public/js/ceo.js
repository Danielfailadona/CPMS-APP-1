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
    
    const generateConsolidatedBtn = document.getElementById('generateConsolidatedBtn');
    if (generateConsolidatedBtn) {
        generateConsolidatedBtn.addEventListener('click', generateConsolidatedReport);
    }
    
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }
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
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    
    const totalProgress = projects.reduce((sum, p) => sum + parseFloat(p.completion_percentage || 0), 0);
    const overallProgress = totalProjects > 0 ? (totalProgress / totalProjects).toFixed(1) : 0;
    
    const totalElement = document.getElementById('total-projects');
    const activeElement = document.getElementById('active-projects');
    const progressElement = document.getElementById('overall-progress');
    
    if (totalElement) totalElement.textContent = totalProjects;
    if (activeElement) activeElement.textContent = activeProjects;
    if (progressElement) progressElement.textContent = overallProgress + '%';
}

function displayProjectsList() {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p class="no-data">No projects found.</p>';
        return;
    }
    
    const projectsHTML = projects.map(project => `
        <div class="project-item" data-id="${project.id}">
            <div class="project-header">
                <h4>${project.name}</h4>
                <span class="project-status status-${project.status}">${project.status.toUpperCase()}</span>
            </div>
            <div class="project-details">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.completion_percentage || 0}%; background: rgb(244, 123, 32);"></div>
                    <span class="progress-text">${project.completion_percentage || 0}% Complete</span>
                </div>
                <p><strong>Phases:</strong> ${project.completed_phases || 0} / ${project.total_phases || 1}</p>
                <p><strong>Start Date:</strong> ${new Date(project.start_date).toLocaleDateString()}</p>
                ${project.description ? `<p><strong>Description:</strong> ${project.description}</p>` : ''}
            </div>
            <div class="project-actions">
                <button class="btn-primary" onclick="updateProjectProgress(${project.id})">Update Progress</button>
            </div>
        </div>
    `).join('');
    
    projectsList.innerHTML = projectsHTML;
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
        const completion = (phases / project.total_phases) * 100;
        const updateData = {
            completed_phases: phases,
            completion_percentage: completion.toFixed(2)
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

async function generateConsolidatedReport() {
    const reportsDiv = document.getElementById('consolidated-reports');
    if (!reportsDiv) return;
    
    try {
        const totalUploads = uploads.length;
        const totalReports = weeklyReports.length;
        const recentUploads = uploads.filter(u => {
            const uploadDate = new Date(u.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return uploadDate >= weekAgo;
        }).length;
        
        const reportHTML = `
            <div class="consolidated-report">
                <h4>Executive Summary Report</h4>
                <div class="report-grid">
                    <div class="report-section">
                        <h5>Project Overview</h5>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-label">Total Projects</span>
                                <span class="stat-value">${projects.length}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Active Projects</span>
                                <span class="stat-value">${projects.filter(p => p.status === 'active').length}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="report-section">
                        <h5>Activity Summary</h5>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-label">Total Files</span>
                                <span class="stat-value">${totalUploads}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Recent Uploads (7 days)</span>
                                <span class="stat-value">${recentUploads}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Weekly Reports</span>
                                <span class="stat-value">${totalReports}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="report-footer">
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;
        
        reportsDiv.innerHTML = reportHTML;
        showSuccess('Consolidated report generated successfully!');
    } catch (error) {
        showError('Error generating report');
    }
}

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
        
        if (sectionName === 'overview') {
            loadProjectOverview();
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