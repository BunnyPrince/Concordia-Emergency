import { getAlerts } from '../data/alertData.js';

document.addEventListener('DOMContentLoaded', () => {
  const alerts = getAlerts();
  const active = alerts.filter(a => a.status === 'ACTIVE');
  const underReview = alerts.filter(a => a.status === 'UNDER REVIEW' || a.status === 'UNDER_REVIEW');
  const resolved = alerts.filter(a => a.status === 'RESOLVED');

  // Helper function to format time
  function formatTime(timeString) {
    if (!timeString) return '';
    
    const now = new Date();
    let updateTime = new Date(timeString);
    
    // Check if the date is valid
    if (isNaN(updateTime.getTime())) {
      // If invalid, fall back to current time
      updateTime = now;
    }
    
    const diffMs = now - updateTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 60) {
      // Show as "xx minutes ago" (minimum 1 minute)
      const minutes = Math.max(1, Math.min(59, diffMinutes));
      return `${minutes} minutes ago`;
    } else {
      // Show as exact time in format yy/mm/dd hh:mm
      const year = updateTime.getFullYear().toString().slice(-2);
      const month = (updateTime.getMonth() + 1).toString().padStart(2, '0');
      const day = updateTime.getDate().toString().padStart(2, '0');
      const hours = updateTime.getHours().toString().padStart(2, '0');
      const minutes = updateTime.getMinutes().toString().padStart(2, '0');
      return `${year}/${month}/${day} ${hours}:${minutes}`;
    }
  }

  function renderRows(list) {
    return list.map(a => `
      <tr>
        <td data-title="Type">${a.type}</td>
        <td data-title="Location">${a.description}</td>
        <td data-title="Reported Time">${formatTime(a.firstTime || a.time)}</td>
        <td data-title="Verification">${a.verification}</td>
        <td data-title="Details"><a href="alertDetail.html?id=${a.id}">[ View Details ]</a></td>
      </tr>
    `).join('');
  }

  document.querySelectorAll('.active-section')[0].querySelector('tbody').innerHTML = renderRows(active);
  document.querySelectorAll('.active-section')[1].querySelector('tbody').innerHTML = renderRows(underReview);
  document.querySelectorAll('.active-section')[2].querySelector('tbody').innerHTML = renderRows(resolved);
});
