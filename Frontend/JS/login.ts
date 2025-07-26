import { API_BASE_URL } from '../config';

document.addEventListener('DOMContentLoaded', () => {
  // Get the form element by ID
  
  const form = document.getElementById('loginForm') as HTMLFormElement | null;

  if (!form) {
    console.error("loginForm element not found");
    return;
  }

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
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
        const text = await response.text();
        throw new Error(text || 'Invalid server response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/HTML/studentdetail.html';

    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please try again.');
    }
  });
});
