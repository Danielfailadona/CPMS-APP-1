<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CEO Dashboard - CPMS</title>
    <link rel="stylesheet" href="{{ asset('styles/sidebar.css') }}">
    <link rel="stylesheet" href="{{ asset('styles/dashboard.css') }}">
    <style>
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .project-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .project-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .project-manager {
            color: #666;
            margin-bottom: 20px;
        }
        .circular-progress {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 20px;
        }
        .circular-progress svg {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
        }
        .circular-progress circle {
            fill: none;
            stroke-width: 8;
        }
        .progress-bg {
            stroke: #e6e6e6;
        }
        .progress-bar {
            stroke: rgb(244, 123, 32);
            stroke-linecap: round;
            transition: stroke-dasharray 0.5s ease;
        }
        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 20px;
            font-weight: bold;
            color: rgb(244, 123, 32);
        }
        .project-details {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <img src="{{ asset('images/aw.jpg') }}" alt="CPMS Logo">
            <h2>CPMS</h2>
        </div>
        
        <div class="user-info">
            <div class="user-avatar">
                <span id="userInitials">{{ strtoupper(substr(Auth::user()->name, 0, 1)) }}</span>
            </div>
            <div class="user-details">
                <span class="user-name">{{ Auth::user()->name }}</span>
                <span class="user-role">CEO</span>
            </div>
        </div>

        <nav class="nav-menu">
            <div class="nav-item">
                <a href="#" class="nav-link active">
                    <span class="nav-icon">📊</span>
                    <span class="nav-text">Projects Overview</span>
                </a>
            </div>
        </nav>

        <div class="sidebar-footer">
            <a href="/logout" class="logout-btn">
                <span class="logout-icon">🚪</span>
                <span class="logout-text">Logout</span>
            </a>
        </div>
    </div>

    <div class="main-content">
        <div class="header">
            <h1>Projects Overview</h1>
            <div class="header-actions">
                <span class="date">{{ date('F j, Y') }}</span>
            </div>
        </div>

        <div class="content">
            <div id="projectsGrid" class="projects-grid">
                <!-- Projects will be loaded here -->
            </div>
        </div>
    </div>

    <script src="{{ asset('js/ceo.js') }}"></script>
</body>
</html>