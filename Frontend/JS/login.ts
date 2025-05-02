document.addEventListener('DOMContentLoaded', () => {
    const accountContainer = document.getElementById('accountContainer') as HTMLElement;
    const flipToLogin = document.getElementById('flipToLogin') as HTMLElement;

    flipToLogin.addEventListener('click', (e: Event) => {
        e.preventDefault();
        accountContainer.classList.add('flipped');
        setTimeout(() => {
            window.location.href = "/Frontend/HTML/register.html";
        }, 800);
    });

    const loginForm = document.getElementById('loginForm') as HTMLFormElement;
    loginForm.addEventListener('submit', async (e: Event) => {
        e.preventDefault();

        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token); // store token
                localStorage.setItem('isLoggedIn', 'true'); // store login status

                // ✅ Redirect after login
                window.location.href = '/Frontend/HTML/studentdetail.html';
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login');
        }
    });
});
