import { API_BASE_URL, isValidURL, showLoadingIndicator, hideLoadingIndicator } from './utils.mjs';

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmlxenVsIiwiZW1haWwiOiJyaXF6dWxAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MTYyNjYxMTl9.H8BNwBerUJ3m--r9ITipc0WfD5tXeGwY8dsIsSUwHJk';

async function createPost(postData) {
    showLoadingIndicator();
    try {
        const token = localStorage.getItem('token') || authToken;
        if (!token) {
            throw new Error('No access token found. Please log in first.');
        }

        const response = await fetch(`${API_BASE_URL}/blog/posts/riqzul`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to create post: ${data.message}`);
        }

        return data; 

    } catch (error) {
        console.error('Error creating post:', error);
        throw error; 
    } finally {
        hideLoadingIndicator();
    }
}

document.getElementById('postForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);

    const data = {
        postMainImageURL: formData.get('postMainImageURL'), 
        postMainImageAlt: formData.get('postMainImageAlt'),
        postTitle: formData.get('postTitle'),
        postBodyText: formData.get('postBodyText'),
        postCategoryAndTag: formData.get('postCategoryAndTag'),
    };

    // Ensure image URL is string
    data.postMainImageURL = String(data.postMainImageURL);
    // Validate if user entry is URL-format
    if (!isValidURL(data.postMainImageURL)) {
        alert('Please enter a valid URL for the main image.');
        return;
    }

    // Validate the title format
    if (!data.postTitle.trim()) {
        alert('Please enter a title.');
        return;
    }

    // Validate the body text format
    if (!data.postBodyText.trim()) {
        alert('Please enter the body text.');
        return;
    }

    // Validate the category and tag format
    const tagsArray = data.postCategoryAndTag.split(',').map(tag => tag.trim());
    if (tagsArray.length !== 2) {
        alert('Please enter exactly one Category and one Tag, separated by a comma.');
        return;
    }

    const [category, tag] = tagsArray;
    if (!category || !tag) {
        alert('Both Category and Tag are required and cannot be empty.');
        return;
    }

    // Create body object
    const bodyObject = {
        title: data.postTitle,
        body: data.postBodyText,
        tags: tagsArray,
        media: {
            url: data.postMainImageURL,
            alt: data.postMainImageAlt || ''
        }
    };

    showLoadingIndicator();
    try {
        const responseData = await createPost(bodyObject);
        alert('Post submitted successfully!');
    } catch (error) {
        alert('Failed to submit post.');
    } finally {
        hideLoadingIndicator();
    }
});
