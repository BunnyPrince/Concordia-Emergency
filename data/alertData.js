// Load alerts from localStorage
function loadAlerts() {
  const stored = localStorage.getItem('alerts');
  return stored ? JSON.parse(stored) : [];
}

export const alerts = loadAlerts();

// Function to add a new alert or increment existing one
export function addAlert(alert) {
  const currentAlerts = loadAlerts();
  
  // Check if alert with same type and building already exists
  const existingIndex = currentAlerts.findIndex(a =>
    a.type === alert.type &&
    a.buildingCode === alert.buildingCode &&
    a.location.lat === alert.location.lat &&
    a.location.lng === alert.location.lng
  );

  let updatedAlerts;
  if (existingIndex !== -1) {
    // Update existing alert
    const existing = currentAlerts[existingIndex];
    const currentCount = parseInt(existing.verification.split(' ')[2]) || 1;
    existing.verification = `Reported by ${currentCount + 1} students`;
    
    // Add detail if provided
    if (alert.detail) {
      if (!existing.detail) {
        existing.detail = [];
      }
      existing.detail.push(alert.detail);
    }
    
    updatedAlerts = currentAlerts;
  } else {
    // Create new alert
    const newId = currentAlerts.length > 0 ? Math.max(...currentAlerts.map(a => a.id)) + 1 : 1;
    const newAlert = {
      ...alert,
      id: newId,
      verification: 'Reported by 1 student'
    };
    if (alert.detail) {
      newAlert.detail = [alert.detail];
    }
    updatedAlerts = [...currentAlerts, newAlert];
  }

  localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
}
