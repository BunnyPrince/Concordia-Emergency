import { getAlerts } from '../data/alertData.js';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const alerts = getAlerts();
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

  const reviewButton = document.querySelector('.review-button-js');
  if (reviewButton) {
    reviewButton.onclick = () => {
      window.location.href = `alertReview.html?id=${alert.id}`;
    };
  }
  
  // Last update (time)
  if (alert.updateTime || alert.time) {
    const now = new Date();
    let updateTime = new Date(alert.updateTime || alert.time);
    
    // Check if the date is valid
    if (isNaN(updateTime.getTime())) {
      // If invalid, fall back to current time
      updateTime = now;
    }
    
    const diffMs = now - updateTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    let timeDisplay;
    if (diffMinutes < 60) {
      // Show as "xx minutes ago" (minimum 1 minute)
      const minutes = Math.max(1, Math.min(59, diffMinutes));
      timeDisplay = `${minutes} minutes ago`;
    } else {
      // Show as exact time in format yy/mm/dd hh:mm
      const year = updateTime.getFullYear().toString().slice(-2);
      const month = (updateTime.getMonth() + 1).toString().padStart(2, '0');
      const day = updateTime.getDate().toString().padStart(2, '0');
      const hours = updateTime.getHours().toString().padStart(2, '0');
      const minutes = updateTime.getMinutes().toString().padStart(2, '0');
      timeDisplay = `${year}/${month}/${day} ${hours}:${minutes}`;
    }
    
    document.querySelector('.update-details p').textContent = timeDisplay;
  }

  // Location
  if (alert.description) {
    document.querySelector('.location-detail-js p').textContent = alert.description;
  }

  // Detail section - populate with detail data
  if (alert.detail) {
    const detailsContainer = document.querySelector('.details-inner-card');
    
    // Handle detail as array or single object
    const details = Array.isArray(alert.detail) ? alert.detail : [alert.detail];
    
    // Group keys from all detail objects
    const allKeys = new Set();
    details.forEach(detail => {
      if (typeof detail === 'object' && detail !== null) {
        Object.keys(detail).forEach(key => {
          allKeys.add(key);
        });
      }
    });

    // Clear existing content
    detailsContainer.innerHTML = '';

    // Create cards for each key found in details
    if (allKeys.size > 0) {
      allKeys.forEach(key => {
        const values = details.map(detail => detail[key]).filter(v => v !== undefined && v !== null && v !== '' && (Array.isArray(v) ? v.length > 0 : true));
        // Only create card if there are actual values
        if (values.length > 0) {
          // Flatten nested arrays and create a set to combine same items
          const flattenedValues = new Set();
          values.forEach(value => {
            if (Array.isArray(value)) {
              value.forEach(item => {
                if (item !== undefined && item !== null && item !== '') {
                  flattenedValues.add(item);
                }
              });
            } else {
              flattenedValues.add(value);
            }
          });
          
          const uniqueValues = Array.from(flattenedValues);
          const detailCard = document.createElement('div');
          detailCard.className = 'detail-card situations';
          
          const cardTitle = document.createElement('p');
          cardTitle.className = 'card-title';
          cardTitle.textContent = key.charAt(0).toUpperCase() + key.slice(1);
          
          const cardContent = document.createElement('div');
          cardContent.className = 'situations-detail';
          
          // Display values separated by <br>
          const valueText = document.createElement('p');
          valueText.innerHTML = uniqueValues.map(value => 
            value.charAt(0).toUpperCase() + value.slice(1)
          ).join('<br>');
          valueText.style.margin = '0';
          valueText.style.fontSize = '15px';
          valueText.style.fontWeight = '600';
          valueText.style.color = '#333';
          
          cardContent.appendChild(valueText);
          
          detailCard.appendChild(cardTitle);
          detailCard.appendChild(cardContent);
          detailsContainer.appendChild(detailCard);
        }
      });
    } else {
      // No details case
      const detailCard = document.createElement('div');
      detailCard.className = 'detail-card situations';
      
      const cardTitle = document.createElement('p');
      cardTitle.className = 'card-title';
      cardTitle.textContent = 'Situation Details';
      
      const cardContent = document.createElement('div');
      cardContent.className = 'situations-detail';
      
      const noDetailsText = document.createElement('p');
      noDetailsText.textContent = 'No additional details';
      noDetailsText.style.margin = '0';
      noDetailsText.style.fontSize = '15px';
      noDetailsText.style.fontWeight = '600';
      noDetailsText.style.color = '#333';
      
      cardContent.appendChild(noDetailsText);
      detailCard.appendChild(cardTitle);
      detailCard.appendChild(cardContent);
      detailsContainer.appendChild(detailCard);
    }
  }
});
