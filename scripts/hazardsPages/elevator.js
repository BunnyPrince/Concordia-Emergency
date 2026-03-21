import { buildings } from "../../data/building.js";

const select = document.getElementById("building");

buildings.forEach((b) => {
  const option = document.createElement("option");
  option.value = b.buildingName;
  option.textContent = b.buildingName;
  select.appendChild(option);
});

document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("report"); 
});

document.getElementById("forward").addEventListener("click", async function () {
    const floor = Array.from(document.querySelectorAll('input[name="floors"]:checked')).map(cb => cb.value);
    const photoInput = document.getElementById("photo");
    
    // Read photos as base64
    const photoFiles = await Promise.all(Array.from(photoInput.files).map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }));

    const data = {
        "Hazard Type": "Elevator",
        "Building": document.getElementById("building").value,
        "Floors Affected": floor,
        "Elevator Status": document.getElementById("status").value,
        "Alternative Access": document.getElementById("alternative").value,
        "Urgency": document.getElementById("urgency").value,
        "Photo": photoFiles
    };

    localStorage.setItem("report", JSON.stringify(data));
});