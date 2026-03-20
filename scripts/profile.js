import { logout, checkAuth } from './auth.js';

const currentUser = checkAuth();

document.addEventListener("DOMContentLoaded", () => {
    if (currentUser) {
        if (document.querySelector(".username-js")) {
            document.querySelector(".username-js").textContent = currentUser.name;
        }
        if (document.querySelector(".user-email-js")) {
            document.querySelector(".user-email-js").textContent = currentUser.email;
        }
    }

    const logoutBtn = document.querySelector('.logOut-js');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    document.querySelector(".safety-edit-js").addEventListener("click", editSafety);
    document.querySelector(".navigation-edit-js").addEventListener("click", editNavigation);
    document.querySelector(".notification-edit-js").addEventListener("click", editNotification);
    document.querySelector(".quiet-hours-edit-js").addEventListener("click", editQuietHours);
});


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

      <p>Construction</p>
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

function editQuietHours() {
  console.log('edit');
  
  document.querySelector('.quiet-hours-inner-card-js').innerHTML =`
    <div class="quiet-hours-display-card">
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

    <div class="edit-card quiet-hours-edit-js">
      <button class="save-button quiet-hours-button-js">
        <img src="../images/save.png" alt="profile icon">
        <p>save</p>
      </button>
    </div>`;
  
  document.querySelector(".quiet-hours-button-js").addEventListener("click", saveQuietHours);
}

function saveSafety() {
  const checkboxes = document.querySelectorAll('#accessibility-form input[name="accessibility"]:checked');
  let selectedItem = Array.from(checkboxes).map(cb => cb.value);
  
  if (selectedItem.length === 0) selectedItem = ["None Selected"];

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
  const routeVal = document.getElementById('route').value || "Not Set";
  const elevatorVal = document.getElementById('elevator').value || "Not Set";
  const textVal = document.getElementById('text').value || "Not Set";
  const colorVal = document.getElementById('color').value || "Not Set";

  document.querySelector('.navigation-inner-card-js').innerHTML = `
    <div class="navigation-display-card">
      <p>Route Preference: </p><p>${routeVal}</p>
      <p>Elevator Preference: </p><p>${elevatorVal}</p>
      <p>Text Size: </p><p>${textVal}</p>
      <p>Color Mode: </p><p>${colorVal}</p>
    </div>
    <div class="edit-card navigation-edit-js"><img src="../images/edit.png"></div>`;
    
  document.querySelector(".navigation-edit-js").addEventListener("click", editNavigation);
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
      <p>Construction</p>
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

function saveQuietHours() {
  
  console.log('save');
  document.querySelector('.quiet-hours-inner-card-js').innerHTML = 
    `<div class="quiet-hours-display-card">
      <p>Quiet Hours</p>
      <p>
        <img src="../images/bell-black.png" alt="profile icon">
        ON
      </p>

      <p>Start Time</p>
      <p>10:00 PM</p>

      <p>End Time</p>
      <p>7:00 AM</p>
    </div>

    <div class="edit-card quiet-hours-edit-js">
      <img src="../images/edit.png" alt="profile icon">
    </div>`
  
  document.querySelector(".quiet-hours-edit-js").addEventListener("click", editQuietHours);
}