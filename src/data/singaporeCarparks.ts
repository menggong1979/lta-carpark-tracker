import { Carpark, UserLocation } from '../types/carpark';

export const SINGAPORE_POPULAR_LOCATIONS: UserLocation[] = [
  {
    name: 'Orchard Road (ION Orchard)',
    coordinates: { lat: 1.3040, lng: 103.8318 }
  },
  {
    name: 'Downtown / Marina Bay (MBS)',
    coordinates: { lat: 1.2834, lng: 103.8607 }
  },
  {
    name: 'CBD / Raffles Place',
    coordinates: { lat: 1.2838, lng: 103.8515 }
  },
  {
    name: 'Bugis / Rochor',
    coordinates: { lat: 1.3005, lng: 103.8558 }
  },
  {
    name: 'Jurong East (jem/Westgate)',
    coordinates: { lat: 1.3331, lng: 103.7436 }
  },
  {
    name: 'Tampines Regional Centre',
    coordinates: { lat: 1.3532, lng: 103.9452 }
  },
  {
    name: 'Woodlands Central',
    coordinates: { lat: 1.4361, lng: 103.7865 }
  },
  {
    name: 'Changi Airport T3',
    coordinates: { lat: 1.3564, lng: 103.9870 }
  }
];

export const INITIAL_CARPARKS: Carpark[] = [
  // 1. Commercial / Orchard
  {
    id: 'MALL_ION',
    code: 'ION01',
    name: 'ION Orchard Carpark',
    address: '2 Orchard Turn, Singapore 238801',
    agency: 'Commercial',
    region: 'Orchard',
    coordinates: { lat: 1.3040, lng: 103.8318 },
    lots: {
      car: { total: 500, available: 142, occupied: 358 },
      motorcycle: { total: 60, available: 18, occupied: 42 }
    },
    rates: {
      weekdayPeak: '$2.67 1st hr, $1.28/subsequent 30m (08:00 - 17:00)',
      weekdayOffPeak: '$3.74 per entry (17:00 - 23:59)',
      weekend: '$3.74 1st 2 hrs, $1.28/subsequent 30m',
      gracePeriodMinutes: 10,
      nightParkingCap: '$10.70 max overnight'
    },
    evCharging: {
      available: true,
      chargerCount: 6,
      network: 'SP Mobility (60kW DC Fast Charger)',
      fastCharger: true
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: 'Just now',
    trend: 'decreasing',
    deltaChange: -3,
    hourlyOccupancyTrend: [15, 10, 8, 7, 10, 20, 35, 60, 75, 80, 88, 92, 85, 78, 80, 84, 90, 88, 75, 60, 45, 30, 22, 18]
  },
  {
    id: 'MALL_TAKASHIMAYA',
    code: 'NGEE01',
    name: 'Ngee Ann City (Takashimaya)',
    address: '391 Orchard Road, Singapore 238873',
    agency: 'Commercial',
    region: 'Orchard',
    coordinates: { lat: 1.3025, lng: 103.8344 },
    lots: {
      car: { total: 720, available: 88, occupied: 632 },
      motorcycle: { total: 40, available: 12, occupied: 28 }
    },
    rates: {
      weekdayPeak: '$2.60 1st hr, $1.30/subsequent 30m',
      weekdayOffPeak: '$4.36 per entry after 18:00',
      weekend: '$4.36 1st 2 hrs, $1.53/subsequent 30m',
      gracePeriodMinutes: 10
    },
    evCharging: {
      available: true,
      chargerCount: 4,
      network: 'Charge+ (22kW AC)',
      fastCharger: false
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.0,
    lastUpdated: '1m ago',
    trend: 'stable',
    deltaChange: 0,
    hourlyOccupancyTrend: [12, 8, 6, 6, 8, 15, 30, 55, 70, 78, 84, 89, 86, 82, 85, 88, 92, 90, 80, 65, 48, 30, 20, 15]
  },
  {
    id: 'MALL_313',
    code: '313SOM',
    name: '313@somerset Multi-Storey Carpark',
    address: '313 Orchard Road, Singapore 238895',
    agency: 'Commercial',
    region: 'Orchard',
    coordinates: { lat: 1.3011, lng: 103.8384 },
    lots: {
      car: { total: 210, available: 14, occupied: 196 },
      motorcycle: { total: 30, available: 5, occupied: 25 }
    },
    rates: {
      weekdayPeak: '$3.00 1st hr, $1.50/subsequent 30m',
      weekdayOffPeak: '$4.00 per entry after 18:00',
      weekend: '$3.50 1st hr, $1.60/subsequent 30m',
      gracePeriodMinutes: 10
    },
    evCharging: {
      available: false
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 1.9,
    lastUpdated: 'Just now',
    trend: 'decreasing',
    deltaChange: -2,
    hourlyOccupancyTrend: [10, 5, 5, 5, 10, 15, 25, 50, 70, 85, 90, 95, 93, 88, 90, 92, 95, 94, 82, 60, 40, 25, 18, 12]
  },

  // 2. Marina Bay / CBD
  {
    id: 'COMM_MBS',
    code: 'MBS01',
    name: 'Marina Bay Sands Integrated Resort',
    address: '10 Bayfront Avenue, Singapore 018956',
    agency: 'Commercial',
    region: 'Marina Bay',
    coordinates: { lat: 1.2834, lng: 103.8607 },
    lots: {
      car: { total: 2500, available: 620, occupied: 1880 },
      motorcycle: { total: 200, available: 75, occupied: 125 }
    },
    rates: {
      weekdayPeak: '$14.00 1st hr, $2.00/subsequent 30m (Capped at $32/day)',
      weekdayOffPeak: '$14.00 1st hr, $2.00/subsequent 30m',
      weekend: '$16.00 1st hr, $2.00/subsequent 30m',
      gracePeriodMinutes: 10,
      nightParkingCap: 'Complimentary with Sands Rewards Elite'
    },
    evCharging: {
      available: true,
      chargerCount: 16,
      network: 'Tesla Supercharger & SP Mobility (150kW DC Fast)',
      fastCharger: true
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: 'Just now',
    trend: 'increasing',
    deltaChange: +5,
    hourlyOccupancyTrend: [25, 20, 15, 12, 10, 15, 25, 45, 60, 70, 75, 78, 80, 82, 85, 88, 92, 95, 90, 80, 65, 50, 40, 30]
  },
  {
    id: 'COMM_SUNTEC',
    code: 'SUN02',
    name: 'Suntec City (West & East Wing Carpark)',
    address: '3 Temasek Boulevard, Singapore 038983',
    agency: 'Commercial',
    region: 'Marina Bay',
    coordinates: { lat: 1.2935, lng: 103.8572 },
    lots: {
      car: { total: 3100, available: 1045, occupied: 2055 },
      motorcycle: { total: 250, available: 90, occupied: 160 },
      heavyVehicle: { total: 40, available: 8, occupied: 32 }
    },
    rates: {
      weekdayPeak: '$2.40 1st hr, $0.60/subsequent 15m (07:00 - 17:00)',
      weekdayOffPeak: '$2.80 per entry (17:00 - 07:00)',
      weekend: '$2.60 1st 4 hrs, $0.60/subsequent 15m',
      gracePeriodMinutes: 10
    },
    evCharging: {
      available: true,
      chargerCount: 12,
      network: 'Shell Recharge (50kW DC / 22kW AC)',
      fastCharger: true
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.0,
    lastUpdated: '2m ago',
    trend: 'stable',
    deltaChange: 0,
    hourlyOccupancyTrend: [20, 15, 10, 8, 12, 22, 40, 70, 85, 88, 85, 82, 80, 82, 84, 86, 75, 60, 50, 42, 35, 28, 24, 20]
  },
  {
    id: 'CBD_ORQ',
    code: 'ORQ01',
    name: 'One Raffles Quay Carpark',
    address: '1 Raffles Quay, Singapore 048583',
    agency: 'Commercial',
    region: 'Central/CBD',
    coordinates: { lat: 1.2818, lng: 103.8522 },
    lots: {
      car: { total: 320, available: 32, occupied: 288 }
    },
    rates: {
      weekdayPeak: '$3.50 per 30 mins (07:00 - 17:00)',
      weekdayOffPeak: '$3.50 per entry (17:00 - 23:00)',
      weekend: '$3.50 per entry all day',
      gracePeriodMinutes: 10
    },
    evCharging: {
      available: true,
      chargerCount: 4,
      network: 'CDG ENGIE',
      fastCharger: true
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: 'Just now',
    trend: 'decreasing',
    deltaChange: -1,
    hourlyOccupancyTrend: [8, 5, 5, 5, 10, 25, 55, 85, 95, 96, 94, 90, 88, 92, 95, 90, 70, 40, 25, 15, 12, 10, 8, 8]
  },
  {
    id: 'CBD_GUOCO',
    code: 'TPC01',
    name: 'Guoco Tower / Tanjong Pagar Centre',
    address: '1 Wallich Street, Singapore 078881',
    agency: 'Commercial',
    region: 'Central/CBD',
    coordinates: { lat: 1.2764, lng: 103.8458 },
    lots: {
      car: { total: 440, available: 65, occupied: 375 },
      motorcycle: { total: 50, available: 15, occupied: 35 }
    },
    rates: {
      weekdayPeak: '$3.20 per 30 mins (07:00 - 17:00)',
      weekdayOffPeak: '$3.50 per entry after 18:00',
      weekend: '$3.50 per entry',
      gracePeriodMinutes: 15
    },
    evCharging: {
      available: true,
      chargerCount: 6,
      network: 'SP Mobility',
      fastCharger: true
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: '1m ago',
    trend: 'stable',
    deltaChange: 0,
    hourlyOccupancyTrend: [10, 5, 5, 5, 10, 30, 60, 90, 95, 95, 92, 88, 86, 90, 92, 85, 65, 45, 30, 20, 15, 12, 10, 10]
  },

  // 3. URA Carparks (Heritage / Central)
  {
    id: 'URA_CHINATOWN',
    code: 'SMTH',
    name: 'Smith Street Off-Street Carpark (Chinatown)',
    address: 'Smith Street / Trengganu Street, Singapore 058945',
    agency: 'URA',
    region: 'Central/CBD',
    coordinates: { lat: 1.2825, lng: 103.8443 },
    lots: {
      car: { total: 110, available: 8, occupied: 102 },
      motorcycle: { total: 25, available: 6, occupied: 19 }
    },
    rates: {
      weekdayPeak: '$1.40 per 30 mins (07:00 - 17:00)',
      weekdayOffPeak: '$0.70 per 30 mins (17:00 - 22:30)',
      weekend: '$0.70 per 30 mins',
      gracePeriodMinutes: 15,
      freeParkingInfo: 'Free parking on Sundays 07:00 - 22:30'
    },
    evCharging: {
      available: false
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 4.5,
    lastUpdated: 'Just now',
    trend: 'decreasing',
    deltaChange: -1,
    hourlyOccupancyTrend: [15, 10, 5, 5, 10, 20, 40, 65, 80, 85, 90, 95, 90, 85, 88, 92, 96, 95, 85, 70, 50, 35, 25, 18]
  },
  {
    id: 'URA_TELOK_AYER',
    code: 'TAYER',
    name: 'Telok Ayer Street URA Carpark',
    address: '150 Telok Ayer Street, Singapore 068608',
    agency: 'URA',
    region: 'Central/CBD',
    coordinates: { lat: 1.2809, lng: 103.8480 },
    lots: {
      car: { total: 95, available: 3, occupied: 92 },
      motorcycle: { total: 20, available: 4, occupied: 16 }
    },
    rates: {
      weekdayPeak: '$1.40 per 30 mins (07:00 - 17:00)',
      weekdayOffPeak: '$0.70 per 30 mins',
      weekend: '$0.70 per 30 mins',
      gracePeriodMinutes: 15,
      freeParkingInfo: 'Free parking on Sundays 07:00 - 22:30'
    },
    evCharging: {
      available: false
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 4.5,
    lastUpdated: 'Just now',
    trend: 'stable',
    deltaChange: 0,
    hourlyOccupancyTrend: [10, 5, 5, 5, 12, 35, 75, 95, 98, 97, 95, 92, 90, 95, 96, 85, 60, 45, 30, 20, 15, 10, 10, 10]
  },
  {
    id: 'URA_ALBERT',
    code: 'ALB01',
    name: 'Albert Centre Multi-Storey Carpark (Bugis)',
    address: '270 Queen Street, Singapore 180270',
    agency: 'URA',
    region: 'Central/CBD',
    coordinates: { lat: 1.3005, lng: 103.8542 },
    lots: {
      car: { total: 280, available: 45, occupied: 235 },
      motorcycle: { total: 40, available: 11, occupied: 29 }
    },
    rates: {
      weekdayPeak: '$1.20 per 30 mins (07:00 - 17:00)',
      weekdayOffPeak: '$0.60 per 30 mins (17:00 - 22:30)',
      weekend: '$0.60 per 30 mins',
      gracePeriodMinutes: 15,
      freeParkingInfo: 'Free parking on Sundays 07:00 - 22:30'
    },
    evCharging: {
      available: true,
      chargerCount: 2,
      network: 'SP Mobility (22kW AC)'
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: '1m ago',
    trend: 'increasing',
    deltaChange: +2,
    hourlyOccupancyTrend: [15, 10, 8, 8, 15, 30, 55, 75, 85, 90, 92, 88, 85, 87, 90, 92, 88, 80, 70, 55, 40, 30, 22, 18]
  },

  // 4. Commercial / Bugis & Marina
  {
    id: 'MALL_BUGIS_JUNCTION',
    code: 'BJ01',
    name: 'Bugis Junction Basement Carpark',
    address: '200 Victoria Street, Singapore 188021',
    agency: 'Commercial',
    region: 'Central/CBD',
    coordinates: { lat: 1.2998, lng: 103.8554 },
    lots: {
      car: { total: 640, available: 184, occupied: 456 },
      motorcycle: { total: 50, available: 16, occupied: 34 }
    },
    rates: {
      weekdayPeak: '$2.20 1st hr, $0.60/subsequent 15m (08:00 - 17:59)',
      weekdayOffPeak: '$3.50 per entry after 18:00',
      weekend: '$2.50 1st 2 hrs, $0.60/subsequent 15m',
      gracePeriodMinutes: 10
    },
    evCharging: {
      available: true,
      chargerCount: 4,
      network: 'Charge+',
      fastCharger: true
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.0,
    lastUpdated: 'Just now',
    trend: 'decreasing',
    deltaChange: -4,
    hourlyOccupancyTrend: [18, 12, 8, 8, 10, 18, 30, 50, 68, 75, 82, 85, 80, 78, 82, 85, 88, 86, 76, 62, 45, 32, 25, 20]
  },
  {
    id: 'MALL_VIVOCITY',
    code: 'VIVO01',
    name: 'VivoCity Multi-Storey Carpark (HarbourFront)',
    address: '1 HarbourFront Walk, Singapore 098585',
    agency: 'Commercial',
    region: 'South',
    coordinates: { lat: 1.2644, lng: 103.8222 },
    lots: {
      car: { total: 2150, available: 712, occupied: 1438 },
      motorcycle: { total: 180, available: 62, occupied: 118 }
    },
    rates: {
      weekdayPeak: '$1.60 1st hr, $0.80/subsequent 30m (07:00 - 18:00)',
      weekdayOffPeak: '$3.50 per entry after 18:00',
      weekend: '$1.80 1st hr, $0.90/subsequent 30m',
      gracePeriodMinutes: 10
    },
    evCharging: {
      available: true,
      chargerCount: 8,
      network: 'CDG ENGIE (60kW DC Fast)',
      fastCharger: true
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: '2m ago',
    trend: 'increasing',
    deltaChange: +8,
    hourlyOccupancyTrend: [15, 10, 8, 6, 8, 14, 25, 40, 55, 68, 75, 80, 82, 80, 83, 86, 88, 85, 78, 68, 50, 35, 25, 18]
  },
  {
    id: 'MALL_JEWEL',
    code: 'CAG_JWL',
    name: 'Jewel Changi Airport / T1 Carpark',
    address: '78 Airport Boulevard, Singapore 819666',
    agency: 'Commercial',
    region: 'East',
    coordinates: { lat: 1.3602, lng: 103.9897 },
    lots: {
      car: { total: 2500, available: 940, occupied: 1560 },
      motorcycle: { total: 150, available: 58, occupied: 92 }
    },
    rates: {
      weekdayPeak: '$0.04 per min ($2.40/hr) (General Parking B3-B5)',
      weekdayOffPeak: '$0.04 per min ($2.40/hr)',
      weekend: '$0.04 per min ($2.40/hr)',
      gracePeriodMinutes: 10,
      nightParkingCap: 'Short-term B2M: $5 for 1st 90m then $5/30m'
    },
    evCharging: {
      available: true,
      chargerCount: 14,
      network: 'SP Mobility & Shell Recharge',
      fastCharger: true
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: 'Just now',
    trend: 'stable',
    deltaChange: 0,
    hourlyOccupancyTrend: [30, 25, 20, 18, 22, 35, 50, 62, 70, 75, 78, 82, 80, 82, 85, 86, 88, 85, 80, 72, 60, 50, 42, 35]
  },

  // 5. Jurong East / West
  {
    id: 'MALL_JEM',
    code: 'JEM01',
    name: 'jem Shopping Mall Carpark',
    address: '50 Jurong Gateway Road, Singapore 608549',
    agency: 'Commercial',
    region: 'West',
    coordinates: { lat: 1.3331, lng: 103.7436 },
    lots: {
      car: { total: 680, available: 165, occupied: 515 },
      motorcycle: { total: 45, available: 14, occupied: 31 }
    },
    rates: {
      weekdayPeak: '$1.95 1st hr, $0.55/subsequent 15m (06:00 - 18:00)',
      weekdayOffPeak: '$3.30 per entry after 18:00',
      weekend: '$2.30 1st hr, $0.60/subsequent 15m',
      gracePeriodMinutes: 10
    },
    evCharging: {
      available: true,
      chargerCount: 4,
      network: 'SP Mobility',
      fastCharger: false
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: '1m ago',
    trend: 'decreasing',
    deltaChange: -3,
    hourlyOccupancyTrend: [10, 5, 5, 5, 8, 15, 30, 55, 70, 80, 88, 92, 88, 84, 86, 89, 94, 90, 80, 62, 45, 30, 20, 15]
  },
  {
    id: 'MALL_WESTGATE',
    code: 'WG01',
    name: 'Westgate Shopping Centre Carpark',
    address: '3 Gateway Drive, Singapore 608532',
    agency: 'Commercial',
    region: 'West',
    coordinates: { lat: 1.3344, lng: 103.7424 },
    lots: {
      car: { total: 610, available: 198, occupied: 412 },
      motorcycle: { total: 40, available: 12, occupied: 28 }
    },
    rates: {
      weekdayPeak: '$1.95 1st hr, $0.55/subsequent 15m',
      weekdayOffPeak: '$3.30 per entry after 18:00',
      weekend: '$2.30 1st hr, $0.60/subsequent 15m',
      gracePeriodMinutes: 10
    },
    evCharging: {
      available: true,
      chargerCount: 4,
      network: 'Shell Recharge',
      fastCharger: true
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: 'Just now',
    trend: 'increasing',
    deltaChange: +2,
    hourlyOccupancyTrend: [12, 6, 5, 5, 10, 18, 35, 60, 72, 82, 85, 90, 86, 82, 84, 88, 92, 88, 78, 60, 42, 28, 18, 14]
  },

  // 6. HDB Heartlands (Central, North, East, West)
  {
    id: 'HDB_TP21',
    code: 'TP21',
    name: 'Blk 210-215 Toa Payoh Lorong 8 (MSCP)',
    address: '212 Toa Payoh Lorong 8, Singapore 310212',
    agency: 'HDB',
    region: 'Central/CBD',
    coordinates: { lat: 1.3394, lng: 103.8562 },
    lots: {
      car: { total: 420, available: 94, occupied: 326 },
      motorcycle: { total: 60, available: 22, occupied: 38 },
      heavyVehicle: { total: 15, available: 3, occupied: 12 }
    },
    rates: {
      weekdayPeak: '$0.60 per 30 mins (07:00 - 17:00)',
      weekdayOffPeak: '$0.60 per 30 mins (17:00 - 22:30)',
      weekend: '$0.60 per 30 mins',
      gracePeriodMinutes: 15,
      freeParkingInfo: 'Free parking on Sundays & Public Holidays 07:00 - 22:30',
      nightParkingCap: '$5.00 max cap (22:30 - 07:00)'
    },
    evCharging: {
      available: true,
      chargerCount: 2,
      network: 'CDG ENGIE (22kW AC)',
      fastCharger: false
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.15,
    lastUpdated: 'Just now',
    trend: 'stable',
    deltaChange: 0,
    hourlyOccupancyTrend: [75, 78, 80, 80, 78, 70, 50, 35, 30, 32, 35, 38, 35, 34, 36, 40, 55, 70, 80, 82, 80, 78, 76, 75]
  },
  {
    id: 'HDB_BISHAN',
    code: 'BS22',
    name: 'Blk 212-218 Bishan Street 23 (MSCP)',
    address: '215 Bishan Street 23, Singapore 570215',
    agency: 'HDB',
    region: 'Central/CBD',
    coordinates: { lat: 1.3575, lng: 103.8492 },
    lots: {
      car: { total: 380, available: 52, occupied: 328 },
      motorcycle: { total: 45, available: 16, occupied: 29 }
    },
    rates: {
      weekdayPeak: '$0.60 per 30 mins',
      weekdayOffPeak: '$0.60 per 30 mins',
      weekend: '$0.60 per 30 mins',
      gracePeriodMinutes: 15,
      freeParkingInfo: 'Free parking on Sundays 07:00 - 22:30',
      nightParkingCap: '$5.00 max cap'
    },
    evCharging: {
      available: true,
      chargerCount: 3,
      network: 'SP Mobility (22kW AC)'
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: '1m ago',
    trend: 'decreasing',
    deltaChange: -2,
    hourlyOccupancyTrend: [80, 82, 85, 85, 80, 68, 45, 30, 28, 30, 34, 36, 35, 35, 38, 45, 60, 75, 82, 85, 84, 82, 80, 80]
  },
  {
    id: 'HDB_TAMPINES',
    code: 'TM42',
    name: 'Blk 503-512 Tampines Central 1 (MSCP)',
    address: '506 Tampines Central 1, Singapore 520506',
    agency: 'HDB',
    region: 'East',
    coordinates: { lat: 1.3532, lng: 103.9452 },
    lots: {
      car: { total: 560, available: 112, occupied: 448 },
      motorcycle: { total: 80, available: 31, occupied: 49 }
    },
    rates: {
      weekdayPeak: '$0.60 per 30 mins',
      weekdayOffPeak: '$0.60 per 30 mins',
      weekend: '$0.60 per 30 mins',
      gracePeriodMinutes: 15,
      freeParkingInfo: 'Free parking on Sundays 07:00 - 22:30',
      nightParkingCap: '$5.00 max cap'
    },
    evCharging: {
      available: true,
      chargerCount: 4,
      network: 'Charge+ (22kW AC)'
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: 'Just now',
    trend: 'increasing',
    deltaChange: +4,
    hourlyOccupancyTrend: [70, 75, 78, 80, 75, 60, 40, 45, 55, 60, 65, 70, 68, 65, 68, 72, 78, 80, 78, 76, 74, 72, 70, 70]
  },
  {
    id: 'HDB_BEDOK',
    code: 'BK18',
    name: 'Blk 207-212 Bedok North Street 1',
    address: '209 Bedok North Street 1, Singapore 460209',
    agency: 'HDB',
    region: 'East',
    coordinates: { lat: 1.3258, lng: 103.9314 },
    lots: {
      car: { total: 310, available: 28, occupied: 282 },
      motorcycle: { total: 35, available: 9, occupied: 26 }
    },
    rates: {
      weekdayPeak: '$0.60 per 30 mins',
      weekdayOffPeak: '$0.60 per 30 mins',
      weekend: '$0.60 per 30 mins',
      gracePeriodMinutes: 15,
      freeParkingInfo: 'Free parking on Sundays 07:00 - 22:30'
    },
    evCharging: {
      available: false
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.0,
    lastUpdated: '2m ago',
    trend: 'decreasing',
    deltaChange: -1,
    hourlyOccupancyTrend: [78, 80, 82, 82, 78, 65, 45, 38, 42, 50, 60, 70, 65, 60, 62, 68, 76, 82, 85, 84, 82, 80, 79, 78]
  },
  {
    id: 'HDB_JURONG_WEST',
    code: 'JW42',
    name: 'Blk 440-449 Jurong West Avenue 1 (MSCP)',
    address: '442 Jurong West Avenue 1, Singapore 640442',
    agency: 'HDB',
    region: 'West',
    coordinates: { lat: 1.3512, lng: 103.7196 },
    lots: {
      car: { total: 490, available: 178, occupied: 312 },
      motorcycle: { total: 70, available: 25, occupied: 45 },
      heavyVehicle: { total: 20, available: 6, occupied: 14 }
    },
    rates: {
      weekdayPeak: '$0.60 per 30 mins',
      weekdayOffPeak: '$0.60 per 30 mins',
      weekend: '$0.60 per 30 mins',
      gracePeriodMinutes: 15,
      freeParkingInfo: 'Free parking on Sundays 07:00 - 22:30'
    },
    evCharging: {
      available: true,
      chargerCount: 2,
      network: 'CDG ENGIE'
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.15,
    lastUpdated: 'Just now',
    trend: 'stable',
    deltaChange: 0,
    hourlyOccupancyTrend: [82, 85, 88, 88, 85, 70, 50, 32, 28, 30, 35, 38, 36, 35, 38, 45, 60, 75, 82, 86, 85, 84, 83, 82]
  },
  {
    id: 'HDB_WOODLANDS',
    code: 'WL82',
    name: 'Blk 845-852 Woodlands Street 82 (MSCP)',
    address: '848 Woodlands Street 82, Singapore 730848',
    agency: 'HDB',
    region: 'North',
    coordinates: { lat: 1.4428, lng: 103.7915 },
    lots: {
      car: { total: 520, available: 215, occupied: 305 },
      motorcycle: { total: 60, available: 28, occupied: 32 }
    },
    rates: {
      weekdayPeak: '$0.60 per 30 mins',
      weekdayOffPeak: '$0.60 per 30 mins',
      weekend: '$0.60 per 30 mins',
      gracePeriodMinutes: 15,
      freeParkingInfo: 'Free parking on Sundays 07:00 - 22:30'
    },
    evCharging: {
      available: true,
      chargerCount: 3,
      network: 'SP Mobility'
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.15,
    lastUpdated: '3m ago',
    trend: 'increasing',
    deltaChange: +3,
    hourlyOccupancyTrend: [85, 88, 90, 90, 85, 65, 42, 28, 25, 28, 32, 35, 34, 32, 35, 42, 60, 78, 86, 88, 87, 86, 85, 85]
  },
  {
    id: 'HDB_AMK',
    code: 'AMK71',
    name: 'Blk 710-716 Ang Mo Kio Avenue 8 (Central)',
    address: '712 Ang Mo Kio Avenue 8, Singapore 560712',
    agency: 'HDB',
    region: 'North',
    coordinates: { lat: 1.3702, lng: 103.8475 },
    lots: {
      car: { total: 390, available: 18, occupied: 372 },
      motorcycle: { total: 40, available: 8, occupied: 32 }
    },
    rates: {
      weekdayPeak: '$0.60 per 30 mins',
      weekdayOffPeak: '$0.60 per 30 mins',
      weekend: '$0.60 per 30 mins',
      gracePeriodMinutes: 15,
      freeParkingInfo: 'Free parking on Sundays 07:00 - 22:30'
    },
    evCharging: {
      available: false
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: 'Just now',
    trend: 'decreasing',
    deltaChange: -1,
    hourlyOccupancyTrend: [75, 78, 80, 80, 75, 60, 48, 65, 78, 85, 90, 94, 92, 88, 90, 92, 95, 92, 85, 80, 78, 76, 75, 75]
  },

  // 7. LTA Park & Ride / Border / Transit Hubs
  {
    id: 'LTA_WOODLANDS_CP',
    code: 'WLC01',
    name: 'Woodlands Checkpoint Heavy & Car Park',
    address: 'Woodlands Crossing, Singapore 738203',
    agency: 'LTA',
    region: 'North',
    coordinates: { lat: 1.4445, lng: 103.7690 },
    lots: {
      car: { total: 480, available: 24, occupied: 456 },
      motorcycle: { total: 300, available: 42, occupied: 258 },
      heavyVehicle: { total: 80, available: 12, occupied: 68 }
    },
    rates: {
      weekdayPeak: '$0.90 1st hr, $0.90/subsequent 30m',
      weekdayOffPeak: '$0.90 per hr',
      weekend: '$0.90 per hr',
      gracePeriodMinutes: 10
    },
    evCharging: {
      available: false
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 4.5,
    lastUpdated: 'Just now',
    trend: 'decreasing',
    deltaChange: -2,
    hourlyOccupancyTrend: [60, 50, 45, 40, 55, 75, 88, 92, 95, 94, 90, 88, 85, 88, 90, 94, 96, 95, 90, 82, 75, 70, 65, 60]
  },
  {
    id: 'LTA_JE_PR',
    code: 'JEPR01',
    name: 'Jurong East Park & Ride Temporary Carpark',
    address: 'Jurong Gateway Road / Venture Drive, Singapore 608531',
    agency: 'LTA',
    region: 'West',
    coordinates: { lat: 1.3320, lng: 103.7445 },
    lots: {
      car: { total: 320, available: 110, occupied: 210 },
      motorcycle: { total: 50, available: 20, occupied: 30 }
    },
    rates: {
      weekdayPeak: '$0.60 per 30 mins (07:00 - 19:00)',
      weekdayOffPeak: '$0.60 per entry (19:00 - 07:00)',
      weekend: '$0.60 per 30 mins',
      gracePeriodMinutes: 15
    },
    evCharging: {
      available: false
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 4.2,
    lastUpdated: '1m ago',
    trend: 'increasing',
    deltaChange: +5,
    hourlyOccupancyTrend: [20, 15, 10, 8, 20, 55, 85, 92, 95, 90, 85, 80, 78, 80, 82, 75, 55, 40, 30, 25, 22, 20, 20, 20]
  },
  {
    id: 'COMM_NEX',
    code: 'NEX01',
    name: 'NEX Shopping Mall Carpark (Serangoon Central)',
    address: '23 Serangoon Central, Singapore 556083',
    agency: 'Commercial',
    region: 'Central/CBD',
    coordinates: { lat: 1.3506, lng: 103.8728 },
    lots: {
      car: { total: 530, available: 72, occupied: 458 },
      motorcycle: { total: 40, available: 15, occupied: 25 }
    },
    rates: {
      weekdayPeak: '$1.50 1st hr, $0.45/subsequent 15m (07:00 - 18:00)',
      weekdayOffPeak: '$2.50 per entry after 18:00',
      weekend: '$1.70 1st hr, $0.55/subsequent 15m',
      gracePeriodMinutes: 10
    },
    evCharging: {
      available: true,
      chargerCount: 4,
      network: 'CDG ENGIE',
      fastCharger: true
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.1,
    lastUpdated: 'Just now',
    trend: 'decreasing',
    deltaChange: -2,
    hourlyOccupancyTrend: [15, 8, 5, 5, 10, 20, 35, 55, 72, 85, 90, 88, 84, 85, 88, 92, 94, 90, 80, 65, 45, 30, 22, 18]
  },
  {
    id: 'COMM_PLAZA_SING',
    code: 'PS01',
    name: 'Plaza Singapura Carpark (Dhoby Ghaut)',
    address: '68 Orchard Road, Singapore 238839',
    agency: 'Commercial',
    region: 'Orchard',
    coordinates: { lat: 1.3007, lng: 103.8453 },
    lots: {
      car: { total: 670, available: 125, occupied: 545 },
      motorcycle: { total: 55, available: 19, occupied: 36 }
    },
    rates: {
      weekdayPeak: '$1.95 1st hr, $0.55/subsequent 15m (00:00 - 17:59)',
      weekdayOffPeak: '$3.25 per entry (18:00 - 23:59)',
      weekend: '$2.60 1st 2 hrs, $0.55/subsequent 15m',
      gracePeriodMinutes: 10
    },
    evCharging: {
      available: true,
      chargerCount: 4,
      network: 'SP Mobility',
      fastCharger: true
    },
    gantryType: 'Electronic Parking System (EPS)',
    heightLimitMeters: 2.05,
    lastUpdated: '1m ago',
    trend: 'stable',
    deltaChange: 0,
    hourlyOccupancyTrend: [12, 8, 5, 5, 10, 18, 30, 52, 70, 80, 88, 90, 86, 84, 88, 92, 95, 92, 82, 65, 45, 30, 20, 15]
  }
];
