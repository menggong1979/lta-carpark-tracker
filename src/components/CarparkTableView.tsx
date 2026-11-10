import { Navigation, Heart, Zap } from 'lucide-react';
import { Carpark, VehicleType } from '../types/carpark';
import { getLotsForVehicle, getTotalLotsForVehicle } from '../services/carparkService';

interface CarparkTableViewProps {
  carparks: Carpark[];
  vehicleType: VehicleType;
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
}

export default function CarparkTableView({
  carparks,
  vehicleType,
  selectedCarpark,
  onSelectCarpark,
  favoriteIds,
  onToggleFavorite
}: CarparkTableViewProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3 text-center w-10">Fav</th>
              <th className="py-3 px-3">Carpark & Code</th>
              <th className="py-3 px-3">Agency</th>
              <th className="py-3 px-3">Region</th>
              <th className="py-3 px-4 text-right">Available Lots</th>
              <th className="py-3 px-4 text-right">Occupancy</th>
              <th className="py-3 px-3">Rates (Peak / Off-Peak)</th>
              <th className="py-3 px-3">Features</th>
              <th className="py-3 px-3 text-right">Distance</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {carparks.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500 text-sm">
                  No carparks match your filter criteria. Try adjusting the search or filters.
                </td>
              </tr>
            ) : (
              carparks.map((cp) => {
                const avail = getLotsForVehicle(cp, vehicleType);
                const total = getTotalLotsForVehicle(cp, vehicleType);
                const percentFree = total > 0 ? Math.round((avail / total) * 100) : 0;
                const isFav = favoriteIds.includes(cp.id);
                const isSelected = selectedCarpark?.id === cp.id;

                let badgeColor = 'text-emerald-700 bg-emerald-50';
                if (avail === 0) badgeColor = 'text-rose-700 bg-rose-50';
                else if (avail < 15) badgeColor = 'text-amber-700 bg-amber-50';

                return (
                  <tr
                    key={cp.id}
                    onClick={() => onSelectCarpark(cp)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/70 font-medium' : ''
                    }`}
                  >
                    {/* Favorite */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleFavorite(cp.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                        title={isFav ? 'Remove favorite' : 'Add favorite'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                      </button>
                    </td>

                    {/* Carpark & Code */}
                    <td className="py-3 px-3 max-w-[240px]">
                      <div className="font-semibold text-slate-900 truncate" title={cp.name}>
                        {cp.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{cp.code}</div>
                    </td>

                    {/* Agency */}
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-700">{cp.agency}</span>
                    </td>

                    {/* Region */}
                    <td className="py-3 px-3 text-slate-600">{cp.region}</td>

                    {/* Available Lots */}
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block font-mono font-bold text-sm px-2 py-0.5 rounded ${badgeColor} tabular-nums`}
                      >
                        {avail}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono tabular-nums">of {total}</div>
                    </td>

                    {/* Occupancy bar */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-mono text-xs text-slate-700 tabular-nums">
                        {100 - percentFree}% full
                      </div>
                      <div className="w-20 ml-auto bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${
                            avail === 0 ? 'bg-rose-500' : avail < 15 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${100 - percentFree}%` }}
                        />
                      </div>
                    </td>

                    {/* Rates */}
                    <td className="py-3 px-3 max-w-[200px]">
                      <div className="text-slate-800 truncate" title={cp.rates.weekdayPeak}>
                        {cp.rates.weekdayPeak.split('(')[0]}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Grace: {cp.rates.gracePeriodMinutes} mins
                      </div>
                    </td>

                    {/* Features */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {cp.evCharging.available && (
                          <span
                            className="inline-flex items-center gap-0.5 text-emerald-700 text-[10px] font-semibold"
                            title={cp.evCharging.network || 'EV Charging Available'}
                          >
                            <Zap className="w-3 h-3 fill-emerald-600" />
                            EV
                          </span>
                        )}
                        {cp.rates.freeParkingInfo && (
                          <span className="text-amber-700 text-[10px] font-medium" title="Free on Sundays/PH">
                            Free Sun
                          </span>
                        )}
                        <span className="text-slate-400 text-[10px] font-mono">{cp.heightLimitMeters}m</span>
                      </div>
                    </td>

                    {/* Distance */}
                    <td className="py-3 px-3 text-right font-mono font-medium text-blue-600 tabular-nums">
                      {cp.distanceKm !== undefined ? `${cp.distanceKm} km` : '-'}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectCarpark(cp)}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${cp.coordinates.lat},${cp.coordinates.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                          title="Directions"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
