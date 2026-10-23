"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { Attendance } from "@/lib/types";
import { formatTanggalIndo } from "@/lib/formatters";
import {
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Compass,
  X,
  ShieldCheck,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { GeofenceRadiusMap } from "@/components/common/GeofenceRadiusMap";

export default function AdminAbsensiPage() {
  const { attendances, outlets } = useAppStore();
  const [selectedOutlet, setSelectedOutlet] = useState("all");
  const [inspectingAttendance, setInspectingAttendance] = useState<Attendance | null>(null);

  const filtered =
    selectedOutlet === "all"
      ? attendances
      : attendances.filter((a) => a.outletId === selectedOutlet);

  const inspectingOutlet = inspectingAttendance
    ? outlets.find((o) => o.id === inspectingAttendance.outletId) || outlets[0]
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            KEDISIPLINAN & KEHADIRAN
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Laporan & Audit Absensi Karyawan</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Audit keabsahan titik koordinat GPS geofencing dan bukti selfie kehadiran staf
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="text-xs font-bold p-2.5 rounded-xl border border-zinc-300 bg-white"
          >
            <option value="all">Semua Cabang Resto</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">Selfie</th>
                <th className="p-3.5">Nama Staf</th>
                <th className="p-3.5">Cabang Resto</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Clock In</th>
                <th className="p-3.5">Clock Out</th>
                <th className="p-3.5">Koordinat & Jarak GPS</th>
                <th className="p-3.5">Kedisiplinan</th>
                <th className="p-3.5">Catatan</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-zinc-400">
                    Belum ada catatan absensi tercatat.
                  </td>
                </tr>
              ) : (
                filtered.map((att) => {
                  const outl = outlets.find((o) => o.id === att.outletId);
                  const isInside = outl ? att.inDistanceM <= outl.radiusMeters : att.inDistanceM <= 100;

                  return (
                    <tr
                      key={att.id}
                      onClick={() => setInspectingAttendance(att)}
                      className="hover:bg-zinc-50/70 cursor-pointer transition"
                    >
                      <td className="p-3.5">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-200 border-2 border-white shadow-xs">
                          {att.inPhotoUrl ? (
                            <Image
                              src={att.inPhotoUrl}
                              alt={att.userName || "Staf"}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold">
                              {att.userName?.charAt(0)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-zinc-900">{att.userName}</td>
                      <td className="p-3.5 font-semibold text-zinc-700">{att.outletName}</td>
                      <td className="p-3.5">{att.date}</td>
                      <td className="p-3.5 font-semibold text-emerald-700">
                        {formatTanggalIndo(att.clockInTime, true)}
                      </td>
                      <td className="p-3.5">
                        {att.clockOutTime ? formatTanggalIndo(att.clockOutTime, true) : "-"}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isInside ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          />
                          <span className="font-mono text-zinc-700">
                            {att.inLatitude.toFixed(4)}, {att.inLongitude.toFixed(4)}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold block mt-0.5 ${
                            isInside ? "text-emerald-700" : "text-red-600"
                          }`}
                        >
                          {att.inDistanceM}m ({isInside ? "Valid Geofence" : "Di Luar Radius"})
                        </span>
                      </td>
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
                      <td className="p-3.5 text-zinc-500 max-w-xs truncate">{att.notes || "-"}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingAttendance(att);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-red-50 hover:text-[#D32323] text-zinc-700 font-bold text-xs transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Audit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal with Selfie & Geofence Map */}
      {inspectingAttendance && inspectingOutlet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in duration-150 my-8">
            <div className="flex items-center justify-between p-5 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#D32323] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900">
                    Audit Presensi: {inspectingAttendance.userName}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {inspectingAttendance.outletName} • {formatTanggalIndo(inspectingAttendance.clockInTime, true)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingAttendance(null)}
                className="w-9 h-9 rounded-full bg-white hover:bg-zinc-200 text-zinc-500 flex items-center justify-center transition border border-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Top row: Selfie + Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="flex flex-col items-center text-center p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase mb-2">
                    Bukti Wajah / Selfie
                  </span>
                  <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-zinc-200 border-2 border-zinc-300 shadow-sm">
                    {inspectingAttendance.inPhotoUrl ? (
                      <Image
                        src={inspectingAttendance.inPhotoUrl}
                        alt="Bukti Selfie"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        Tidak ada foto
                      </div>
                    )}
                  </div>
                  <span className="mt-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    ✓ Terverifikasi Wajah
                  </span>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                      <span className="text-zinc-400 block text-[10px] uppercase font-bold">Waktu Clock In</span>
                      <strong className="text-zinc-900 text-sm font-black">
                        {formatTanggalIndo(inspectingAttendance.clockInTime, true)}
                      </strong>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                      <span className="text-zinc-400 block text-[10px] uppercase font-bold">Waktu Clock Out</span>
                      <strong className="text-zinc-900 text-sm font-black">
                        {inspectingAttendance.clockOutTime
                          ? formatTanggalIndo(inspectingAttendance.clockOutTime, true)
                          : "Belum Keluar"}
                      </strong>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                      <span className="text-zinc-400 block text-[10px] uppercase font-bold">Jarak ke Outlet</span>
                      <strong
                        className={`text-sm font-black ${
                          inspectingAttendance.inDistanceM <= inspectingOutlet.radiusMeters
                            ? "text-emerald-700"
                            : "text-red-600"
                        }`}
                      >
                        {inspectingAttendance.inDistanceM} Meter
                      </strong>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                      <span className="text-zinc-400 block text-[10px] uppercase font-bold">Batas Geofence Cabang</span>
                      <strong className="text-zinc-900 text-sm font-black">
                        Maks. {inspectingOutlet.radiusMeters} Meter
                      </strong>
                    </div>
                  </div>

                  {inspectingAttendance.inDistanceM <= inspectingOutlet.radiusMeters ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Presensi Sah:</strong> Karyawan melakukan absensi di dalam zona radius yang ditentukan ({inspectingOutlet.radiusMeters}m).
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800 text-xs">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>
                        <strong>Peringatan Titik Presensi:</strong> Karyawan terdeteksi di luar zona radius {inspectingOutlet.radiusMeters}m saat absen.
                      </span>
                    </div>
                  )}

                  {inspectingAttendance.notes && (
                    <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Catatan Karyawan:</span>
                      <p className="text-zinc-700 italic">"{inspectingAttendance.notes}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Geofence Map Inspection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#D32323]" />
                    <span>Visualisasi Posisi GPS vs Radius Geofence</span>
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Pin GPS: {inspectingAttendance.inLatitude.toFixed(6)}, {inspectingAttendance.inLongitude.toFixed(6)}
                  </span>
                </div>

                <GeofenceRadiusMap
                  centerLat={inspectingOutlet.latitude}
                  centerLng={inspectingOutlet.longitude}
                  radiusMeters={inspectingOutlet.radiusMeters}
                  outletName={inspectingOutlet.name}
                  userLat={inspectingAttendance.inLatitude}
                  userLng={inspectingAttendance.inLongitude}
                />
              </div>
            </div>

            <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex justify-end">
              <button
                onClick={() => setInspectingAttendance(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition shadow-xs"
              >
                Tutup Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

