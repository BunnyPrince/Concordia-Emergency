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

    // Save the data to reports
    const reports = JSON.parse(localStorage.getItem("reports") || "[]");
    const existingIndex = reports.findIndex(r => 
      r["Hazard Type"] === data["Hazard Type"] && 
      r["Building"] === data["Building"] && 
      r["Intersection Street 1"] === data["Intersection Street 1"] && 
      r["Intersection Street 2"] === data["Intersection Street 2"]
    );
    if (existingIndex !== -1) {
      reports[existingIndex]["information"].push(getDetails(data));
      reports[existingIndex]["reported number"] += 1;
    } else {
      const common = {
        "Hazard Type": data["Hazard Type"],
        "Building": data["Building"],
        "Intersection Street 1": data["Intersection Street 1"],
        "Intersection Street 2": data["Intersection Street 2"],
        "Reported Number": 1,
        "Detail": [getDetails(data)]
      };
      reports.push(common);
    }
    localStorage.setItem("reports", JSON.stringify(reports));

    localStorage.removeItem("report");
    popup.style.display = "flex";
  });

  okBtn.addEventListener("click", () => {
    window.location.href = "../../index.html";
  });
});
