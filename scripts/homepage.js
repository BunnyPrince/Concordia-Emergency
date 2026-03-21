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

