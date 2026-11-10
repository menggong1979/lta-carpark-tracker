export type CarparkAgency = 'HDB' | 'URA' | 'LTA' | 'Commercial';
export type CarparkRegion = 'Central/CBD' | 'Orchard' | 'Marina Bay' | 'North' | 'South' | 'East' | 'West';
export type VehicleType = 'car' | 'motorcycle' | 'heavyVehicle';

export interface LotAvailability {
  total: number;
  available: number;
  occupied: number;
}

export interface CarparkRates {
  weekdayPeak: string;
  weekdayOffPeak: string;
  weekend: string;
  gracePeriodMinutes: number;
  freeParkingInfo?: string;
  nightParkingCap?: string;
}

export interface EvChargingInfo {
  available: boolean;
  chargerCount?: number;
  network?: string; // e.g. "SP Mobility", "Shell Recharge", "CDG ENGIE"
  fastCharger?: boolean;
}

export interface Carpark {
  id: string;
  code: string; // e.g. "ACB", "TP21", "ION01", "MBS01"
  name: string;
  address: string;
  agency: CarparkAgency;
  region: CarparkRegion;
  coordinates: {
    lat: number;
    lng: number;
  };
  lots: {
    car: LotAvailability;
    motorcycle?: LotAvailability;
    heavyVehicle?: LotAvailability;
  };
  rates: CarparkRates;
  evCharging: EvChargingInfo;
  gantryType: 'Electronic Parking System (EPS)' | 'Automated Barrier' | 'Coupon Parking';
  heightLimitMeters: number;
  lastUpdated: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  deltaChange?: number; // recent change e.g. -2 or +3 lots
  hourlyOccupancyTrend: number[]; // 24 values representing % occupied 00:00 - 23:00
  distanceKm?: number;
  isFavorite?: boolean;
}

export interface FilterOptions {
  searchQuery: string;
  region: string;
  agency: string;
  vehicleType: VehicleType;
  availabilityFilter: 'all' | 'plentiful' | 'limited' | 'full';
  onlyEvCharging: boolean;
  onlyFreeSunday: boolean;
  minHeightClearance: number; // 0, 2.0, 4.0
  sortBy: 'distance' | 'availableLots' | 'rate' | 'name';
}

export interface UserLocation {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isGps?: boolean;
}

export interface BackendConfig {
  useMockSimulation: boolean;
  pollingIntervalSeconds: number;
  backendApiUrl: string;
  apiSource: 'mock' | 'lta_datamall' | 'custom_api';
  apiKey?: string;
}
