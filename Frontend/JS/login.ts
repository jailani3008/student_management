

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form") as HTMLFormElement | null;

  if (!form) {
    console.error("Login form not found");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = (form.querySelector("#username") as HTMLInputElement).value.trim();
    const password = (form.querySelector("#password") as HTMLInputElement).value;

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
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
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");

      window.location.href = "/HTML/studentdetail.html";

    } catch (err) {
      const message = (err instanceof Error) ? err.message : "Unknown error occurred";
      alert(message);
      console.error(err);
    }
  });
});
