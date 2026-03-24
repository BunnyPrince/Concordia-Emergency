const seedAlerts = [
  {
    id: 1,
    type: 'Protest',
    buildingCode: 'H',
    location: { lat: 45.4972, lng: -73.5788 },
    description: 'Large gathering blocking front entrance',
    status: 'ACTIVE',
    verification: 'Verified by Campus Safety',
    time: '2026-03-23T12:40:00.000Z',
    detail: {
      'Intersection Street 1': 'Mackay St',
      'Intersection Street 2': 'De Maisonneuve Blvd W',
      'Current Situation': 'partially blocked',
      'Mobility Impact': ['sidewalk blocked', 'accessible entrance closed'],
      'Intensity Level': 'loud / high noise'
    }
  },
  {
    id: 2,
    type: 'Elevator Malfunction',
    buildingCode: 'LB',
    location: { lat: 45.4969, lng: -73.5786 },
    description: 'Elevator out of service on floors 2-4',
    status: 'UNDER REVIEW',
    verification: 'Reported by 3 students',
    time: '2026-03-23T14:14:00.000Z',
    detail: {
      'Floors Affected': ['cannot access upper floors'],
      'Elevator Status': 'not working at all',
      'Alternative Access': 'another elevator working',
      'Urgency': 'temporary issue'
    }
  },
  {
    id: 3,
    type: 'Construction',
    buildingCode: 'EV',
    location: { lat: 45.4957, lng: -73.5778 },
    description: 'Sidewalk partially blocked near main entrance',
    status: 'ACTIVE',
    verification: 'Verified by Campus Safety',
    time: '2026-03-23T09:00:00.000Z',
    detail: {
      'Intersection Street 1': 'Guy St',
      'Intersection Street 2': 'De Maisonneuve Blvd W',
      'Type of Issue': 'sidewalk closed',
      'Estimated Duration': 'this week',
      'Accessibility Impact': ['detour required', 'uneven ground / debris']
    }
  },
  {
    id: 4,
    type: 'Weather Hazard',
    buildingCode: 'GM',
    location: { lat: 45.4959, lng: -73.5790 },
    description: 'Icy sidewalk near main entrance cleared',
    status: 'RESOLVED',
    verification: 'Verified by Campus Safety',
    time: '2026-03-23T08:30:00.000Z',
    detail: {
      'Intersection Street 1': 'Mackay St',
      'Intersection Street 2': 'Sherbrooke St W',
      'Type of Weather': 'ice on sidewalk',
      'Severity': 'slippery but walkable',
      'Accessibility Impact': ['ramp unsafe']
    }
  },
  {
    id: 5,
    type: 'Elevator Malfunction',
    buildingCode: 'H',
    location: { lat: 45.4972, lng: -73.5788 },
    description: 'Elevator on floors 8-12 back in service',
    status: 'RESOLVED',
    verification: 'Verified by Campus Safety',
    time: '2026-03-23T11:00:00.000Z',
    detail: {
      'Floors Affected': ['cannot access upper floors'],
      'Elevator Status': 'long wait time',
      'Alternative Access': 'ramp available',
      'Urgency': 'temporary issue'
    }
  }
];

function ensureAlertsInitialized() {
  if (localStorage.getItem('alerts') === null) {
    localStorage.setItem('alerts', JSON.stringify(seedAlerts));
  }
}

// Load alerts from localStorage.
function loadAlerts() {
  ensureAlertsInitialized();
  const stored = localStorage.getItem('alerts');
  const currentTime = new Date().toISOString();
  const seedById = new Map(seedAlerts.map(alert => [alert.id, alert]));

  if (!stored) return [...seedAlerts];

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [...seedAlerts];

    let changed = false;
    const normalized = parsed.map(alert => {
      const normalizedAlert = { ...alert };

      if (!normalizedAlert.time) {
        normalizedAlert.time = currentTime;
        changed = true;
      }

      if (!normalizedAlert.firstTime) {
        normalizedAlert.firstTime = normalizedAlert.time;
        changed = true;
      }

      if (!normalizedAlert.updateTime) {
        normalizedAlert.updateTime = normalizedAlert.time;
        changed = true;
      }

      const seedMatch = seedById.get(Number(normalizedAlert.id));
      if (!normalizedAlert.detail && seedMatch?.detail) {
        normalizedAlert.detail = seedMatch.detail;
        changed = true;
      }

      return normalizedAlert;
    });

    if (changed) {
      saveAlerts(normalized);
    }

    return normalized;
  } catch {
    return [...seedAlerts];
  }
}

function saveAlerts(alertList) {
  localStorage.setItem('alerts', JSON.stringify(alertList));
}

function normalizeStatus(status) {
  if (status === 'UNDER_REVIEW') return 'UNDER REVIEW';
  return status || 'UNDER REVIEW';
}

function readReportCount(alert) {
  if (typeof alert.reportCount === 'number' && alert.reportCount > 0) {
    return alert.reportCount;
  }

  const match = (alert.verification || '').match(/Reported by\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : 1;
}

function formatVerification(count) {
  return count === 1 ? 'Reported by 1 student' : `Reported by ${count} students`;
}

function nextAlertId(alertList) {
  if (!alertList.length) return 1;

  return alertList.reduce((maxId, item) => {
    const id = Number(item.id);
    return Number.isFinite(id) ? Math.max(maxId, id) : maxId;
  }, 0) + 1;
}

export const alerts = loadAlerts();

export function getAlerts() {
  return loadAlerts();
}

// Add a new alert or merge with an existing one if it reports the same incident.
export function addAlert(alert) {
  const currentAlerts = loadAlerts();
  const currentTime = new Date().toISOString();

  const existingIndex = currentAlerts.findIndex(a =>
    a.type === alert.type &&
    a.buildingCode === alert.buildingCode &&
    a.location.lat === alert.location.lat &&
    a.location.lng === alert.location.lng
  );

  if (existingIndex !== -1) {
    const existing = currentAlerts[existingIndex];
    const reportCount = readReportCount(existing) + 1;

    existing.reportCount = reportCount;
    existing.verification = formatVerification(reportCount);
    existing.updateTime = alert.time || currentTime;
    existing.status = normalizeStatus(existing.status);

    if (alert.detail) {
      const detailList = Array.isArray(existing.detail)
        ? existing.detail
        : (existing.detail ? [existing.detail] : []);
      detailList.push(alert.detail);
      existing.detail = detailList;
    }

    saveAlerts(currentAlerts);
    return;
  }

  const firstTime = alert.time || currentTime;
  const reportCount = 1;

  const newAlert = {
    ...alert,
    id: nextAlertId(currentAlerts),
    status: normalizeStatus(alert.status),
    reportCount,
    verification: alert.verification || formatVerification(reportCount),
    firstTime,
    updateTime: firstTime
  };

  if (alert.detail) {
    newAlert.detail = Array.isArray(alert.detail) ? alert.detail : [alert.detail];
  }

  saveAlerts([...currentAlerts, newAlert]);
}