// logout.ts

// Clear localStorage
localStorage.clear();

// Optional: clear cookies or sessionStorage too
// sessionStorage.clear(); // if you’re using sessionStorage

// Redirect to login page after short delay
setTimeout(() => {
  window.location.replace("/Frontend/HTML/login.html");
}, 100);
