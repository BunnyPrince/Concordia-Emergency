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
    const accessibility = Array.from(document.querySelectorAll('input[name="accessibility"]:checked')).map(cb => cb.value);
    const photoInput = document.getElementById("photo");
    const photoFiles = Array.from(photoInput.files).map(file => file.name);

    const data = {
        "Hazard Type": "Construction",
        "Building": document.getElementById("building").value,
        "Intersection Street 1": document.getElementById("street1").value,
        "Intersection Street 2": document.getElementById("street2").value,
        "Type of Issue": document.getElementById("issue").value,
        "Estimated Duration": document.getElementById("duration").value,
        "Accessibility Impact": accessibility,
        "Photo": photoFiles
    };

    localStorage.setItem("report", JSON.stringify(data));
});