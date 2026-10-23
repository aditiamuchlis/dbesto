"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { formatTanggalIndo } from "@/lib/formatters";
import {
  MapPin,
  Clock,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Users,
} from "lucide-react";

export default function RestoAbsensiRiwayatPage() {
  const { currentOutlet, attendances } = useAppStore();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const outletAttendances = attendances.filter((a) => a.outletId === currentOutlet.id);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <Link href="/resto/absensi" className="hover:text-zinc-700">
              Absensi Geofence
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-amber-500 font-bold">Log Kehadiran</span>
          </div>
          <h2 className="text-2xl font-black text-zinc-900">Rekap Riwayat Absensi Karyawan</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cabang: <strong>{currentOutlet.name}</strong> • Rekap clock-in/out, foto selfie, dan verifikasi radius geofence.
          </p>
        </div>

        <Link
          href="/resto/absensi"
          className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-red-500/20"
        >
          <Camera className="w-4 h-4" />
          <span>Buka Terminal Absensi Kamera</span>
        </Link>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-500 font-extrabold uppercase">
                <th className="p-4">Tanggal</th>
                <th className="p-4">Nama Karyawan</th>
                <th className="p-4">Jam Masuk (In)</th>
                <th className="p-4">Jarak GPS In</th>
                <th className="p-4">Jam Pulang (Out)</th>
                <th className="p-4">Durasi Kerja</th>
                <th className="p-4">Status Kedisiplinan</th>
                <th className="p-4 text-center">Foto Selfie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {outletAttendances.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-400">
                    Belum ada riwayat absensi staf untuk cabang ini.
                  </td>
                </tr>
              ) : (
                outletAttendances.map((att) => {
                  const isLate = att.status === "LATE";
                  return (
                    <tr key={att.id} className="hover:bg-zinc-50/80 transition">
                      <td className="p-4 font-semibold text-zinc-900">{att.date}</td>
                      <td className="p-4 font-bold text-zinc-900">{att.userName}</td>
                      <td className="p-4 font-mono font-bold text-emerald-700">
                        {att.clockInTime ? new Date(att.clockInTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-"}
                      </td>
                      <td className="p-4 text-zinc-500">
                        {att.inDistanceM ? `${att.inDistanceM.toFixed(1)} m` : "-"}
                      </td>
                      <td className="p-4 font-mono font-bold text-zinc-700">
                        {att.clockOutTime ? new Date(att.clockOutTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-"}
                      </td>
                      <td className="p-4 font-semibold text-zinc-700">
                        {att.workHours ? `${att.workHours} Jam` : "Shift Berjalan"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            isLate
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isLate ? `TERLAMBAT (${att.lateMinutes}m)` : "HADIR TEPAT WAKTU"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {att.inPhotoUrl ? (
                          <button
                            onClick={() => setSelectedPhoto(att.inPhotoUrl!)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-600 hover:text-[#D32323] px-2 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Lihat</span>
                          </button>
                        ) : (
                          <span className="text-zinc-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-zinc-900">Foto Selfie Presensi</h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-zinc-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
              <Image src={selectedPhoto} alt="Selfie Presensi" fill className="object-cover" unoptimized />
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="w-full bg-zinc-900 text-white text-xs font-bold py-2.5 rounded-xl transition"
            >
              Tutup Foto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
