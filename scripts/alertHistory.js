import { alerts } from '../data/alertData.js';

document.addEventListener('DOMContentLoaded', () => {
  const active = alerts.filter(a => a.status === 'ACTIVE');
  const underReview = alerts.filter(a => a.status === 'UNDER REVIEW');
  const resolved = alerts.filter(a => a.status === 'RESOLVED');

  function renderRows(list) {
    return list.map(a => `
      <tr>
        <td data-title="Type">${a.type}</td>
        <td data-title="Location">${a.buildingCode} - ${a.description.substring(0, 30)}...</td>
        <td data-title="Reported Time">${a.time}</td>
        <td data-title="Verification">${a.verification}</td>
        <td data-title="Details"><a href="alertDetail.html?id=${a.id}">[ View Details ]</a></td>
      </tr>
    `).join('');
  }

  document.querySelectorAll('.active-section')[0].querySelector('tbody').innerHTML = renderRows(active);
  document.querySelectorAll('.active-section')[1].querySelector('tbody').innerHTML = renderRows(underReview);
  document.querySelectorAll('.active-section')[2].querySelector('tbody').innerHTML = renderRows(resolved);
});
