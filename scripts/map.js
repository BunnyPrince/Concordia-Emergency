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
  // (map returned at end)
  buildings.forEach(b => {
    const buildingIcon = L.icon({
      iconUrl: 'images/concordia-logo.png',
      iconSize: [16, 16]
    });
    L.marker([b.lat, b.lng], { icon: buildingIcon })
      .addTo(map)
      .bindPopup(`<b>${b.code}</b><br>${b.buildingName}`);
  });

  // Alert markers
  const alertPrefs = JSON.parse(localStorage.getItem('alertPrefs') || '{}');
  const typeMap = {
    'Protest': 'protest',
    'Construction': 'construction',
    'Weather Hazard': 'weather',
    'Elevator Malfunction': 'elevator',
    'Others': 'others'
  };
  alerts.forEach(alert => {
    const prefKey = typeMap[alert.type];
    if (prefKey && alertPrefs[prefKey] === false) return;
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

  return map;
}

// Proximity alert + Navigation
export function initLocationFeatures(map) {
  if (!navigator.geolocation) return;

  const userMarker = L.circleMarker([0, 0], {
    radius: 8,
    fillColor: '#2980b9',
    color: '#fff',
    weight: 2,
    fillOpacity: 1
  }).addTo(map).bindPopup('📍 You are here');

  let routingControl = null;
  let notifiedAlerts = new Set();

  navigator.geolocation.watchPosition((pos) => {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    userMarker.setLatLng([userLat, userLng]);

    // Check proximity to alerts (50m)
    alerts.forEach(alert => {
      const dist = map.distance([userLat, userLng], [alert.location.lat, alert.location.lng]);
      if (dist < 50 && !notifiedAlerts.has(alert.id)) {
        notifiedAlerts.add(alert.id);
        L.popup({ autoClose: false, closeOnClick: false })
          .setLatLng([alert.location.lat, alert.location.lng])
          .setContent(`
            <b>⚠️ Hazard Nearby!</b><br>
            ${alert.type} - ${alert.description}<br>
            <a href="pages/alertDetail.html?id=${alert.id}">View Details</a>
          `)
          .openOn(map);
      }
    });
  }, null, { enableHighAccuracy: true });

  // Navigate to clicked building
  map.on('click', (e) => {
    navigator.geolocation.getCurrentPosition((pos) => {
      if (routingControl) map.removeControl(routingControl);
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(pos.coords.latitude, pos.coords.longitude),
          L.latLng(e.latlng.lat, e.latlng.lng)
        ],
        routeWhileDragging: false,
        show: false
      }).addTo(map);
    });
  });
}
