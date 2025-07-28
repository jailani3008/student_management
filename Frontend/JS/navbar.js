"use strict";
document.addEventListener('DOMContentLoaded', () => {
    // Setup the hamburger menu toggle
    function setupNavbarToggle() {
        const toggle = document.querySelector('.navbar-toggle');
        const navLinks = document.querySelector('.nav-link');
        if (!toggle || !navLinks) {
            console.warn('Navbar toggle button or nav links container not found!');
            return;
        }
        toggle.addEventListener('click', function () {
            const isActive = navLinks.classList.toggle('active');
            this.classList.toggle('is-open');
            // Update ARIA attribute for accessibility
            this.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
    }
    setupNavbarToggle();
    // If navbar is loaded dynamically (e.g., via fetch), you can call this function again after injection
});
