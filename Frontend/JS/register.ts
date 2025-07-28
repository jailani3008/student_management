// Declare global API URL variable (set in config.js)
declare const API_URL: string;

document.addEventListener("DOMContentLoaded", () => {
  const accountContainer = document.getElementById("account-container");
  const linkLogin = document.getElementById("link-login");
  const form = document.getElementById("register-form") as HTMLFormElement | null;

  const passwordInput = document.getElementById("password") as HTMLInputElement | null;
  const confirmPasswordInput = document.getElementById("confirm-password") as HTMLInputElement | null;
  const passwordHint = document.querySelector(".password-hint") as HTMLElement | null;
  const passwordMatchText = document.getElementById("password-match");

  if (!form || !passwordInput || !confirmPasswordInput || !passwordHint) {
    console.error("Required elements missing.");
    return;
  }

  // Animate flipping to login page for UX when clicking link
  if (linkLogin && accountContainer) {
    linkLogin.addEventListener("click", (e) => {
      e.preventDefault();
      accountContainer.classList.add("flipped");
      setTimeout(() => {
        window.location.href = "/HTML/login.html";
      }, 800);
    });
  }

  // Real-time password length hint
  passwordInput.addEventListener("input", () => {
    const len = passwordInput.value.length;
    if (len < 6) {
      passwordHint.textContent = "Minimum 6 characters required";
      passwordHint.style.color = "red";
    } else {
      passwordHint.textContent = "";
    }
  });

  // Real-time password match check
  confirmPasswordInput.addEventListener("input", () => {
    if (
      passwordInput.value.length >= 6 &&
      confirmPasswordInput.value !== passwordInput.value
    ) {
      if (passwordMatchText) {
        passwordMatchText.textContent = "Passwords do not match";
        passwordMatchText.style.color = "red";
      }
    } else {
      if (passwordMatchText) passwordMatchText.textContent = "";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById("username") as HTMLInputElement | null;

    if (!usernameInput) {
      alert("Please enter a username or email.");
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!username) {
      alert("Username or email cannot be empty.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Invalid response from server");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      alert("Registration successful! Redirecting to login...");
      window.location.href = "/HTML/login.html";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      alert(message);
      console.error("Registration error:", error);
    }
  });
});
