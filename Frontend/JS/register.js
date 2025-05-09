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
    flipToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        accountContainer.classList.add('flipped');
        setTimeout(() => {
            window.location.href = "/Frontend/HTML/login.html";
        }, 800);
    });
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        try {
            const response = yield fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                alert('User registered successfully');
                window.location.href = "/Frontend/HTML/login.html";
            }
            else {
                const error = yield response.text();
                alert('Registration failed: ' + error);
            }
        }
        catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration');
        }
    }));
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const hint = document.querySelector('.password-hint');
        if (password.length < 6) {
            hint.textContent = 'Password must be at least 6 characters';
            hint.style.color = 'red';
        }
        else {
            hint.textContent = '';
        }
    });
});
