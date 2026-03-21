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
  document.getElementById('description').addEventListener('input', function() {
    this.style.height = 'auto';                 
    this.style.height = this.scrollHeight + 'px'; 
  });
});

document.getElementById("forward").addEventListener("click", function () {
    const photoInput = document.getElementById("photo");
    const photoFiles = Array.from(photoInput.files).map(file => file.name);

    const data = {
        "Hazard Type": "Other",
        "Building": document.getElementById("building").value,
        "Intersection Street 1": document.getElementById("street1").value,
        "Intersection Street 2": document.getElementById("street2").value,
        "Impact Type": document.getElementById("impact").value,
        "Description": document.getElementById("description").value,
        "Photo": photoFiles
    };

    localStorage.setItem("report", JSON.stringify(data));
});