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
    var _a, _b;
    const accountContainer = document.getElementById('account-container');
    const flipLoginLink = (_b = (_a = document.getElementById('link-login')) !== null && _a !== void 0 ? _a : document.getElementById('flip-login')) !== null && _b !== void 0 ? _b : document.getElementById('flipLogin');
    const registerForm = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordHint = document.querySelector('.password-hint');
    if (!registerForm || !passwordInput || !confirmPasswordInput || !passwordHint) {
        console.error('Some elements are missing.');
        return;
    }
    // Update password hint color on input
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length < 6) {
            passwordHint.textContent = 'Password must be at least 6 characters';
            passwordHint.style.color = 'red'; // <-- No TS error: `passwordHint` typed as HTMLElement
        }
        else {
            passwordHint.textContent = '';
            passwordHint.style.color = ''; // reset color to default
        }
    });
    // Flip to login animation
    flipLoginLink === null || flipLoginLink === void 0 ? void 0 : flipLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        accountContainer === null || accountContainer === void 0 ? void 0 : accountContainer.classList.add('flipped');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 800);
    });
    // Handle registration form submit
    registerForm.addEventListener('submit', (ev) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        ev.preventDefault();
        const username = (_a = document.getElementById('username')) === null || _a === void 0 ? void 0 : _a.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (!username) {
            alert('Please enter a username or email.');
            return;
        }
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
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password }),
            });
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = yield response.text();
                throw new Error(text || 'Invalid server response');
            }
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed.');
            }
            alert('Registration successful! Redirecting to login...');
            window.location.href = '/login.html';
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            alert('Error: ' + message);
            console.error(err);
        }
    }));
});
