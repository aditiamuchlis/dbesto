"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatTanggalIndo } from "@/lib/formatters";
import { calculateHaversineDistance } from "@/lib/geofence";

export default function AbsensiPage() {
  const { currentOutlet, currentUser, attendances, clockIn, clockOut } = useAppStore();

  const todayStr = "2026-10-23"; // matching system date
  const myTodayAtt = attendances.find(
    (a) => a.userId === currentUser.id && a.outletId === currentOutlet.id
  );

  // GPS Simulation or Browser Geolocation
  // Margonda: -6.3688, 106.8332
  const [userLat, setUserLat] = useState<number>(currentOutlet.latitude + 0.0001); // ~11 meters away
  const [userLon, setUserLon] = useState<number>(currentOutlet.longitude + 0.0001);
  const [selfiePhoto, setSelfiePhoto] = useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"
  );
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  // Calculate live distance
  const currentDistance = calculateHaversineDistance(
    userLat,
    userLon,
    currentOutlet.latitude,
    currentOutlet.longitude
  );
  const isInsideGeofence = currentDistance <= currentOutlet.radiusMeters;

  const handleClockIn = () => {
    try {
      const att = clockIn(userLat, userLon, selfiePhoto);
      setFeedback({
        type: "success",
        message: `Clock-In Berhasil! Status: ${att.status} (${att.lateMinutes > 0 ? `Terlambat ${att.lateMinutes} menit` : "Tepat Waktu"}). Jarak GPS: ${currentDistance}m.`,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Presensi gagal diverifikasi.",
      });
    }
  };

  const handleClockOut = () => {
    if (!myTodayAtt) return;
    try {
      clockOut(myTodayAtt.id, userLat, userLon, selfiePhoto);
      setFeedback({
        type: "success",
        message: `Clock-Out Berhasil! Jam kerja tercatat dengan jarak GPS: ${currentDistance}m.`,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Presensi gagal diverifikasi.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            PRESENSI KARYAWAN
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Terminal Absensi Geofencing GPS</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cabang: <strong>{currentOutlet.name}</strong> • Karyawan: <strong>{currentUser.name}</strong> ({currentUser.role})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/resto/absensi/riwayat"
            className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>Lihat Log Absensi →</span>
          </Link>

          <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Radius: {currentOutlet.radiusMeters}m</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
              : "bg-red-50 border border-red-300 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <p className="text-xs font-bold">{feedback.message}</p>
        </div>
      )}

      {/* CLOCK-IN TERMINAL CARD */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Camera & Selfie Viewfinder */}
        <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col items-center justify-between space-y-4">
          <div className="text-center">
            <h3 className="font-extrabold text-sm text-zinc-900">Verifikasi Wajah / Selfie</h3>
            <p className="text-[11px] text-zinc-500">Bukti kehadiran staf di outlet resto</p>
          </div>

          <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-dashed border-red-300 bg-zinc-100 flex items-center justify-center shadow-inner group">
            <Image src={selfiePhoto} alt="Selfie Staf" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <button
              onClick={() =>
                setSelfiePhoto(
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop"
                )
              }
              className="flex-1 py-1.5 text-[11px] font-bold rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition"
            >
              Foto 1
            </button>
            <button
              onClick={() =>
                setSelfiePhoto(
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop"
                )
              }
              className="flex-1 py-1.5 text-[11px] font-bold rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition"
            >
              Foto 2
            </button>
          </div>
        </div>

        {/* Right: GPS Geofence Check & Action Buttons */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm text-zinc-900">Validasi Radius Lokasi GPS</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  isInsideGeofence
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800 animate-pulse"
                }`}
              >
                {isInsideGeofence ? "DALAM RADIUS RESTO" : "DI LUAR RADIUS RESTO"}
              </span>
            </div>

            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Koordinat Resto:</span>
                <span className="font-mono font-bold text-zinc-800">
                  {currentOutlet.latitude.toFixed(4)}, {currentOutlet.longitude.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Koordinat Perangkat Anda:</span>
                <span className="font-mono font-bold text-zinc-800">
                  {userLat.toFixed(4)}, {userLon.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-1 text-sm font-bold">
                <span>Jarak Terdeteksi (Haversine):</span>
                <span className={isInsideGeofence ? "text-emerald-600" : "text-red-600"}>
                  {currentDistance} Meter (Maks. {currentOutlet.radiusMeters}m)
                </span>
              </div>
            </div>

            {/* Test GPS coordinates switcher */}
            <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <span className="text-[11px] font-bold text-amber-900 block">
                Simulator Posisi GPS (Untuk Pengujian):
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setUserLat(currentOutlet.latitude + 0.0001);
                    setUserLon(currentOutlet.longitude + 0.0001);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    isInsideGeofence
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-zinc-700 border border-zinc-300"
                  }`}
                >
                  📍 Di Dapur Resto (11m - Sah)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserLat(currentOutlet.latitude + 0.005); // ~550m away
                    setUserLon(currentOutlet.longitude + 0.005);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    !isInsideGeofence
                      ? "bg-red-600 text-white"
                      : "bg-white text-zinc-700 border border-zinc-300"
                  }`}
                >
                  🚨 Di Luar Resto (780m - Tolak)
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {!myTodayAtt?.clockInTime ? (
              <button
                onClick={handleClockIn}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-md transition cursor-pointer"
              >
                Clock-In Masuk Sekarang
              </button>
            ) : !myTodayAtt.clockOutTime ? (
              <button
                onClick={handleClockOut}
                className="flex-1 bg-[#D32323] hover:bg-[#B31818] text-white font-black py-4 rounded-2xl shadow-md transition cursor-pointer"
              >
                Clock-Out Pulang
              </button>
            ) : (
              <div className="flex-1 p-3.5 bg-zinc-100 rounded-2xl text-center font-bold text-xs text-zinc-600">
                ✔️ Anda telah menyelesaikan absensi hari ini (Clock-In & Clock-Out lengkap).
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIWAYAT ABSENSI CABANG */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <h3 className="font-black text-base text-zinc-900">Rekap Riwayat Presensi Staf</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">Foto</th>
                <th className="p-3.5">Nama Karyawan</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Clock In</th>
                <th className="p-3.5">Clock Out</th>
                <th className="p-3.5">Jarak GPS</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {attendances
                .filter((a) => a.outletId === currentOutlet.id)
                .map((att) => (
                  <tr key={att.id} className="hover:bg-zinc-50/70">
                    <td className="p-3.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-200">
                        {att.inPhotoUrl && (
                          <Image src={att.inPhotoUrl} alt={att.userName || "Staf"} fill className="object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-zinc-900">{att.userName}</td>
                    <td className="p-3.5">{att.date}</td>
                    <td className="p-3.5 font-semibold text-emerald-700">{formatTanggalIndo(att.clockInTime, true)}</td>
                    <td className="p-3.5">{att.clockOutTime ? formatTanggalIndo(att.clockOutTime, true) : "-"}</td>
                    <td className="p-3.5 font-mono">{att.inDistanceM} meter</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          att.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {att.status} {att.lateMinutes > 0 && `(+${att.lateMinutes}m)`}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
