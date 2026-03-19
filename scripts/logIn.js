import { users } from '../data/profileData.js';

function togglePassword() {
  const password = document.getElementById("password");
  const icon = document.querySelector(".show-password");

  if (password.type === "password") {
    password.type = "text";
    icon.textContent = "👁️‍🗨️";
  } else {
    password.type = "password";
    icon.textContent = "👁";
  }
}

function handleLogin(event) {
    event.preventDefault(); 

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful! Redirecting...');
        window.location.href = 'profile.html'; 
    } else {
        alert('Invalid username or password. Hint: Try John / 123');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const showPasswordBtn = document.querySelector(".show-password-js");
    if (showPasswordBtn) {
        showPasswordBtn.addEventListener("click", togglePassword);
    }

    const loginBtn = document.querySelector(".logIn-js");
    if (loginBtn) {
        loginBtn.addEventListener("click", handleLogin);
    }
});