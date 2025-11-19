// Finance Dashboard JavaScript
let uploads = [];
let users = [];

const uploadCrud = new CrudHelper('uploads');
const userCrud = new CrudHelper('users');
const reviewCrud = new CrudHelper('reviews');

document.addEventListener('DOMContentLoaded', function() {
    loadUploadsForReview();
    
    const loadReviewBtn = document.getElementById('loadReviewBtn');
    if (loadReviewBtn) {
        loadReviewBtn.addEventListener('click', loadUploadsForReview);
    }
    
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateFinancialReport);
    }
    
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }
});

async function loadUploadsForReview() {
    try {
        [uploads, users] = await Promise.all([
            uploadCrud.readAll(),
            userCrud.readAll()
        ]);
        
        uploads = uploads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        displayUploadsForReview();
    } catch (error) {
        console.error('Error loading uploads:', error);
        showError('Error loading uploads for review');
    }
}

function displayUploadsForReview() {
    const reviewList = document.getElementById('review-list');
    if (!reviewList) return;
    
    if (uploads.length === 0) {
        reviewList.innerHTML = '<p class="no-data">No uploads found for review.</p>';
        return;
    }
    
    const uploadsHTML = uploads.map(upload => {
        const user = users.find(u => u.id == upload.user_id);
        const userName = user ? user.name : 'Unknown User';
        
        return `
            <div class="upload-item" data-id="${upload.id}">
                <div class="upload-header">
                    <h4>${upload.title || upload.filename}</h4>
                    <span class="upload-type">${upload.upload_type || 'General'}</span>
                </div>
                <div class="upload-details">
                    <p><strong>Uploaded by:</strong> ${userName}</p>
                    <p><strong>Date:</strong> ${new Date(upload.created_at).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> ${upload.is_public ? 'Public' : 'Private'}</p>
                    ${upload.description ? `<p><strong>Description:</strong> ${upload.description}</p>` : ''}
                </div>
                <div class="upload-actions">
                    <button class="view-btn" onclick="viewUpload(${upload.id})">View</button>
                    <button class="approve-btn" onclick="approveUpload(${upload.id})">Approve</button>
                    <button class="reject-btn" onclick="rejectUpload(${upload.id})">Reject</button>
                </div>
            </div>
        `;
    }).join('');
    
    reviewList.innerHTML = uploadsHTML;
}

async function approveUpload(uploadId) {
    const comments = prompt('Approval comments (optional):');
    
    try {
        const reviewData = {
            upload_id: uploadId,
            reviewed_by: await getCurrentUserId(),
            status: 'approved',
            comments: comments || '',
            reviewed_at: new Date().toISOString()
        };
        
        const result = await reviewCrud.create(reviewData);
        if (result.success) {
            showSuccess('Upload approved successfully!');
            loadUploadsForReview();
        } else {
            showError('Error approving upload: ' + result.message);
        }
    } catch (error) {
        showError('Error approving upload');
    }
}

async function rejectUpload(uploadId) {
    const comments = prompt('Rejection reason (required):');
    if (!comments) {
        showError('Rejection reason is required');
        return;
    }
    
    try {
        const reviewData = {
            upload_id: uploadId,
            reviewed_by: await getCurrentUserId(),
            status: 'rejected',
            comments: comments,
            reviewed_at: new Date().toISOString()
        };
        
        const result = await reviewCrud.create(reviewData);
        if (result.success) {
            showSuccess('Upload rejected successfully!');
            loadUploadsForReview();
        } else {
            showError('Error rejecting upload: ' + result.message);
        }
    } catch (error) {
        showError('Error rejecting upload');
    }
}

function generateFinancialReport() {
    const reportsList = document.getElementById('reports-list');
    if (!reportsList) return;
    
    const totalUploads = uploads.length;
    const receiptUploads = uploads.filter(u => u.upload_type === 'receipt' || u.upload_type === 'financial_report').length;
    const progressPhotos = uploads.filter(u => u.upload_type === 'image' || u.is_camera_photo).length;
    
    const reportHTML = `
        <div class="financial-report">
            <h4>Financial Summary Report</h4>
            <div class="report-stats">
                <div class="stat-item">
                    <h5>Total Uploads</h5>
                    <span class="stat-number">${totalUploads}</span>
                </div>
                <div class="stat-item">
                    <h5>Financial Documents</h5>
                    <span class="stat-number">${receiptUploads}</span>
                </div>
                <div class="stat-item">
                    <h5>Progress Photos</h5>
                    <span class="stat-number">${progressPhotos}</span>
                </div>
            </div>
            <div class="report-date">
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
        </div>
    `;
    
    reportsList.innerHTML = reportHTML;
    showSuccess('Financial report generated successfully!');
}

async function handleUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const uploadBtn = document.getElementById('uploadBtn');
    
    if (uploadBtn) uploadBtn.disabled = true;
    
    try {
        const result = await uploadCrud.create(formData);
        if (result.success) {
            showSuccess('Financial report uploaded successfully!');
            e.target.reset();
        } else {
            showError('Error uploading report: ' + result.message);
        }
    } catch (error) {
        showError('Error uploading report');
    } finally {
        if (uploadBtn) uploadBtn.disabled = false;
    }
}

window.viewUpload = async function(uploadId) {
    const upload = uploads.find(u => u.id == uploadId);
    if (!upload) {
        showError('File not found');
        return;
    }
    
    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(upload.filename);
    
    const modalHTML = `
        <div id="file-viewer-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 80%; max-height: 80%; overflow: auto; position: relative;">
                <button onclick="closeFileViewer()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
                
                <h3 style="margin-top: 0; color: rgb(244, 123, 32);">${upload.title || upload.filename}</h3>
                
                ${isImage ? `
                    <div style="text-align: center; margin: 20px 0;">
                        <img src="/storage/uploads/${upload.filename}" alt="${upload.title || upload.filename}" style="max-width: 100%; max-height: 400px; border-radius: 8px;">
                    </div>
                ` : `
                    <div style="text-align: center; margin: 20px 0; padding: 40px; background: #f8f9fa; border-radius: 8px;">
                        <div style="font-size: 48px; color: #6c757d; margin-bottom: 10px;">📄</div>
                        <p style="color: #6c757d; margin: 0;">Preview not available for this file type</p>
                    </div>
                `}
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p><strong>Filename:</strong> ${upload.filename}</p>
                    <p><strong>Upload Date:</strong> ${new Date(upload.created_at).toLocaleDateString()}</p>
                    <p><strong>Type:</strong> ${upload.upload_type || 'General'}</p>
                    ${upload.description ? `<p><strong>Description:</strong> ${upload.description}</p>` : ''}
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="closeFileViewer()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.closeFileViewer = function() {
    const modal = document.getElementById('file-viewer-modal');
    if (modal) modal.remove();
};

async function getCurrentUserId() {
    try {
        const response = await fetch('/current-user');
        const result = await response.json();
        return result.success ? result.user.id : 1;
    } catch (error) {
        return 1;
    }
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
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

console.log('Finance dashboard initialized');