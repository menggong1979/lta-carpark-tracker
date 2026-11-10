/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import CarparkCard from './components/CarparkCard';
import CarparkTableView from './components/CarparkTableView';
import CarparkMap from './components/CarparkMap';
import CarparkDetailModal from './components/CarparkDetailModal';
import BackendConnectorModal from './components/BackendConnectorModal';
import RateGuideModal from './components/RateGuideModal';
import { INITIAL_CARPARKS, SINGAPORE_POPULAR_LOCATIONS } from './data/singaporeCarparks';
import {
  Carpark,
  FilterOptions,
  UserLocation,
  BackendConfig
} from './types/carpark';
import {
  filterAndSortCarparks,
  getLotsForVehicle,
  getTotalLotsForVehicle,
  simulateFluctuations,
  getStoredBackendConfig,
  getStoredFavoriteIds,
  saveFavoriteIds,
  fetchLiveCarparks
} from './services/carparkService';
import { MapPin, Navigation, Car, Heart, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [carparks, setCarparks] = useState<Carpark[]>(INITIAL_CARPARKS);
  const [userLocation, setUserLocation] = useState<UserLocation>(SINGAPORE_POPULAR_LOCATIONS[0]);
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(null);
  const [detailModalCarpark, setDetailModalCarpark] = useState<Carpark | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getStoredFavoriteIds);
  const [backendConfig, setBackendConfig] = useState<BackendConfig>(getStoredBackendConfig);
  const [liveSimulationActive, setLiveSimulationActive] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);
  const [isRateGuideOpen, setIsRateGuideOpen] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    region: 'all',
    agency: 'all',
    vehicleType: 'car',
    availabilityFilter: 'all',
    onlyEvCharging: false,
    onlyFreeSunday: false,
    minHeightClearance: 0,
    sortBy: 'distance'
  });

  // Favorite toggling
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      saveFavoriteIds(next);
      return next;
    });
  };

  // Real-time simulated turnover interval
  useEffect(() => {
    if (!liveSimulationActive) return;

    const interval = setInterval(() => {
      setCarparks((prev) => simulateFluctuations(prev));
    }, (backendConfig.pollingIntervalSeconds || 15) * 1000);

    return () => clearInterval(interval);
  }, [liveSimulationActive, backendConfig.pollingIntervalSeconds]);

  // Manual refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if (!backendConfig.useMockSimulation) {
      const result = await fetchLiveCarparks(backendConfig);
      setCarparks(result.carparks);
    } else {
      // Simulate live shift
      setCarparks((prev) => simulateFluctuations(prev));
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  }, [backendConfig]);

  // GPS User location detection
  const handleDetectGps = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Verify coordinates are approximately in Singapore area (Lat 1.15 to 1.48, Lng 103.55 to 104.1)
        if (latitude >= 1.15 && latitude <= 1.5 && longitude >= 103.5 && longitude <= 104.2) {
          setUserLocation({
            name: 'Current Device Location',
            coordinates: { lat: latitude, lng: longitude },
            isGps: true
          });
        } else {
          // If user is testing outside Singapore, inform them and place them at Orchard
          setGpsError(
            `Device GPS (${latitude.toFixed(2)}, ${longitude.toFixed(2)}) is outside Singapore. Centered on Orchard Road.`
          );
          setUserLocation(SINGAPORE_POPULAR_LOCATIONS[0]);
        }
      },
      (err) => {
        setGpsError('Could not obtain GPS permission. Defaulted to Orchard Road.');
      },
      { timeout: 8000 }
    );
  };

  // Filtered & sorted carparks
  const processedCarparks = useMemo(() => {
    let list = carparks;
    if (activeTab === 'favorites') {
      list = list.filter((cp) => favoriteIds.includes(cp.id));
    }
    return filterAndSortCarparks(
      list,
      filters,
      userLocation.coordinates.lat,
      userLocation.coordinates.lng
    );
  }, [carparks, activeTab, favoriteIds, filters, userLocation]);

  // Summary statistics for current view
  const stats = useMemo(() => {
    let totalAvail = 0;
    let totalCapacity = 0;

    processedCarparks.forEach((cp) => {
      totalAvail += getLotsForVehicle(cp, filters.vehicleType);
      totalCapacity += getTotalLotsForVehicle(cp, filters.vehicleType);
    });

    const percentFree = totalCapacity > 0 ? Math.round((totalAvail / totalCapacity) * 100) : 0;
    const nearest = processedCarparks[0];

    return {
      totalAvail,
      totalCapacity,
      percentFree,
      nearestName: nearest ? nearest.name : 'None',
      nearestLots: nearest ? getLotsForVehicle(nearest, filters.vehicleType) : 0,
      nearestDistance: nearest ? nearest.distanceKm : 0
    };
  }, [processedCarparks, filters.vehicleType]);

  // Handler for adjusting test lots in detail modal
  const handleAdjustLots = (carparkId: string, delta: number) => {
    setCarparks((prev) =>
      prev.map((cp) => {
        if (cp.id === carparkId) {
          const currentAvail = cp.lots.car.available;
          const newAvail = Math.max(0, Math.min(cp.lots.car.total, currentAvail + delta));
          const actualDelta = newAvail - currentAvail;
          const updated = {
            ...cp,
            lots: {
              ...cp.lots,
              car: {
                ...cp.lots.car,
                available: newAvail,
                occupied: cp.lots.car.total - newAvail
              }
            },
            deltaChange: actualDelta,
            trend: (actualDelta > 0 ? 'increasing' : actualDelta < 0 ? 'decreasing' : 'stable') as any,
            lastUpdated: 'Just now'
          };
          if (detailModalCarpark?.id === carparkId) {
            setDetailModalCarpark(updated);
          }
          return updated;
        }
        return cp;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Top Bar */}
      <Header
        userLocation={userLocation}
        onChangeUserLocation={setUserLocation}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        liveSimulationActive={liveSimulationActive}
        onToggleSimulation={() => setLiveSimulationActive((prev) => !prev)}
        backendConfig={backendConfig}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        onOpenRateGuide={() => setIsRateGuideOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        favoriteCount={favoriteIds.length}
      />

      {/* Filter Toolbar */}
      <FilterBar
        filters={filters}
        onChangeFilters={setFilters}
        totalCount={carparks.length}
        filteredCount={processedCarparks.length}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />

      {/* Metric Strip & GPS Indicator */}
      <div className="bg-slate-100/70 border-b border-slate-200 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Quick Metrics */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Available ({filters.vehicleType}):</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                {stats.totalAvail.toLocaleString()}
              </span>
              <span className="text-slate-400 font-mono">/ {stats.totalCapacity.toLocaleString()} lots</span>
            </div>

            <div className="hidden sm:inline text-slate-300">|</div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Overall Availability:</span>
              <span className="font-semibold text-emerald-700 font-mono tabular-nums">
                {stats.percentFree}% Free
              </span>
            </div>

            <div className="hidden md:inline text-slate-300">|</div>

            <div className="hidden md:flex items-center gap-1.5 text-slate-600 truncate max-w-sm">
              <span className="text-slate-500">Nearest:</span>
              <span className="font-medium text-slate-900 truncate">{stats.nearestName}</span>
              <span className="font-mono text-blue-600">({stats.nearestLots} lots · {stats.nearestDistance} km)</span>
            </div>
          </div>

          {/* Reference User Location & GPS Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Reference point:</span>
              <span className="font-semibold text-slate-800">{userLocation.name}</span>
            </span>

            <button
              onClick={handleDetectGps}
              className="px-2 py-1 bg-white hover:bg-slate-200/80 border border-slate-300 text-slate-700 font-medium rounded text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
              title="Use your device GPS"
            >
              <Navigation className="w-3 h-3 text-blue-600" />
              <span>Detect GPS</span>
            </button>
          </div>
        </div>

        {gpsError && (
          <div className="max-w-7xl mx-auto mt-1 text-[11px] text-amber-800 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Tab Empty States */}
        {activeTab === 'favorites' && processedCarparks.length === 0 && (
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No Favorite Carparks Saved</h3>
            <p className="text-xs text-slate-500 mb-4">
              Click the heart icon on any carpark card or map popup to bookmark it for rapid lot checking.
            </p>
            <button
              onClick={() => setActiveTab('all')}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Explore All Carparks
            </button>
          </div>
        )}

        {/* View Mode 1: Split View (Map on Left/Top + Cards on Right/Bottom) */}
        {viewMode === 'split' && processedCarparks.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Map Column (sticky on desktop) */}
            <div className="lg:col-span-6 lg:sticky lg:top-24 h-[420px] lg:h-[calc(100vh-140px)] rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <CarparkMap
                carparks={processedCarparks}
                selectedCarpark={selectedCarpark}
                onSelectCarpark={(cp) => {
                  setSelectedCarpark(cp);
                  setDetailModalCarpark(cp);
                }}
                userLocation={userLocation}
                vehicleType={filters.vehicleType}
              />
            </div>

            {/* Cards List Column */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                <span>
                  Sorted by <strong className="text-slate-800 capitalize">{filters.sortBy}</strong>
                </span>
                <span>Click card to view details &amp; tariffs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                {processedCarparks.map((cp) => (
                  <CarparkCard
                    key={cp.id}
                    carpark={cp}
                    vehicleType={filters.vehicleType}
                    isSelected={selectedCarpark?.id === cp.id}
                    onSelect={(targetCp) => {
                      setSelectedCarpark(targetCp);
                      setDetailModalCarpark(targetCp);
                    }}
                    isFavorite={favoriteIds.includes(cp.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Full Map View */}
        {viewMode === 'map' && processedCarparks.length > 0 && (
          <div className="h-[calc(100vh-210px)] min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative">
            <CarparkMap
              carparks={processedCarparks}
              selectedCarpark={selectedCarpark}
              onSelectCarpark={(cp) => {
                setSelectedCarpark(cp);
                setDetailModalCarpark(cp);
              }}
              userLocation={userLocation}
              vehicleType={filters.vehicleType}
            />

            {/* Floating Quick Drawer on bottom if carpark is selected */}
            {selectedCarpark && (
              <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 z-20 bg-white border border-slate-200 rounded-xl shadow-lg p-3 animate-in fade-in slide-in-from-bottom-2">
                <CarparkCard
                  carpark={selectedCarpark}
                  vehicleType={filters.vehicleType}
                  isSelected={true}
                  onSelect={(targetCp) => setDetailModalCarpark(targetCp)}
                  isFavorite={favoriteIds.includes(selectedCarpark.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            )}
          </div>
        )}

        {/* View Mode 3: Dense Table / Spreadsheet View */}
        {viewMode === 'list' && (
          <CarparkTableView
            carparks={processedCarparks}
            vehicleType={filters.vehicleType}
            selectedCarpark={selectedCarpark}
            onSelectCarpark={(cp) => {
              setSelectedCarpark(cp);
              setDetailModalCarpark(cp);
            }}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      {/* Detail Modal */}
      <CarparkDetailModal
        carpark={detailModalCarpark}
        onClose={() => setDetailModalCarpark(null)}
        isFavorite={detailModalCarpark ? favoriteIds.includes(detailModalCarpark.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAdjustLots={handleAdjustLots}
      />

      {/* Backend Integration Hub Modal */}
      <BackendConnectorModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        config={backendConfig}
        onUpdateConfig={(cfg) => {
          setBackendConfig(cfg);
          handleRefresh();
        }}
      />

      {/* Rate Guide Modal */}
      <RateGuideModal
        isOpen={isRateGuideOpen}
        onClose={() => setIsRateGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SG CarPark Live</span>
            <span>·</span>
            <span>Real-time availability tracker for Singapore motorists</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setIsRateGuideOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Rate Guide
            </button>
            <span>·</span>
            <button
              onClick={() => setIsBackendModalOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Backend API Connect
            </button>
            <span>·</span>
            <a
              href="https://datamall.lta.gov.sg"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              LTA DataMall
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
