import { Heart, Navigation, Zap, ShieldCheck } from 'lucide-react';
import { Carpark, VehicleType } from '../types/carpark';
import { getLotsForVehicle, getTotalLotsForVehicle } from '../services/carparkService';

interface CarparkCardProps {
  carpark: Carpark;
  vehicleType: VehicleType;
  isSelected: boolean;
  onSelect: (carpark: Carpark) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function CarparkCard({
  carpark,
  vehicleType,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite
}: CarparkCardProps) {
  const availableLots = getLotsForVehicle(carpark, vehicleType);
  const totalLots = getTotalLotsForVehicle(carpark, vehicleType);
  const percentAvailable = totalLots > 0 ? Math.round((availableLots / totalLots) * 100) : 0;

  // Status color logic
  let lotColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let barColor = 'bg-emerald-500';
  let statusText = 'Plentiful Lots';

  if (availableLots === 0) {
    lotColor = 'text-rose-700 bg-rose-50 border-rose-200';
    barColor = 'bg-rose-500';
    statusText = 'Carpark Full';
  } else if (availableLots < 15) {
    lotColor = 'text-amber-700 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
    statusText = 'Filling Fast';
  }

  return (
    <div
      onClick={() => onSelect(carpark)}
      className={`group relative bg-white border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-md'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {/* Top Header: Unboxed Metadata Kicker + Favorite Button */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="font-semibold text-slate-800">{carpark.agency}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-slate-600">{carpark.code}</span>
          <span aria-hidden="true">·</span>
          <span>{carpark.region}</span>
          {carpark.distanceKm !== undefined && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-medium text-blue-600">{carpark.distanceKm} km</span>
            </>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(carpark.id);
          }}
          className="p-1 rounded-full text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
          title={isFavorite ? 'Remove from favorites' : 'Save as favorite'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Carpark Title */}
      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-1">
        {carpark.name}
      </h3>
      <p className="text-xs text-slate-500 line-clamp-1 mb-3">{carpark.address}</p>

      {/* Lot Availability Hero Metric */}
      <div className={`p-3 rounded-lg border mb-3 flex items-center justify-between ${lotColor}`}>
        <div>
          <div className="text-[11px] font-medium tracking-wide uppercase opacity-80">
            Available Lots ({vehicleType === 'car' ? 'Car' : vehicleType === 'motorcycle' ? 'Motorcycle' : 'Heavy'})
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold font-mono tabular-nums leading-none">
              {availableLots}
            </span>
            <span className="text-xs opacity-75 font-mono">/ {totalLots} total</span>
            {carpark.deltaChange !== undefined && carpark.deltaChange !== 0 && (
              <span
                className={`text-[11px] font-mono font-semibold ${
                  carpark.deltaChange > 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {carpark.deltaChange > 0 ? `+${carpark.deltaChange}` : carpark.deltaChange}
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold">{statusText}</div>
          <div className="text-[11px] opacity-75 font-mono tabular-nums">{percentAvailable}% free</div>
        </div>
      </div>

      {/* Linear capacity bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-500 rounded-full ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(3, percentAvailable))}%` }}
        />
      </div>

      {/* Features & Key Specs: unboxed text row */}
      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 mb-3 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Peak:</span>
          <span className="font-medium text-slate-800 truncate max-w-[170px]" title={carpark.rates.weekdayPeak}>
            {carpark.rates.weekdayPeak.split('(')[0]}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-400">Grace:</span>
          <span className="font-medium text-slate-800">{carpark.rates.gracePeriodMinutes}m</span>
        </div>

        {carpark.evCharging.available && (
          <div className="flex items-center gap-1 text-emerald-700 font-medium">
            <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span>EV ({carpark.evCharging.chargerCount} pts)</span>
          </div>
        )}

        {carpark.rates.freeParkingInfo && (
          <div className="flex items-center gap-1 text-amber-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Free Sun</span>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-400 text-[11px]">Updated {carpark.lastUpdated}</span>

        <div className="flex items-center gap-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${carpark.coordinates.lat},${carpark.coordinates.lng}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1"
            title="Open in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Directions</span>
          </a>

          <button
            onClick={() => onSelect(carpark)}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md transition-colors cursor-pointer"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
