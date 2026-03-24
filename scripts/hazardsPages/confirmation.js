import { addAlert } from '../../data/alertData.js';
import { buildings } from '../../data/building.js';

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("report");
  if (!saved) return;

  const data = JSON.parse(saved);
  const container = document.getElementById("detail");

  Object.entries(data).forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "confirm-row";

    if (key === "Photo" && Array.isArray(value)) {
      const photosHtml = value.length
        ? value.map(photo => `<img src="${photo}" alt="Uploaded photo" style="max-width: 200px; max-height: 200px; margin: 5px;">`).join('')
        : '<span class="confirm-value">N/A</span>';

      row.innerHTML = `
        <span class="confirm-key">${key}:</span>
        <div class="confirm-value">${photosHtml}</div>
      `;
    } else {
      const displayValue = Array.isArray(value)
        ? (value.length ? value.join(', ') : 'N/A')
        : (value === undefined || value === null || String(value).trim() === '' ? 'N/A' : value);

      row.innerHTML = `
        <span class="confirm-key">${key}:</span>
        <span class="confirm-value">${displayValue}</span>
      `;
    }
    container.appendChild(row);
  });

  
  const submitBtn = document.getElementById("submitBtn");
  const popup = document.getElementById("successPopup");
  const okBtn = document.getElementById("popupOkBtn");

  submitBtn.addEventListener("click", () => {
    
    const getDetails = (data) => {
      const details = {};
      const commonKeys = ["Hazard Type", "Building", "Intersection Street 1", "Intersection Street 2"];
      Object.keys(data).forEach(key => {
        if (!commonKeys.includes(key)) {
          details[key] = data[key];
        }
      });
      return details;
    };

    // Add to alerts
    const building = buildings.find(b => b.buildingName === data["Building"]);
    if (building) {
      const alertData = {
        type: data["Hazard Type"],
        buildingCode: building.code,
        location: { lat: building.lat, lng: building.lng },
        description: data["Building"],
        status: 'UNDER REVIEW',
        time: new Date().toISOString(),
        detail: getDetails(data)
      };
      addAlert(alertData);
    }

    localStorage.removeItem("report");
    popup.style.display = "flex";
  });

  okBtn.addEventListener("click", () => {
    window.location.href = "../../index.html";
  });
});
