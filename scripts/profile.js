
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".safety-edit-js").addEventListener("click", editSafety);
  document.querySelector(".navigation-edit-js").addEventListener("click", editNavigation);
  document.querySelector(".notification-edit-js").addEventListener("click", editNotification);
  document.querySelector(".quitet-hours-edit-js").addEventListener("click", editQuitetHours);
})


function editSafety() {
  document.querySelector('.safety-inner-card-js').innerHTML =
    `<div>
      <form id="accessibility-form">
        <input type="checkbox" id="wheelchair" name="accessibility" value="Wheelchair User">
        <label for="wheelchair">Wheelchair User</label><br>

        <input type="checkbox" id="crutches" name="accessibility" value="Uses Crutches / Mobility Aid">
        <label for="crutches">Uses Crutches / Mobility Aid</label><br>

        <input type="checkbox" id="stairs" name="accessibility" value="Avoid Stairs">
        <label for="stairs">Avoid Stairs</label><br>

        <input type="checkbox" id="slopes" name="accessibility" value="Avoid Steep Slopes">
        <label for="slopes">Avoid Steep Slopes</label><br>

        <input type="checkbox" id="visual" name="accessibility" value="Visual Impairment">
        <label for="visual">Visual Impairment</label><br>

        <input type="checkbox" id="anxiety" name="accessibility" value="Anxiety-Sensitive Mode">
        <label for="anxiety">Anxiety-Sensitive Mode</label><br>

        <input type="checkbox" id="crowd" name="accessibility" value="Prefer Low-Crowd Routes">
        <label for="crowd">Prefer Low-Crowd Routes</label><br><br>
      </form>
    </div>
    
    <div class="edit-card safety-edit-js">
      <button class="save-button save-button-js">
        <img src="../images/save.png" alt="profile icon">
        <p>save</p>
      </button>
    </div>`

  document.querySelector('.save-button-js').addEventListener("click", saveSafety);
}

function editNavigation() {
  document.querySelector('.navigation-inner-card-js').innerHTML = `
    <div class="navigation-display-card">
      <label for="route">Route Preference:</label>
      <select id="route" name="route">
        <option value="">Select an option</option>
        <option value="fastest">Fastest Route</option>
        <option value="safest">Safest Route</option>
        <option value="accessible">Fully Accessible Route</option>
      </select>
      
      <label for="elevator">Elevator Preference:</label>
      <select id="elevator" name="elevator">
        <option value="">Select an option</option>
        <option value="prioritize">Prioritize Elevator</option>
        <option value="avoid">Avoid Elevator</option>
      </select>
      
      <label for="text">Text Size:</label>
      <select id="text" name="text">
        <option value="">Select an option</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
      
      <label for="color">Color Mode:</label>
      <select id="color" name="color">
        <option value="">Select an option</option>
        <option value="wheelchair">Standard</option>
        <option value="mobility">High Contrast</option>
      </select>
    </div>
    
    <div class="edit-card navigation-edit-js">
      <button class="save-button navigation-button-js">
        <img src="../images/save.png" alt="profile icon">
        <p>save</p>
      </button>
    </div>`;
    
  document.querySelector(".navigation-button-js").addEventListener("click", saveNavigation);
}

function editNotification() {
  document.querySelector('.notification-inner-card-js').innerHTML = `
    <div class="notification-display-card">
      <p>Emergency Alert</p>
      <p>
        <img src="../images/lock-solid.png" alt="profile icon">
        ON (Required)
      </p>

      <p>Protest</p>
      <label class="switch">
        <input type="checkbox" id="protest-alert" checked>
        <span class="slider round"></span>
      </label>

      <p>Cconstruction</p>
      <label class="switch">
        <input type="checkbox" id="protest-alert" checked>
        <span class="slider round"></span>
      </label>

      <p>Weather</p>
      <label class="switch">
        <input type="checkbox" id="protest-alert" checked>
        <span class="slider round"></span>
      </label>

      <p>Elevator Issues</p>
      <label class="switch">
        <input type="checkbox" id="protest-alert" checked>
        <span class="slider round"></span>
      </label>

      <p>General Notices</p>
      <label class="switch">
        <input type="checkbox" id="protest-alert">
        <span class="slider round"></span>
      </label>
    </div>

    <div class="edit-card notification-edit-js">
      <button class="save-button notification-button-js">
        <img src="../images/save.png" alt="profile icon">
        <p>save</p>
      </button>
    </div>`;
  document.querySelector(".notification-button-js").addEventListener("click", saveNotification);
}

function editQuitetHours() {
  console.log('edit');
  
  document.querySelector('.quitet-hours-inner-card-js').innerHTML =`
    <div class="quitet-hours-display-card">
      <p>Quiet Hours</p>
      <label class="switch">
        <input type="checkbox" id="quiet hours" checked>
        <span class="slider round"></span>
      </label>

      <p>Start Time</p>
      <input type="time" id="appt" name="appt">

      <p>End Time</p>
      <input type="time" id="appt" name="appt">
    </div>

    <div class="edit-card quitet-hours-edit-js">
      <button class="save-button quitet-hours-button-js">
        <img src="../images/save.png" alt="profile icon">
        <p>save</p>
      </button>
    </div>`;
  
  document.querySelector(".quitet-hours-button-js").addEventListener("click", saveQuitetHours);
}



function saveSafety() {
  let selectedItem = ["Weelchair User","Avoid Stairs"];

  let htmlContente = '';
  selectedItem.forEach((item) => {
    htmlContente += `<p>${item}</p>`
  });

  document.querySelector('.safety-inner-card-js').innerHTML = `
    <div>
      ${htmlContente}
    </div>
    <div class="edit-card safety-edit-js">
      <img src="../images/edit.png" alt="profile icon">
    </div>`;
  
  document.querySelector(".safety-edit-js").addEventListener("click", editSafety);
}

function saveNavigation() {
<<<<<<< Updated upstream
  document.querySelector('.navigation-inner-card-js').innerHTML = `
    <div class="navigation-display-card">
      <p>Route Preference: </p>
      <p>Fastest Route</p>
      <p>Elevator Preference: </p>
      <p>Prioritize Elevator</p>
      <p>Text Size: </p>
      <p>Medium</p>
      <p>Color Mode: </p>
      <p>High Contrast</p>
    </div>
    
    <div class="edit-card navigation-edit-js">
      <img src="../images/edit.png" alt="profile icon">
    </div>`;
  document.querySelector(".navigation-edit-js").addEventListener("click", editNavigation);
=======
  settingsState.navigation.route = document.getElementById('route').value || settingsState.navigation.route;
  settingsState.navigation.elevator = document.getElementById('elevator').value || settingsState.navigation.elevator;
  settingsState.navigation.text = document.getElementById('text').value || settingsState.navigation.text;
  settingsState.navigation.color = document.getElementById('color').value || settingsState.navigation.color;

  persistSettingsToStorage();
  renderNavigationSummary();
  applyUserPreferences();
>>>>>>> Stashed changes
}

function saveNotification() {
  document.querySelector('.notification-inner-card-js').innerHTML = `
    <div class="notification-display-card">
      <p>Emergency Alert</p>
      <p>
        <img src="../images/lock-solid.png" alt="profile icon">
        ON (Required)
      </p>
      <p>Protest</p>
      <p>
        <img src="../images/bell-black.png" alt="profile icon">
        ON
      </p>
      <p>Cconstruction</p>
      <p>
        <img src="../images/bell-black.png" alt="profile icon">
        ON
      </p>
      <p>Weather</p>
      <p>
        <img src="../images/bell-black.png" alt="profile icon">
        ON
      </p>
      <p>Elevator Issues</p>
      <p>
        <img src="../images/bell-black.png" alt="profile icon">
        ON
      </p>
      <p>General Notices</p>
      <p>
        <img src="../images/bell-slash-black.png" alt="profile icon">
        OFF
      </p>
    </div>

    <div class="edit-card notification-edit-js">
      <img src="../images/edit.png" alt="profile icon">
    </div>`;
  document.querySelector(".notification-edit-js").addEventListener("click", editNotification);
}

function saveQuitetHours() {
  
  console.log('save');
  document.querySelector('.quitet-hours-inner-card-js').innerHTML = 
    `<div class="quitet-hours-display-card">
      <p>Quiet Hours</p>
      <p>
        <img src="../images/bell-black.png" alt="profile icon">
        ON
      </p>

<<<<<<< Updated upstream
      <p>Start Time</p>
      <p>10:00 PM</p>

      <p>End Time</p>
      <p>7:00 AM</p>
    </div>

    <div class="edit-card quitet-hours-edit-js">
      <img src="../images/edit.png" alt="profile icon">
    </div>`
  
  document.querySelector(".quitet-hours-edit-js").addEventListener("click", editQuitetHours);
=======
  persistSettingsToStorage();
  renderQuietHoursSummary();
}

document.addEventListener("DOMContentLoaded", () => {
  // Apply User Preferences
  if (currentUser) {
    applyUserPreferences();
  }
});

function applyUserPreferences() {
  if (!settingsState || !settingsState.navigation) return;
  
  const textSize = settingsState.navigation.text;
  const colorMode = settingsState.navigation.color; // 'wheelchair' (Standard) or 'mobility' (High Contrast)
  const logoutBtn = document.querySelector('.logOut-js');

  // Apply Font Size
  const sizeMap = { "small": "10px", "medium": "16px", "large": "28px" };
  document.body.style.fontSize = sizeMap[textSize] || "16px";

  let hoverStyle = document.getElementById('dynamic-hover-style');
  if (!hoverStyle) {
    hoverStyle = document.createElement('style');
    hoverStyle.id = 'dynamic-hover-style';
    document.head.appendChild(hoverStyle);
  }

  // Apply Color Theme
  if (colorMode === "mobility") {
    document.documentElement.style.setProperty('--container-color', '#eae2b7');
    document.documentElement.style.setProperty('--background-color', '#ffffff');
    document.documentElement.style.setProperty('--inner-button-color', '#f77f00');
    const allParagraphs = document.querySelectorAll('.safety-settings > p, .navigation-settings > p, .notification-settings > p, .quiet-hours-settings > p');
    allParagraphs.forEach(p => {
      p.style.color = "#f77f00";
    });
    const titleBox = document.querySelector('.title p');
    if (titleBox) {
      titleBox.style.backgroundColor = "#f5f5f5"; // Forces visibility against the new background
    }
    if (logoutBtn) {
      logoutBtn.style.color = "#f77f00"; 
      logoutBtn.style.fontWeight = "bold";
      logoutBtn.style.border = "2px solid #f77f00";
    }
    hoverStyle.innerHTML = `
      .logOut-js:hover { 
        background-color: #f77f00 !important; 
        color: #ffffff !important;
      }
    `;
    document.body.style.filter = "contrast(1.2)";
    const boxes = document.querySelectorAll('.inner-card, .delete-card');
    boxes.forEach(box => {
      box.style.boxShadow = "0px 0px 15px 2px rgba(0, 0, 0, 0.25)";
      box.style.marginBottom = "25px";
    });
  } else {
    // Reset to normal theme variables if standard is selected
    document.documentElement.style.removeProperty('--container-color');
    document.documentElement.style.removeProperty('--background-color');
    document.documentElement.style.removeProperty('--inner-button-color');
    const allParagraphs = document.querySelectorAll('.safety-settings > p, .navigation-settings > p, .notification-settings > p, .quiet-hours-settings > p');
    allParagraphs.forEach(p => {
      p.style.color = "#912338";
    });
    const titleBox = document.querySelector('.title p');
    if (titleBox) {
      titleBox.style.filter = "";
      titleBox.style.backgroundColor = ""; // Returns to CSS default
    }
    if (logoutBtn) {
      logoutBtn.style.color = ""; // Reset to CSS default
      logoutBtn.style.fontWeight = "";
      logoutBtn.style.border = "";
    }
    hoverStyle.innerHTML = "";
    document.body.style.filter = "none";
    const boxes = document.querySelectorAll('.inner-card, .delete-card');
    boxes.forEach(box => {
      box.style.boxShadow = ""; // Removes the inline style entirely
      box.style.marginBottom = ""; 
    });
  }
>>>>>>> Stashed changes
}