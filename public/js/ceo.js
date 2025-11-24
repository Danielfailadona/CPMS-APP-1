document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
});

async function loadProjects() {
    try {
        const response = await fetch('/api/projects/all');
        const projects = await response.json();
        
        const projectsGrid = document.getElementById('projectsGrid');
        
        if (projects.length === 0) {
            projectsGrid.innerHTML = '<div style="text-align: center; color: #666; grid-column: 1/-1;">No projects found</div>';
            return;
        }
        
        projectsGrid.innerHTML = projects.map(project => {
            const progress = Math.round(project.progress_percentage || 0);
            const circumference = 2 * Math.PI * 52; // radius = 52
            const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;
            
            return `
                <div class="project-card">
                    <div class="project-title">${project.name}</div>
                    <div class="project-manager">Manager: ${project.manager ? project.manager.name : 'Not assigned'}</div>
                    
                    <div class="circular-progress">
                        <svg viewBox="0 0 120 120">
                            <circle class="progress-bg" cx="60" cy="60" r="52"></circle>
                            <circle class="progress-bar" cx="60" cy="60" r="52" 
                                    stroke-dasharray="${strokeDasharray}"></circle>
                        </svg>
                        <div class="progress-text">${progress}%</div>
                    </div>
                    
                    <div class="project-details">
                        <span>Start: ${new Date(project.start_date).toLocaleDateString()}</span>
                        <span>End: ${new Date(project.end_date).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projectsGrid').innerHTML = '<div style="text-align: center; color: #666; grid-column: 1/-1;">Error loading projects</div>';
    }
}