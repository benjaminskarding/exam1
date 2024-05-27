import { termsAndConditionsOverlay, setupMenuOverlay } from './overlays.mjs';
import { populateHomepageGrid } from './populateGridWithPosts.mjs';
import { fetchPost } from './fetchPosts.mjs';
import { populatePost } from './populateSinglePostPage.mjs';
import { setupUserInterface } from './admin.mjs';
import { populateAdminPanel } from './adminPanel.mjs';
import { hideLoadingIndicator, showLoadingIndicator } from './utils.mjs';


document.addEventListener('DOMContentLoaded', async () => {
    setupUserInterface();
    termsAndConditionsOverlay();
    await initializePageSpecificFunctions();
    setupMenuOverlay();
});


/* Page specific functions handler */

async function initializePageSpecificFunctions() {
    showLoadingIndicator();
    try {
        if (document.querySelector('.grid-container')) {
            populateHomepageGrid();
        }
    
        // Check if on the admin panel page
        if (window.location.pathname.endsWith('/pages/adminpanel.html')) {
            await populateAdminPanel();
        }
    
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');
    
        // Check if on single post page
        if (postId && window.location.pathname.endsWith('/post/index.html')) {
            try {
                const postData = await fetchPost(postId);
                if (postData) populatePost(postData);
            } catch (error) {
                console.error('Failed to fetch post data:', error);
            }
        }
    
    } finally {
        hideLoadingIndicator();
    }
}

