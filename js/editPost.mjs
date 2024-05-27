import { fetchPost, updatePost } from './fetchPosts.mjs';
import { isValidURL, showLoadingIndicator, hideLoadingIndicator, getRootPath } from './utils.mjs';

document.addEventListener('DOMContentLoaded', async () => {
    await populateEditForm();

    const postForm = document.getElementById('postForm');
    postForm.addEventListener('submit', handleEditFormSubmit);
});

async function populateEditForm() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (postId) {
        showLoadingIndicator();
        try {
            const postData = await fetchPost(postId);
            if (postData) {
                document.getElementById('titleOfBlogPostBeingEdited').innerHTML = `<span>Edit Post:&nbsp;</span>'${postData.data.title}'`;
                document.getElementById('postMainImageURL').value = postData.data.media.url || '';
                document.getElementById('postMainImageAlt').value = postData.data.media?.alt || '';
                document.getElementById('postTitle').value = postData.data.title || '';
                document.getElementById('postBodyText').value = postData.data.body || '';
                document.getElementById('postCategoryAndTag').value = postData.data.tags.join(', ') || '';
            }
        } catch (error) {
            console.error('Failed to fetch post data:', error);
        } finally {
            hideLoadingIndicator();
        }
    } else {
        console.error('No post ID found in the URL');
    }
}

async function handleEditFormSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        console.error('No post ID found in the URL');
        return;
    }

    const form = event.target;
    const formData = new FormData(form);

    const data = {
        postMainImageURL: formData.get('postMainImageURL'), 
        postMainImageAlt: formData.get('postMainImageAlt'),
        postTitle: formData.get('postTitle'),
        postBodyText: formData.get('postBodyText'),
        postCategoryAndTag: formData.get('postCategoryAndTag')
    };

    const validatedData = validatePostData(data);

    if (!validatedData) {
        return;
    }
    showLoadingIndicator();
    try {
        const response = await updatePost(postId, validatedData);
        const rootPath = getRootPath();
        if (response.ok) {
            alert('Post updated successfully.');
            window.location.href = `${rootPath}/index.html?id=${postId}`;
        } else {
            const responseData = await response.json();
            alert('Failed to update post: ' + (responseData.message || 'Error'));
        }
    } catch (error) {
        console.error('Error updating post:', error);
        alert('An error occurred. Please try again later.');
    } finally {
        hideLoadingIndicator();
    }
}

function validatePostData(data) {
    if (!isValidURL(data.postMainImageURL)) {
        alert('Please enter a valid URL for the main image.');
        return null;
    }

    if (!data.postTitle.trim()) {
        alert('Please enter a title.');
        return null;
    }

    if (!data.postBodyText.trim()) {
        alert('Please enter the body text.');
        return null;
    }

    const tagsArray = data.postCategoryAndTag.split(',').map(tag => tag.trim());
    if (tagsArray.length !== 2) {
        alert('Please enter exactly one Category and one Tag, separated by a comma.');
        return null;
    }

    const [category, tag] = tagsArray;
    if (!category || !tag) {
        alert('Both Category and Tag are required and cannot be empty.');
        return null;
    }

    return {
        title: data.postTitle,
        body: data.postBodyText,
        tags: tagsArray,
        media: {
            url: data.postMainImageURL,
            alt: data.postMainImageAlt || ''
        }
    };
}