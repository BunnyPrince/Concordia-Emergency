import { isLoggedIn } from "../data/profileData.js";
import {normalColors} from "../data/colors.js"

function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  if (!menu) return; // safety check
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", () => {
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

let isCrisisMode = false;

document.addEventListener("DOMContentLoaded", () => {
  const crisisBtn = document.querySelector(".crisis");
  if (crisisBtn) {
    crisisBtn.addEventListener("click", toggleCrisisMode);
  }
});

function toggleCrisisMode() {
  isCrisisMode = !isCrisisMode;
  
  const crisisBtn = document.querySelector(".crisis");
  const sidePanel = document.querySelector(".side-panel");
  const bottomSection = document.querySelector(".bottom-section");
  const mapSection = document.querySelector(".map-section");
  const logo = document.querySelector(".logo");
  const authButtons = document.querySelector(".auth-buttons");

  if (isCrisisMode) {
    // 1. Visual Feedback for High Alert
    document.body.style.backgroundColor = "#912338"; // Concordia Red
    crisisBtn.textContent = "❎ Crisis Mode";
    crisisBtn.style.background = "";
    crisisBtn.style.color = "#ffffff";
    crisisBtn.style.fontWeight = "bold";

    // 2. Disable everything EXCEPT the map and the exit button
    // We keep the layout the same but make these elements non-interactive
    const backgroundElements = [sidePanel, bottomSection, logo, authButtons];
    backgroundElements.forEach(el => {
      if (el) {
        el.style.opacity = "0.4";         // Visual cue that it's disabled
        el.style.pointerEvents = "none";  // Prevents any clicks or hovers
        el.style.userSelect = "none";     // Prevents highlighting text
      }
    });

    // 3. Keep Map fully active and highlight it
    if (mapSection) {
      mapSection.style.opacity = "1";
      mapSection.style.pointerEvents = "auto";
      mapSection.style.boxShadow = "0px 0px 20px 5px rgba(0, 0, 0, 0.5)";
      mapSection.style.position = "relative";
      mapSection.style.zIndex = "10"; // Ensures it stays on top visually
    }

  } else {
    // 4. REVERT TO NORMAL DESIGN
    // Setting these to empty strings tells the browser to use your original CSS files
    document.body.style.backgroundColor = ""; 
    
    crisisBtn.textContent = "⚠️ Crisis Mode";
    crisisBtn.style.background = ""; 
    crisisBtn.style.color = "";
    crisisBtn.style.fontWeight = "";

    // Re-enable all background elements
    const backgroundElements = [sidePanel, bottomSection, logo, authButtons];
    backgroundElements.forEach(el => {
      if (el) {
        el.style.opacity = "";
        el.style.pointerEvents = "";
        el.style.userSelect = "";
      }
    });

    // Reset Map style
    if (mapSection) {
      mapSection.style.boxShadow = "";
      mapSection.style.zIndex = "";
    }
  }
}