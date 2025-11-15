<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finance Dashboard - CPMS</title>
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
                <h3>FINANCE DASHBOARD</h3>
            </div>

            <ul class="menu">
                <li><a href="#" onclick="showSection('review')" class="btn active">Review Uploads</a></li>
                <li><a href="#" onclick="showSection('reports')" class="btn">Generate Reports</a></li>
                <li><a href="#" onclick="showSection('upload')" class="btn">Upload Financial Report</a></li>
                <li><a href="/profile" class="btn">Profile Settings</a></li>
                <li><a href="#" onclick="logout()" class="btn">Logout</a></li>
            </ul>
        </div>

        <div class="main-content">
            <!-- Review Uploads Section -->
            <div class="section" id="review-section">
                <div class="section-header">
                    <h3>Review All Uploads</h3>
                    <button type="button" id="loadReviewBtn" class="action-btn">Refresh</button>
                </div>
                <div id="review-list"></div>
            </div>

            <!-- Generate Reports Section -->
            <div class="section" id="reports-section" style="display: none;">
                <div class="section-header">
                    <h3>Financial Reports</h3>
                    <button type="button" id="generateReportBtn" class="action-btn">Generate Report</button>
                </div>
                <div id="reports-list"></div>
            </div>

            <!-- Upload Section -->
            <div class="section form-section" id="upload-section" style="display: none;">
                <div class="section-header">
                    <h3>Upload Financial Report</h3>
                </div>
                <form id="uploadForm" enctype="multipart/form-data">
                    @csrf
                    <div class="form-fields">
                        <div class="form-row">
                            <div class="input-group">
                                <label for="file">Select File:</label>
                                <input type="file" id="file" name="file" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label for="title">Report Title:</label>
                                <input id="title" name="title" type="text" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label for="upload_type">Report Type:</label>
                                <select id="upload_type" name="upload_type" required>
                                    <option value="financial_report">Financial Report</option>
                                    <option value="expense_report">Expense Report</option>
                                    <option value="budget_analysis">Budget Analysis</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label for="description">Description:</label>
                                <textarea id="description" name="description" class="form-textarea"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" id="uploadBtn" class="btn-primary">Upload Report</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <script src="{{ asset('js/crudHelper.js') }}"></script>
    <script src="{{ asset('js/popup.js') }}"></script>
    <script src="{{ asset('js/finance.js') }}"></script>
</body>
</html>