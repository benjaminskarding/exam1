import { isUserAdmin } from './utils.mjs';

function checkAdminStatus() { // Redirect from adminpage if not admin user. In case user guesses url. Secondary safety measure originally covered by not displaying href or admin panel visuals until admin user logged in
    const adminStatus = isUserAdmin();
    if (!adminStatus) {
        alert("You do not have the necessary permissions to access this page.");
        window.location.href = '../account/login.html'; 
    }
}

function continuousAdminCheck() {

    checkAdminStatus();


    setInterval(checkAdminStatus, 3000);
}

// Run continuous check when the document is fully loaded
document.addEventListener('DOMContentLoaded', continuousAdminCheck);