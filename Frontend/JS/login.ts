
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm") as HTMLFormElement | null;

  if (!form) {
    console.error("loginForm element not found");
    return;
  }

  form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const usernameInput = document.getElementById("username") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;

    if (!usernameInput || !passwordInput) {
      alert("Username or password input not found.");
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
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
        throw new Error(data.error || "Invalid username or password");
      }

      // Store token and login flag in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");

      // Redirect to main student page or dashboard
      window.location.href = "/HTML/studentdetail.html";
    } catch (error) {
      console.error("Login error:", error);
      alert((error as Error).message || "Login failed. Please try again.");
    }
  });
});
