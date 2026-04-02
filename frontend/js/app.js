// Use environment variable for API URL, fallback to localhost for development
const API_BASE = typeof process !== 'undefined' && process.env.VITE_API_BASE_URL 
  ? process.env.VITE_API_BASE_URL 
  : window.location.hostname === 'localhost' 
  ? 'http://localhost:5000'
  : `${window.location.protocol}//${window.location.hostname.replace('canteen', 'api')}`;

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.color = '#fff';
    toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    toast.style.zIndex = '9999';
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.background = type === 'success' ? '#10B981' : '#EF4444';
    toast.innerText = message;
    
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    
    if (!isLoggedIn && !isLoginPage) {
        window.location.href = 'index.html';
    } else if (isLoggedIn && isLoginPage) {
        window.location.href = 'dashboard.html';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

function setupSidebarToggle() {}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
