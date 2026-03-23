export const alerts = [
  {
    id: 1,
    type: 'Protest',
    buildingCode: 'H',
    location: { lat: 45.4972, lng: -73.5788 },
    description: 'Large gathering blocking front entrance',
    status: 'ACTIVE',
    verification: 'Reported by 1 student',
    time: '12:40 PM'
  },
  {
    id: 2,
    type: 'Elevator Malfunction',
    buildingCode: 'LB',
    location: { lat: 45.4969, lng: -73.5786 },
    description: 'Elevator out of service on floors 2-4',
    status: 'UNDER REVIEW',
    verification: 'Reported by 3 students',
    time: '2:14 PM'
  },
  {
    id: 3,
    type: 'Construction',
    buildingCode: 'EV',
    location: { lat: 45.4957, lng: -73.5778 },
    description: 'Sidewalk partially blocked near main entrance',
    status: 'ACTIVE',
    verification: 'Verified by Campus Safety',
    time: '9:00 AM'
  }
,
  {
    id: 4,
    type: 'Weather Hazard',
    buildingCode: 'GM',
    location: { lat: 45.4959, lng: -73.5790 },
    description: 'Icy sidewalk near main entrance cleared',
    status: 'RESOLVED',
    verification: 'Verified by Campus Safety',
    time: '8:30 AM'
  },
  {
    id: 5,
    type: 'Elevator Malfunction',
    buildingCode: 'H',
    location: { lat: 45.4972, lng: -73.5788 },
    description: 'Elevator on floors 8-12 back in service',
    status: 'RESOLVED',
    verification: 'Reported by 2 students',
    time: '11:00 AM'
  }
];
