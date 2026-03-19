import { initMap, initLocationFeatures } from "./map.js";
import { isLoggedIn } from "../data/profileData.js";
import {normalColors} from "../data/colors.js"

function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  if (!menu) return; // safety check
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const map = initMap();
  initLocationFeatures(map);
  const menuBtn = document.querySelector(".mobile-menu");
  menuBtn.addEventListener("click", toggleMenu);

  if(isLoggedIn){
    const profileButtons = document.querySelector(".auth-buttons");
    profileButtons.innerHTML = `
    <div class="profile profile-js" onclick="window.location.href='pages/profile.html'">Profile</div>
    `;
    profileButtons.style.display = 'flex'; 
    profileButtons.style.gridTemplateColumns = '';
    profileButtons.style.width = '100%';
    profileButtons.style.background = normalColors.buttonColor;
    profileButtons.style.cursor = 'pointer';
    profileButtons.style.justifyContent = 'center';
    profileButtons.style.alignItems = 'center';
    profileButtons.style.fontWeight = 'bold';

    document.querySelector(".dropdown-menu").innerHTML ="";
    document.querySelector(".mobile-menu").innerHTML="";
  }
});

