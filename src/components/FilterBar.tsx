import { Search, X, Zap, Calendar, SlidersHorizontal, Map, LayoutList, Columns } from 'lucide-react';
import { FilterOptions, VehicleType } from '../types/carpark';

interface FilterBarProps {
  filters: FilterOptions;
  onChangeFilters: (filters: FilterOptions) => void;
  totalCount: number;
  filteredCount: number;
  viewMode: 'split' | 'map' | 'list';
  onChangeViewMode: (mode: 'split' | 'map' | 'list') => void;
}

export default function FilterBar({
  filters,
  onChangeFilters,
  totalCount,
  filteredCount,
  viewMode,
  onChangeViewMode
}: FilterBarProps) {
  const regions = [
    { id: 'all', label: 'All Singapore' },
    { id: 'Central/CBD', label: 'Central / CBD' },
    { id: 'Orchard', label: 'Orchard' },
    { id: 'Marina Bay', label: 'Marina Bay' },
    { id: 'East', label: 'East' },
    { id: 'West', label: 'West' },
    { id: 'North', label: 'North' },
    { id: 'South', label: 'South' }
  ];

  const agencies = [
    { id: 'all', label: 'All Operators' },
    { id: 'HDB', label: 'HDB' },
    { id: 'URA', label: 'URA' },
    { id: 'Commercial', label: 'Malls / Commercial' },
    { id: 'LTA', label: 'LTA' }
  ];

  const vehicleTypes: { id: VehicleType; label: string }[] = [
    { id: 'car', label: 'Cars' },
    { id: 'motorcycle', label: 'Motorcycles' },
    { id: 'heavyVehicle', label: 'Heavy Vehicles' }
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Row 1: Search, Vehicle Type Segmented Control, View Mode Switch */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by carpark name, road, HDB block, or code (e.g. ION01, TP21, Smith St)..."
              value={filters.searchQuery}
              onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Vehicle Type Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            {vehicleTypes.map((vt) => (
              <button
                key={vt.id}
                onClick={() => onChangeFilters({ ...filters, vehicleType: vt.id })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  filters.vehicleType === vt.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {vt.label}
              </button>
            ))}
          </div>

          {/* View Mode Switch */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => onChangeViewMode('split')}
              title="Split View (Map + List)"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeViewMode('map')}
              title="Map View Only"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeViewMode('list')}
              title="Dense List View"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Region Tabs, Operator, Availability, Features, and Sort */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Region Tabs (horizontal scrollable on mobile) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full sm:max-w-none no-scrollbar">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => onChangeFilters({ ...filters, region: r.id })}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filters.region === r.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Quick Filter Pill-Free Buttons and Dropdowns */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Operator Select */}
            <select
              aria-label="Operator filter"
              value={filters.agency}
              onChange={(e) => onChangeFilters({ ...filters, agency: e.target.value })}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 border border-transparent rounded-md text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              {agencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>

            {/* Lot Availability Filter */}
            <select
              aria-label="Availability filter"
              value={filters.availabilityFilter}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  availabilityFilter: e.target.value as any
                })
              }
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 border border-transparent rounded-md text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Lot Statuses</option>
              <option value="plentiful">Plentiful (&gt; 50 lots)</option>
              <option value="limited">Limited (1 – 50 lots)</option>
              <option value="full">Full (0 lots)</option>
            </select>

            {/* EV Charging Toggle */}
            <button
              onClick={() => onChangeFilters({ ...filters, onlyEvCharging: !filters.onlyEvCharging })}
              className={`px-2.5 py-1 rounded-md font-medium border flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                filters.onlyEvCharging
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${filters.onlyEvCharging ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>EV Charging</span>
            </button>

            {/* Free Sunday Parking Toggle */}
            <button
              onClick={() => onChangeFilters({ ...filters, onlyFreeSunday: !filters.onlyFreeSunday })}
              className={`px-2.5 py-1 rounded-md font-medium border flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                filters.onlyFreeSunday
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${filters.onlyFreeSunday ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>Free Sunday/PH</span>
            </button>

            {/* Sort by */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <span className="text-slate-400 text-xs hidden lg:inline">Sort:</span>
              <select
                aria-label="Sort carparks by"
                value={filters.sortBy}
                onChange={(e) => onChangeFilters({ ...filters, sortBy: e.target.value as any })}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200/80 border border-transparent rounded-md text-slate-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="distance">Distance (Nearest)</option>
                <option value="availableLots">Available Lots (Most)</option>
                <option value="rate">Rate Priority (HDB first)</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Result Counter & Active Filter Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div>
            Showing <span className="font-semibold text-slate-800 font-mono tabular-nums">{filteredCount}</span> of{' '}
            <span className="font-mono tabular-nums">{totalCount}</span> tracked Singapore carparks
          </div>

          {(filters.searchQuery ||
            filters.region !== 'all' ||
            filters.agency !== 'all' ||
            filters.availabilityFilter !== 'all' ||
            filters.onlyEvCharging ||
            filters.onlyFreeSunday) && (
            <button
              onClick={() =>
                onChangeFilters({
                  searchQuery: '',
                  region: 'all',
                  agency: 'all',
                  vehicleType: filters.vehicleType,
                  availabilityFilter: 'all',
                  onlyEvCharging: false,
                  onlyFreeSunday: false,
                  minHeightClearance: 0,
                  sortBy: 'distance'
                })
              }
              className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
