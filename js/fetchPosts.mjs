import { API_BASE_URL } from './utils.mjs';
import { showLoadingIndicator, hideLoadingIndicator } from './utils.mjs';

export async function fetchPosts() {
    showLoadingIndicator();
    try {
        const response = await fetch(`${API_BASE_URL}/blog/posts/riqzul`);
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return null;
    } finally {
        hideLoadingIndicator();
    }
}


export async function fetchPost(id) {
    showLoadingIndicator();
    try {
        const response = await fetch(`${API_BASE_URL}/blog/posts/riqzul/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    } finally {
        hideLoadingIndicator();
    }
}

export async function updatePost(id, postData) {
    const token = localStorage.getItem('token');
    showLoadingIndicator();
    try {
        const response = await fetch(`${API_BASE_URL}/blog/posts/riqzul/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });
        return response;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    } finally {
        hideLoadingIndicator();
    }
}