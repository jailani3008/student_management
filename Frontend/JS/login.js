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
            window.location.href = "/Frontend/HTML/register.html";
        }, 800);
    });
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const response = yield fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                const data = yield response.json();
                localStorage.setItem('token', data.token); // store token
                localStorage.setItem('isLoggedIn', 'true'); // store login status
                // ✅ Redirect after login
                window.location.href = '/Frontend/HTML/studentdetail.html';
            }
            else {
                alert('Invalid credentials');
            }
        }
        catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login');
        }
    }));
});
