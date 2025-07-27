document.addEventListener('DOMContentLoaded', () => {
  const accountContainer = document.getElementById('accountContainer') as HTMLElement | null;
  const flipToLogin = document.getElementById('flipToLogin') as HTMLElement | null;
  const registerForm = document.getElementById('registerForm') as HTMLFormElement | null;
  const passwordInput = document.getElementById('password') as HTMLInputElement | null;
  const passwordHint = document.querySelector('.password-hint') as HTMLElement | null;

  if (!accountContainer || !flipToLogin || !registerForm || !passwordInput || !passwordHint) {
    console.error('One or more elements for registration page are missing.');
    return;
  }

  // Flip to login page with animation
  flipToLogin.addEventListener('click', (e: Event) => {
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
    } else {
      passwordHint.textContent = '';
    }
  });

  // Handle form submit
  registerForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username') as HTMLInputElement | null;
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement | null;

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
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert('User registered successfully');
        window.location.href = '/HTML/login.html';
      } else {
        const errorText = await response.text();
        alert('Registration failed: ' + errorText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration');
    }
  });
});
