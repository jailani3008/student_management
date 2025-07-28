document.addEventListener('DOMContentLoaded', () => {
  // In case navbar is dynamically injected (with fetch), call this again after the navbar is loaded
  function setupNavbarToggle(): void {
    const toggle = document.querySelector('.navbar-toggle') as HTMLButtonElement | null;
    const links = document.querySelector('.nav-link') as HTMLElement | null;
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        links.classList.toggle('active');
        this.classList.toggle('is-open');
      });
    }
  }

  // Run once DOM is ready
  setupNavbarToggle();

  // For dynamically loaded navbars (via fetch), repeat after short delay
  setTimeout(setupNavbarToggle, 200);
});
