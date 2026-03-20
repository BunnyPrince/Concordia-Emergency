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
];
