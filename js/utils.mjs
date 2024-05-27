export const API_BASE_URL = 'https://v2.api.noroff.dev';

export function showLoadingIndicator() {
    const loadingIndicatorContainer = document.getElementById('loadingIndicatorContainer');
    if (loadingIndicatorContainer) {
        loadingIndicatorContainer.classList.remove('hide');
    }
}

export function hideLoadingIndicator() {
    const loadingIndicatorContainer = document.getElementById('loadingIndicatorContainer');
    if (loadingIndicatorContainer) {
        loadingIndicatorContainer.classList.add('hidden');
    }
}


export function isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
}

export function isUserAdmin() {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    const confirmedAdmin = localStorage.getItem('isAdmin') === 'true';
    return confirmedAdmin;
}

export function isValidURL(url) {
    const pattern = new RegExp('^(https?:\\/\\/)' + 
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + 
        '((\\d{1,3}\\.){3}\\d{1,3}))' + 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
        '(\\?[;&a-z\\d%_.~+=-]*)?' + 
        '(\\#[-a-z\\d_]*)?$', 'i'); 
    return pattern.test(url);
}

export function showOrHideButton(condition, button) {
    if (condition) {
        button.classList.remove('hidden');
        button.style.display = 'flex';
    } else {
        button.classList.add('hidden');
        button.style.display = 'none';
    }
}

export function capitalizeFirstLetter(string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function getRootPath() {
    const pathParts = window.location.pathname.split('/');
    return `/${pathParts[1]}`;
}

window.copyLink = function(event) { // Assign copyLink function to global window. Related to carouselItem 'share' button/link
    event.preventDefault();
    const postId = event.target.getAttribute('post-id');
    const basePath = '/exam1/post/index.html';
    const url = `${window.location.protocol}//${window.location.host}${basePath}?id=${postId}`;

    navigator.clipboard.writeText(url).then(() => {
        alert('Link to post copied!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};