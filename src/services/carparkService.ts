import { Carpark, FilterOptions, BackendConfig, VehicleType } from '../types/carpark';
import { INITIAL_CARPARKS } from '../data/singaporeCarparks';

const STORAGE_KEY_BACKEND_CONFIG = 'sg_carpark_backend_config';
const STORAGE_KEY_FAVORITES = 'sg_carpark_favorites';

export const DEFAULT_BACKEND_CONFIG: BackendConfig = {
  useMockSimulation: true,
  pollingIntervalSeconds: 15,
  backendApiUrl: '/api/v1/carparks',
  apiSource: 'mock',
  apiKey: ''
};

// Calculate Haversine distance in kilometers between two lat/lng coordinates
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function getStoredBackendConfig(): BackendConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_BACKEND_CONFIG);
    if (saved) {
      return { ...DEFAULT_BACKEND_CONFIG, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.warn('Failed to load backend config from localStorage', err);
  }
  return DEFAULT_BACKEND_CONFIG;
}

export function saveBackendConfig(config: BackendConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_BACKEND_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.warn('Failed to save backend config to localStorage', err);
  }
}

export function getStoredFavoriteIds(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Failed to load favorites from localStorage', err);
  }
  return ['MALL_ION', 'COMM_MBS', 'HDB_TP21'];
}

export function saveFavoriteIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(ids));
  } catch (err) {
    console.warn('Failed to save favorites to localStorage', err);
  }
}

/**
 * Simulates real-time parking lot turnover in Singapore
 * (cars leaving and entering based on realistic Poisson-like fluctuations)
 */
export function simulateFluctuations(carparks: Carpark[]): Carpark[] {
  return carparks.map((cp) => {
    // 50% chance of lots shifting slightly this tick
    if (Math.random() < 0.45) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 4 + 1);
      const currentAvail = cp.lots.car.available;
      const newAvail = Math.max(0, Math.min(cp.lots.car.total, currentAvail + delta));
      const actualDelta = newAvail - currentAvail;
      const newOccupied = cp.lots.car.total - newAvail;

      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (actualDelta > 0) trend = 'increasing';
      else if (actualDelta < 0) trend = 'decreasing';

      // Motorcycle subtle shift
      let updatedMoto = cp.lots.motorcycle;
      if (updatedMoto && Math.random() < 0.3) {
        const mDelta = Math.random() > 0.5 ? 1 : -1;
        const mAvail = Math.max(0, Math.min(updatedMoto.total, updatedMoto.available + mDelta));
        updatedMoto = {
          ...updatedMoto,
          available: mAvail,
          occupied: updatedMoto.total - mAvail
        };
      }

      return {
        ...cp,
        lots: {
          ...cp.lots,
          car: {
            ...cp.lots.car,
            available: newAvail,
            occupied: newOccupied
          },
          motorcycle: updatedMoto
        },
        deltaChange: actualDelta,
        trend,
        lastUpdated: 'Just now'
      };
    }
    return cp;
  });
}

/**
 * Filter & sort carparks
 */
export function filterAndSortCarparks(
  carparks: Carpark[],
  filters: FilterOptions,
  userLat: number,
  userLng: number
): Carpark[] {
  return carparks
    .map((cp) => ({
      ...cp,
      distanceKm: calculateDistanceKm(userLat, userLng, cp.coordinates.lat, cp.coordinates.lng)
    }))
    .filter((cp) => {
      // Search query (name, code, address, region)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = cp.name.toLowerCase().includes(query);
        const matchesCode = cp.code.toLowerCase().includes(query);
        const matchesAddress = cp.address.toLowerCase().includes(query);
        const matchesRegion = cp.region.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesAddress && !matchesRegion) {
          return false;
        }
      }

      // Region filter
      if (filters.region && filters.region !== 'all') {
        if (cp.region !== filters.region) return false;
      }

      // Agency filter
      if (filters.agency && filters.agency !== 'all') {
        if (cp.agency !== filters.agency) return false;
      }

      // Vehicle type lot availability check
      const vehicleLots =
        filters.vehicleType === 'motorcycle'
          ? cp.lots.motorcycle
          : filters.vehicleType === 'heavyVehicle'
          ? cp.lots.heavyVehicle
          : cp.lots.car;

      if (!vehicleLots) {
        return false; // Carpark doesn't support this vehicle type
      }

      // Availability filter
      if (filters.availabilityFilter === 'plentiful' && vehicleLots.available <= 50) {
        return false;
      }
      if (
        filters.availabilityFilter === 'limited' &&
        (vehicleLots.available === 0 || vehicleLots.available > 50)
      ) {
        return false;
      }
      if (filters.availabilityFilter === 'full' && vehicleLots.available > 0) {
        return false;
      }

      // EV Charging filter
      if (filters.onlyEvCharging && !cp.evCharging.available) {
        return false;
      }

      // Free Sunday parking filter
      if (filters.onlyFreeSunday && !cp.rates.freeParkingInfo) {
        return false;
      }

      // Height clearance
      if (filters.minHeightClearance > 0 && cp.heightLimitMeters < filters.minHeightClearance) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'distance') {
        return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
      }
      if (filters.sortBy === 'availableLots') {
        const aLots = getLotsForVehicle(a, filters.vehicleType);
        const bLots = getLotsForVehicle(b, filters.vehicleType);
        return bLots - aLots;
      }
      if (filters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (filters.sortBy === 'rate') {
        // HDB is generally cheapest
        const getRatePriority = (cp: Carpark) => {
          if (cp.agency === 'HDB') return 1;
          if (cp.agency === 'URA') return 2;
          if (cp.agency === 'LTA') return 3;
          return 4;
        };
        return getRatePriority(a) - getRatePriority(b);
      }
      return 0;
    });
}

export function getLotsForVehicle(cp: Carpark, vehicleType: VehicleType): number {
  if (vehicleType === 'motorcycle') {
    return cp.lots.motorcycle?.available ?? 0;
  }
  if (vehicleType === 'heavyVehicle') {
    return cp.lots.heavyVehicle?.available ?? 0;
  }
  return cp.lots.car.available;
}

export function getTotalLotsForVehicle(cp: Carpark, vehicleType: VehicleType): number {
  if (vehicleType === 'motorcycle') {
    return cp.lots.motorcycle?.total ?? 0;
  }
  if (vehicleType === 'heavyVehicle') {
    return cp.lots.heavyVehicle?.total ?? 0;
  }
  return cp.lots.car.total;
}

/**
 * Backend Service Adapter:
 * When user connects their real backend later, this method calls the configured URL
 * or falls back gracefully to mock simulation.
 */
export async function fetchLiveCarparks(config: BackendConfig): Promise<{
  carparks: Carpark[];
  source: 'mock' | 'custom_api';
  latencyMs: number;
  error?: string;
}> {
  const startTime = performance.now();

  if (config.useMockSimulation || !config.backendApiUrl) {
    return {
      carparks: INITIAL_CARPARKS,
      source: 'mock',
      latencyMs: Math.round(performance.now() - startTime)
    };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (config.apiKey) {
      headers['AccountKey'] = config.apiKey;
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(config.backendApiUrl, {
      method: 'GET',
      headers
    });

    const latencyMs = Math.round(performance.now() - startTime);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if user returned standard Carpark array or LTA DataMall payload
    let parsedCarparks: Carpark[] = [];

    if (Array.isArray(data)) {
      parsedCarparks = data;
    } else if (data.value && Array.isArray(data.value)) {
      // LTA DataMall format
      parsedCarparks = data.value.map((item: any, idx: number) => ({
        id: item.CarParkID || `CP_${idx}`,
        code: item.CarParkID || `CP_${idx}`,
        name: item.Development || `Carpark ${item.CarParkID}`,
        address: `${item.Area || 'Singapore'}, ${item.Development || ''}`,
        agency: (item.Agency as any) || 'LTA',
        region: 'Central/CBD',
        coordinates: item.Location
          ? {
              lat: parseFloat(item.Location.split(' ')[0]) || 1.3521,
              lng: parseFloat(item.Location.split(' ')[1]) || 103.8198
            }
          : { lat: 1.3521, lng: 103.8198 },
        lots: {
          car: {
            total: (item.AvailableLots || 0) + 50,
            available: item.AvailableLots || 0,
            occupied: 50
          }
        },
        rates: {
          weekdayPeak: '$1.20 / 30 mins',
          weekdayOffPeak: '$0.60 / 30 mins',
          weekend: '$0.60 / 30 mins',
          gracePeriodMinutes: 10
        },
        evCharging: { available: false },
        gantryType: 'Electronic Parking System (EPS)',
        heightLimitMeters: 2.1,
        lastUpdated: 'Live from API',
        trend: 'stable',
        hourlyOccupancyTrend: [40, 30, 20, 20, 25, 40, 60, 80, 85, 88, 85, 80, 80, 82, 85, 88, 85, 80, 70, 60, 50, 45, 42, 40]
      }));
    }

    return {
      carparks: parsedCarparks.length > 0 ? parsedCarparks : INITIAL_CARPARKS,
      source: 'custom_api',
      latencyMs
    };
  } catch (error: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      carparks: INITIAL_CARPARKS,
      source: 'mock',
      latencyMs,
      error: error.message || 'Failed to fetch from backend API'
    };
  }
}
