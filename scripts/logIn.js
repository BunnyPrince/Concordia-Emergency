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

    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || users;
    const user = allUsers.find(u => u.username === usernameInput && u.password === passwordInput);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'profile.html';
    } else {
        alert("Invalid username or password.");
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