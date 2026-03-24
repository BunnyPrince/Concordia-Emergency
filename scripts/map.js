import { buildings } from '../data/building.js';
import { getAlerts } from '../data/alertData.js';

function isQuietHours() {
  const saved = JSON.parse(localStorage.getItem('quietHours') || '{}');
  if (saved.enabled === false) return false;
  const start = saved.start || '22:00';
  const end = saved.end || '07:00';
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const s = sh * 60 + sm;
  const e = eh * 60 + em;
  // handle overnight range e.g. 22:00 - 07:00
  if (s > e) return cur >= s || cur < e;
  return cur >= s && cur < e;
}

let lastKnownPosition = null;

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

// ─── Valhalla Router ──────────────────────────────────────────────────────────
function decodePolyline(str, precision = 6) {
  let index = 0, lat = 0, lng = 0, coordinates = [];
  const factor = Math.pow(10, precision);
  while (index < str.length) {
    let shift = 0, result = 0, byte;
    do { byte = str.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);
    shift = 0; result = 0;
    do { byte = str.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);
    coordinates.push([lat / factor, lng / factor]);
  }
  return coordinates;
}

function buildValhallaRouter(alertList) {
  return {
    abort() {},
    route(waypoints, callback) {
      const controller = new AbortController();
      const locations = waypoints.map(wp => ({
        lon: wp.latLng.lng, lat: wp.latLng.lat
      }));
      const d = 0.0005; // ~50m radius square
      const excludePolygons = alertList
        .filter(a => a.status === 'ACTIVE')
        .map(a => [
          [a.location.lng - d, a.location.lat - d],
          [a.location.lng + d, a.location.lat - d],
          [a.location.lng + d, a.location.lat + d],
          [a.location.lng - d, a.location.lat + d],
          [a.location.lng - d, a.location.lat - d]
        ]);
      fetch('https://valhalla1.openstreetmap.de/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: (() => { const body = { locations, costing: 'pedestrian', exclude_polygons: excludePolygons }; console.log('Valhalla request:', JSON.stringify(body)); return JSON.stringify(body); })()
      })
      .then(r => r.json())
      .then(data => {
        if (data.error) { callback(new Error(data.error)); return; }
        const coords = decodePolyline(data.trip.legs[0].shape);
        callback(null, [{
          name: 'Route',
          summary: { totalDistance: data.trip.summary.length * 1000, totalTime: data.trip.summary.time },
          coordinates: coords.map(c => L.latLng(c[0], c[1])),
          waypoints, inputWaypoints: waypoints
        }]);
      })
      .catch(err => { if (err.name !== 'AbortError') callback(err); });
      return { abort() { controller.abort(); } };
    }
  };
}

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
  getAlerts().forEach(alert => {
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
    lastKnownPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    userMarker.setLatLng([userLat, userLng]);

    // Check proximity to alerts (50m)
    getAlerts().forEach(alert => {
      const dist = map.distance([userLat, userLng], [alert.location.lat, alert.location.lng]);
      if (dist < 50 && !notifiedAlerts.has(alert.id) && !isQuietHours()) {
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
    if (!navigator.onLine) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      if (routingControl) { map.removeLayer(routingControl); routingControl = null; }
      const d = 0.0005;
      const excludePolygons = getAlerts()
        .filter(a => a.status === 'ACTIVE')
        .map(a => [
          [a.location.lng - d, a.location.lat - d],
          [a.location.lng + d, a.location.lat - d],
          [a.location.lng + d, a.location.lat + d],
          [a.location.lng - d, a.location.lat + d],
          [a.location.lng - d, a.location.lat - d]
        ]);
      fetch('https://valhalla1.openstreetmap.de/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locations: [
            { lon: pos.coords.longitude, lat: pos.coords.latitude },
            { lon: e.latlng.lng, lat: e.latlng.lat }
          ],
          costing: 'pedestrian',
          exclude_polygons: excludePolygons
        })
      })
      .then(r => r.json())
      .then(data => {
        if (data.error) return;
        const coords = decodePolyline(data.trip.legs[0].shape);
        routingControl = L.polyline(coords.map(c => [c[0], c[1]]), {
          color: '#0ABAB5', weight: 5, opacity: 0.85
        }).addTo(map);
      });
    });
  });
}

// ─── Destination Search Box ────────────────────────────────────────────────────
export function addDestinationSearch(map) {
  const SearchControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd() {
      const container = L.DomUtil.create('div', 'ds-control');
      container.innerHTML = `
        <div class="ds-row">
          <input id="ds-input" class="ds-input" type="text"
                 placeholder="Search destination…" autocomplete="off" />
          <button id="ds-btn" class="ds-btn">Go</button>
          <button id="ds-clear" class="ds-clear" title="Clear">✕</button>
        </div>
        <ul id="ds-suggestions" class="ds-suggestions"></ul>
        <div id="ds-status" class="ds-status"></div>
      `;
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);
      return container;
    }
  });
  map.addControl(new SearchControl());

  let routingControl = null;
  let destMarker     = null;

  const input  = document.getElementById('ds-input');
  const btn    = document.getElementById('ds-btn');
  const clear  = document.getElementById('ds-clear');
  const status = document.getElementById('ds-status');

  function setStatus(msg, isError = false) {
    status.textContent = msg;
    status.style.color = isError ? '#e74c3c' : '#555';
  }

  function clearRoute() {
    if (routingControl) { map.removeLayer(routingControl); routingControl = null; }
    if (destMarker)     { map.removeLayer(destMarker);       destMarker     = null; }
    input.value = '';
    setStatus('');
  }

  // Debounce helper
  function debounce(fn, delay) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
  }

  const suggestionsList = document.getElementById('ds-suggestions');

  function showSuggestions(items) {
    suggestionsList.innerHTML = '';
    if (!items.length) { suggestionsList.style.display = 'none'; return; }
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'ds-suggestion-item';
      li.textContent = item.display_name;
      li.addEventListener('click', () => {
        input.value = item.display_name;
        suggestionsList.style.display = 'none';
        handleSearch();
      });
      suggestionsList.appendChild(li);
    });
    suggestionsList.style.display = 'block';
  }

  async function fetchSuggestions(query) {
    if (query.length < 3) { suggestionsList.style.display = 'none'; return; }
    const params = new URLSearchParams({
      q: query, format: 'json', limit: 5,
      countrycodes: 'ca', viewbox: '-73.65,45.46,-73.52,45.54', bounded: 0, dedupe: 1
    });
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?${params}`,
        { headers: { 'Accept-Language': 'en' } });
      const data = await res.json();
      showSuggestions(data);
    } catch { suggestionsList.style.display = 'none'; }
  }

  const debouncedFetch = debounce(fetchSuggestions, 300);

  input.addEventListener('input', () => debouncedFetch(input.value.trim()));

  // Hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.ds-control')) suggestionsList.style.display = 'none';
  });

  async function geocode(address) {
    const params = new URLSearchParams({
      q: address, format: 'json', limit: 1
    });
    const res  = await fetch(`https://nominatim.openstreetmap.org/search?${params}`,
      { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (!data.length) throw new Error('Address not found. Try a more specific query.');
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), label: data[0].display_name };
  }

  function routeTo(userLatLng, dest) {
    if (routingControl) { map.removeLayer(routingControl); routingControl = null; }
    if (destMarker)     { map.removeLayer(destMarker);     destMarker     = null; }

    destMarker = L.marker([dest.lat, dest.lng], {
      icon: L.divIcon({
        html: '<div class="ds-dest-pin">📍</div>',
        className: '', iconSize: [32, 32], iconAnchor: [16, 32]
      })
    }).addTo(map).bindPopup(`<b>Destination</b><br><small>${dest.label}</small>`).openPopup();

    const d = 0.0005;
    const excludePolygons = getAlerts()
      .filter(a => a.status === 'ACTIVE')
      .map(a => [
        [a.location.lng - d, a.location.lat - d],
        [a.location.lng + d, a.location.lat - d],
        [a.location.lng + d, a.location.lat + d],
        [a.location.lng - d, a.location.lat + d],
        [a.location.lng - d, a.location.lat - d]
      ]);

    setStatus('🗺️ Calculating route…');
    fetch('https://valhalla1.openstreetmap.de/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locations: [
          { lon: userLatLng.lng, lat: userLatLng.lat },
          { lon: dest.lng,       lat: dest.lat }
        ],
        costing: 'pedestrian',
        exclude_polygons: excludePolygons
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      const coords = decodePolyline(data.trip.legs[0].shape);
      routingControl = L.polyline(coords.map(c => [c[0], c[1]]), {
        color: '#0ABAB5', weight: 5, opacity: 0.85
      }).addTo(map);
      map.fitBounds(routingControl.getBounds(), { padding: [40, 40] });
      setStatus('✅ Route set!');
    })
    .catch(err => setStatus('❌ ' + err.message, true));
  }

  async function handleSearch() {
    if (!navigator.onLine) {
      const query = input.value.trim();
      if (!query) { setStatus('Please enter a destination.', true); return; }

      // Find matching building from local data
      const q = query.toLowerCase();
      const match =
        buildings.find(b => b.code.toLowerCase() === q) ||
        buildings.find(b => b.buildingName.toLowerCase().includes(q)) ||
        buildings.find(b => q.includes(b.code.toLowerCase()));

      if (!match) {
        setStatus('📡 Offline — Building not found in local data. Try a building code (e.g. "H", "EV", "MB").', true);
        return;
      }

      // Get user position
      const userPos = lastKnownPosition;
      if (!userPos) {
        setStatus('📡 Offline — Location unavailable. Please enable GPS.', true);
        return;
      }

      // Calculate straight-line distance (haversine)
      const R = 6371000;
      const dLat = (match.lat - userPos.lat) * Math.PI / 180;
      const dLng = (match.lng - userPos.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(userPos.lat * Math.PI / 180) * Math.cos(match.lat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const distM = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));

      // Cardinal direction
      const latDiff = match.lat - userPos.lat;
      const lngDiff = match.lng - userPos.lng;
      let dir = '';
      if (Math.abs(latDiff) >= Math.abs(lngDiff)) {
        dir = latDiff > 0 ? 'north' : 'south';
      } else {
        dir = lngDiff > 0 ? 'east' : 'west';
      }

      // Draw straight line on map
      if (routingControl) { map.removeLayer(routingControl); routingControl = null; }
      if (destMarker)     { map.removeLayer(destMarker);     destMarker = null; }

      routingControl = L.polyline(
        [[userPos.lat, userPos.lng], [match.lat, match.lng]],
        { color: '#e67e22', weight: 4, opacity: 0.8, dashArray: '8, 8' }
      ).addTo(map);

      destMarker = L.marker([match.lat, match.lng], {
        icon: L.divIcon({
          html: '<div class="ds-dest-pin">📍</div>',
          className: '', iconSize: [32, 32], iconAnchor: [16, 32]
        })
      }).addTo(map).bindPopup(`<b>${match.code} — ${match.buildingName}</b><br><small>~${distM}m ${dir}</small>`).openPopup();

      map.fitBounds(routingControl.getBounds(), { padding: [60, 60] });
      setStatus(`📡 Offline — Head ~${distM}m ${dir} to ${match.buildingName} (${match.code})`, false);
      return;
    }
    const query = input.value.trim();
    if (!query) { setStatus('Please enter a destination.', true); return; }
    btn.disabled = true;
    setStatus('📡 Getting your location…');
    if (lastKnownPosition) {
      const userLatLng = lastKnownPosition;
      setStatus("🔎 Searching address…");
      geocode(query).then(dest => routeTo(userLatLng, dest)).catch(err => setStatus(err.message, true)).finally(() => { btn.disabled = false; });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setStatus('🔎 Searching address…');
        try {
          const dest = await geocode(query);
          routeTo(userLatLng, dest);
        } catch (err) {
          setStatus(err.message, true);
        } finally {
          btn.disabled = false;
        }
      },
      () => { setStatus('⚠️ Location access denied.', true); btn.disabled = false; },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  btn.addEventListener('click', handleSearch);
  clear.addEventListener('click', clearRoute);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });
}
