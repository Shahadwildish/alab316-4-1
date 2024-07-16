// Part 3: Registration Form Validation
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const errorDisplay = document.getElementById('errorDisplay');

function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
}

function hideError() {
    errorDisplay.textContent = '';
    errorDisplay.style.display = 'none';
}

function validateUsername(username) {
    if (!username) return 'Username cannot be blank.';
    if (username.length < 4) return 'Username must be at least 4 characters long.';
    if (/[^a-zA-Z0-9]/.test(username)) return 'Username cannot contain special characters or whitespace.';
    const uniqueChars = new Set(username);
    if (uniqueChars.size < 2) return 'Username must contain at least 2 unique characters.';
    return '';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email address.';
    if (email.endsWith('@example.com')) return 'Email cannot be from the domain example.com.';
    return '';
}

function validatePassword(password, username) {
    if (password.length < 12) return 'Password must be at least 12 characters long.';
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) return 'Password must contain at least one uppercase and one lowercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*()_+{}\[\]:;"\'<>,.?/~`|]/.test(password)) return 'Password must contain at least one special character.';
    if (password.toLowerCase().includes('password')) return 'Password cannot contain the word "password".';
    if (password.toLowerCase().includes(username.toLowerCase())) return 'Password cannot contain the username.';
    return '';
}

function clearForm(form) {
    form.reset();
    hideError();
}

function isUsernameUnique(username) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    return !users[username];
}

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('register-username').value.trim().toLowerCase();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const termsAccepted = document.getElementById('terms').checked;

    let error = validateUsername(username);
    if (!error) error = validateEmail(email);
    if (!error) error = validatePassword(password, username);
    if (!error && password !== confirmPassword) error = 'Passwords do not match.';
    if (!error && !termsAccepted) error = 'You must accept the terms and conditions.';
    if (!error && !isUsernameUnique(username)) error = 'That username is already taken.';

    if (error) {
        showError(error);
        document.querySelector(`[name=${error.includes('username') ? 'username' : 'email'}]`).focus();
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    users[username] = { email, password };
    localStorage.setItem('users', JSON.stringify(users));
    clearForm(registerForm);
    alert('Registration successful!');
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('login-username').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const keepLoggedIn = document.getElementById('keep-logged-in').checked;

    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[username];

    if (!username) {
        showError('Username cannot be blank.');
        document.getElementById('login-username').focus();
        return;
    }

    if (!user) {
        showError('Username does not exist.');
        document.getElementById('login-username').focus();
        return;
    }

    if (password !== user.password) {
        showError('Incorrect password.');
        document.getElementById('login-password').focus();
        return;
    }

    clearForm(loginForm);
    alert(keepLoggedIn ? 'Login successful! Keep me logged in option selected.' : 'Login successful!');
});
