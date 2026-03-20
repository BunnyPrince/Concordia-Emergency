import { users } from '../data/profileData.js';

function getMergedUsers() {
  const storedUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
  const merged = [...users];

  storedUsers.forEach((storedUser) => {
    const exists = merged.some((u) => u.username === storedUser.username);
    if (!exists) {
      merged.push(storedUser);
    }
  });

  return merged;
}

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

  const allUsers = getMergedUsers();
  const user = allUsers.find(u => u.username === usernameInput && u.password === passwordInput);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
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