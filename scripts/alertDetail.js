import { alerts } from '../data/alertData.js';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const alert = alerts.find(a => a.id === id);

  if (!alert) return;

  // Title
  const statusColor = alert.status === 'ACTIVE' ? 'red' : alert.status === 'UNDER REVIEW' ? 'yellow' : 'green';
  document.querySelector('.title p').innerHTML = `
    ${alert.type} Details - ${alert.status}
    <img src="../images/circle-${statusColor}.png" alt="status">
  `;

  // Common top section - Status card
  document.querySelector('.verification-details p').textContent = alert.verification;
  document.querySelector('.status-details p').textContent = alert.status;
  
  // Last update (time)
  if (alert.time) {
    document.querySelector('.update-details p').textContent = alert.time;
  }

  // Location
  if (alert.description) {
    document.querySelector('.location-detail-js p').textContent = alert.description;
  }

  // Detail section - populate with detail data
  if (alert.detail) {
    const situationsList = document.querySelector('.situations-detail-js ul');
    
    // Handle detail as array or single object
    const details = Array.isArray(alert.detail) ? alert.detail : [alert.detail];
    
    // Group keys from all detail objects
    const allKeys = new Set();
    details.forEach(detail => {
      if (typeof detail === 'object' && detail !== null) {
        Object.keys(detail).forEach(key => allKeys.add(key));
      }
    });

    // Create rows for each key found in details
    if (allKeys.size > 0) {
      situationsList.innerHTML = '';
      allKeys.forEach(key => {
        const values = details.map(detail => detail[key]).filter(v => v !== undefined && v !== null && v !== '');
        if (values.length > 0) {
          const li = document.createElement('li');
          li.textContent = `${key}: ${values.join(', ')}`;
          situationsList.appendChild(li);
        }
      });
    } else {
      situationsList.innerHTML = '<li>No additional details</li>';
    }
  }
});
