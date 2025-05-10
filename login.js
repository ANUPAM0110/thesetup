if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html"; // go to login if not logged in
}

// Toggle dark/light mode
const toggle = document.getElementById('toggle-theme');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});