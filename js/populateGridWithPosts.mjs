import { fetchPosts } from './fetchPosts.mjs';
import { showLoadingIndicator, hideLoadingIndicator, getRootPath } from './utils.mjs';

export async function populateHomepageGrid() {
    const gridContainer = document.querySelector('.grid-container');

    if (!gridContainer) return;

    showLoadingIndicator();

    let postsData;
    try {
        postsData = await fetchPosts();
    } catch (error) {
        console.error('Error fetching posts:', error);
        gridContainer.innerHTML = '<p>Error loading posts.</p>';
        hideLoadingIndicator();
        return;
    }

    const rootPath = getRootPath();

    const displayPosts = (posts) => {
        gridContainer.innerHTML = ''; // Clear existing posts
        if (posts && posts.length > 0) {
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
            gridContainer.innerHTML = '<p class="no-posts">No posts available.</p>';
            gridContainer.classList.add('no-posts');
        }
    };

    // Display all posts initially
    displayPosts(postsData.data.slice(0, 12));


    hideLoadingIndicator();
}

