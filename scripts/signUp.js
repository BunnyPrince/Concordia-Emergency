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

function togglePassword(link) {
  const password = document.getElementById(link);
  const icon = document.querySelector(`.show-${link}-js`);

  if (password.type === "password") {
    password.type = "text";
    icon.textContent = "👁️‍🗨️";
  } else {
    password.type = "password";
    icon.textContent = "👁";
  }
}

function handleSignUp(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const emailInput = document.getElementById("email");
    const email = emailInput ? emailInput.value : "";
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please fill in all fields!");
        return;
    }

    let allUsers = getMergedUsers();
    const usernameExists = allUsers.some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (usernameExists) {
      alert("Username already exists. Please choose another one.");
      return;
    }

    const newUser = {
        id: Date.now().toString(), 
        username: username,
        password: password,
        name: username, 
        email: email,
        role: "Student"
    };

    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    alert("Sign up successful! Please log in.");
    window.location.href = 'logIn.html'; 
}

document.addEventListener("DOMContentLoaded", () => {
  const passwordBtn = document.querySelector(".show-password-js");
  passwordBtn.addEventListener("click",() =>  togglePassword('password'));
  
  const reEnterPasswordBtn = document.querySelector(".show-re-enter-password-js");
  reEnterPasswordBtn.addEventListener("click",() =>  togglePassword('re-enter-password'));

  const signUpBtn = document.querySelector(".signUp-js"); // 确保你的 HTML 里按钮类名是这个
  if (signUpBtn) {
    signUpBtn.addEventListener("click", handleSignUp);
  }
})