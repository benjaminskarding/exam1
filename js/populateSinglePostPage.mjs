import { fetchPost, fetchPosts } from './fetchPosts.mjs';
import { capitalizeFirstLetter, showLoadingIndicator, hideLoadingIndicator } from "./utils.mjs";

export async function populatePost() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        console.error('No post ID found in the URL');
        return;
    }
    showLoadingIndicator();
    try {
        const postData = await fetchPost(postId);
        const postsData = await fetchPosts(); 

        if (postData && postsData) {
            const post = postData.data;
            const allPosts = postsData.data;
            const postIndex = allPosts.findIndex(p => p.id === post.id);
            const prevPost = postIndex > 0 ? allPosts[postIndex - 1] : null;
            const nextPost = postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null;

            document.getElementById('postCategory').textContent = (post.tags[0] || 'Category').toUpperCase();
            document.getElementById('postTag').textContent = (post.tags[1] || 'Tag').toUpperCase();
            document.getElementById('postTitle').textContent = (post.title || 'Title').toUpperCase();
            document.getElementById('postDate').textContent = new Date(post.created).toLocaleDateString('en-GB').replace(/\//g, ' | ');
            document.getElementById('postIntro').innerHTML = `<p>${post.body.split(' ').slice(0, 30).join(' ')}...</p>`;
            document.getElementById('postHeader').textContent = post.title || 'Header';
            document.getElementById('postHeaderParagraphContent').textContent = post.body || 'Content';

            // Set image + image url
            const landingSection = document.querySelector('.landing-section');
            if (post.media && post.media.url) {
                landingSection.style.backgroundImage = `
                    radial-gradient(419.8% 44.31% at 50% 44.31%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.75) 100%), 
                    url(${post.media.url})
                `; // Access ALT property to add aria-label for accessibility
                landingSection.setAttribute('aria-label', post.media.alt || 'Main image description');
            }

            // Add post ID and onclick to share elements in html
            document.querySelectorAll('.read-share-landing').forEach(link => {
                link.setAttribute('post-id', post.id);
                link.setAttribute('onclick', 'copyLink(event)');
            });

            // Update last section with navigation and share links
            updateLastSection(post, prevPost, nextPost);
        } else {
            console.error('Failed to fetch the required data.');
        }
    } catch (error) {
        console.error('Failed to fetch post data:', error);
    } finally {
        hideLoadingIndicator();
    }
}

function updateLastSection(currentPost, prevPost, nextPost) {
    const shareLink = document.getElementById('shareLink');
    const postNavLinks = document.querySelectorAll('.postNav .nav-link');
    const authorElement = document.getElementById('postAuthor');

    if (shareLink) {
        shareLink.textContent = 'SHARE THIS POST';
        shareLink.setAttribute('post-id', currentPost.id);
        shareLink.setAttribute('onclick', 'copyLink(event)');
    }

    if (postNavLinks[0] && prevPost) {
        postNavLinks[0].textContent = 'Previous';
        postNavLinks[0].href = `/post/index.html?id=${prevPost.id}`;
    } else {
        postNavLinks[0].style.display = 'none';
    }

    if (postNavLinks[1] && nextPost) {
        postNavLinks[1].textContent = 'Next';
        postNavLinks[1].href = `/post/index.html?id=${nextPost.id}`;
    } else {
        postNavLinks[1].style.display = 'none';
    }

    if (authorElement) {
        authorElement.textContent = `| ${capitalizeFirstLetter(currentPost.author.name)}`;
    }
}


