import { fetchPosts } from './fetchPosts.mjs';
import { API_BASE_URL, capitalizeFirstLetter, showLoadingIndicator, hideLoadingIndicator } from './utils.mjs';



export async function populateAdminPanel() {
    showLoadingIndicator();

    const posts = await fetchPosts();

    hideLoadingIndicator();
    if (posts && posts.data) {
        const tableBody = document.querySelector('.managePostsContainer tbody');


        tableBody.innerHTML = '';

        // Populate table with fetched posts
        posts.data.forEach((post, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${post.title}</td>
                <td>${capitalizeFirstLetter(post.author.name)}</td>
                <td><a href="#" class="edit" data-id="${post.id}">Edit</a></td>
                <td><a href="#" class="delete" data-id="${post.id}">Delete</a></td>
            `;

            tableBody.appendChild(row);
        });

        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }
}

function handleEdit(event) {
    event.preventDefault();
    const postId = event.target.dataset.id;
    window.location.href = `../post/edit.html?id=${postId}`;
}

async function handleDelete(event) {
    event.preventDefault();
    const postId = event.target.dataset.id;

    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) {
        return;
    }

    showLoadingIndicator();

    try {
        const response = await deletePost(postId);
        if (response.ok) {
            alert('Post deleted successfully.');
            await populateAdminPanel(); // Refresh the table
        } else {
            const data = await response.json();
            alert('Failed to delete post: ' + (data.message || 'Error'));
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('An error occurred. Please try again later.');
    } finally {
        hideLoadingIndicator();
    }
}

async function deletePost(postId) {
    const token = localStorage.getItem('token');

    showLoadingIndicator();
    try {
        const response = await fetch(`${API_BASE_URL}/blog/posts/riqzul/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    } finally {
        hideLoadingIndicator();
    }
}




