import { useState } from 'react';
import { X, Check, Copy, RefreshCw, AlertCircle, Database, Server, Code2 } from 'lucide-react';
import { BackendConfig } from '../types/carpark';
import { saveBackendConfig, fetchLiveCarparks } from '../services/carparkService';

interface BackendConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BackendConfig;
  onUpdateConfig: (newConfig: BackendConfig) => void;
}

export default function BackendConnectorModal({
  isOpen,
  onClose,
  config,
  onUpdateConfig
}: BackendConnectorModalProps) {
  const [localConfig, setLocalConfig] = useState<BackendConfig>(config);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    count?: number;
    rawSnippet?: string;
  } | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'schema' | 'code'>('settings');

  if (!isOpen) return null;

  const handleSave = () => {
    saveBackendConfig(localConfig);
    onUpdateConfig(localConfig);
    onClose();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    const res = await fetchLiveCarparks(localConfig);

    setTesting(false);
    if (res.error) {
      setTestResult({
        success: false,
        message: res.error,
        latencyMs: res.latencyMs
      });
    } else {
      setTestResult({
        success: true,
        message: `Successfully connected! Received ${res.carparks.length} carpark records from ${res.source}.`,
        latencyMs: res.latencyMs,
        count: res.carparks.length,
        rawSnippet: JSON.stringify(res.carparks[0], null, 2)
      });
    }
  };

  const sampleBackendCode = `// server.ts or express backend route
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const LTA_DATAMALL_KEY = process.env.LTA_DATAMALL_KEY || 'YOUR_LTA_KEY';

// Singapore LTA Carpark Availability v2 Proxy
app.get('/api/v1/carparks', async (req, res) => {
  try {
    const response = await fetch(
      'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2',
      {
        headers: {
          AccountKey: LTA_DATAMALL_KEY,
          accept: 'application/json'
        }
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch LTA carpark data' });
  }
});
`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Backend Integration Hub</h2>
              <p className="text-xs text-slate-500">
                Connect your real LTA DataMall, data.gov.sg, or custom backend API
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'schema'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            LTA API Schema
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Node.js Proxy Snippet
          </button>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === 'settings' && (
            <>
              {/* Simulation vs Real Backend Radio */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Data Provider Mode
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setLocalConfig({ ...localConfig, useMockSimulation: true })}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      localConfig.useMockSimulation
                        ? 'border-blue-600 bg-blue-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">Built-in Simulated Mode</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-medium">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Realistic Singapore carpark dataset with live Poisson turnover simulations. No external server needed.
                    </p>
                  </div>

                  <div
                    onClick={() => setLocalConfig({ ...localConfig, useMockSimulation: false })}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      !localConfig.useMockSimulation
                        ? 'border-blue-600 bg-blue-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">Custom Backend API</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-medium">
                        Live Fetch
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Fetches live JSON from your proxy server or LTA DataMall v2 endpoint.
                    </p>
                  </div>
                </div>
              </div>

              {/* Endpoint Configuration */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Backend API Endpoint URL
                  </label>
                  <input
                    type="text"
                    value={localConfig.backendApiUrl}
                    onChange={(e) => setLocalConfig({ ...localConfig, backendApiUrl: e.target.value })}
                    placeholder="https://your-api.com/api/v1/carparks or /api/carparks"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Accepts either the Singapore LTA DataMall response structure or our standard Carpark array schema.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    API Key / AccountKey (Optional)
                  </label>
                  <input
                    type="password"
                    value={localConfig.apiKey || ''}
                    onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                    placeholder="e.g. LTA DataMall AccountKey"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Polling Cadence
                  </label>
                  <select
                    value={localConfig.pollingIntervalSeconds}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        pollingIntervalSeconds: parseInt(e.target.value, 10)
                      })
                    }
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                  >
                    <option value={5}>Every 5 seconds (High frequency)</option>
                    <option value={15}>Every 15 seconds (Recommended)</option>
                    <option value={30}>Every 30 seconds</option>
                    <option value={60}>Every 60 seconds (Conserves API quota)</option>
                  </select>
                </div>
              </div>

              {/* Test Connection Button & Result Box */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>{testing ? 'Pinging Endpoint...' : 'Test Connection'}</span>
                  </button>

                  <span className="text-xs text-slate-400">Verifies CORS headers, response time, and payload format.</span>
                </div>

                {testResult && (
                  <div
                    className={`mt-3 p-3.5 rounded-xl border text-xs ${
                      testResult.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {testResult.success ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold">{testResult.message}</div>
                        {testResult.latencyMs !== undefined && (
                          <div className="text-[11px] opacity-80 font-mono mt-0.5">
                            Latency: {testResult.latencyMs}ms
                          </div>
                        )}
                        {testResult.rawSnippet && (
                          <pre className="mt-2 p-2 bg-white/80 border border-slate-200 rounded font-mono text-[10px] max-h-36 overflow-y-auto">
                            {testResult.rawSnippet}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  Supported API Schemas
                </h4>
                <p className="text-slate-500">
                  This frontend automatically detects and parses the official Land Transport Authority (LTA) DataMall format and the standard JSON format.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="font-mono font-semibold text-slate-800 text-[11px] mb-1">
                  LTA DataMall CarParkAvailabilityv2 JSON Response:
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
{`{
  "odata.metadata": "https://datamall2.mytransport.sg/...",
  "value": [
    {
      "CarParkID": "1",
      "Area": "Marina",
      "Development": "Suntec City",
      "Location": "1.2935 103.8572",
      "AvailableLots": 1045,
      "LotType": "C",
      "Agency": "LTA"
    }
  ]
}`}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 text-xs">
                <strong>Pro-tip for DataMall integration:</strong> Because the official LTA DataMall API enforces CORS and requires an <code>AccountKey</code> header, it should be called via your server backend (e.g. Express) rather than directly from the browser.
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Express.js Proxy Endpoint</h4>
                  <p className="text-xs text-slate-500">Ready to drop into your Node.js or Express backend</p>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sampleBackendCode);
                    setCopiedSnippet(true);
                    setTimeout(() => setCopiedSnippet(false), 2000);
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                {sampleBackendCode}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-3.5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
