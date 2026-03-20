import { building } from "../../data/building.js";

const select = document.getElementById("building");

building.forEach((b) => {
  const option = document.createElement("option");
  option.value = b.buildingName;
  option.textContent = b.buildingName;
  select.appendChild(option);
});