import { isUserAdmin, isLoggedIn } from './utils.mjs';

function checkAdminStatus() {
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