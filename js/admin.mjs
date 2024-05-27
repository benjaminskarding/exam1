import { API_BASE_URL, isUserAdmin, isLoggedIn, showOrHideButton, showLoadingIndicator, hideLoadingIndicator } from './utils.mjs';

// Login & logout

export async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill in both fields.');
        return;
    }

    showLoadingIndicator();

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login?_holidaze=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            const token = data.data.accessToken;
            localStorage.setItem('token', token);

            // Store admin status
            if (data.data.venueManager) {
                localStorage.setItem('isAdmin', 'true');
            } else {
                localStorage.removeItem('isAdmin');
            }

            alert('Login successful!');
            window.location.href = window.location.href; 
        } else {
            let errorMessage = 'Login failed due to an unknown error.';
            if (response.status === 401) {
                errorMessage = 'Incorrect email or password.';
            } else if (data.message) {
                errorMessage = data.message;
            }
            alert('Login failed: ' + errorMessage);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
    } finally {
        hideLoadingIndicator();
    }
}

export function handleLogout() {
    showLoadingIndicator();

    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.href = window.location.href;
    
    hideLoadingIndicator();
}

// User Panel Interface

export function setupUserInterface() {
    const adminPanelLink = document.getElementById('displayAdminPanel');
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');

    const loggedIn = isLoggedIn();
    const userIsAdmin = isUserAdmin();

    if (adminPanelLink) {
        showAdminPanelLink(adminPanelLink, userIsAdmin);
    }

    if (logoutButton) {
        showOrHideButton(loggedIn, logoutButton);
        if (loggedIn) {
            logoutButton.addEventListener('click', handleLogout);
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    updateAdminPanelTextOnResize(adminPanelLink);
    window.addEventListener('resize', () => updateAdminPanelTextOnResize(adminPanelLink));

    changeAdminPanelColor();
}

// IF admin logged in -> Show the admin panel visuals - and more importantly - add the hidden href to admin panel. 
// Security measure. In real life situation would have to find a better solution.
// Could have made the adminpanel.html a much harder URL for anyone to guess, but don't consider it neccessary for demo */

function showAdminPanelLink(adminPanelLink, userIsAdmin) {
    const currentPath = window.location.pathname;
    const projectBasePath = currentPath.split('/').slice(0, 2).join('/'); 

    if (userIsAdmin) {
        adminPanelLink.href = `${projectBasePath}/pages/adminpanel.html`;
        showOrHideButton(true, adminPanelLink);
    } else {
        showOrHideButton(false, adminPanelLink);
    }
}

// Visual related 

function updateAdminPanelTextOnResize(adminPanelLink) {
    if (!adminPanelLink) return;

    const updateText = () => {
        adminPanelLink.querySelector('p.adminPanel').textContent = window.innerWidth <= 936 ? 'Admin' : 'Admin Panel';
    };

    updateText();
}

function changeAdminPanelColor() {
    const currentPath = window.location.pathname;
    const projectBasePath = currentPath.split('/').slice(0, -1).join('/'); 

    if (currentPath === `${projectBasePath}/index.html` || currentPath === `${projectBasePath}/post/index.html`) {
        document.querySelectorAll('.adminPanel').forEach(element => {
            element.style.color = 'white';
        });
    }
}

