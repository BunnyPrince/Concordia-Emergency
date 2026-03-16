import { building } from "../../data/building.js";

const select = document.getElementById("building");

building.forEach((b) => {
  const option = document.createElement("option");
  option.value = b.buildingName;
  option.textContent = b.buildingName;
  select.appendChild(option);
});

document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("report"); 
});

document.getElementById("forward").addEventListener("click", function () {
    const situation = document.querySelector('input[name="situation"]:checked')?.value || '';
    const mobility = Array.from(document.querySelectorAll('input[name="mobility"]:checked')).map(cb => cb.value);
    const photoInput = document.getElementById("photo");
    const photoFiles = Array.from(photoInput.files).map(file => file.name);

    const data = {
        "Building": document.getElementById("building").value,
        "Intersection Street 1": document.getElementById("street1").value,
        "Intersection Street 2": document.getElementById("street2").value,
        "Current Situation": situation,
        "Mobility Impact": mobility,
        "Intensity Level": document.getElementById("intensity").value,
        "Photo": photoFiles
    };

    localStorage.setItem("report", JSON.stringify(data));
});
