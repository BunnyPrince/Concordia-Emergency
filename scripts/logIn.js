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

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".show-password-js");
  menuBtn.addEventListener("click", togglePassword);
})