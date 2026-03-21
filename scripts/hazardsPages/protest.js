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

document.getElementById("forward").addEventListener("click", async function (event) {
    event.preventDefault();

    const building = document.getElementById("building").value.trim();
    if (!building) {
      alert("Please choose a building to make report.");
      return;
    }

    const situation = document.querySelector('input[name="situation"]:checked')?.value || '';
    const mobility = Array.from(document.querySelectorAll('input[name="mobility"]:checked')).map(cb => cb.value);
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
        "Hazard Type": "Protest",
        "Building": building,
        "Intersection Street 1": document.getElementById("street1").value,
        "Intersection Street 2": document.getElementById("street2").value,
        "Current Situation": situation,
        "Mobility Impact": mobility,
        "Intensity Level": document.getElementById("intensity").value,
        "Photo": photoFiles
    };

    localStorage.setItem("report", JSON.stringify(data));
    window.location.href = "confirmation.html";
});
