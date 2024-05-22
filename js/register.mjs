import { API_BASE_URL, showLoadingIndicator, hideLoadingIndicator } from './utils.mjs';

export async function RegisterUser(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (!terms) {
        alert('You must agree to the terms of service.');
        return;
    }

    showLoadingIndicator();

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful!');
            window.location.href = './login.html';
        } else {
            alert('Registration failed: ' + (data.message || 'Error'));
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please try again later.');
    } finally {
        hideLoadingIndicator();
    }
}

export function initializeRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', RegisterUser);
    }
}