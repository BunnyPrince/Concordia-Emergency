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

document.addEventListener("DOMContentLoaded", () => {
  const passwordBtn = document.querySelector(".show-password-js");
  passwordBtn.addEventListener("click",() =>  togglePassword('password'));
  
  const reEnterPasswordBtn = document.querySelector(".show-re-enter-password-js");
  reEnterPasswordBtn.addEventListener("click",() =>  togglePassword('re-enter-password'));
})