// js/auth.js - FINAL VERSION

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');
    const showSignUpLink = document.getElementById('showSignUp');
    const showLoginLink = document.getElementById('showLoginLink');
    const showLoginBtn = document.getElementById('showLogin');

    // Logic to switch between login and sign-up forms
    showSignUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        document.querySelector('p.switch-auth').classList.add('hidden');
        signUpForm.classList.remove('hidden');
        showLoginLink.classList.remove('hidden');
        document.querySelector('h1').textContent = 'Create Your EcoFinds Account';
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signUpForm.classList.add('hidden');
        showLoginLink.classList.add('hidden');
        loginForm.classList.remove('hidden');
        document.querySelector('p.switch-auth').classList.remove('hidden');
        document.querySelector('h1').textContent = 'Welcome to EcoFinds';
    });

    // --- THIS IS THE CRITICAL LOGIN LOGIC ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from submitting the old way

        // Get the values from the form
        const identifier = document.getElementById('loginIdentifier').value;
        const password = document.getElementById('loginPassword').value;

        // Check if the credentials match 'admin'
        if (identifier.toLowerCase() === 'admin' && password === 'admin') {
            alert('Admin login successful. Redirecting to dashboard...');
            // Redirect to the admin page
            window.location.href = 'admin.html';
        } else {
            // Logic for regular users
            alert('Login successful! Redirecting to the homepage.');
            window.location.href = 'index.html';
        }
    });
});