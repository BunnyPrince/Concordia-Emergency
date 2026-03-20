import { logout, checkAuth } from './auth.js';

const currentUser = checkAuth();

function applySettings() {
  const textSize = localStorage.getItem('textSize');
  if (textSize === 'small') document.body.style.fontSize = '12px';
  else if (textSize === 'large') document.body.style.fontSize = '20px';
  else document.body.style.fontSize = '16px';
}
applySettings();

document.addEventListener("DOMContentLoaded", () => {
  if (currentUser) {
    if (document.querySelector(".username-js"))
      document.querySelector(".username-js").textContent = currentUser.name;
    if (document.querySelector(".user-email-js"))
      document.querySelector(".user-email-js").textContent = currentUser.email;
  }
  const logoutBtn = document.querySelector('.logOut-js');
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  document.querySelector(".safety-edit-js").addEventListener("click", editSafety);
  document.querySelector(".navigation-edit-js").addEventListener("click", editNavigation);
  document.querySelector(".notification-edit-js").addEventListener("click", editNotification);
  document.querySelector(".quiet-hours-edit-js").addEventListener("click", editQuietHours);
});

function editSafety() {
  document.querySelector('.safety-inner-card-js').innerHTML = `
    <div>
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
        <img src="../images/save.png" alt="save"><p>save</p>
      </button>
    </div>`;
  document.querySelector('.save-button-js').addEventListener("click", saveSafety);
}

function editNavigation() {
  const savedText = localStorage.getItem('textSize') || '';
  const savedColor = localStorage.getItem('colorMode') || '';
  document.querySelector('.navigation-inner-card-js').innerHTML = `
    <div class="navigation-display-card">
      <label for="route">Route Preference:</label>
      <select id="route">
        <option value="">Select an option</option>
        <option value="fastest">Fastest Route</option>
        <option value="safest">Safest Route</option>
        <option value="accessible">Fully Accessible Route</option>
      </select>
      <label for="elevator">Elevator Preference:</label>
      <select id="elevator">
        <option value="">Select an option</option>
        <option value="prioritize">Prioritize Elevator</option>
        <option value="avoid">Avoid Elevator</option>
      </select>
      <label for="text">Text Size:</label>
      <select id="text">
        <option value="">Select an option</option>
        <option value="small" ${savedText==='small'?'selected':''}>Small</option>
        <option value="medium" ${savedText==='medium'?'selected':''}>Medium</option>
        <option value="large" ${savedText==='large'?'selected':''}>Large</option>
      </select>
      <label for="color">Color Mode:</label>
      <select id="color">
        <option value="">Select an option</option>
        <option value="standard" ${savedColor==='standard'?'selected':''}>Standard</option>
        <option value="high-contrast" ${savedColor==='high-contrast'?'selected':''}>High Contrast</option>
      </select>
    </div>
    <div class="edit-card navigation-edit-js">
      <button class="save-button navigation-button-js">
        <img src="../images/save.png" alt="save"><p>save</p>
      </button>
    </div>`;
  document.querySelector(".navigation-button-js").addEventListener("click", saveNavigation);
}

function editNotification() {
  const prefs = JSON.parse(localStorage.getItem('alertPrefs') || '{}');
  document.querySelector('.notification-inner-card-js').innerHTML = `
    <div class="notification-display-card">
      <p>Emergency Alert</p>
      <p><img src="../images/lock-solid.png" alt="lock"> ON (Required)</p>
      <p>Protest</p>
      <label class="switch"><input type="checkbox" id="pref-protest" ${prefs.protest!==false?'checked':''}><span class="slider round"></span></label>
      <p>Construction</p>
      <label class="switch"><input type="checkbox" id="pref-construction" ${prefs.construction!==false?'checked':''}><span class="slider round"></span></label>
      <p>Weather</p>
      <label class="switch"><input type="checkbox" id="pref-weather" ${prefs.weather!==false?'checked':''}><span class="slider round"></span></label>
      <p>Elevator Issues</p>
      <label class="switch"><input type="checkbox" id="pref-elevator" ${prefs.elevator!==false?'checked':''}><span class="slider round"></span></label>
      <p>General Notices</p>
      <label class="switch"><input type="checkbox" id="pref-general" ${prefs.general!==false?'checked':''}><span class="slider round"></span></label>
    </div>
    <div class="edit-card notification-edit-js">
      <button class="save-button notification-button-js">
        <img src="../images/save.png" alt="save"><p>save</p>
      </button>
    </div>`;
  document.querySelector(".notification-button-js").addEventListener("click", saveNotification);
}

function editQuietHours() {
  document.querySelector('.quiet-hours-inner-card-js').innerHTML = `
    <div class="quiet-hours-display-card">
      <p>Quiet Hours</p>
      <label class="switch"><input type="checkbox" id="quiet-hours-toggle" checked><span class="slider round"></span></label>
      <p>Start Time</p>
      <input type="time" id="start-time" value="22:00">
      <p>End Time</p>
      <input type="time" id="end-time" value="07:00">
    </div>
    <div class="edit-card quiet-hours-edit-js">
      <button class="save-button quiet-hours-button-js">
        <img src="../images/save.png" alt="save"><p>save</p>
      </button>
    </div>`;
  document.querySelector(".quiet-hours-button-js").addEventListener("click", saveQuietHours);
}

function saveSafety() {
  const checkboxes = document.querySelectorAll('#accessibility-form input[name="accessibility"]:checked');
  let selectedItem = Array.from(checkboxes).map(cb => cb.value);
  if (selectedItem.length === 0) selectedItem = ["None Selected"];
  let html = selectedItem.map(item => `<p>${item}</p>`).join('');
  document.querySelector('.safety-inner-card-js').innerHTML = `
    <div>${html}</div>
    <div class="edit-card safety-edit-js"><img src="../images/edit.png" alt="edit"></div>`;
  document.querySelector(".safety-edit-js").addEventListener("click", editSafety);
}

function saveNavigation() {
  const routeVal = document.getElementById('route').value || "Not Set";
  const elevatorVal = document.getElementById('elevator').value || "Not Set";
  const textVal = document.getElementById('text').value || "Not Set";
  const colorVal = document.getElementById('color').value || "Not Set";

  localStorage.setItem('textSize', textVal);
  localStorage.setItem('colorMode', colorVal);
  applySettings();

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
  const prefs = {
    protest: document.getElementById('pref-protest')?.checked ?? true,
    construction: document.getElementById('pref-construction')?.checked ?? true,
    weather: document.getElementById('pref-weather')?.checked ?? true,
    elevator: document.getElementById('pref-elevator')?.checked ?? true,
    general: document.getElementById('pref-general')?.checked ?? true,
  };
  localStorage.setItem('alertPrefs', JSON.stringify(prefs));

  document.querySelector('.notification-inner-card-js').innerHTML = `
    <div class="notification-display-card">
      <p>Emergency Alert</p><p><img src="../images/lock-solid.png"> ON (Required)</p>
      <p>Protest</p><p><img src="../images/${prefs.protest?'bell-black':'bell-slash-black'}.png"> ${prefs.protest?'ON':'OFF'}</p>
      <p>Construction</p><p><img src="../images/${prefs.construction?'bell-black':'bell-slash-black'}.png"> ${prefs.construction?'ON':'OFF'}</p>
      <p>Weather</p><p><img src="../images/${prefs.weather?'bell-black':'bell-slash-black'}.png"> ${prefs.weather?'ON':'OFF'}</p>
      <p>Elevator Issues</p><p><img src="../images/${prefs.elevator?'bell-black':'bell-slash-black'}.png"> ${prefs.elevator?'ON':'OFF'}</p>
      <p>General Notices</p><p><img src="../images/${prefs.general?'bell-black':'bell-slash-black'}.png"> ${prefs.general?'ON':'OFF'}</p>
    </div>
    <div class="edit-card notification-edit-js"><img src="../images/edit.png"></div>`;
  document.querySelector(".notification-edit-js").addEventListener("click", editNotification);
}

function saveQuietHours() {
  const startTime = document.getElementById('start-time')?.value || '10:00 PM';
  const endTime = document.getElementById('end-time')?.value || '7:00 AM';
  document.querySelector('.quiet-hours-inner-card-js').innerHTML = `
    <div class="quiet-hours-display-card">
      <p>Quiet Hours</p><p><img src="../images/bell-black.png"> ON</p>
      <p>Start Time</p><p>${startTime}</p>
      <p>End Time</p><p>${endTime}</p>
    </div>
    <div class="edit-card quiet-hours-edit-js"><img src="../images/edit.png"></div>`;
  document.querySelector(".quiet-hours-edit-js").addEventListener("click", editQuietHours);
}
