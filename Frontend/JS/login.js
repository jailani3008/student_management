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
    // Get the form element by ID
    const form = document.getElementById('loginForm');
    if (!form) {
        console.error("loginForm element not found");
        return;
    }
    form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const response = yield fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Explicitly expect JSON
                },
                body: JSON.stringify({ username, password })
            });
            // First check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = yield response.text();
                throw new Error(text || 'Invalid server response');
            }
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            localStorage.setItem('token', data.token);
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = '/HTML/studentdetail.html';
        }
        catch (error) {
            console.error('Login error:', error);
            alert(error.message || 'Login failed. Please try again.');
        }
    }));
});
