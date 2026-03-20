import { alerts } from '../data/alertData.js';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const alert = alerts.find(a => a.id === id);

  if (!alert) return;

  // Title
  document.querySelector('.title p').innerHTML = `
    ${alert.type} Details - ${alert.status}
    <img src="../images/circle-${alert.status === 'ACTIVE' ? 'red' : alert.status === 'UNDER REVIEW' ? 'yellow' : 'green'}.png" alt="status">
  `;

  // Status card
  document.querySelector('.verification-details p').textContent = alert.verification;
  document.querySelector('.status-details p').textContent = alert.status;

  // Location
  document.querySelector('.location-detail-js p').textContent = alert.description;
});
