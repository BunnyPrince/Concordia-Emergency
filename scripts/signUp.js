import { users } from '../data/profileData.js';

function getMergedUsers() {
  let storedUsers = [];
  try {
    storedUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
  } catch (error) {
    storedUsers = [];
  }
  const userMap = new Map();

  users.forEach((user) => {
    userMap.set(user.username.toLowerCase(), user);
  });

  // Stored users should override defaults with the same username.
  storedUsers.forEach((user) => {
    userMap.set(user.username.toLowerCase(), user);
  });

  return Array.from(userMap.values());
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(message) {
  const errorElement = document.querySelector('.signUp-error-js');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    return;
  }
  alert(message);
}

function clearError() {
  const errorElement = document.querySelector('.signUp-error-js');
  if (!errorElement) return;
  errorElement.textContent = '';
  errorElement.style.display = 'none';
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
  clearError();

  const username = document.getElementById('username')?.value.trim() || '';
  const email = document.getElementById('email')?.value.trim() || '';
  const password = document.getElementById('password')?.value || '';
  const confirmPassword = document.getElementById('re-enter-password')?.value || '';

  if (!username || !email || !password || !confirmPassword) {
    setError('Please fill in all required fields.');
    return;
  }

  if (!isValidEmail(email)) {
    setError('Please enter a valid email address.');
    return;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  const allUsers = getMergedUsers();
  const normalizedUsername = username.toLowerCase();
  const normalizedEmail = email.toLowerCase();

  const usernameExists = allUsers.some(
    (u) => (u.username || '').toLowerCase() === normalizedUsername
  );
  if (usernameExists) {
    setError('Username already exists. Please choose another one.');
    return;
  }

  const emailExists = allUsers.some(
    (u) => (u.email || '').toLowerCase() === normalizedEmail
  );
  if (emailExists) {
    setError('Email is already in use. Please use another email.');
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    username,
    password,
    name: username,
    email,
    role: 'Student'
  };

  try {
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
  } catch (error) {
    setError('Sign up failed due to a storage error. Please try again.');
    return;
  }

  alert('Sign up successful! Please log in.');
  window.location.href = 'logIn.html';
}

document.addEventListener("DOMContentLoaded", () => {
  const passwordBtn = document.querySelector(".show-password-js");
  if (passwordBtn) {
    passwordBtn.addEventListener("click",() =>  togglePassword('password'));
  }
  
  const reEnterPasswordBtn = document.querySelector(".show-re-enter-password-js");
  if (reEnterPasswordBtn) {
    reEnterPasswordBtn.addEventListener("click",() =>  togglePassword('re-enter-password'));
  }

  const signUpBtn = document.querySelector(".signUp-js");
  if (signUpBtn) {
    signUpBtn.addEventListener("click", handleSignUp);
  }
})