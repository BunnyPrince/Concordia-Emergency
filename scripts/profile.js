import { logout, checkAuth } from './auth.js';

const currentUser = checkAuth();
const settingsState = {
  safety: [],
  navigation: {
    route: 'fastest',
    elevator: 'prioritize',
    text: 'medium',
    color: 'mobility'
  },
  notification: {
    protest: true,
    construction: true,
    weather: true,
    elevator: true,
    general: false
  },
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '07:00'
  }
};

function loadSettingsFromStorage() {
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem('currentUser'));
  } catch (error) {
    storedUser = null;
  }

  const userSettings = storedUser || currentUser || {};
  const safety = userSettings.safetySettings
    || (userSettings.accessibility && userSettings.accessibility !== 'none' ? [userSettings.accessibility] : []);
  const navigation = userSettings.navigationSettings || {};
  const notification = userSettings.notificationSettings || {};
  const quietHours = userSettings.quietHoursSettings || {};

  settingsState.safety = Array.isArray(safety) ? safety : [];

  settingsState.navigation = {
    ...settingsState.navigation,
    ...navigation
  };

  settingsState.notification = {
    ...settingsState.notification,
    ...notification
  };

  settingsState.quietHours = {
    ...settingsState.quietHours,
    ...quietHours
  };
}

function persistSettingsToStorage() {
  try {
    const storedCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!storedCurrentUser) return;

    const updatedUser = {
      ...storedCurrentUser,
      safetySettings: [...settingsState.safety],
      navigationSettings: { ...settingsState.navigation },
      notificationSettings: { ...settingsState.notification },
      quietHoursSettings: { ...settingsState.quietHours }
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    const userKey = updatedUser.id || updatedUser.username;
    let found = false;
    const updatedUsers = allUsers.map((user) => {
      const compareKey = user.id || user.username;
      if (compareKey === userKey) {
        found = true;
        return {
          ...user,
          safetySettings: [...settingsState.safety],
          navigationSettings: { ...settingsState.navigation },
          notificationSettings: { ...settingsState.notification },
          quietHoursSettings: { ...settingsState.quietHours }
        };
      }
      return user;
    });

    if (!found) {
      updatedUsers.push(updatedUser);
    }

    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
  } catch (error) {
    console.error('Failed to persist profile settings:', error);
  }
}

function renderSafetySummary() {
  const selectedItems = settingsState.safety.length > 0 ? settingsState.safety : ['None Selected'];
  const htmlContent = selectedItems.map((item) => `<p>${item}</p>`).join('');

  document.querySelector('.safety-inner-card-js').innerHTML = `
    <div>
      ${htmlContent}
    </div>
    <div class="edit-card safety-edit-js">
      <img src="../images/edit.png" alt="profile icon">
    </div>`;

  document.querySelector('.safety-edit-js').addEventListener('click', editSafety);
}

function renderNavigationSummary() {
  const routeLabel = {
    fastest: 'Fastest Route',
    safest: 'Safest Route',
    accessible: 'Fully Accessible Route'
  };
  const elevatorLabel = {
    prioritize: 'Prioritize Elevator',
    avoid: 'Avoid Elevator'
  };
  const textLabel = {
    small: 'Small',
    medium: 'Medium',
    large: 'Large'
  };
  const colorLabel = {
    wheelchair: 'Standard',
    mobility: 'High Contrast'
  };

  document.querySelector('.navigation-inner-card-js').innerHTML = `
    <div class="navigation-display-card">
      <p>Route Preference: </p><p>${routeLabel[settingsState.navigation.route] || 'Not Set'}</p>
      <p>Elevator Preference: </p><p>${elevatorLabel[settingsState.navigation.elevator] || 'Not Set'}</p>
      <p>Text Size: </p><p>${textLabel[settingsState.navigation.text] || 'Not Set'}</p>
      <p>Color Mode: </p><p>${colorLabel[settingsState.navigation.color] || 'Not Set'}</p>
    </div>
    <div class="edit-card navigation-edit-js"><img src="../images/edit.png" alt="profile icon"></div>`;

  document.querySelector('.navigation-edit-js').addEventListener('click', editNavigation);
}

function renderNotificationSummary() {
  const renderStatus = (isOn) => `
      <p>
        <img src="../images/${isOn ? 'bell-black' : 'bell-slash-black'}.png" alt="profile icon">
        ${isOn ? 'ON' : 'OFF'}
      </p>`;

  document.querySelector('.notification-inner-card-js').innerHTML = `
    <div class="notification-display-card">
      <p>Emergency Alert</p>
      <p>
        <img src="../images/lock-solid.png" alt="profile icon">
        ON (Required)
      </p>
      <p>Protest</p>
      ${renderStatus(settingsState.notification.protest)}
      <p>Construction</p>
      ${renderStatus(settingsState.notification.construction)}
      <p>Weather</p>
      ${renderStatus(settingsState.notification.weather)}
      <p>Elevator Issues</p>
      ${renderStatus(settingsState.notification.elevator)}
      <p>General Notices</p>
      ${renderStatus(settingsState.notification.general)}
    </div>

    <div class="edit-card notification-edit-js">
      <img src="../images/edit.png" alt="profile icon">
    </div>`;

  document.querySelector('.notification-edit-js').addEventListener('click', editNotification);
}

function renderQuietHoursSummary() {
  const formatTime = (value) => {
    const [hours, minutes] = value.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  document.querySelector('.quiet-hours-inner-card-js').innerHTML =
    `<div class="quiet-hours-display-card">
      <p>Quiet Hours</p>
      <p>
        <img src="../images/${settingsState.quietHours.enabled ? 'bell-black' : 'bell-slash-black'}.png" alt="profile icon">
        ${settingsState.quietHours.enabled ? 'ON' : 'OFF'}
      </p>

      <p>Start Time</p>
      <p>${formatTime(settingsState.quietHours.start)}</p>

      <p>End Time</p>
      <p>${formatTime(settingsState.quietHours.end)}</p>
    </div>

    <div class="edit-card quiet-hours-edit-js">
      <img src="../images/edit.png" alt="profile icon">
    </div>`;

  document.querySelector('.quiet-hours-edit-js').addEventListener('click', editQuietHours);
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettingsFromStorage();

  if (currentUser) {
    if (document.querySelector('.username-js')) {
      document.querySelector('.username-js').textContent = currentUser.name;
    }
    if (document.querySelector('.user-email-js')) {
      document.querySelector('.user-email-js').textContent = currentUser.email;
    }
  }

  const logoutBtn = document.querySelector('.logOut-js');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  renderSafetySummary();
  renderNavigationSummary();
  renderNotificationSummary();
  renderQuietHoursSummary();
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
    </div>`;

  const accessibilityInputs = document.querySelectorAll('#accessibility-form input[name="accessibility"]');
  accessibilityInputs.forEach((checkbox) => {
    checkbox.checked = settingsState.safety.includes(checkbox.value);
  });

  document.querySelector('.save-button-js').addEventListener('click', saveSafety);
}

function editNavigation() {
  document.querySelector('.navigation-inner-card-js').innerHTML = `
    <div class="navigation-display-card">
      <label for="route">Route Preference:</label>
      <select id="route" name="route">
        <option value="">Select an option</option>
        <option value="fastest" ${settingsState.navigation.route === 'fastest' ? 'selected' : ''}>Fastest Route</option>
        <option value="safest" ${settingsState.navigation.route === 'safest' ? 'selected' : ''}>Safest Route</option>
        <option value="accessible" ${settingsState.navigation.route === 'accessible' ? 'selected' : ''}>Fully Accessible Route</option>
      </select>

      <label for="elevator">Elevator Preference:</label>
      <select id="elevator" name="elevator">
        <option value="">Select an option</option>
        <option value="prioritize" ${settingsState.navigation.elevator === 'prioritize' ? 'selected' : ''}>Prioritize Elevator</option>
        <option value="avoid" ${settingsState.navigation.elevator === 'avoid' ? 'selected' : ''}>Avoid Elevator</option>
      </select>

      <label for="text">Text Size:</label>
      <select id="text" name="text">
        <option value="">Select an option</option>
        <option value="small" ${settingsState.navigation.text === 'small' ? 'selected' : ''}>Small</option>
        <option value="medium" ${settingsState.navigation.text === 'medium' ? 'selected' : ''}>Medium</option>
        <option value="large" ${settingsState.navigation.text === 'large' ? 'selected' : ''}>Large</option>
      </select>

      <label for="color">Color Mode:</label>
      <select id="color" name="color">
        <option value="">Select an option</option>
        <option value="wheelchair" ${settingsState.navigation.color === 'wheelchair' ? 'selected' : ''}>Standard</option>
        <option value="mobility" ${settingsState.navigation.color === 'mobility' ? 'selected' : ''}>High Contrast</option>
      </select>
    </div>

    <div class="edit-card navigation-edit-js">
      <button class="save-button navigation-button-js">
        <img src="../images/save.png" alt="profile icon">
        <p>save</p>
      </button>
    </div>`;

  document.querySelector('.navigation-button-js').addEventListener('click', saveNavigation);
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
        <input type="checkbox" id="protest-alert" ${settingsState.notification.protest ? 'checked' : ''}>
        <span class="slider round"></span>
      </label>

      <p>Construction</p>
      <label class="switch">
        <input type="checkbox" id="construction-alert" ${settingsState.notification.construction ? 'checked' : ''}>
        <span class="slider round"></span>
      </label>

      <p>Weather</p>
      <label class="switch">
        <input type="checkbox" id="weather-alert" ${settingsState.notification.weather ? 'checked' : ''}>
        <span class="slider round"></span>
      </label>

      <p>Elevator Issues</p>
      <label class="switch">
        <input type="checkbox" id="elevator-alert" ${settingsState.notification.elevator ? 'checked' : ''}>
        <span class="slider round"></span>
      </label>

      <p>General Notices</p>
      <label class="switch">
        <input type="checkbox" id="general-alert" ${settingsState.notification.general ? 'checked' : ''}>
        <span class="slider round"></span>
      </label>
    </div>

    <div class="edit-card notification-edit-js">
      <button class="save-button notification-button-js">
        <img src="../images/save.png" alt="profile icon">
        <p>save</p>
      </button>
    </div>`;

  document.querySelector('.notification-button-js').addEventListener('click', saveNotification);
}

function editQuietHours() {
  document.querySelector('.quiet-hours-inner-card-js').innerHTML = `
    <div class="quiet-hours-display-card">
      <p>Quiet Hours</p>
      <label class="switch">
        <input type="checkbox" id="quiet-hours-toggle" ${settingsState.quietHours.enabled ? 'checked' : ''}>
        <span class="slider round"></span>
      </label>

      <p>Start Time</p>
      <input type="time" id="quiet-hours-start" name="quiet-hours-start" value="${settingsState.quietHours.start}">

      <p>End Time</p>
      <input type="time" id="quiet-hours-end" name="quiet-hours-end" value="${settingsState.quietHours.end}">
    </div>

    <div class="edit-card quiet-hours-edit-js">
      <button class="save-button quiet-hours-button-js">
        <img src="../images/save.png" alt="profile icon">
        <p>save</p>
      </button>
    </div>`;

  document.querySelector('.quiet-hours-button-js').addEventListener('click', saveQuietHours);
}

function saveSafety() {
  const checkboxes = document.querySelectorAll('#accessibility-form input[name="accessibility"]:checked');
  settingsState.safety = Array.from(checkboxes).map((checkbox) => checkbox.value);

  persistSettingsToStorage();
  renderSafetySummary();
}

function saveNavigation() {
  settingsState.navigation.route = document.getElementById('route').value || settingsState.navigation.route;
  settingsState.navigation.elevator = document.getElementById('elevator').value || settingsState.navigation.elevator;
  settingsState.navigation.text = document.getElementById('text').value || settingsState.navigation.text;
  settingsState.navigation.color = document.getElementById('color').value || settingsState.navigation.color;

  persistSettingsToStorage();
  renderNavigationSummary();
  applyUserPreferences();
}

function saveNotification() {
  settingsState.notification.protest = document.getElementById('protest-alert')?.checked ?? true;
  settingsState.notification.construction = document.getElementById('construction-alert')?.checked ?? true;
  settingsState.notification.weather = document.getElementById('weather-alert')?.checked ?? true;
  settingsState.notification.elevator = document.getElementById('elevator-alert')?.checked ?? true;
  settingsState.notification.general = document.getElementById('general-alert')?.checked ?? false;

  persistSettingsToStorage();
  renderNotificationSummary();
}

function saveQuietHours() {
  settingsState.quietHours.enabled = document.getElementById('quiet-hours-toggle')?.checked ?? true;
  settingsState.quietHours.start = document.getElementById('quiet-hours-start')?.value || '22:00';
  settingsState.quietHours.end = document.getElementById('quiet-hours-end')?.value || '07:00';
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
}