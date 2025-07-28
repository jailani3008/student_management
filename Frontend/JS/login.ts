
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form") as HTMLFormElement | null;

  if (!form) {
    console.error("Login form not found");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usernameInput = form.querySelector("#username") as HTMLInputElement | null;
    const passwordInput = form.querySelector("#password") as HTMLInputElement | null;

    if (!usernameInput || !passwordInput) {
      alert("Username or password input not found.");
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
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
        throw new Error(data.error || "Login failed");
      }

      // Save token and logged-in flag
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");

      // Redirect to dashboard/home
      window.location.href = "/HTML/studentdetail.html";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login failed");
    }
  });
});
