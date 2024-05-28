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
                            <h2 class="text-overlay-title semibold">${post.title.toUpperCase()}</h2>
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

                // Add touchstart event listener for mobile tap grid image display
                postElement.addEventListener('touchstart', () => {
                    document.querySelectorAll('.grid-item.active').forEach(item => {
                        item.classList.remove('active');
                    });

                    postElement.classList.add('active');
                });
    
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


