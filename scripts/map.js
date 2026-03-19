import { buildings } from '../data/building.js';
import { alerts } from '../data/alertData.js';

const alertColors = {
  'Protest': '#e74c3c',
  'Construction': '#e67e22',
  'Elevator Malfunction': '#9b59b6',
  'Weather Hazard': '#3498db',
  'Others': '#7f8c8d'
};

const alertIcons = {
  'Protest': '🚨',
  'Construction': '🚧',
  'Elevator Malfunction': '🛗',
  'Weather Hazard': '🌧️',
  'Others': '⚠️'
};

export function initMap() {
  const map = L.map('map-js').setView([45.4969, -73.5788], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Building markers
  buildings.forEach(b => {
    L.circleMarker([b.lat, b.lng], {
      radius: 6,
      fillColor: '#cdbcf1',
      color: '#7a5fc0',
      weight: 1,
      fillOpacity: 0.8
    }).addTo(map).bindPopup(`<b>${b.code}</b><br>${b.buildingName}`);
  });

  // Alert markers
  alerts.forEach(alert => {
    const color = alertColors[alert.type] || '#7f8c8d';
    const icon = alertIcons[alert.type] || '⚠️';

    const alertIcon = L.divIcon({
      html: `<div class="alert-marker-js" style="background:${color}">${icon}</div>`,
      className: '',
      iconSize: [32, 32]
    });

    L.marker([alert.location.lat, alert.location.lng], { icon: alertIcon })
      .addTo(map)
      .bindPopup(`
        <b>${alert.type}</b><br>
        ${alert.description}<br>
        <small>🕐 ${alert.time} | ${alert.verification}</small><br>
        <span style="color:${color}">● ${alert.status}</span>
      `);
  });
}
