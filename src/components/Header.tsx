import { RefreshCw, Database, Heart, BookOpen, MapPin, Sparkles } from 'lucide-react';
import { UserLocation, BackendConfig } from '../types/carpark';
import { SINGAPORE_POPULAR_LOCATIONS } from '../data/singaporeCarparks';

interface HeaderProps {
  userLocation: UserLocation;
  onChangeUserLocation: (loc: UserLocation) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  liveSimulationActive: boolean;
  onToggleSimulation: () => void;
  backendConfig: BackendConfig;
  onOpenBackendModal: () => void;
  onOpenRateGuide: () => void;
  activeTab: 'all' | 'favorites';
  onChangeTab: (tab: 'all' | 'favorites') => void;
  favoriteCount: number;
}

export default function Header({
  userLocation,
  onChangeUserLocation,
  onRefresh,
  isRefreshing,
  liveSimulationActive,
  onToggleSimulation,
  backendConfig,
  onOpenBackendModal,
  onOpenRateGuide,
  activeTab,
  onChangeTab,
  favoriteCount
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
              SG
            </div>
            <div>
              <a href="/" className="text-base font-bold tracking-tight text-slate-900 hover:text-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                SG CarPark Live
              </a>
              <div className="text-[11px] text-slate-500 font-normal leading-none hidden sm:block">
                Singapore Real-Time Lot Availabilities
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onChangeTab('all')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                activeTab === 'all' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              All Carparks
            </button>
            <button
              onClick={() => onChangeTab('favorites')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'favorites' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoriteCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span>Favorites</span>
              {favoriteCount > 0 && (
                <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full">
                  {favoriteCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenRateGuide}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>SG Rate Guide</span>
            </button>
            <button
              onClick={onOpenBackendModal}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Backend API</span>
              <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {backendConfig.useMockSimulation ? 'Mock' : 'Custom'}
              </span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* User Location dropdown */}
            <div className="relative hidden lg:flex items-center">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                aria-label="Location selector"
                value={userLocation.name}
                onChange={(e) => {
                  const found = SINGAPORE_POPULAR_LOCATIONS.find((l) => l.name === e.target.value);
                  if (found) onChangeUserLocation(found);
                }}
                className="pl-8 pr-7 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/80 border border-transparent rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none cursor-pointer"
              >
                {SINGAPORE_POPULAR_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    Near {loc.name.split('(')[0].trim()}
                  </option>
                ))}
              </select>
              <span className="absolute right-2 pointer-events-none text-[10px] text-slate-400">▼</span>
            </div>

            {/* Simulation Toggle */}
            <button
              onClick={onToggleSimulation}
              title={liveSimulationActive ? 'Live lot turnover is running every 8s' : 'Simulation paused'}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                liveSimulationActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${liveSimulationActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{liveSimulationActive ? 'Live Polling ON' : 'Paused'}</span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60 whitespace-nowrap"
              title="Refresh lot counts"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
