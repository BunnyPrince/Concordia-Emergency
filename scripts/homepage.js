import { initMap, initLocationFeatures, addDestinationSearch } from "./map.js";
import { getCurrentUser } from "./auth.js";

function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  if (!menu) return; // safety check
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const map = initMap();
  initLocationFeatures(map);
  addDestinationSearch(map);
  const menuBtn = document.querySelector(".mobile-menu");
  if (menuBtn) {
    menuBtn.addEventListener("click", toggleMenu);
  }

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const profileButtons = document.querySelector(".auth-buttons");
  if (profileButtons) {
    profileButtons.innerHTML = `
      <div class="profile profile-js" onclick="window.location.href='pages/profile.html'" style="display:flex;align-items:center;gap:10px;padding:0 20px;">
        <div style="width:36px;height:36px;border-radius:50%;background:#912338;display:flex;justify-content:center;align-items:center;">
          <img src="images/user-regular.png" style="width:20px;height:20px;filter:invert(1);">
        </div>
        Profile
      </div>
    `;
    profileButtons.style.display = 'flex';
    profileButtons.style.gridTemplateColumns = '';
    profileButtons.style.width = 'auto';
    profileButtons.style.background = 'white';
    profileButtons.style.cursor = 'pointer';
    profileButtons.style.justifyContent = 'flex-end';
    profileButtons.style.alignItems = 'center';
    profileButtons.style.fontWeight = 'bold';
    profileButtons.style.color = '#912338';
  }

  const dropdownMenu = document.querySelector(".dropdown-menu");
  if (dropdownMenu) {
    dropdownMenu.innerHTML = `
      <div class="profile" onclick="window.location.href='pages/profile.html'">Profile</div>
    `;
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
  
  // Elements to hide completely
  const sidePanel = document.querySelector(".side-panel");
  const bottomSection = document.querySelector(".bottom-section");
  const logo = document.querySelector(".logo");
  const authButtons = document.querySelector(".auth-buttons");
  const header = document.querySelector(".header");

  if (isCrisisMode) {
    document.body.classList.add("crisis-active");
    crisisBtn.textContent = "❎ Exit Crisis Mode";

    // Hide everything except the map container
    [header, sidePanel, bottomSection].forEach(el => {
      if (el) el.style.display = "none";
    });

    // Reposition the exit button so it stays clickable outside the hidden header
    crisisBtn.style.position = "fixed";
    crisisBtn.style.top = "20px";
    crisisBtn.style.right = "20px";
    crisisBtn.style.zIndex = "2000";
    document.body.appendChild(crisisBtn);

  } else {
    document.body.classList.remove("crisis-active");
    crisisBtn.textContent = "⚠️ Crisis Mode";

    // Restore elements
    [header, sidePanel, bottomSection].forEach(el => {
      if (el) el.style.display = "";
    });

    // Move button back to original header location
    const headerBottom = document.querySelector(".header-bottom");
    if (headerBottom) headerBottom.appendChild(crisisBtn);
    crisisBtn.style = ""; 
  }

  // Force Leaflet to recognize the new box dimensions
  setTimeout(() => {
    if (window.map) {
      window.map.invalidateSize();
    }
  }, 200);
}