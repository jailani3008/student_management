document.addEventListener('DOMContentLoaded', () => {
    const accountContainer = document.getElementById('accountContainer') as HTMLElement;
    const flipToLogin = document.getElementById('flipToLogin') as HTMLElement;

    flipToLogin.addEventListener('click', (e: Event) => {
        e.preventDefault();
        accountContainer.classList.add('flipped');
        setTimeout(() => {
            window.location.href = "/Frontend/HTML/login.html";
        }, 800);
    });

    const registerForm = document.getElementById('registerForm') as HTMLFormElement;
    registerForm.addEventListener('submit', async (e: Event) => {
        e.preventDefault();
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('https://student-management-1-xok5.onrender.com/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('User registered successfully');
                window.location.href = "/Frontend/HTML/login.html";
            } else {
                const error = await response.text();
                alert('Registration failed: ' + error);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration');
        }
    });

    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const hint = document.querySelector('.password-hint') as HTMLElement;
        if (password.length < 6) {
            hint.textContent = 'Password must be at least 6 characters';
            hint.style.color = 'red';
        } else {
            hint.textContent = '';
        }
    });
});