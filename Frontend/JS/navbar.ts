// Add this in navbar.ts, then compile to navbar.js for production use

export {};

function setupNavbarToggle(): void {
  const toggle = document.querySelector('.navbar-toggle') as HTMLButtonElement | null;
  const navLinks = document.querySelector('.nav-link') as HTMLElement | null;

  if (!toggle || !navLinks) {
    // Try again in 100ms in case of delayed insertion (due to fetch etc)
    setTimeout(setupNavbarToggle, 100);
    return;
  }

  toggle.addEventListener('click', function () {
    const isActive = navLinks.classList.toggle('active');
    this.classList.toggle('is-open');
    this.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  // Optional: close menu if you click a nav link (mobile UX)
  navLinks.querySelectorAll('.nav-button').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Will run after DOM loaded, and via setTimeout will retry if navbar is dynamically inserted via fetch
if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', setupNavbarToggle);
} else {
  setupNavbarToggle();
}
