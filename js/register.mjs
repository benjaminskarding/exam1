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

    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

    if (!terms) {
        alert('You must agree to the terms of service.');
        return;
    }

    const emailDomain = email.split('@')[1];
    if (emailDomain !== 'stud.noroff.no') {
        alert('Only stud.noroff.no emails are allowed to register.');
        return;
    }

    showLoadingIndicator();

    const payload = {
        name,
        email,
        password,
        venueManager: false,
    };

    console.log("Registration Payload:", payload);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Response Data:", data);

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = './login.html';
        } else {
            const errors = data.errors || [];
            const errorMessage = errors.map(error => `${error.param}: ${error.msg}`).join('\n') || 'Registration failed due to an unknown error.';
            alert(`Registration failed: ${errorMessage}`);
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
