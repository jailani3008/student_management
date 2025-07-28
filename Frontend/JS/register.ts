// register.ts, compile to register.js

declare const API_URL: string;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form") as HTMLFormElement | null;
  const passwordInput = document.getElementById("password") as HTMLInputElement | null;
  const confirmInput = document.getElementById("confirm-password") as HTMLInputElement | null;
  const passwordHint = document.querySelector(".password-hint") as HTMLElement | null;
  const passwordValidation = document.getElementById("password-validation") as HTMLElement | null;
  const loginLink = document.getElementById("link-login");

  if (!form || !passwordInput || !confirmInput || !passwordHint || !passwordValidation) {
    console.error("Required form elements missing.");
    return;
  }

  // Password length hint
  passwordInput.addEventListener("input", () => {
    if (passwordInput.value.length < 6) {
      passwordHint.textContent = "Minimum 6 characters";
      passwordHint.style.color = "red";
    } else {
      passwordHint.textContent = "";
    }
  });

  // Password match validation
  confirmInput.addEventListener("input", () => {
    if (
      passwordInput.value.length >= 6 &&
      confirmInput.value !== passwordInput.value
    ) {
      passwordValidation.textContent = "Passwords do not match";
      passwordValidation.style.color = "red";
    } else {
      passwordValidation.textContent = "";
    }
  });

  // Link to login page with animation (optional, or simple redirect)
  loginLink?.addEventListener("click", (e) => {
    e.preventDefault();
    // Optional: add animations if desired
    window.location.href = "/HTML/login.html";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = (form.querySelector("#username") as HTMLInputElement).value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    if (!username) {
      alert("Please enter username or email.");
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
      const response = await fetch(`${API_URL}/register`, {
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
        throw new Error(text || "Invalid server response");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      alert("Registration successful! Redirecting to login...");
      window.location.href = "/HTML/login.html";
    } catch (err) {
      const message = (err instanceof Error) ? err.message : "Unknown error occurred";
      alert(message);
      console.error(err);
    }
  });
});
