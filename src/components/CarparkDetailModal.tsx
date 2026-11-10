import { useState } from 'react';
import { X, Navigation, Heart, Zap, Clock, ShieldCheck, Car, Bike, Truck, Check, Copy, ExternalLink } from 'lucide-react';
import { Carpark } from '../types/carpark';

interface CarparkDetailModalProps {
  carpark: Carpark | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAdjustLots?: (carparkId: string, delta: number) => void;
}

export default function CarparkDetailModal({
  carpark,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAdjustLots
}: CarparkDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!carpark) return null;

  const currentHour = new Date().getHours();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${carpark.name}, ${carpark.address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const carAvail = carpark.lots.car.available;
  const carTotal = carpark.lots.car.total;
  const carPercent = carTotal > 0 ? Math.round((carAvail / carTotal) * 100) : 0;

  // SVG chart dimensions for 24-hr occupancy trend
  const chartWidth = 520;
  const chartHeight = 130;
  const points = carpark.hourlyOccupancyTrend.map((val, idx) => {
    const x = (idx / 23) * chartWidth;
    const y = chartHeight - (val / 100) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  });
  const polylinePoints = points.join(' ');
  const areaPoints = `0,${chartHeight} ${polylinePoints} ${chartWidth},${chartHeight}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span className="font-semibold text-slate-900">{carpark.agency}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-600">{carpark.code}</span>
              <span aria-hidden="true">·</span>
              <span>{carpark.region}</span>
              {carpark.distanceKm !== undefined && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono font-medium text-blue-600">{carpark.distanceKm} km away</span>
                </>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{carpark.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-slate-500">{carpark.address}</p>
              <button
                onClick={handleCopyAddress}
                className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 cursor-pointer"
                title="Copy address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(carpark.id)}
              className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-50 transition-colors cursor-pointer"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Real-Time Lots Breakdown */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Current Lot Availabilities
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cars */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Car className="w-4 h-4 text-slate-600" />
                    Cars
                  </span>
                  <span className="font-mono text-[11px]">{carPercent}% free</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-2xl font-bold font-mono tabular-nums ${
                      carAvail === 0 ? 'text-rose-600' : carAvail < 15 ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {carAvail}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/ {carTotal}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${
                      carAvail === 0 ? 'bg-rose-500' : carAvail < 15 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(3, carPercent))}%` }}
                  />
                </div>
              </div>

              {/* Motorcycles */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Bike className="w-4 h-4 text-slate-600" />
                    Motorcycles
                  </span>
                  {carpark.lots.motorcycle ? (
                    <span className="font-mono text-[11px]">
                      {Math.round(
                        (carpark.lots.motorcycle.available / carpark.lots.motorcycle.total) * 100
                      )}
                      % free
                    </span>
                  ) : null}
                </div>
                {carpark.lots.motorcycle ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono tabular-nums text-slate-800">
                        {carpark.lots.motorcycle.available}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        / {carpark.lots.motorcycle.total}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-slate-700"
                        style={{
                          width: `${Math.round(
                            (carpark.lots.motorcycle.available / carpark.lots.motorcycle.total) * 100
                          )}%`
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 pt-2">Not available</div>
                )}
              </div>

              {/* Heavy Vehicles */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Truck className="w-4 h-4 text-slate-600" />
                    Heavy Vehicles
                  </span>
                </div>
                {carpark.lots.heavyVehicle ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono tabular-nums text-slate-800">
                        {carpark.lots.heavyVehicle.available}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        / {carpark.lots.heavyVehicle.total}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-slate-700"
                        style={{
                          width: `${Math.round(
                            (carpark.lots.heavyVehicle.available / carpark.lots.heavyVehicle.total) * 100
                          )}%`
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 pt-2">Standard bays only</div>
                )}
              </div>
            </div>
          </div>

          {/* 24-Hour Occupancy Trend Chart */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">24-Hour Occupancy Pattern</h4>
                <p className="text-xs text-slate-500">Historical peak and off-peak crowding curve</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Now ({currentHour}:00)</span>
              </div>
            </div>

            <div className="w-full overflow-hidden pt-2">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-28 overflow-visible">
                <defs>
                  <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines */}
                <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="65" x2={chartWidth} y2="65" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2={chartWidth} y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                {/* Area under curve */}
                <polygon points={areaPoints} fill="url(#occupancyGradient)" />

                {/* Curve line */}
                <polyline fill="none" stroke="#2563eb" strokeWidth="2.5" points={polylinePoints} />

                {/* Current hour vertical marker */}
                {(() => {
                  const x = (currentHour / 23) * chartWidth;
                  const currentVal = carpark.hourlyOccupancyTrend[currentHour] || 50;
                  const y = chartHeight - (currentVal / 100) * (chartHeight - 20) - 10;
                  return (
                    <g>
                      <line x1={x} y1="0" x2={x} y2={chartHeight} stroke="#2563eb" strokeWidth="1.5" strokeDasharray="2 2" />
                      <circle cx={x} cy={y} r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                    </g>
                  );
                })()}
              </svg>

              {/* X-axis labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00 (Lunch)</span>
                <span>18:00 (Rush)</span>
                <span>23:00</span>
              </div>
            </div>
          </div>

          {/* Tariffs & Rates Schedule */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Parking Rates & Tariff Schedule
            </h3>

            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Weekday Daytime / Peak:</span>
                <span className="font-semibold text-slate-900 text-right">{carpark.rates.weekdayPeak}</span>
              </div>

              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Weekday Evening / Off-Peak:</span>
                <span className="font-semibold text-slate-900 text-right">{carpark.rates.weekdayOffPeak}</span>
              </div>

              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Saturdays, Sundays & PH:</span>
                <span className="font-semibold text-slate-900 text-right">{carpark.rates.weekend}</span>
              </div>

              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Grace Period (Pick-up / Drop-off):</span>
                <span className="font-semibold text-emerald-700">{carpark.rates.gracePeriodMinutes} Minutes Free</span>
              </div>

              {carpark.rates.freeParkingInfo && (
                <div className="p-3 flex justify-between items-center bg-amber-50/50">
                  <span className="text-amber-800 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Free Parking Scheme:
                  </span>
                  <span className="font-semibold text-amber-900 text-right">{carpark.rates.freeParkingInfo}</span>
                </div>
              )}

              {carpark.rates.nightParkingCap && (
                <div className="p-3 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Overnight Cap:</span>
                  <span className="font-semibold text-slate-800">{carpark.rates.nightParkingCap}</span>
                </div>
              )}
            </div>
          </div>

          {/* Gantry & Facilities Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 border border-slate-200 rounded-xl">
              <div className="text-slate-500 font-medium mb-1">Gantry & Clearance</div>
              <div className="font-semibold text-slate-800 mb-0.5">{carpark.gantryType}</div>
              <div className="text-slate-500">
                Max Height Limit: <span className="font-mono font-bold text-slate-800">{carpark.heightLimitMeters}m</span>
              </div>
            </div>

            <div className="p-3.5 border border-slate-200 rounded-xl">
              <div className="text-slate-500 font-medium mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                Electric Vehicle (EV) Charging
              </div>
              {carpark.evCharging.available ? (
                <>
                  <div className="font-semibold text-emerald-800">
                    {carpark.evCharging.chargerCount} Charging Lots Available
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{carpark.evCharging.network}</div>
                </>
              ) : (
                <div className="text-slate-400">No public EV chargers at this location</div>
              )}
            </div>
          </div>

          {/* Test Lot Simulator Adjuster */}
          {onAdjustLots && (
            <div className="p-3.5 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-700">Quick Lot Simulator (Interactive Test)</span>
                <span className="text-[11px] text-slate-400">Simulate incoming or outgoing cars</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAdjustLots(carpark.id, -5)}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-mono cursor-pointer"
                >
                  -5 Lots
                </button>
                <button
                  onClick={() => onAdjustLots(carpark.id, -1)}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-mono cursor-pointer"
                >
                  -1 Lot
                </button>
                <button
                  onClick={() => onAdjustLots(carpark.id, +1)}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-mono cursor-pointer"
                >
                  +1 Lot
                </button>
                <button
                  onClick={() => onAdjustLots(carpark.id, +5)}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-mono cursor-pointer"
                >
                  +5 Lots
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">Coordinates: {carpark.coordinates.lat}, {carpark.coordinates.lng}</div>

          <div className="flex items-center gap-2">
            <a
              href={`https://waze.com/ul?ll=${carpark.coordinates.lat},${carpark.coordinates.lng}&navigate=yes`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Waze</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${carpark.coordinates.lat},${carpark.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate in Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
