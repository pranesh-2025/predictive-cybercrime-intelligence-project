import React, { useState } from 'react';
import { CameraSensor } from '../types';
import { 
  Camera, 
  RotateCw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  EyeOff, 
  Radio, 
  Activity,
  Filter
} from 'lucide-react';

interface CameraSensorModuleProps {
  sensors: CameraSensor[];
  onScanCameras: () => Promise<void>;
  isScanning: boolean;
  onSelectSensorLocation?: (atmId: string) => void;
}

export const CameraSensorModule: React.FC<CameraSensorModuleProps> = ({
  sensors,
  onScanCameras,
  isScanning,
  onSelectSensorLocation
}) => {
  const [filterCity, setFilterCity] = useState<string>('ALL');

  const filteredSensors = sensors.filter(s => {
    if (filterCity === 'ALL') return true;
    return s.city.toLowerCase() === filterCity.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Privacy & Governance Notice Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-400">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide">
                Authorized Public Perimeter Sensor Module
              </h3>
              <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-mono-code font-bold uppercase">
                Privacy-Preserving
              </span>
            </div>
            <p className="text-xs text-amber-300/90 font-mono-code mt-1 font-medium">
              "Camera alerts are supporting signals for investigator verification and are not evidence of criminal activity."
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Zero biometric identification. Strictly evaluates physical movement patterns, loitering duration, and off-hour vehicle proximity.
            </p>
          </div>
        </div>

        <button
          id="btn-scan-authorized-cameras"
          onClick={onScanCameras}
          disabled={isScanning}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-tech font-bold uppercase tracking-wider text-xs shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 transition cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-cyan-200' : 'text-cyan-300'}`} />
          <span>{isScanning ? 'Scanning Feeds...' : 'Scan Authorized Cameras'}</span>
        </button>
      </div>

      {/* Sensor Grid Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-tech uppercase font-bold text-slate-200">
            Active Perimeter Telemetry Feeds ({filteredSensors.length} Nodes)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono-code text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3" /> Region:
          </span>
          <select
            id="filter-camera-city"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs font-mono-code focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Jurisdictions</option>
            <option value="Nagapattinam">Nagapattinam</option>
            <option value="Chennai">Chennai</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Madurai">Madurai</option>
            <option value="Tiruchirappalli">Tiruchirappalli</option>
          </select>
        </div>
      </div>

      {/* Camera Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSensors.map((sensor) => {
          const isAnomaly = sensor.confidence > 70;

          return (
            <div
              key={sensor.id}
              id={`card-camera-${sensor.id}`}
              className={`bg-slate-900/90 border rounded-xl p-4 shadow-xl transition flex flex-col justify-between ${
                isAnomaly ? 'border-amber-500/40 bg-slate-900/95' : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header with Camera ID & Status */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-slate-800 border border-slate-700 text-cyan-400">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono-code font-bold text-xs text-cyan-300 block">
                        {sensor.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-code">
                        ATM Link: {sensor.atmId}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                    sensor.status === 'ONLINE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : sensor.status === 'ACTIVE_ANALYSIS'
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                  }`}>
                    {sensor.status}
                  </span>
                </div>

                {/* Location and Anomaly Event */}
                <div className="space-y-2 mb-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono-code text-slate-500 block">
                      SENSOR LOCATION
                    </span>
                    <span className="font-tech font-bold text-slate-200 text-sm">
                      {sensor.location}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {sensor.city}, Tamil Nadu
                    </span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                    <span className="text-[10px] uppercase font-mono-code text-slate-500 block flex items-center justify-between">
                      <span>MOTION / ANOMALY EVENT</span>
                      <span className="text-slate-400">{sensor.lastScanTime}</span>
                    </span>
                    <p className={`font-medium mt-1 leading-snug ${isAnomaly ? 'text-amber-300' : 'text-slate-300'}`}>
                      {sensor.event}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                {/* Confidence Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] font-mono-code mb-1">
                    <span className="text-slate-400">ANOMALY CONFIDENCE</span>
                    <span className={`font-bold ${isAnomaly ? 'text-amber-400' : 'text-slate-300'}`}>
                      {sensor.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isAnomaly ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${sensor.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Disclaimer Footnote */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 italic">
                    Non-biometric verification
                  </span>
                  {onSelectSensorLocation && (
                    <button
                      id={`btn-view-map-${sensor.id}`}
                      onClick={() => onSelectSensorLocation(sensor.atmId)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono-code flex items-center gap-1 cursor-pointer"
                    >
                      <Activity className="w-3 h-3" />
                      Locate ATM
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
