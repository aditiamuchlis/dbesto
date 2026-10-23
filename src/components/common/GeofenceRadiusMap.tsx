"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Navigation, Compass, AlertTriangle, CheckCircle2, Crosshair, ZoomIn, ZoomOut } from "lucide-react";
import { calculateHaversineDistance } from "@/lib/geofence";

interface GeofenceRadiusMapProps {
  outletName: string;
  outletLat?: number;
  outletLng?: number;
  centerLat?: number;
  centerLng?: number;
  radiusMeters: number;
  userLat: number;
  userLng: number;
  onLocationChange?: (lat: number, lng: number) => void;
  interactive?: boolean;
}

export function GeofenceRadiusMap({
  outletName,
  outletLat: propOutletLat,
  outletLng: propOutletLng,
  centerLat,
  centerLng,
  radiusMeters,
  userLat,
  userLng,
  onLocationChange,
  interactive = true,
}: GeofenceRadiusMapProps) {
  const [zoom, setZoom] = useState(1);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const outletLat = propOutletLat ?? centerLat ?? -6.3728;
  const outletLng = propOutletLng ?? centerLng ?? 106.8337;

  // Calculate real distance
  const distanceMeters = calculateHaversineDistance(userLat, userLng, outletLat, outletLng);
  const isInside = distanceMeters <= radiusMeters;

  // Conversion: 1 degree latitude ~ 111,320 meters
  // In our local coordinate plane centered on outlet (0,0):
  // 1 meter = 1 / 111320 degrees
  const deltaLat = userLat - outletLat;
  const deltaLng = userLng - outletLng;

  // Approx offset in meters
  const offsetY_m = deltaLat * 111320;
  const offsetX_m = deltaLng * (111320 * Math.cos((outletLat * Math.PI) / 180));

  // Map viewport scale: map dimensions 400x320 px
  // At zoom 1: map width represents ~300 meters
  const pixelsPerMeter = (1.2 * zoom);
  const centerPxX = 200;
  const centerPxY = 160;

  // User position in SVG pixels (SVG Y is inverted relative to north latitude)
  const userPxX = Math.max(20, Math.min(380, centerPxX + offsetX_m * pixelsPerMeter));
  const userPxY = Math.max(20, Math.min(300, centerPxY - offsetY_m * pixelsPerMeter));

  // Geofence radius in SVG pixels
  const radiusPx = radiusMeters * pixelsPerMeter;

  // Get real device GPS
  const handleGetRealGps = () => {
    if (!navigator.geolocation) {
      setGpsError("Browser Anda tidak mendukung geolokasi GPS.");
      return;
    }
    setIsGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        if (onLocationChange) {
          onLocationChange(pos.coords.latitude, pos.coords.longitude);
        }
      },
      (err) => {
        setIsGpsLoading(false);
        setGpsError(`GPS Gagal: ${err.message}. Menggunakan simulasi.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Quick preset locations
  const setPreset = (metersNorth: number, metersEast: number) => {
    const newLat = outletLat + metersNorth / 111320;
    const newLng = outletLng + metersEast / (111320 * Math.cos((outletLat * Math.PI) / 180));
    if (onLocationChange) {
      onLocationChange(Number(newLat.toFixed(6)), Number(newLng.toFixed(6)));
    }
  };

  // Handle click on map SVG to reposition pin
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || !onLocationChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const metersE = (clickX - centerPxX) / pixelsPerMeter;
    const metersN = -(clickY - centerPxY) / pixelsPerMeter;

    const newLat = outletLat + metersN / 111320;
    const newLng = outletLng + metersE / (111320 * Math.cos((outletLat * Math.PI) / 180));
    onLocationChange(Number(newLat.toFixed(6)), Number(newLng.toFixed(6)));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-white shadow-xl space-y-4">
      {/* Top Header & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
          <div>
            <h4 className="text-xs font-black tracking-wide uppercase text-zinc-300">
              Peta Radar Geofence GPS
            </h4>
            <p className="text-[11px] text-zinc-400 font-mono">
              Outlet: <span className="text-white font-bold">{outletName}</span>
            </p>
          </div>
        </div>

        {/* Real-time Status Badge */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black border shadow-sm ${
            isInside
              ? "bg-emerald-950/80 text-emerald-400 border-emerald-700/80"
              : "bg-red-950/80 text-red-400 border-red-700/80"
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isInside ? "bg-emerald-400 animate-ping" : "bg-red-400 animate-pulse"
            }`}
          />
          <span>
            {isInside
              ? `VALID • ${distanceMeters}m (≤ ${radiusMeters}m)`
              : `DITOLAK • ${distanceMeters}m (> ${radiusMeters}m)`}
          </span>
        </div>
      </div>

      {gpsError && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] p-2.5 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Map Radar Canvas / SVG */}
      <div className="relative w-full h-80 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 select-none">
        {/* Subtle Map Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        {/* SVG Viewport */}
        <svg
          viewBox="0 0 400 320"
          className="w-full h-full cursor-crosshair"
          onClick={handleMapClick}
        >
          {/* Concentric distance rings */}
          <circle
            cx={centerPxX}
            cy={centerPxY}
            r={radiusPx * 0.5}
            fill="none"
            stroke="#3f3f46"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle
            cx={centerPxX}
            cy={centerPxY}
            r={radiusPx * 1.5}
            fill="none"
            stroke="#27272a"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* GEOFENCE ALLOWED RADIUS CIRCLE */}
          <circle
            cx={centerPxX}
            cy={centerPxY}
            r={radiusPx}
            fill={isInside ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.08)"}
            stroke={isInside ? "#10b981" : "#ef4444"}
            strokeWidth="2"
            strokeDasharray={isInside ? "none" : "6 4"}
          />

          {/* Distance connecting line between Outlet and Staff */}
          <line
            x1={centerPxX}
            y1={centerPxY}
            x2={userPxX}
            y2={userPxY}
            stroke={isInside ? "#34d399" : "#f87171"}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* OUTLET PIN (Center (200, 160)) */}
          <g transform={`translate(${centerPxX}, ${centerPxY})`}>
            {/* Outer halo */}
            <circle r="16" fill="rgba(217, 119, 6, 0.2)" />
            <circle r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            <text
              y="22"
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Resto D&apos;Besto
            </text>
          </g>

          {/* STAFF GPS PIN (Dynamic user position) */}
          <g transform={`translate(${userPxX}, ${userPxY})`}>
            <circle
              r="14"
              fill={isInside ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}
              className="animate-ping"
            />
            <circle
              r="7"
              fill={isInside ? "#10b981" : "#ef4444"}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              y="-12"
              textAnchor="middle"
              fill={isInside ? "#34d399" : "#f87171"}
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Posisi Anda ({distanceMeters}m)
            </text>
          </g>
        </svg>

        {/* Map Overlays & Toolbars */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
            className="w-8 h-8 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center justify-center transition"
            title="Perbesar Peta"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.25))}
            className="w-8 h-8 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center justify-center transition"
            title="Perkecil Peta"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-[10px] bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-3 text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Outlet Cabang
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Radius Geofence ({radiusMeters}m)
            </span>
            <span className="flex items-center gap-1">
              <span
                className={`w-2.5 h-2.5 rounded-full inline-block ${
                  isInside ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              Posisi Karyawan
            </span>
          </div>

          <span className="text-zinc-500 hidden sm:inline">
            Klik bidang peta untuk menggeser posisi pin
          </span>
        </div>
      </div>

      {/* Preset Simulation Buttons & Real GPS Button */}
      {interactive && (
        <div className="space-y-2 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[11px] font-bold text-zinc-400">
              Uji Coba Cepat Posisi GPS Presensi:
            </span>

            <button
              type="button"
              onClick={handleGetRealGps}
              disabled={isGpsLoading}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 transition cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isGpsLoading ? "Mencari Sinyal GPS..." : "Gunakan GPS Asli HP/PC"}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setPreset(8, 10)}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 font-bold transition flex flex-col items-center text-center cursor-pointer"
            >
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Di Kasir / Dapur</span>
              </span>
              <span className="text-[10px] text-zinc-400">~12 meter (Valid)</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset(35, 25)}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 font-bold transition flex flex-col items-center text-center cursor-pointer"
            >
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Area Parkir Resto</span>
              </span>
              <span className="text-[10px] text-zinc-400">~43 meter (Valid)</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset(75, 55)}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 font-bold transition flex flex-col items-center text-center cursor-pointer"
            >
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Batas Radius (95m)</span>
              </span>
              <span className="text-[10px] text-zinc-400">Hampir batas (Valid)</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset(200, 150)}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 font-bold transition flex flex-col items-center text-center cursor-pointer"
            >
              <span className="text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Di Luar Jangkauan</span>
              </span>
              <span className="text-[10px] text-zinc-400">~250 meter (Ditolak)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
