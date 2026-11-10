import { X, ShieldCheck, Clock, Zap, MapPin } from 'lucide-react';

interface RateGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RateGuideModal({ isOpen, onClose }: RateGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Singapore Carpark Rate & Tariff Guide</h2>
            <p className="text-xs text-slate-500">Official HDB, URA, and Commercial parking guidelines</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* HDB Carpark Rules */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
              <span>HDB (Housing & Development Board) Rates</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Standard Heartland Carpark (Cars):</span>
                <span className="font-semibold text-slate-900 font-mono">$0.60 per 30 mins</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Central Area (CBD/Orchard/Bugis) Peak (07:00 – 17:00):</span>
                <span className="font-semibold text-slate-900 font-mono">$1.20 per 30 mins</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Motorcycle Parking (All Day):</span>
                <span className="font-semibold text-slate-900 font-mono">$0.65 per session ($0.20/hr)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Night Parking Scheme (22:30 – 07:00 next day):</span>
                <span className="font-semibold text-slate-900 font-mono">Capped at $5.00 max</span>
              </div>
            </div>
          </div>

          {/* Grace Period & Free Sunday Scheme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Grace Period Rules</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Most HDB and URA Electronic Parking System (EPS) carparks provide a <strong>15-minute grace period</strong> for picking up or dropping off passengers. If you exit within 15 minutes, no fee is charged. Commercial malls typically offer <strong>10 minutes</strong>.
              </p>
            </div>

            <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/40">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-sm mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Free Parking Scheme (FPS)</span>
              </div>
              <p className="text-amber-900/80 leading-relaxed">
                Available at designated HDB carparks on <strong>Sundays and Public Holidays from 07:00 to 22:30</strong>. Look for the yellow FPS signage board at carpark entrances or the "Free Sun" indicator in this app.
              </p>
            </div>
          </div>

          {/* Commercial & Shopping Mall Rates */}
          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Commercial & Shopping Malls</h3>
            <p className="text-slate-500 mb-3">
              Malls set individual tariffs. Many offer per-entry flat rates during weekday evenings (after 17:00 or 18:00) ranging between $3.00 to $4.50. Weekday lunch and weekend afternoon rates are charged in 15 or 30-minute blocks.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-600">
              <div className="p-2 bg-slate-100 rounded">ION Orchard: ~$2.67/hr peak</div>
              <div className="p-2 bg-slate-100 rounded">MBS: $14.00 1st hr (cap $32)</div>
              <div className="p-2 bg-slate-100 rounded">Suntec City: $2.40 1st hr</div>
              <div className="p-2 bg-slate-100 rounded">VivoCity: $1.60 1st hr</div>
              <div className="p-2 bg-slate-100 rounded">Jewel Changi: $2.40/hr ($0.04/m)</div>
              <div className="p-2 bg-slate-100 rounded">jem / Westgate: $1.95 1st hr</div>
            </div>
          </div>

          {/* EV Charging Info */}
          <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/30">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-sm mb-1">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>EV Charging Etiquette in Singapore</span>
            </div>
            <p className="text-emerald-950/80 leading-relaxed">
              Electric Vehicle lots in Singapore are reserved strictly for active charging. Standard parking rates still apply while charging. Operators such as SP Mobility, CDG ENGIE, and Shell Recharge levy idle fees if vehicles remain plugged in after completion.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
