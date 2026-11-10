import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Carpark, VehicleType, UserLocation } from '../types/carpark';
import { getLotsForVehicle, getTotalLotsForVehicle } from '../services/carparkService';

interface CarparkMapProps {
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  userLocation: UserLocation;
  vehicleType: VehicleType;
}

export default function CarparkMap({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  userLocation,
  vehicleType
}: CarparkMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.coordinates.lat, userLocation.coordinates.lng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    // Custom positioned zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Carto Positron clean map tiles (reliable, fast, no API key needed)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: 'sg-carpark-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-blue-500/25 animate-ping"></div>
          <div class="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([userLocation.coordinates.lat, userLocation.coordinates.lng], {
      icon: userIcon,
      zIndexOffset: 1000
    }).addTo(map);

    marker.bindTooltip(`<b>Your Location</b><br/>${userLocation.name}`, {
      direction: 'top',
      offset: [0, -12]
    });

    userMarkerRef.current = marker;
  }, [userLocation]);

  // Update Carpark Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    carparks.forEach((cp) => {
      const avail = getLotsForVehicle(cp, vehicleType);
      const total = getTotalLotsForVehicle(cp, vehicleType);
      const isSelected = selectedCarpark?.id === cp.id;

      let colorBg = 'bg-emerald-600 text-white border-emerald-700';
      let ringColor = 'ring-emerald-400/40';
      if (avail === 0) {
        colorBg = 'bg-rose-600 text-white border-rose-700';
        ringColor = 'ring-rose-400/40';
      } else if (avail < 15) {
        colorBg = 'bg-amber-600 text-white border-amber-700';
        ringColor = 'ring-amber-400/40';
      }

      const iconHtml = `
        <div class="transition-transform duration-200 cursor-pointer ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110'
        }">
          <div class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shadow-md border ${colorBg} ${
        isSelected ? `ring-4 ${ringColor}` : ''
      }">
            <span class="font-mono tabular-nums text-[11px]">${avail}</span>
            <span class="text-[9px] opacity-80 uppercase tracking-tighter">${cp.agency}</span>
          </div>
        </div>
      `;

      const markerIcon = L.divIcon({
        className: 'sg-carpark-pin',
        html: iconHtml,
        iconSize: [44, 24],
        iconAnchor: [22, 12]
      });

      const marker = L.marker([cp.coordinates.lat, cp.coordinates.lng], {
        icon: markerIcon
      });

      // Custom rich popup
      const popupHtml = `
        <div class="w-64 p-3 bg-white text-slate-900 text-xs">
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <span class="text-[10px] uppercase font-semibold tracking-wider text-slate-500">${cp.agency} · ${cp.code}</span>
              <h4 class="font-bold text-sm text-slate-900 leading-tight">${cp.name}</h4>
            </div>
          </div>
          
          <p class="text-slate-500 text-[11px] mb-2 line-clamp-1">${cp.address}</p>

          <div class="p-2 mb-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
            <div>
              <div class="text-[10px] text-slate-500 font-medium">Available Lots (${vehicleType})</div>
              <div class="text-lg font-bold font-mono tabular-nums ${
                avail === 0 ? 'text-rose-600' : avail < 15 ? 'text-amber-600' : 'text-emerald-600'
              }">
                ${avail} <span class="text-xs text-slate-400 font-normal">/ ${total}</span>
              </div>
            </div>
            ${
              cp.evCharging.available
                ? '<div class="text-right"><span class="inline-block px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">⚡ EV Charging</span></div>'
                : ''
            }
          </div>

          <div class="text-[11px] text-slate-600 mb-3 space-y-0.5">
            <div class="flex justify-between">
              <span class="text-slate-400">Peak Rate:</span>
              <span class="font-medium text-slate-700">${cp.rates.weekdayPeak.split('(')[0]}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Grace Period:</span>
              <span class="font-medium text-slate-700">${cp.rates.gracePeriodMinutes} mins</span>
            </div>
            ${
              cp.distanceKm !== undefined
                ? `<div class="flex justify-between">
                    <span class="text-slate-400">Distance:</span>
                    <span class="font-semibold text-blue-600 font-mono">${cp.distanceKm} km away</span>
                  </div>`
                : ''
            }
          </div>

          <div class="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
            <button id="btn-details-${cp.id}" class="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium rounded transition-colors text-center">
              View Details
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${cp.coordinates.lat},${cp.coordinates.lng}" target="_blank" rel="noreferrer" class="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium rounded transition-colors text-center inline-flex items-center justify-center gap-1">
              Navigate ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      marker.on('click', () => {
        onSelectCarpark(cp);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-details-${cp.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectCarpark(cp);
          };
        }
      });

      markersLayer.addLayer(marker);
    });
  }, [carparks, selectedCarpark, vehicleType, onSelectCarpark]);

  // Pan to selected carpark smoothly
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedCarpark) return;

    map.flyTo([selectedCarpark.coordinates.lat, selectedCarpark.coordinates.lng], 15, {
      duration: 1.2
    });
  }, [selectedCarpark]);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-100 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-lg shadow-sm p-2.5 text-xs text-slate-700 pointer-events-auto">
        <div className="font-semibold text-[11px] text-slate-900 mb-1.5 tracking-tight">Lot Status</div>
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>&gt; 50 lots (Plentiful)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>1 – 50 lots (Limited)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>0 lots (Full)</span>
          </div>
        </div>
      </div>

      {/* Quick Recenter to User Location Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(
              [userLocation.coordinates.lat, userLocation.coordinates.lng],
              14,
              { duration: 1 }
            );
          }
        }}
        className="absolute bottom-6 left-3 z-10 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-1.5 rounded-md shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        title="Recenter map to your location"
      >
        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
        Recenter to {userLocation.name.split('(')[0].trim()}
      </button>
    </div>
  );
}
