document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("report");
  if (!saved) return;

  const data = JSON.parse(saved);
  const container = document.getElementById("detail");

  Object.entries(data).forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "confirm-row";

    row.innerHTML = `
      <span class="confirm-key">${key}:</span>
      <span class="confirm-value">${value}</span>
    `;
    container.appendChild(row);
  });

  
  const submitBtn = document.getElementById("submitBtn");
  const popup = document.getElementById("successPopup");
  const okBtn = document.getElementById("popupOkBtn");

  submitBtn.addEventListener("click", () => {
    // Save the data to reports
    const reports = JSON.parse(localStorage.getItem("reports") || "[]");
    reports.push(data);
    localStorage.setItem("reports", JSON.stringify(reports));

    localStorage.removeItem("report");
    popup.style.display = "flex";
  });

  okBtn.addEventListener("click", () => {
    window.location.href = "../../index.html";
  });
});
