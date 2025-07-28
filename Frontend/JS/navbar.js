"use strict";
function setupNavbarToggle() {
    const toggle = document.querySelector('.navbar-toggle');
    const navLinks = document.querySelector('.nav-link');
    if (!toggle || !navLinks) {
        setTimeout(setupNavbarToggle, 100); // Try again after delay in case navbar loaded via fetch
        return;
    }
    toggle.addEventListener('click', function () {
        const isActive = navLinks.classList.toggle('active');
        this.classList.toggle('is-open');
        this.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
    navLinks.querySelectorAll('.nav-button').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}
if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', setupNavbarToggle);
}
else {
    setupNavbarToggle();
}
