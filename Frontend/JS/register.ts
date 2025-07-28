
document.addEventListener('DOMContentLoaded', () => {
  const accountContainer = document.getElementById('account-container');
  const flipLoginLink = document.getElementById('link-login') ?? document.getElementById('flip-login') ?? document.getElementById('flipLogin');

  const registerForm = document.getElementById('register-form') as HTMLFormElement | null;
  const passwordInput = document.getElementById('password') as HTMLInputElement | null;
  const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement | null;
  const passwordHint = document.querySelector('.password-hint') as HTMLElement | null;

  if (!registerForm || !passwordInput || !confirmPasswordInput || !passwordHint) {
    console.error('Some elements are missing.');
    return;
  }

  // Update password hint color on input
  passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length < 6) {
      passwordHint.textContent = 'Password must be at least 6 characters';
      passwordHint.style.color = 'red';  // <-- No TS error: `passwordHint` typed as HTMLElement
    } else {
      passwordHint.textContent = '';
      passwordHint.style.color = ''; // reset color to default
    }
  });

  // Flip to login animation
  flipLoginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    accountContainer?.classList.add('flipped');
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 800);
  });

  // Handle registration form submit
  registerForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const username = (document.getElementById('username') as HTMLInputElement)?.value.trim();
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
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Invalid server response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      alert('Registration successful! Redirecting to login...');
      window.location.href = '/login.html';

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert('Error: ' + message);
      console.error(err);
    }

  });

});
