import { fetchPosts } from './fetchPosts.mjs';
import { showLoadingIndicator, hideLoadingIndicator, getRootPath } from './utils.mjs';

export async function populateHomepageGrid() {
    const gridContainer = document.querySelector('.grid-container');
    const currentPath = window.location.pathname;
    const projectBasePath = currentPath.split('/').slice(0, -1).join('/');

    if (!gridContainer) return;

    showLoadingIndicator();

    try {
        const postsData = await fetchPosts();
        const rootPath = getRootPath();

        if (postsData && postsData.data) {
            const posts = postsData.data.slice(0, 12); 
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('grid-item');
    
                postElement.innerHTML = `
                    <img src="${post.media.url}" aria-label="${post.media.alt}">
                    <div class="text-overlay">
                        <div class="title-and-date">
                            <div class="text-overlay-title semibold">${post.title.toUpperCase()}</div>
                            <div class="post-date light">${new Date(post.created).toLocaleDateString('en-GB').split('/').join(' | ')}</div>
                        </div>
                        <div class="category-text">${post.tags.join(' X ').toUpperCase()}</div>
                        <div class="bold">
                            <a href="${rootPath}/post/index.html?id=${post.id}" class="read-share">READ</a>
                            <a class="read-share">|</a>
                            <a href="#" class="read-share" post-id="${post.id}" onclick="copyLink(event)">SHARE</a>
                        </div>
                    </div>
                `;
    
                gridContainer.appendChild(postElement);
            });
        } else {
            gridContainer.innerHTML = '<p>No posts available.</p>';
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        gridContainer.innerHTML = '<p>Error loading posts.</p>';
    } finally {
        hideLoadingIndicator();
    }
}


