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
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (!form) {
        console.error("loginForm element not found");
        return;
    }
    form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        if (!usernameInput || !passwordInput) {
            alert("Username or password input not found.");
            return;
        }
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        if (!username || !password) {
            alert("Please enter username and password.");
            return;
        }
        try {
            const response = yield fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ username, password }),
            });
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = yield response.text();
                throw new Error(text || "Invalid server response");
            }
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.error || "Invalid username or password");
            }
            // Store token and login flag in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("isLoggedIn", "true");
            // Redirect to main student page or dashboard
            window.location.href = "/HTML/studentdetail.html";
        }
        catch (error) {
            console.error("Login error:", error);
            alert(error.message || "Login failed. Please try again.");
        }
    }));
});
