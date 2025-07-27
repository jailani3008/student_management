"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    const accountContainer = document.getElementById('accountContainer');
    const flipToLogin = document.getElementById('flipToLogin');
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const passwordHint = document.querySelector('.password-hint');
    if (!accountContainer || !flipToLogin || !registerForm || !passwordInput || !passwordHint) {
        console.error('One or more elements for registration page are missing.');
        return;
    }
    // Flip to login page with animation
    flipToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        accountContainer.classList.add('flipped');
        setTimeout(() => {
            window.location.href = '/HTML/login.html';
        }, 800);
    });
    // Live password length hint
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        if (password.length < 6) {
            passwordHint.textContent = 'Password must be at least 6 characters';
            passwordHint.style.color = 'red';
        }
        else {
            passwordHint.textContent = '';
        }
    });
    // Handle form submit
    registerForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        if (!usernameInput || !passwordInput || !confirmPasswordInput) {
            alert('Form inputs not found');
            return;
        }
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        try {
            const response = yield fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                alert('User registered successfully');
                window.location.href = '/HTML/login.html';
            }
            else {
                const errorText = yield response.text();
                alert('Registration failed: ' + errorText);
            }
        }
        catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration');
        }
    }));
});
